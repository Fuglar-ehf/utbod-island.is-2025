import { HttpService, Inject, Injectable } from '@nestjs/common'
import { AxiosRequestConfig } from 'axios'

import { DocumentOauthConnection } from './documentProvider.connection'
import { DocumentProviderClientConfig } from './documentProviderClientConfig'
import { ClientCredentials, AudienceAndScope, TestResult } from './models'

export const DOCUMENT_PROVIDER_CLIENT_CONFIG = 'DOCUMENT_PROVIDER_CLIENT_CONFIG'

@Injectable()
export class DocumentProviderClient {
  private accessToken!: string
  private accessTokenExpiryDate!: Date

  constructor(
    private httpService: HttpService,
    @Inject(DOCUMENT_PROVIDER_CLIENT_CONFIG)
    private clientConfig: DocumentProviderClientConfig,
  ) {}

  private async rehydrateToken() {
    if (
      !this.accessTokenExpiryDate ||
      this.accessTokenExpiryDate < new Date()
    ) {
      const { token, expiresIn } = await DocumentOauthConnection.fetchToken(
        this.clientConfig,
      )
      this.accessToken = token
      const expiryTime = new Date()
      expiryTime.setSeconds(expiryTime.getSeconds() + expiresIn)
      this.accessTokenExpiryDate = expiryTime
    }
  }

  private async getRequest<T>(requestRoute: string): Promise<T> {
    await this.rehydrateToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }

    const response: {
      data: T
    } = await this.httpService
      .get(`${this.clientConfig.basePath}${requestRoute}`, config)
      .toPromise()

    return response.data
  }

  private async postRequest<T>(requestRoute: string): Promise<T> {
    await this.rehydrateToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }

    const response: {
      data: T
    } = await this.httpService
      .post(`${this.clientConfig.basePath}${requestRoute}`, null, config)
      .toPromise()

    return response.data
  }

  async createClient(
    nationalId: string,
    clientName: string,
  ): Promise<ClientCredentials> {
    const requestRoute = `/api/DocumentProvider/createclient?nationalId=${nationalId}&clientName=${clientName}`
    return await this.postRequest<ClientCredentials>(requestRoute)
  }

  async updateEndpoint(
    providerId: string,
    endpoint: string,
  ): Promise<AudienceAndScope> {
    const requestRoute = `/api/DocumentProvider/updateendpoint?providerId=${providerId}&endpoint=${endpoint}`
    return await this.postRequest<AudienceAndScope>(requestRoute)
  }

  async runTests(
    providerId: string,
    recipient: string,
    documentId: string,
  ): Promise<TestResult[]> {
    const requestRoute = `/api/documentprovider/runtests?providerId=${providerId}&recipient=${recipient}&documentId=${documentId}`
    //api/documentprovider/runtests?providerId=31bca5e1-586b-4cfc-b922-c89e9224f5e9&recipient=2404805659&documentId=123456
    return await this.postRequest<TestResult[]>(requestRoute)
  }
}
