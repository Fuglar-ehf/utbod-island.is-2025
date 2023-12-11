import { Inject, Injectable } from '@nestjs/common'

import {
  Application,
  ApplicationTypes,
  YES,
} from '@island.is/application/types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'

import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'

import {
  ApplicationType,
  Employment,
  getApplicationAnswers as getOAPApplicationAnswers,
  isEarlyRetirement,
  errorMessages as OAPErrorMessages,
} from '@island.is/application/templates/social-insurance-administration/old-age-pension'
import {
  HouseholdSupplementHousing,
  getApplicationAnswers as getHSApplicationAnswers,
  errorMessages as HSErrorMessages,
} from '@island.is/application/templates/social-insurance-administration/household-supplement'
import {
  Attachment,
  AttachmentTypeEnum,
  SocialInsuranceAdministrationClientService,
} from '@island.is/clients/social-insurance-administration'
import { S3 } from 'aws-sdk'
import {
  getApplicationType,
  transformApplicationToHouseholdSupplementDTO,
  transformApplicationToOldAgePensionDTO,
} from './social-insurance-administration-utils'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { FileType } from '@island.is/application/templates/social-insurance-administration-core/types'

export const APPLICATION_ATTACHMENT_BUCKET = 'APPLICATION_ATTACHMENT_BUCKET'

@Injectable()
export class SocialInsuranceAdministrationService extends BaseTemplateApiService {
  s3 = new S3()

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private siaClientService: SocialInsuranceAdministrationClientService,
    @Inject(APPLICATION_ATTACHMENT_BUCKET)
    private readonly attachmentBucket: string,
  ) {
    super('SocialInsuranceAdministration')
  }

  private async initAttachments(
    application: Application,
    type: AttachmentTypeEnum,
    attachments: FileType[],
  ): Promise<Attachment[]> {
    const result: Attachment[] = []

    for (const attachment of attachments) {
      const Key = `${application.id}/${attachment.key}`
      const pdf = await this.getPdf(Key)

      result.push({
        name: attachment.name,
        type: type,
        file: pdf,
      })
    }

    return result
  }

  private async getAdditionalAttachments(
    application: Application,
  ): Promise<Array<Attachment>> {
    const attachments: Array<Attachment> = []
    let additionalAttachmentsRequired: FileType[] = []

    if (application.typeId === ApplicationTypes.OLD_AGE_PENSION) {
      additionalAttachmentsRequired = getOAPApplicationAnswers(
        application.answers,
      ).additionalAttachmentsRequired
    }
    if (application.typeId === ApplicationTypes.HOUSEHOLD_SUPPLEMENT) {
      additionalAttachmentsRequired = getHSApplicationAnswers(
        application.answers,
      ).additionalAttachmentsRequired
    }

    if (
      additionalAttachmentsRequired &&
      additionalAttachmentsRequired.length > 0
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          AttachmentTypeEnum.Undefined,
          additionalAttachmentsRequired,
        )),
      )
    }

    return attachments
  }

  private async getOAPAttachments(
    application: Application,
  ): Promise<Attachment[]> {
    const {
      additionalAttachments,
      pensionAttachments,
      fishermenAttachments,
      selfEmployedAttachments,
      earlyRetirementAttachments,
      applicationType,
      employmentStatus,
    } = getOAPApplicationAnswers(application.answers)

    const attachments: Attachment[] = []

    if (additionalAttachments && additionalAttachments.length > 0) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          AttachmentTypeEnum.Other,
          additionalAttachments,
        )),
      )
    }

    if (pensionAttachments && pensionAttachments.length > 0) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          AttachmentTypeEnum.Pension,
          pensionAttachments,
        )),
      )
    }

    if (
      fishermenAttachments &&
      fishermenAttachments.length > 0 &&
      applicationType === ApplicationType.SAILOR_PENSION
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          AttachmentTypeEnum.Sailor,
          fishermenAttachments,
        )),
      )
    }

    if (
      selfEmployedAttachments &&
      selfEmployedAttachments.length > 0 &&
      employmentStatus === Employment.SELFEMPLOYED
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          AttachmentTypeEnum.SelfEmployed,
          selfEmployedAttachments,
        )),
      )
    }

    if (
      isEarlyRetirement(application.answers, application.externalData) &&
      earlyRetirementAttachments &&
      earlyRetirementAttachments.length > 0
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          AttachmentTypeEnum.Retirement,
          earlyRetirementAttachments,
        )),
      )
    }

    return attachments
  }

  private async getHSAttachments(
    application: Application,
  ): Promise<Attachment[]> {
    const {
      additionalAttachments,
      schoolConfirmationAttachments,
      leaseAgreementAttachments,
      householdSupplementChildren,
      householdSupplementHousing,
    } = getHSApplicationAnswers(application.answers)

    const attachments: Attachment[] = []

    if (additionalAttachments && additionalAttachments.length > 0) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          AttachmentTypeEnum.Other,
          additionalAttachments,
        )),
      )
    }

    if (
      schoolConfirmationAttachments &&
      schoolConfirmationAttachments.length > 0 &&
      householdSupplementChildren === YES
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          AttachmentTypeEnum.SchoolConfirmation,
          schoolConfirmationAttachments,
        )),
      )
    }

    if (
      leaseAgreementAttachments &&
      leaseAgreementAttachments.length > 0 &&
      householdSupplementHousing === HouseholdSupplementHousing.RENTER
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          AttachmentTypeEnum.RentalAgreement,
          leaseAgreementAttachments,
        )),
      )
    }

    return attachments
  }

  async getPdf(key: string) {
    const file = await this.s3
      .getObject({ Bucket: this.attachmentBucket, Key: key })
      .promise()
    const fileContent = file.Body as Buffer

    if (!fileContent) {
      throw new Error('File content was undefined')
    }

    return fileContent.toString('base64')
  }

  async sendApplication({ application, auth }: TemplateApiModuleActionProps) {
    if (application.typeId === ApplicationTypes.OLD_AGE_PENSION) {
      const attachments = await this.getOAPAttachments(application)

      const oldAgePensionDTO = transformApplicationToOldAgePensionDTO(
        application,
        attachments,
      )

      const applicationType = getApplicationType(application).toLowerCase()

      const response = await this.siaClientService.sendApplication(
        auth,
        oldAgePensionDTO,
        applicationType,
      )

      return response
    }

    if (application.typeId === ApplicationTypes.HOUSEHOLD_SUPPLEMENT) {
      const attachments = await this.getHSAttachments(application)
      const householdSupplementDTO =
        transformApplicationToHouseholdSupplementDTO(application, attachments)

      const response = await this.siaClientService.sendApplication(
        auth,
        householdSupplementDTO,
        application.typeId.toLowerCase(),
      )

      return response
    }
  }

  async sendDocuments({ application, auth }: TemplateApiModuleActionProps) {
    const attachments = await this.getAdditionalAttachments(application)

    await this.siaClientService.sendAdditionalDocuments(
      auth,
      application.id,
      attachments,
    )
  }

  async getApplicant({ application, auth }: TemplateApiModuleActionProps) {
    const res = await this.siaClientService.getApplicant(auth)

    // mock data since gervimenn don't have bank account registered at TR,
    // and might also not have phone number and email address registered
    if (isRunningOnEnvironment('local')) {
      if (res.bankAccount) {
        res.bankAccount.bank = '2222'
        res.bankAccount.ledger = '00'
        res.bankAccount.accountNumber = '123456'
      }

      if (!res.emailAddress) {
        res.emailAddress = 'mail@mail.is'
      }

      if (!res.phoneNumber) {
        res.phoneNumber = '888-8888'
      }
    }

    if (!res.emailAddress) {
      throw new TemplateApiError(
        {
          title:
            application.typeId === ApplicationTypes.OLD_AGE_PENSION
              ? OAPErrorMessages.noEmailFound
              : HSErrorMessages.noEmailFound,
          summary:
            application.typeId === ApplicationTypes.OLD_AGE_PENSION
              ? OAPErrorMessages.noEmailFoundDescription
              : HSErrorMessages.noEmailFoundDescription,
        },
        500,
      )
    }

    return res
  }

  async getIsEligible({ application, auth }: TemplateApiModuleActionProps) {
    const applicationType =
      application.typeId === ApplicationTypes.OLD_AGE_PENSION
        ? getApplicationType(application).toLowerCase()
        : application.typeId.toLowerCase()

    return await this.siaClientService.getIsEligible(auth, applicationType)
  }

  async getCurrencies({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getCurrencies(auth)
  }
}
