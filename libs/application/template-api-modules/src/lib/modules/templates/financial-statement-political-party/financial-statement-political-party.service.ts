import { Inject, Injectable } from '@nestjs/common'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { S3 } from 'aws-sdk'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  ApplicationTypes,
  ApplicationWithAttachments as Application,
} from '@island.is/application/types'
import {
  Contact,
  ContactType,
  DigitalSignee,
  FinancialStatementsInaoClientService,
  PoliticalPartyFinancialStatementValues,
} from '@island.is/clients/financial-statements-inao'
import { getValueViaPath } from '@island.is/application/core'
import AmazonS3Uri from 'amazon-s3-uri'
import { TemplateApiModuleActionProps } from '../../../types'
import * as kennitala from 'kennitala'
import { mapValuesToPartyTypes } from './mappers/mapValuesToPartyTypes'

export interface AttachmentData {
  key: string
  name: string
}

export interface DataResponse {
  success: boolean
  message?: string
}

export const getCurrentUserType = (
  answers: Application['answers'],
  externalData: Application['externalData'],
) => {
  const fakeUserType = getValueViaPath(answers, 'fakeData.options') as
    | number
    | undefined

  const currentUserType = getValueViaPath(
    externalData,
    'getUserType.data.value',
  ) as number | undefined

  return fakeUserType ?? currentUserType
}

const PARTY_USER_TYPE = 150000001

@Injectable()
export class FinancialStatementPoliticalPartyTemplateService extends BaseTemplateApiService {
  s3: S3
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private financialStatementClientService: FinancialStatementsInaoClientService,
  ) {
    super(ApplicationTypes.FINANCIAL_STATEMENT_POLITICAL_PARTY)
    this.s3 = new S3()
  }

  private async getAttachment(application: Application): Promise<string> {
    const attachments = getValueViaPath(
      application.answers,
      'attachments.files',
    ) as Array<AttachmentData>

    if (!attachments || attachments.length === 0) {
      throw new Error('No attachments found in application')
    }

    const attachmentKey = attachments[0].key

    const fileName = (
      application.attachments as {
        [key: string]: string
      }
    )[attachmentKey]

    if (!fileName) {
      throw new Error('Attachment file name not found')
    }

    const { bucket, key } = AmazonS3Uri(fileName)

    const uploadBucket = bucket
    try {
      const file = await this.s3
        .getObject({ Bucket: uploadBucket, Key: key })
        .promise()
      const fileContent = file.Body as Buffer
      return fileContent?.toString('base64') || ''
    } catch (error) {
      this.logger.error('Error retrieving attachment from S3', error)
      throw new Error('Villa kom upp við að senda umsókn')
    }
  }

  async getUserType({ auth }: TemplateApiModuleActionProps) {
    const { nationalId } = auth
    if (kennitala.isPerson(nationalId)) {
      return this.financialStatementClientService.getClientType('Einstaklingur')
    } else {
      return this.financialStatementClientService.getUserClientType(nationalId)
    }
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { nationalId, actor } = auth

    if (!actor) {
      throw new Error('Enginn umboðsmaður fannst')
    }

    this.validateUserType(application)

    const values = this.prepareValues(application)
    const year = this.getOperatingYear(application)
    const fileName = await this.getAttachment(application)
    const client = { nationalId }
    const contacts = this.prepareContacts(application, actor)
    const digitalSignee = this.prepareDigitalSignee(application)

    try {
      const result =
        await this.financialStatementClientService.postFinancialStatementForPoliticalParty(
          client,
          contacts,
          digitalSignee,
          year,
          '',
          values,
          fileName,
        )

      if (!result) {
        throw new Error('Application submission failed')
      }

      return { success: true }
    } catch (error) {
      this.logger.error('Error submitting application', error)
      return {
        success: false,
        message: error.message,
      }
      // throw new Error('Application submission failed')
    }
  }

  private prepareValues(
    application: Application,
  ): PoliticalPartyFinancialStatementValues {
    return mapValuesToPartyTypes(application.answers)
  }

  private getOperatingYear(application: Application): string {
    return getValueViaPath(
      application.answers,
      'conditionalAbout.operatingYear',
    ) as string
  }

  private validateUserType(application: Application) {
    const currentUserType = getCurrentUserType(
      application.answers,
      application.externalData,
    )
    if (currentUserType !== PARTY_USER_TYPE) {
      throw new Error('Invalid user type for application submission')
    }
  }

  private prepareContacts(
    application: Application,
    actor: { nationalId: string },
  ): Array<Contact> {
    const actorsName = getValueViaPath(
      application.answers,
      'about.powerOfAttorneyName',
    ) as string
    return [
      {
        nationalId: actor.nationalId,
        name: actorsName,
        contactType: ContactType.Actor,
      },
    ]
  }

  private prepareDigitalSignee(application: Application): DigitalSignee {
    const clientPhone = getValueViaPath(
      application.answers,
      'about.phoneNumber',
    ) as string
    const clientEmail = getValueViaPath(
      application.answers,
      'about.email',
    ) as string
    return {
      email: clientEmail,
      phone: clientPhone,
    }
  }
}
