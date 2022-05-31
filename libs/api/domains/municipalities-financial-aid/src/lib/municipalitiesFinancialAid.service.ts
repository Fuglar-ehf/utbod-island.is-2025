import { Injectable } from '@nestjs/common'

import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  ApplicationApi,
  MunicipalityApi,
  FilesApi,
  PersonalTaxReturnApi,
} from '@island.is/clients/municipalities-financial-aid'
import { FetchError } from '@island.is/clients/middlewares'
import {
  ApplicationFilesInput,
  CreateSignedUrlInput,
  GetSignedUrlInput,
  MunicipalityInput,
} from './dto'
import { ApplicationInput } from './dto/application.input'
import { UpdateApplicationInput } from './dto/updateApplication.input'

@Injectable()
export class MunicipalitiesFinancialAidService {
  constructor(
    private applicationApi: ApplicationApi,
    private municipalityApi: MunicipalityApi,
    private filesApi: FilesApi,
    private personalTaxReturnApi: PersonalTaxReturnApi,
  ) {}

  applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  municipalityApiWithAuth(auth: Auth) {
    return this.municipalityApi.withMiddleware(new AuthMiddleware(auth))
  }

  fileApiWithAuth(auth: Auth) {
    return this.filesApi.withMiddleware(new AuthMiddleware(auth))
  }

  personalTaxReturnApiWithAuth(auth: Auth) {
    return this.personalTaxReturnApi.withMiddleware(new AuthMiddleware(auth))
  }

  private handle404(error: FetchError) {
    if (error.status === 404) {
      return null
    }
    throw error
  }

  async municipalitiesFinancialAidCurrentApplication(auth: Auth) {
    return await this.applicationApiWithAuth(auth)
      .applicationControllerGetCurrentApplication()
      .catch(this.handle404)
  }

  async municipalityInfoForFinancialAId(
    auth: Auth,
    municipalityCode: MunicipalityInput,
  ) {
    return await this.municipalityApiWithAuth(auth)
      .municipalityControllerGetById(municipalityCode)
      .catch(this.handle404)
  }

  async personalTaxReturnForFinancialAId(auth: Auth, id: string) {
    return await this.personalTaxReturnApiWithAuth(
      auth,
    ).personalTaxReturnControllerMunicipalitiesPersonalTaxReturn({
      id: id,
    })
  }

  async directTaxPaymentsForFinancialAId(auth: Auth) {
    return await this.personalTaxReturnApiWithAuth(
      auth,
    ).personalTaxReturnControllerMunicipalitiesDirectTaxPayments()
  }

  async municipalitiesFinancialAidCreateSignedUrl(
    auth: Auth,
    getSignedUrl: CreateSignedUrlInput,
  ) {
    return await this.fileApiWithAuth(auth).fileControllerCreateSignedUrl({
      getSignedUrlDto: getSignedUrl,
    })
  }

  async municipalitiesFinancialAidApplication(
    auth: Auth,
    applicationId: ApplicationInput,
  ) {
    return await this.applicationApiWithAuth(auth)
      .applicationControllerGetById(applicationId)
      .catch(this.handle404)
  }

  async municipalitiesFinancialAidCreateFiles(
    auth: Auth,
    files: ApplicationFilesInput,
  ) {
    return await this.fileApiWithAuth(auth).fileControllerCreateFiles({
      createFilesDto: files as any,
    })
  }

  async municipalitiesFinancialAidUpdateApplication(
    auth: Auth,
    updates: UpdateApplicationInput,
  ) {
    return await this.applicationApiWithAuth(auth)
      .applicationControllerUpdate({
        id: updates.id,
        updateApplicationDto: updates as any,
      })
      .catch(this.handle404)
  }

  async municipalitiesFinancialAidGetSignedUrl(
    auth: Auth,
    id: GetSignedUrlInput,
  ) {
    return await this.fileApiWithAuth(auth).fileControllerCreateSignedUrlForId(
      id,
    )
  }
}
