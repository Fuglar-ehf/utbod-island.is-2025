import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { generateResidenceChangePdf } from './utils/pdf'
import { PdfTypes } from '@island.is/application/core'
import { Application } from './../application.model'
import { FormValue } from '@island.is/application/core'
import {
  SigningService,
  SigningServiceResponse,
} from '@island.is/dokobit-signing'
import { BucketTypePrefix, DokobitFileName } from './utils/constants'
import {
  applicantData,
  variablesForResidenceChange,
} from './utils/childrenResidenceChange'
import { AwsService } from './aws.service'
import {
  APPLICATION_CONFIG,
  ApplicationConfig,
} from '../application.configuration'

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

    const answers = application.answers as FormValue
    const externalData = application.externalData as FormValue

    switch (pdfType) {
      case PdfTypes.CHILDREN_RESIDENCE_CHANGE: {
        const {
          parentA,
          parentB,
          childrenAppliedFor,
          expiry,
          reason,
        } = variablesForResidenceChange(answers, externalData)
        const bucket = this.getBucketName()

        const pdfBuffer = await generateResidenceChangePdf(
          childrenAppliedFor,
          parentA,
          parentB,
          expiry,
          reason,
        )

        const fileName = `${
          BucketTypePrefix[PdfTypes.CHILDREN_RESIDENCE_CHANGE]
        }/${application.id}.pdf`

        await this.awsService.uploadFile(pdfBuffer, bucket, fileName)

        return this.awsService.getPresignedUrl(bucket, fileName)
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

    const answers = application.answers as FormValue
    const externalData = application.externalData as FormValue

    switch (pdfType) {
      case PdfTypes.CHILDREN_RESIDENCE_CHANGE: {
        const { phoneNumber, name } = applicantData(answers, externalData)
        return await this.handleChildrenResidenceChangeSignature(
          pdfType,
          application.id,
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
