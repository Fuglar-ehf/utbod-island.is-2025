import FormData from 'form-data'
import fetch, { Response } from 'node-fetch'

import { Cache as CacheManager } from 'cache-manager'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  PkPassServiceErrorResponse,
  PkPassServiceTokenResponse,
  PkPassServiceVerifyDriversLicenseResponse,
  PkPassVerifyResult,
} from './pkpass.type'
import type { ConfigType } from '@island.is/nest/config'
import { DrivingLicenseApiClientConfig } from '../drivingLicenseApiClient.config'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
/** Set TTL to less than given expiry from service */
const DEFAULT_CACHE_TOKEN_EXPIRY_DELTA_IN_MS = 2000

/**
 * Under load the pkpass service could return unauthenticated for a valid token
 * How often should we retry auth?
 */
const DEFAULT_AUTH_RETRIES = 1

/** Category to attach each log message to */
const LOG_CATEGORY = 'pkpass'

function strToPositiveNum(s: string): number | undefined {
  const parsed = Number.parseInt(s, 10)

  if (parsed > 0) {
    return parsed
  }

  return undefined
}

/**
 * Client for PkPass generation and verification via SmartSolution API.
 */
@Injectable()
export class PkPassClient {
  private readonly pkpassApiKey: string
  private readonly pkpassSecretKey: string
  private readonly pkpassApiUrl: string
  private readonly pkpassCacheKey: string
  private readonly pkpassCacheTokenExpiryDelta: number
  private readonly pkpassAuthRetries: number

  constructor(
    @Inject(DrivingLicenseApiClientConfig.KEY)
    private config: ConfigType<typeof DrivingLicenseApiClientConfig>,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    @Inject(CACHE_MANAGER)
    private cacheManager?: CacheManager | null,
  ) {
    this.pkpassApiKey = config.pkpass.apiKey
    this.pkpassSecretKey = config.pkpass.secretKey ?? ''
    this.pkpassApiUrl = config.pkpass.apiUrl
    this.pkpassCacheKey = config.pkpass.cacheKey ?? ''
    this.pkpassCacheTokenExpiryDelta =
      strToPositiveNum(config.pkpass.cacheTokenExpiryDelta ?? '') ??
      DEFAULT_CACHE_TOKEN_EXPIRY_DELTA_IN_MS
    this.pkpassAuthRetries =
      strToPositiveNum(config.pkpass.authRetries ?? '') ?? DEFAULT_AUTH_RETRIES

    this.logger = logger
    this.cacheManager = cacheManager
  }

  private parseTtlFromTokenExpiry(expiry?: string | null): number | null {
    if (!expiry) {
      return null
    }

    try {
      const parsed: number =
        Date.parse(expiry) - Date.now() - this.pkpassCacheTokenExpiryDelta

      if (parsed > 0) {
        return parsed
      }
    } catch (e) {
      this.logger.verbose('unable to parse datetime from token', {
        exception: e,
        category: LOG_CATEGORY,
      })
    }

    return null
  }

  private async getCachedGetPkPassToken(): Promise<string | null> {
    if (!this.cacheManager) {
      return null
    }

    const cached = await this.cacheManager.get(this.pkpassCacheKey)

    if (cached && typeof cached === 'string') {
      return cached
    }

    return null
  }

  private async fetchRetried(
    fetchToPerform: (token: string) => Promise<Response | null>,
    retries = 0,
  ): Promise<Response | null> {
    let count = 0
    const actualRetries = 0 <= retries && retries <= 3 ? retries : 0

    if (retries !== actualRetries) {
      this.logger.warn(
        `service retry count (${retries}) outside of bounds [0,3], setting as 0`,
        {
          category: LOG_CATEGORY,
        },
      )
    }

    do {
      // For retries, force a non-cached token
      const token = await this.getPkPassToken(count > 0)

      if (!token) {
        throw new Error('null from getPkPassToken')
      }

      const res = await fetchToPerform(token)

      if (res?.status !== 401) {
        return res
      }

      count = count + 1
      this.logger.info(`401 from service, retry number ${count}`, {
        category: LOG_CATEGORY,
      })
    } while (count <= actualRetries)

    this.logger.info(`Exceeded retries (${actualRetries}), returning null`, {
      category: LOG_CATEGORY,
    })

    return null
  }

  private async getPkPassToken(force = false): Promise<string | null> {
    let res: Response | null = null

    if (!force) {
      const cachedToken = await this.getCachedGetPkPassToken()

      if (cachedToken) {
        this.logger.verbose('using cached token for pkpass service', {
          category: LOG_CATEGORY,
        })
        return cachedToken
      }
    }

    try {
      res = await fetch(`${this.pkpassApiUrl}/getDriversLicenseAccessToken`, {
        headers: {
          apiKey: this.pkpassApiKey,
          secretKey: this.pkpassSecretKey,
        },
      })

      if (!res.ok) {
        throw new Error(
          `Expected 200 status for pkpass token service, got ${res.status}`,
        )
      }
    } catch (e) {
      this.logger.warn('Unable to get pkpass access token', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return null
    }

    let json: unknown
    try {
      json = await res.json()
    } catch (e) {
      this.logger.warn('Unable to parse JSON for pkpass token service', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return null
    }

    const response = json as PkPassServiceTokenResponse

    const token = response.data?.ACCESS_TOKEN

    if (response.status === 1 && token) {
      const ttl = this.parseTtlFromTokenExpiry(response.data?.EXPIRED_ON)
      if (this.cacheManager && ttl) {
        try {
          await this.cacheManager.set(this.pkpassCacheKey, token, { ttl })
        } catch (e) {
          this.logger.warn('Unable to cache token for pkpass service', {
            category: LOG_CATEGORY,
          })
        }
      }

      return token
    }

    this.logger.warn('pkpass service response does not include access token', {
      serviceStatus: response.status,
      serviceMessage: response.message,
      category: LOG_CATEGORY,
    })

    return null
  }

  private verifyFetch(
    pdf417Text: string,
  ): (accessToken: string) => Promise<Response> {
    return (accessToken: string): Promise<Response> => {
      const formData = new FormData()
      formData.append('pdf417Text', pdf417Text)

      const authHeaders = {
        apiKey: this.pkpassApiKey,
        accessToken: `smart ${accessToken}`,
      }

      return fetch(`${this.pkpassApiUrl}/verifyDriversLicense`, {
        method: 'POST',
        headers: { ...authHeaders, ...formData.getHeaders() },
        body: formData.getBuffer().toString(),
      })
    }
  }

  async verifyPkpassByPdf417(
    pdf417Text: string,
  ): Promise<PkPassVerifyResult | null> {
    let res: Response | null = null

    try {
      res = await this.fetchRetried(
        this.verifyFetch(pdf417Text),
        this.pkpassAuthRetries,
      )
    } catch (e) {
      this.logger.warn('Unable to verify pkpass drivers license', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return null
    }

    if (!res) {
      this.logger.warn(
        'Unable to verify pkpass drivers license, null from fetch',
        {
          category: LOG_CATEGORY,
        },
      )
      return null
    }

    if (!res.ok) {
      const responseErrors: PkPassServiceErrorResponse = {}
      try {
        // Service returns 400 for invalid data with details in the body
        const json = await res.json()
        responseErrors.message = json?.message ?? undefined
        responseErrors.status = json?.status ?? undefined
        responseErrors.data = json?.data ?? undefined
      } catch {
        // noop
      }

      // If we don't have a status in the body and a non-200 response, log it
      if (!responseErrors.status) {
        let message =
          'Expected 200 status or 400 status with info in message for pkpass verify drivers license service'

        if (res.status === 400) {
          message =
            'Expected 400 status with info in message for pkpass verify drivers license service'
        }

        this.logger.warn(message, {
          status: res.status,
          statusText: res.statusText,
          category: LOG_CATEGORY,
          ...responseErrors,
        })
      }

      return {
        valid: false,
        error: {
          statusCode: res.status,
          serviceError: responseErrors,
        },
      }
    }

    let json: unknown
    try {
      json = await res.json()
    } catch (e) {
      this.logger.warn('Unable to parse JSON for verify pkpass service', {
        exception: e,
        category: LOG_CATEGORY,
      })
      return null
    }

    const response = json as PkPassServiceVerifyDriversLicenseResponse

    if (response.status !== 1) {
      this.logger.warn('verify pkpass service response status is not "1"', {
        serviceStatus: response.status,
        serviceMessage: response.message,
        category: LOG_CATEGORY,
      })
      return null
    }

    if (!response.data?.kennitala) {
      this.logger.warn(
        'verify pkpass service response does not include "kennitala" but returned status "1"',
        {
          serviceStatus: response.status,
          serviceMessage: response.message,
          category: LOG_CATEGORY,
        },
      )

      return {
        valid: true,
      }
    }

    return {
      valid: true,
      nationalId: response.data.kennitala,
    }
  }
}
