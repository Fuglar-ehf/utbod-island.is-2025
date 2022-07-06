import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common'
import { Cache as CacheManager } from 'cache-manager'
import add from 'date-fns/add'
import compareAsc from 'date-fns/compareAsc'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'
import {
  GenericUserLicense,
  GenericLicenseTypeType,
  GENERIC_LICENSE_FACTORY,
  GenericLicenseType,
  GenericLicenseClient,
  GenericLicenseMetadata,
  GenericUserLicenseFetchStatus,
  GenericUserLicenseStatus,
  GenericLicenseCached,
  GenericLicenseUserdataExternal,
  PkPassVerification,
  GenericUserLicensePkPassStatus,
} from './licenceService.type'
import { Locale } from '@island.is/shared/types'

import { AVAILABLE_LICENSES } from './licenseService.module'

const CACHE_KEY = 'licenseService'

export type GetGenericLicenseOptions = {
  includedTypes?: Array<GenericLicenseTypeType>
  excludedTypes?: Array<GenericLicenseTypeType>
  force?: boolean
  onlyList?: boolean
}
@Injectable()
export class LicenseServiceService {
  constructor(
    @Inject(GENERIC_LICENSE_FACTORY)
    private genericLicenseFactory: (
      type: GenericLicenseType,
      cacheManager: CacheManager,
    ) => Promise<GenericLicenseClient<unknown> | null>,
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  private async getCachedOrCache(
    license: GenericLicenseMetadata,
    user: User,
    fetch: () => Promise<GenericLicenseUserdataExternal | null>,
    ttl = 0,
  ): Promise<GenericLicenseCached> {
    const cacheKey = `${CACHE_KEY}_${license.type}_${user.nationalId}`

    if (ttl > 0) {
      const cachedData = await this.cacheManager.get(cacheKey)

      if (cachedData) {
        try {
          const data = JSON.parse(cachedData as string) as GenericLicenseCached

          const cacheMaxAge = add(data.fetch.updated, { seconds: ttl })
          if (compareAsc(cacheMaxAge, new Date()) < 0) {
            data.fetch.status = GenericUserLicenseFetchStatus.Stale
          }
        } catch (e) {
          this.logger.warn('Unable to parse cached data for license', {
            license,
          })
          // fall through to actual fetch of fresh fresh data
        }
      }
    }

    const fetchedData = await fetch()

    if (!fetchedData) {
      this.logger.warn('No data for generic license returned', {
        license,
      })
      return {
        data: null,
        fetch: {
          status: GenericUserLicenseFetchStatus.Error,
          updated: new Date(),
        },
        payload: undefined,
      }
    }

    const { payload, ...userData } = fetchedData

    const dataWithFetch: GenericLicenseCached = {
      data: userData,
      fetch: {
        status: GenericUserLicenseFetchStatus.Fetched,
        updated: new Date(),
      },
      payload: payload ?? undefined,
    }

    try {
      await this.cacheManager.set(cacheKey, JSON.stringify(dataWithFetch), {
        ttl,
      })
    } catch (e) {
      this.logger.warn('Unable to cache data for license', {
        license,
      })
    }

    return dataWithFetch
  }

  async getAllLicenses(
    user: User,
    locale: Locale,
    {
      includedTypes,
      excludedTypes,
      force,
      onlyList,
    }: GetGenericLicenseOptions = {},
  ): Promise<GenericUserLicense[]> {
    const licenses: GenericUserLicense[] = []

    for (const license of AVAILABLE_LICENSES) {
      if (excludedTypes && excludedTypes.indexOf(license.type) >= 0) {
        continue
      }

      if (includedTypes && includedTypes.indexOf(license.type) < 0) {
        continue
      }

      let licenseDataFromService: GenericLicenseCached | null = null
      if (!onlyList) {
        const licenseService = await this.genericLicenseFactory(
          license.type,
          this.cacheManager,
        )

        if (!licenseService) {
          this.logger.warn('No license service from generic license factory', {
            type: license.type,
            provider: license.provider,
          })
        } else {
          licenseDataFromService = await this.getCachedOrCache(
            license,
            user,
            async () => await licenseService.getLicense(user),
            force ? 0 : license.timeout,
          )

          if (!licenseDataFromService) {
            this.logger.warn('No license data returned from service', {
              type: license.type,
              provider: license.provider,
            })
          }
        }
      }

      const licenseUserdata = licenseDataFromService?.data ?? {
        status: GenericUserLicenseStatus.Unknown,
        pkpassStatus: GenericUserLicensePkPassStatus.Unknown,
      }

      const fetch = licenseDataFromService?.fetch ?? {
        status: GenericUserLicenseFetchStatus.Error,
        updated: new Date(),
      }
      const combined: GenericUserLicense = {
        nationalId: user.nationalId,
        license: {
          ...license,
          ...licenseUserdata,
        },
        fetch,
        payload: licenseDataFromService?.payload ?? undefined,
      }
      licenses.push(combined)
    }
    return licenses
  }

  async getLicense(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
  ): Promise<GenericUserLicense> {
    let licenseUserdata: GenericLicenseUserdataExternal | null = null

    const license = AVAILABLE_LICENSES.find((i) => i.type === licenseType)
    const licenseService = await this.genericLicenseFactory(
      licenseType,
      this.cacheManager,
    )

    if (license && licenseService) {
      licenseUserdata = await licenseService.getLicenseDetail(user)
    } else {
      throw new Error(`${licenseType} not supported`)
    }

    return {
      nationalId: user.nationalId,
      license: {
        ...license,
        status: licenseUserdata?.status ?? GenericUserLicenseStatus.Unknown,
        pkpassStatus:
          licenseUserdata?.pkpassStatus ??
          GenericUserLicensePkPassStatus.Unknown,
      },
      fetch: {
        status: licenseUserdata
          ? GenericUserLicenseFetchStatus.Fetched
          : GenericUserLicenseFetchStatus.Error,
        updated: new Date(),
      },
      payload: licenseUserdata?.payload ?? undefined,
    }
  }

  async generatePkPass(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
  ) {
    let pkpassUrl: string | null = null

    const licenseService = await this.genericLicenseFactory(
      licenseType,
      this.cacheManager,
    )

    if (licenseService) {
      pkpassUrl = await licenseService.getPkPassUrl(user)
    } else {
      throw new Error(`${licenseType} not supported`)
    }

    if (!pkpassUrl) {
      throw new Error(
        `Unable to get pkpass url for ${licenseType} for nationalId ${user.nationalId}`,
      )
    }
    return { pkpassUrl }
  }

  async generatePkPassQrCode(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
  ) {
    let pkpassQRCode: string | null = null

    const licenseService = await this.genericLicenseFactory(
      licenseType,
      this.cacheManager,
    )

    if (licenseService) {
      pkpassQRCode = await licenseService.getPkPassQRCode(user)
    } else {
      throw new Error(`${licenseType} not supported`)
    }
    if (!pkpassQRCode) {
      throw new Error(
        `Unable to get pkpass qr code for ${licenseType} for nationalId ${user.nationalId}`,
      )
    }

    return { pkpassQRCode }
  }

  async verifyPkPass(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
    data: string,
  ): Promise<PkPassVerification> {
    let verification: PkPassVerification | null = null

    const licenseService = await this.genericLicenseFactory(
      licenseType,
      this.cacheManager,
    )

    if (licenseService) {
      verification = await licenseService.verifyPkPass(data)
    } else {
      throw new Error(`${licenseType} not supported`)
    }

    if (!verification) {
      throw new Error(
        `Unable to verify pkpass for ${licenseType} for nationalId ${user.nationalId}`,
      )
    }

    return verification
  }
}
