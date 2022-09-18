import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import {
  Configuration,
  SkipApi,
  StadaSkipsApi,
  V1SkipHeitiHeitiGetRequest,
  V1StadaskipsKvotategundirAlmanaksarArGetRequest,
  V1StadaskipsKvotategundirFiskveidiarFiskveidiarGetRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest,
  V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest,
  V1StadaskipsSkipnumerFiskveidiarFiskveidiarBreyttPostRequest,
  V1StadaskipsSkipnumerFiskveidiarFiskveidiarGetRequest,
  V1StadaskipsSkipnumerFiskveidiarFiskveidiarKvotiBreyttPostRequest,
} from '../../gen/fetch'
import { FiskistofaClientConfig } from './fiskistofaClient.config'
import {
  mapShipStatusForTimePeriod,
  mapShipStatusForCalendarYear,
  mapQuotaType,
} from './utils'

@Injectable()
export class FiskistofaApi {
  private stadaSkipsApi: StadaSkipsApi | null = null
  private skipApi: SkipApi | null = null

  constructor(
    @Inject(FiskistofaClientConfig.KEY)
    private clientConfig: ConfigType<typeof FiskistofaClientConfig>,
  ) {}

  async initialize(ignoreCache: boolean = false) {
    if (this.stadaSkipsApi && this.skipApi && !ignoreCache) {
      return
    }

    const stadaSkipsApi = new StadaSkipsApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-fiskistofa',
          ...this.clientConfig.fetch,
        }),
        basePath: this.clientConfig.url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )

    const skipApi = new SkipApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-fiskistofa',
          ...this.clientConfig.fetch,
        }),
        basePath: this.clientConfig.url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )

    const accessTokenResponse = await fetch(
      this.clientConfig.accessTokenServiceUrl,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: this.clientConfig.accessTokenServiceClientId,
          client_secret: this.clientConfig.accessTokenServiceClientSecret,
          audience: this.clientConfig.accessTokenServiceAudience,
        }),
      },
    )

    const { access_token } = await accessTokenResponse.json()

    if (!access_token) {
      throw new Error('Fiskistofa client configuration and login went wrong')
    }

    this.stadaSkipsApi = stadaSkipsApi.withMiddleware(
      new AuthHeaderMiddleware(`Bearer ${access_token}`),
    )
    this.skipApi = skipApi.withMiddleware(
      new AuthHeaderMiddleware(`Bearer ${access_token}`),
    )
  }

  async updateShipStatusForTimePeriod(
    params: V1StadaskipsSkipnumerFiskveidiarFiskveidiarBreyttPostRequest,
  ) {
    const data = await this.stadaSkipsApi?.v1StadaskipsSkipnumerFiskveidiarFiskveidiarBreyttPost(
      params,
    )
    return mapShipStatusForTimePeriod(data)
  }

  async updateShipQuotaStatusForTimePeriod(
    params: V1StadaskipsSkipnumerFiskveidiarFiskveidiarKvotiBreyttPostRequest,
  ) {
    const data = await this.stadaSkipsApi?.v1StadaskipsSkipnumerFiskveidiarFiskveidiarKvotiBreyttPost(
      params,
    )
    return {
      nextYearCatchQuota: data?.aNaestaArAflamark,
      nextYearQuota: data?.aNaestaArKvotiBreytt,
      nextYearFromQuota: data?.afNaestaAriKvotiBreytt,
      totalCatchQuota: data?.heildarAflamark,
      quotaShare: data?.hlutdeildBreytt,
      id: data?.kvotategund,
      newStatus: data?.nyStada,
      unused: data?.onotad,
      percentCatchQuotaFrom: data?.prosentaAflamarkFra,
      percentCatchQuotaTo: data?.prosentaAflamarkTil,
      excessCatch: data?.umframafli,
      allocatedCatchQuota: data?.uthlutadAflamarkBreytt,
    }
  }

  async getShipStatusForTimePeriod(
    params: V1StadaskipsSkipnumerFiskveidiarFiskveidiarGetRequest,
  ) {
    const data = await this.stadaSkipsApi?.v1StadaskipsSkipnumerFiskveidiarFiskveidiarGet(
      params,
    )
    return mapShipStatusForTimePeriod(data)
  }

  async getShipStatusForCalendarYear(
    params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarGetRequest,
  ) {
    const data = await this.stadaSkipsApi?.v1StadaskipsSkipnumerAlmanaksarArDeilistofnarGet(
      params,
    )
    return mapShipStatusForCalendarYear(data)
  }

  async updateShipStatusForCalendarYear(
    params: V1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPostRequest,
  ) {
    const data = await this.stadaSkipsApi?.v1StadaskipsSkipnumerAlmanaksarArDeilistofnarBreyttPost(
      params,
    )
    return mapShipStatusForCalendarYear(data)
  }

  async getQuotaTypesForTimePeriod(
    params: V1StadaskipsKvotategundirFiskveidiarFiskveidiarGetRequest,
  ) {
    const data = await this.stadaSkipsApi?.v1StadaskipsKvotategundirFiskveidiarFiskveidiarGet(
      params,
    )
    return (data ?? []).map(mapQuotaType)
  }

  async getQuotaTypesForCalendarYear(
    params: V1StadaskipsKvotategundirAlmanaksarArGetRequest,
  ) {
    const data = await this.stadaSkipsApi?.v1StadaskipsKvotategundirAlmanaksarArGet(
      params,
    )
    return (data ?? []).map(mapQuotaType)
  }

  async getShips(params: V1SkipHeitiHeitiGetRequest) {
    const data = await this.skipApi?.v1SkipHeitiHeitiGet(params)
    return (data ?? []).map((ship) => ({
      id: ship?.skipaskraNumer,
      name: ship?.heiti ?? '',
      shippingCompany: ship?.utgerdarflokkur ?? '',
      shippingClass: ship?.utgerd ?? '',
      homePort: ship?.heimahofn ?? '',
    }))
  }
}
