import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'

import AmazonS3URI from 'amazon-s3-uri'
import { S3 } from 'aws-sdk'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
  DataUploadResponse,
} from '@island.is/clients/syslumenn'
import {
  File,
  ApplicationAttachments,
  AttachmentPaths,
} from './types/attachments'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
  YES,
} from '@island.is/application/types'
import { Info } from './types/application'
import { getExtraData } from './utils'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { CriminalRecordService } from '@island.is/api/domains/criminal-record'
import { TemplateApiError } from '@island.is/nest/problem'
import { FinanceClientService } from '@island.is/clients/finance'
import { OperatingLicenseFakeData } from '@island.is/application/templates/operating-license/types'

@Injectable()
export class OperatingLicenseService extends BaseTemplateApiService {
  s3: S3
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly syslumennService: SyslumennService,
    private readonly criminalRecordService: CriminalRecordService,
    private readonly financeService: FinanceClientService,
  ) {
    super(ApplicationTypes.OPERATING_LCENSE)
    this.s3 = new S3()
  }

  async criminalRecord({
    application,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    const fakeData = getValueViaPath<OperatingLicenseFakeData>(
      application.answers,
      'fakeData',
    )
    const useFakeData = fakeData?.useFakeData === YES

    if (useFakeData) {
      return fakeData?.criminalRecord === YES
        ? Promise.resolve({ success: true })
        : Promise.reject({
            reason: {
              title: coreErrorMessages.dataCollectionCriminalRecordTitle,
              summary: coreErrorMessages.dataCollectionCriminalRecordErrorTitle,
              hideSubmitError: true,
            },
            statusCode: 404,
          })
    }
    try {
      const applicantSsn =
        application.applicantActors.length > 0
          ? application.applicantActors[0]
          : application.applicant
      const hasCriminalRecord = await this.criminalRecordService.validateCriminalRecord(
        applicantSsn,
      )
      if (hasCriminalRecord) {
        throw new TemplateApiError(
          {
            title: coreErrorMessages.dataCollectionCriminalRecordTitle,
            summary: coreErrorMessages.dataCollectionCriminalRecordErrorTitle,
          },
          400,
        )
      }

      return { success: true }
    } catch (e) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.dataCollectionCriminalRecordTitle,
          summary: coreErrorMessages.errorDataProvider,
        },
        400,
      )
    }
  }

  async debtLessCertificate({
    application,
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    const fakeData = getValueViaPath<OperatingLicenseFakeData>(
      application.answers,
      'fakeData',
    )
    const useFakeData = fakeData?.useFakeData === YES

    if (useFakeData) {
      return fakeData?.debtStatus === YES
        ? Promise.resolve({ success: true })
        : Promise.reject({
            reason: {
              title: coreErrorMessages.missingCertificateTitle,
              summary: coreErrorMessages.missingCertificateSummary,
              hideSubmitError: true,
            },
            statusCode: 404,
          })
    }
    const financeServiceLangMap = {
      is: 'IS',
      en: 'EN',
    }

    const response = await this.financeService.getDebtLessCertificate(
      auth.nationalId,
      financeServiceLangMap[currentUserLocale] ?? 'is',
      auth,
    )

    if (response?.error) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.errorDataProvider,
          summary: response.error.message,
        },
        response.error.code,
      )
    }

    if (
      response?.debtLessCertificateResult &&
      !response.debtLessCertificateResult.debtLess
    ) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.missingCertificateTitle,
          summary: coreErrorMessages.missingCertificateSummary,
        },
        400,
      )
    }

    return { success: true }
  }

  async createCharge({
    application: { id, answers },
    auth,
  }: TemplateApiModuleActionProps) {
    const SYSLUMADUR_NATIONAL_ID = '6509142520'

    const chargeItemCode = getValueViaPath<string>(answers, 'chargeItemCode')
    if (!chargeItemCode) {
      throw new Error('chargeItemCode missing in request')
    }

    const response = await this.sharedTemplateAPIService.createCharge(
      auth,
      id,
      SYSLUMADUR_NATIONAL_ID,
      [chargeItemCode],
    )
    // last chance to validate before the user receives a dummy
    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }

    return response
  }

  async submitOperatingLicenseApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{
    success: boolean
    orderId?: string
  }> {
    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      auth,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      this.log(
        'info',
        'Trying to submit OperatingLicenseapplication that has not been paid.',
        {},
      )
      throw new Error(
        'Ekki er hægt að skila inn umsókn af því að ekki hefur tekist að taka við greiðslu.',
      )
    }

    try {
      const uploadDataName = 'rekstrarleyfi1.0'
      const uploadDataId = 'rekstrarleyfi1.0'
      const info = getValueViaPath(application.answers, 'info') as Info
      const applicant: Person = {
        name: '',
        ssn: auth.nationalId,
        phoneNumber: info?.phoneNumber,
        email: info?.email,
        homeAddress: '',
        postalCode: '',
        city: '',
        signed: true,
        type: PersonType.Plaintiff,
      }

      const actors: Person[] = application.applicantActors.map((actor) => ({
        name: '',
        ssn: actor,
        phoneNumber: '',
        email: '',
        homeAddress: '',
        postalCode: '',
        city: '',
        signed: true,
        type: PersonType.CounterParty,
      }))

      const persons: Person[] = [applicant, ...actors]

      const attachments = await this.getAttachments(application)
      const extraData = getExtraData(application)
      const result: DataUploadResponse = await this.syslumennService
        .uploadData(
          persons,
          attachments,
          extraData,
          uploadDataName,
          uploadDataId,
        )
        .catch((e) => {
          return {
            success: false,
            errorMessage: e.message,
          }
        })
      return {
        success: result.success,
        orderId: '',
      }
    } catch (e) {
      this.log('error', 'Submitting operating license failed', {
        e,
      })

      throw e
    }
  }

  private log(lvl: 'error' | 'info', message: string, meta: unknown) {
    this.logger.log(lvl, `[operation-license] ${message}`, meta)
  }

  private async getAttachments(
    application: ApplicationWithAttachments,
  ): Promise<Attachment[]> {
    const attachments: Attachment[] = []

    for (let i = 0; i < AttachmentPaths.length; i++) {
      const { path, prefix } = AttachmentPaths[i]
      const attachmentAnswerData = getValueViaPath(
        application.answers,
        path,
      ) as File[]
      const attachmentAnswer = attachmentAnswerData.pop()

      if (attachmentAnswer) {
        const fileType = attachmentAnswer.name?.split('.').pop()
        const name = `${prefix}_${new Date(Date.now())
          .toISOString()
          .substring(0, 10)}.${fileType}`
        const fileName = (application.attachments as ApplicationAttachments)[
          attachmentAnswer?.key
        ]
        const content = await this.getFileContentBase64(fileName)
        attachments.push({ name, content } as Attachment)
      }
    }
    return attachments
  }

  private async getFileContentBase64(fileName: string): Promise<string> {
    const { bucket, key } = AmazonS3URI(fileName)

    const uploadBucket = bucket
    try {
      const file = await this.s3
        .getObject({
          Bucket: uploadBucket,
          Key: key,
        })
        .promise()
      const fileContent = file.Body as Buffer
      return fileContent?.toString('base64') || ''
    } catch (e) {
      this.log('error', 'Fetching uploaded file failed', {
        e,
      })
      return 'err'
    }
  }
}
