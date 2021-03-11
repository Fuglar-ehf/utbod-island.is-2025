import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { generateResidenceChangePdf } from './utils/pdf'
import { PdfTypes } from '@island.is/application/core'
import { Application } from './../application.model'
import {
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { BucketTypePrefix, DokobitFileName } from './utils/constants'
import { AwsService } from './aws.service'
import {
  APPLICATION_CONFIG,
  ApplicationConfig,
} from '../application.configuration'
import { CRCApplication } from '@island.is/application/templates/children-residence-change'
import { User } from '@island.is/api/domains/national-registry'

@Injectable()
export class FileService {
  constructor(
    @Inject(APPLICATION_CONFIG)
    private readonly config: ApplicationConfig,
    private readonly signingService: SigningService,
    private readonly awsService: AwsService,
  ) {}

  async createPdf(
    application: Application,
    pdfType: PdfTypes,
  ): Promise<string | undefined> {
    this.validateApplicationType(application.typeId)

    switch (pdfType) {
      case PdfTypes.CHILDREN_RESIDENCE_CHANGE: {
        return await this.createChildrenResidencePdf(
          application as CRCApplication,
        )
      }
    }
  }

  async uploadSignedFile(
    application: Application,
    documentToken: string,
    pdfType: PdfTypes,
  ) {
    this.validateApplicationType(application.typeId)

    const bucket = this.getBucketName()

    await this.signingService
      .getSignedDocument(DokobitFileName[pdfType], documentToken)
      .then((file) => {
        const s3FileName = `${BucketTypePrefix[pdfType]}/${application.id}.pdf`
        this.awsService.uploadFile(
          Buffer.from(file, 'binary'),
          bucket,
          s3FileName,
        )
      })
  }

  async requestFileSignature(
    application: Application,
    pdfType: PdfTypes,
  ): Promise<SigningServiceResponse> {
    this.validateApplicationType(application.typeId)
    const { answers, externalData, id, state } = application as CRCApplication
    const { nationalRegistry, parentNationalRegistry } = externalData
    const isParentA = state === 'draft'

    const parentBName =
      answers.useMocks === 'yes'
        ? answers.mockData.parentNationalRegistry.data.name
        : parentNationalRegistry.data.name

    switch (pdfType) {
      case PdfTypes.CHILDREN_RESIDENCE_CHANGE: {
        const name = isParentA ? nationalRegistry.data.fullName : parentBName
        const phoneNumber = isParentA
          ? answers.parentA.phoneNumber
          : answers.parentB.phoneNumber

        return await this.handleChildrenResidenceChangeSignature(
          pdfType,
          id,
          name,
          phoneNumber,
        )
      }
    }
  }

  getPresignedUrl(application: Application, pdfType: PdfTypes) {
    this.validateApplicationType(application.typeId)

    const bucket = this.getBucketName()

    const fileName = `${BucketTypePrefix[pdfType]}/${application.id}.pdf`

    return this.awsService.getPresignedUrl(bucket, fileName)
  }

  private async createChildrenResidencePdf(application: CRCApplication) {
    const bucket = this.getBucketName()

    // TODO: Remove ternary for usemocks once we move mock data to externalData
    const selectedChildren =
      application.answers.useMocks === 'no'
        ? application.externalData.childrenNationalRegistry.data.filter((c) =>
            application.answers.selectChild.includes(c.name),
          )
        : application.answers.mockData.childrenNationalRegistry.data.filter(
            (c) => application.answers.selectChild.includes(c.name),
          )

    const pdfBuffer = await generateResidenceChangePdf(
      selectedChildren,
      (application.externalData.nationalRegistry.data as unknown) as User,
      application.answers.useMocks === 'no'
        ? application.externalData.parentNationalRegistry.data
        : application.answers.mockData.parentNationalRegistry.data,
      application.answers.selectDuration,
      application.answers.residenceChangeReason,
    )

    const fileName = `${BucketTypePrefix[PdfTypes.CHILDREN_RESIDENCE_CHANGE]}/${
      application.id
    }.pdf`

    await this.awsService.uploadFile(pdfBuffer, bucket, fileName)

    return this.awsService.getPresignedUrl(bucket, fileName)
  }

  private async handleChildrenResidenceChangeSignature(
    pdfType: PdfTypes,
    applicationId: string,
    applicantName: string,
    phoneNumber?: string,
  ): Promise<SigningServiceResponse> {
    const bucket = this.getBucketName()

    const s3FileName = `${BucketTypePrefix[pdfType]}/${applicationId}.pdf`
    const s3File = await this.awsService.getFile(bucket, s3FileName)
    const fileContent = s3File.Body?.toString('binary')

    if (!fileContent || !phoneNumber) {
      throw new NotFoundException(`Variables for document signing not found`)
    }

    return await this.signingService.requestSignature(
      phoneNumber,
      'Lögheimilisbreyting barns',
      applicantName,
      'Ísland',
      DokobitFileName[pdfType],
      fileContent,
    )
  }

  private validateApplicationType(applicationType: string) {
    if (
      Object.values(PdfTypes).includes(applicationType as PdfTypes) === false
    ) {
      throw new BadRequestException(
        'Application type is not supported in file service.',
      )
    }
  }

  private getBucketName() {
    const bucket = this.config.presignBucket

    if (!bucket) {
      throw new Error('Bucket name not found.')
    }

    return bucket
  }
}
