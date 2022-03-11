import {
  SyslumennAuction,
  Homestay,
  PaginatedOperatingLicenses,
  CertificateInfoResponse,
  DistrictCommissionerAgencies,
  DataUploadResponse,
  Person,
  Attachment,
  MortgageCertificate,
  MortgageCertificateValidation,
} from './syslumennClient.types'
import {
  mapSyslumennAuction,
  mapHomestay,
  mapPaginatedOperatingLicenses,
  mapCertificateInfo,
  mapDistrictCommissionersAgenciesResponse,
  mapDataUploadResponse,
  constructUploadDataObject,
} from './syslumennClient.utils'
import { Injectable, Inject } from '@nestjs/common'
import {
  SyslumennApi,
  SvarSkeyti,
  Configuration,
  VirkLeyfiGetRequest,
  TegundAndlags,
} from '../../gen/fetch'
import { SyslumennClientConfig } from './syslumennClient.config'
import type { ConfigType } from '@island.is/nest/config'
import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { PropertyDetail } from '@island.is/api/domains/assets'

const UPLOAD_DATA_SUCCESS = 'Gögn móttekin'

@Injectable()
export class SyslumennService {
  constructor(
    @Inject(SyslumennClientConfig.KEY)
    private clientConfig: ConfigType<typeof SyslumennClientConfig>,
  ) {}

  private async createApi() {
    const api = new SyslumennApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-syslumenn',
          ...this.clientConfig.fetch,
        }),
        basePath: this.clientConfig.url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )

    const config = {
      notandi: this.clientConfig.username,
      lykilord: this.clientConfig.password,
    }

    const { audkenni, accessToken } = await api.innskraningPost({
      notandi: config,
    })
    if (audkenni && accessToken) {
      return {
        id: audkenni,
        api: api.withMiddleware(
          new AuthHeaderMiddleware(`Bearer ${accessToken}`),
        ),
      }
    } else {
      throw new Error('Syslumenn client configuration and login went wrong')
    }
  }

  async getHomestays(year?: number): Promise<Homestay[]> {
    const { id, api } = await this.createApi()

    const homestays = year
      ? await api.virkarHeimagistingarGet({
          audkenni: id,
          ar: year ? JSON.stringify(year) : null,
        })
      : await api.virkarHeimagistingarGetAll({
          audkenni: id,
        })

    return (homestays ?? []).map(mapHomestay)
  }

  async getSyslumennAuctions(): Promise<SyslumennAuction[]> {
    const { id, api } = await this.createApi()
    const syslumennAuctions = await api.uppbodGet({
      audkenni: id,
    })

    return (syslumennAuctions ?? []).map(mapSyslumennAuction)
  }

  async getOperatingLicenses(
    searchQuery?: string,
    pageNumber?: number,
    pageSize?: number,
  ): Promise<PaginatedOperatingLicenses> {
    // Prepare client request
    const { id, api } = await this.createApi()
    const params: VirkLeyfiGetRequest = { audkenni: id }
    if (searchQuery) {
      params.searchBy = searchQuery
    }
    if (pageNumber) {
      params.pageNumber = pageNumber
    }
    if (pageSize) {
      params.pageSize = pageSize
    }

    // Do the client request.
    const virkLeyfiApiResponse = await api.virkLeyfiGetRaw(params)

    // Custom response header for Pagination Info
    const HEADER_KEY_PAGINATION_INFO = 'x-pagination'
    const paginationInfo = virkLeyfiApiResponse.raw.headers.get(
      HEADER_KEY_PAGINATION_INFO,
    )
    if (!paginationInfo) {
      throw new Error(
        'Syslumenn API did not return pagination info for operating licences.',
      )
    }

    // Custom response header for Searcy By
    const HEADER_KEY_SEARCH_BY = 'x-searchby'
    const searchBy = decodeURIComponent(
      virkLeyfiApiResponse.raw.headers.get(HEADER_KEY_SEARCH_BY) ?? '',
    )

    return mapPaginatedOperatingLicenses(
      searchBy,
      paginationInfo,
      await virkLeyfiApiResponse.value(),
    )
  }

  async sealDocument(document: string): Promise<SvarSkeyti> {
    const { id, api } = await this.createApi()
    const explination = 'Rafrænt undirritað vottorð'
    return await api.innsiglunPost({
      skeyti: {
        audkenni: id,
        skyring: explination,
        skjal: document,
      },
    })
  }

  async uploadData(
    persons: Person[],
    attachment: Attachment | undefined,
    extraData: { [key: string]: string },
    uploadDataName: string,
    uploadDataId?: string,
  ): Promise<DataUploadResponse> {
    const { id, api } = await this.createApi()

    const payload = constructUploadDataObject(
      id,
      persons,
      attachment,
      extraData,
      uploadDataName,
      uploadDataId,
    )
    const response = await api.syslMottakaGognPost(payload)
    const success = response.skilabod === UPLOAD_DATA_SUCCESS
    if (!success) {
      throw new Error(`POST uploadData was not successful`)
    }

    return mapDataUploadResponse(response)
  }

  async getCertificateInfo(
    nationalId: string,
  ): Promise<CertificateInfoResponse | null> {
    const { id, api } = await this.createApi()
    const certificate = await api
      .faVottordUpplysingarGet({
        audkenni: id,
        kennitala: nationalId,
      })
      .catch((e) => {
        if ((e as { status: number })?.status === 404) {
          return null
        }

        throw e
      })

    if (!certificate) {
      return null
    }
    return mapCertificateInfo(certificate)
  }

  async getDistrictCommissionersAgencies(): Promise<
    DistrictCommissionerAgencies[]
  > {
    const { api } = await this.createApi()
    const response = await api.embaettiOgStarfsstodvarGetEmbaetti()
    return response.map(mapDistrictCommissionersAgenciesResponse)
  }

  async getMortgageCertificate(
    propertyNumber: string,
  ): Promise<MortgageCertificate> {
    const { id, api } = await this.createApi()

    const res = await api.vedbokarvottordPost({
      skilabod: {
        audkenni: id,
        fastanumer:
          propertyNumber[0] == 'F'
            ? propertyNumber.substring(1, propertyNumber.length)
            : propertyNumber,
        tegundAndlags: TegundAndlags.NUMBER_0, // 0 = Real estate
      },
    })
    const contentBase64 = res.vedbandayfirlitPDFSkra || ''

    const certificate: MortgageCertificate = {
      contentBase64: contentBase64,
    }

    return certificate
  }

  async validateMortgageCertificate(
    propertyNumber: string,
  ): Promise<MortgageCertificateValidation> {
    try {
      // Note: this function will throw an error if something goes wrong
      const certificate = await this.getMortgageCertificate(propertyNumber)

      const exists = certificate.contentBase64.length !== 0
      const hasKMarking =
        exists && certificate.contentBase64 !== 'Precondition Required'

      return {
        exists: exists,
        hasKMarking: hasKMarking,
      }
    } catch (exception) {
      return {
        exists: false,
        hasKMarking: false,
      }
    }
  }

  async getPropertyDetails(propertyNumber: string): Promise<PropertyDetail> {
    const { id, api } = await this.createApi()

    const res = await api.vedbokavottordRegluverkiPost({
      skilabod: {
        audkenni: id,
        fastanumer:
          propertyNumber[0] == 'F'
            ? propertyNumber.substring(1, propertyNumber.length)
            : propertyNumber,
        tegundAndlags: TegundAndlags.NUMBER_0, // 0 = Real estate
      },
    })

    if (res.length > 0) {
      return {
        propertyNumber: propertyNumber,
        defaultAddress: {
          display: res[0].heiti,
        },
        unitsOfUse: {
          unitsOfUse: [
            {
              explanation: res[0].notkun,
            },
          ],
        },
      }
    } else {
      throw new Error()
    }
  }
}
