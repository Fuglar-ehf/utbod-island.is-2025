import { Test } from '@nestjs/testing'
import { FileService } from './file.service'
import { SigningModule, SigningService } from '@island.is/dokobit-signing'
import { AwsService } from './aws.service'
import * as pdf from './utils/pdf'
import { Application } from './../application.model'
import { ApplicationTypes, PdfTypes } from '@island.is/application/core'
import { LoggingModule } from '@island.is/logging'
import { NotFoundException, BadRequestException } from '@nestjs/common'
import {
  APPLICATION_CONFIG,
  ApplicationConfig,
} from '../application.configuration'

describe('FileService', () => {
  let service: FileService
  let signingService: SigningService
  let awsService: AwsService
  const signingServiceRequestSignatureResponse = {
    controlCode: 'code',
    documentToken: 'token',
  }

  const bucket = 'bucket'

  const applicationId = '1111-2222-3333-4444'

  const parentA = {
    nationalId: '0113215029',
    ssn: '0113215029',
    fullName: 'Test name',
    phoneNumber: '111-2222',
    email: 'email@email.is',
  }

  const parentB = {
    id: 'id',
    name: 'parent b',
    ssn: '0022993322',
    postalCode: '101',
    address: 'Borgartún',
    city: 'Reykjavík',
    phoneNumber: '222-1111',
    email: 'email2@email2.is',
  }

  const child = {
    id: 'id',
    name: 'child',
    ssn: '123456-7890',
    postalCode: '101',
    address: 'Borgartún',
    city: 'Reykjavík',
    phoneNumber: '222-3333',
    email: 'email3@email3.is',
  }

  const createApplication = (answers?: object, typeId?: string) =>
    (({
      id: applicationId,
      state: 'draft',
      applicant: parentA.ssn,
      assignees: [],
      typeId: typeId ?? ApplicationTypes.CHILDREN_RESIDENCE_CHANGE,
      modified: new Date(),
      created: new Date(),
      attachments: {},
      answers: answers ?? {
        useMocks: 'no',
        selectChild: [child.name],
        parentA: {
          phoneNumber: parentA.phoneNumber,
          email: parentA.email,
        },
        parentB: {
          email: parentB.email,
          phoneNumber: parentB.phoneNumber,
        },
        expiry: 'permanent',
      },
      externalData: {
        parentNationalRegistry: {
          data: { ...parentB },
          status: 'success',
          date: new Date(),
        },
        nationalRegistry: {
          data: { ...parentA },
          status: 'success',
          date: new Date(),
        },
        childrenNationalRegistry: {
          data: [child],
          status: 'success',
          date: new Date(),
        },
      },
    } as unknown) as Application)

  beforeEach(async () => {
    const config: ApplicationConfig = { presignBucket: bucket }
    const module = await Test.createTestingModule({
      imports: [
        LoggingModule,
        SigningModule.register({
          url: 'Test Url',
          accessToken: 'Test Access Token',
        }),
      ],
      providers: [
        FileService,
        AwsService,
        { provide: APPLICATION_CONFIG, useValue: config },
      ],
    }).compile()

    awsService = module.get(AwsService)

    jest
      .spyOn(awsService, 'getFile')
      .mockImplementation(() => Promise.resolve({ Body: 'body' }))

    jest
      .spyOn(awsService, 'uploadFile')
      .mockImplementation(() => Promise.resolve())

    jest
      .spyOn(awsService, 'getPresignedUrl')
      .mockImplementation(() => Promise.resolve('url'))

    jest
      .spyOn(pdf, 'generateResidenceChangePdf')
      .mockImplementation(() => Promise.resolve(Buffer.from('buffer')))

    signingService = module.get(SigningService)

    jest
      .spyOn(signingService, 'requestSignature')
      .mockImplementation(() =>
        Promise.resolve(signingServiceRequestSignatureResponse),
      )

    service = module.get(FileService)
  })

  it('should be defined', () => {
    expect(service).toBeTruthy()
  })

  it('should generate pdf for children residence change and return a presigned url', async () => {
    const application = createApplication()

    const response = await service.createPdf(
      application,
      PdfTypes.CHILDREN_RESIDENCE_CHANGE,
    )

    const fileName = `children-residence-change/${application.id}.pdf`

    expect(awsService.uploadFile).toHaveBeenCalledWith(
      Buffer.from('buffer'),
      bucket,
      fileName,
    )

    expect(awsService.getPresignedUrl).toHaveBeenCalledWith(bucket, fileName)

    expect(response).toEqual('url')
  })
  it('should request file signature for children residence transfer then return controlCode and documentToken', async () => {
    const application = createApplication()

    const response = await service.requestFileSignature(
      application,
      PdfTypes.CHILDREN_RESIDENCE_CHANGE,
    )

    expect(awsService.getFile).toHaveBeenCalledWith(
      bucket,
      `children-residence-change/${application.id}.pdf`,
    )

    expect(signingService.requestSignature).toHaveBeenCalledWith(
      parentA.phoneNumber,
      'Lögheimilisbreyting barns',
      parentA.fullName,
      'Ísland',
      'Lögheimilisbreyting-barns.pdf',
      'body',
    )

    expect(response.controlCode).toEqual(
      signingServiceRequestSignatureResponse.controlCode,
    )
    expect(response.documentToken).toEqual(
      signingServiceRequestSignatureResponse.documentToken,
    )
  })

  it('should throw error for request file signature since phone number is missing', async () => {
    const application = createApplication({ useMocks: 'no', parentA: {} })

    const act = async () =>
      await service.requestFileSignature(
        application,
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    expect(act).rejects.toThrowError(NotFoundException)

    expect(awsService.getFile).toHaveBeenCalledWith(
      bucket,
      `children-residence-change/${applicationId}.pdf`,
    )

    expect(signingService.requestSignature).not.toHaveBeenCalled()
  })

  it('should throw error for request file signature since file content is missing', async () => {
    const application = createApplication()

    jest
      .spyOn(awsService, 'getFile')
      .mockImplementation(() => Promise.resolve({ Body: '' }))

    const act = async () =>
      await service.requestFileSignature(
        application,
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    expect(act).rejects.toThrowError(NotFoundException)

    expect(awsService.getFile).toHaveBeenCalledWith(
      bucket,
      `children-residence-change/${applicationId}.pdf`,
    )

    expect(signingService.requestSignature).not.toHaveBeenCalled()
  })

  it('should throw error for createPdf since application type is not supported', async () => {
    const application = createApplication(undefined, ApplicationTypes.EXAMPLE)

    const act = async () =>
      await service.createPdf(application, PdfTypes.CHILDREN_RESIDENCE_CHANGE)

    expect(act).rejects.toEqual(BadRequestException)
  })

  it('should have an application type that is valid for createPdf', async () => {
    const application = createApplication()

    const act = async () =>
      await service.createPdf(application, PdfTypes.CHILDREN_RESIDENCE_CHANGE)

    expect(act).not.toThrow()
  })
  it('should return presigned url', async () => {
    const application = createApplication()
    const fileName = `children-residence-change/${application.id}.pdf`

    const result = await service.getPresignedUrl(
      application,
      PdfTypes.CHILDREN_RESIDENCE_CHANGE,
    )

    expect(awsService.getPresignedUrl).toHaveBeenCalledWith(bucket, fileName)
    expect(result).toEqual('url')
  })

  it('should throw error for uploadSignedFile since application type is not supported', async () => {
    const application = createApplication(undefined, ApplicationTypes.EXAMPLE)

    const act = async () =>
      await service.uploadSignedFile(
        application,
        'token',
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    expect(act).rejects.toEqual(BadRequestException)
  })

  it('should have an application type that is valid for uploadSignedFile', async () => {
    const application = createApplication()

    const act = async () =>
      await service.uploadSignedFile(
        application,
        'token',
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    expect(act).not.toThrow()
  })

  it('should throw error for requestFileSignature since application type is not supported', async () => {
    const application = createApplication(undefined, ApplicationTypes.EXAMPLE)

    const act = async () =>
      await service.requestFileSignature(
        application,
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    expect(act).rejects.toEqual(BadRequestException)
  })

  it('should have an application type that is valid for requestFileSignature', async () => {
    const application = createApplication()

    const act = async () =>
      await service.requestFileSignature(
        application,
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    expect(act).not.toThrow()
  })

  it('should throw error for getPresignedUrl since application type is not supported', async () => {
    const application = createApplication(undefined, ApplicationTypes.EXAMPLE)

    const act = async () =>
      await service.getPresignedUrl(
        application,
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    expect(act).rejects.toEqual(BadRequestException)
  })

  it('should have an application type that is valid for getPresignedUrl', async () => {
    const application = createApplication()

    const act = async () =>
      await service.getPresignedUrl(
        application,
        PdfTypes.CHILDREN_RESIDENCE_CHANGE,
      )

    expect(act).rejects.toEqual(BadRequestException)
  })
})
