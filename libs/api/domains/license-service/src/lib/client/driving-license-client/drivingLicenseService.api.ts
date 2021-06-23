import fetch, { Response } from 'node-fetch'

// TODO(osk) correct way to include logger? inject?
import { logger } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'

import { GenericDrivingLicenseResponse } from './genericDrivingLicense.type'

export class LicenseServiceApi {
  private readonly xroadApiUrl: string
  private readonly xroadClientId: string
  private readonly xroadPath: string
  private readonly secret: string

  constructor(
    xroadBaseUrl: string,
    xroadClientId: string,
    xroadPath: string,
    secret: string,
  ) {
    this.xroadApiUrl = xroadBaseUrl
    this.xroadClientId = xroadClientId
    this.xroadPath = xroadPath
    this.secret = secret
  }

  headers() {
    return {
      'X-Road-Client': this.xroadClientId,
      SECRET: this.secret,
      Accept: 'application/json',
    }
  }

  async requestApi(url: string): Promise<unknown | null> {
    let res: Response | null = null

    try {
      res = await fetch(`${this.xroadApiUrl}/${url}`, {
        headers: this.headers(),
      })

      if (!res.ok) {
        throw new Error(
          `Expected 200 status for Drivers license query, got ${res.status}`,
        )
      }
    } catch (e) {
      // TODO(osk) correct way to log this?
      logger.error('Unable to query for drivers licence', {
        exception: e,
        url,
      })
      return null
    }

    let json: unknown
    try {
      json = await res.json()
    } catch (e) {
      // TODO(osk) correct way to log this?
      logger.error('Unable to parse JSON for drivers licence', {
        exception: e,
        url,
      })
      return null
    }

    return json
  }

  /**
   * Fetch drivers license data from RLS through x-road.
   *
   * @param nationalId NationalId to fetch drivers licence for.
   * @return {Promise<GenericDrivingLicenseResponse[] | null>} Array of driving license or null if an error occured.
   */
  async getGenericDrivingLicense(
    nationalId: User['nationalId'],
  ): Promise<GenericDrivingLicenseResponse[] | null> {
    const response = await this.requestApi(
      `${this.xroadPath}/api/Okuskirteini/${nationalId}`,
    )

    // TODO(osk) should this throw or return null? What's the general pattern
    if (!response) {
      return null
    }

    if (!Array.isArray(response)) {
      logger.warn('Expected drivers license response to be an array')
      return null
    }

    // TODO(osk) map and validate every field?
    const licenses = response as GenericDrivingLicenseResponse[]

    // If we get more than one license, sort in descending order so we can pick the first one as the
    // newest license later on
    licenses.sort(
      (
        a?: GenericDrivingLicenseResponse,
        b?: GenericDrivingLicenseResponse,
      ) => {
        const timeA = a?.utgafuDagsetning
          ? new Date(a.utgafuDagsetning).getTime()
          : 0
        const timeB = b?.utgafuDagsetning
          ? new Date(b.utgafuDagsetning).getTime()
          : 0

        if (isNaN(timeA) || isNaN(timeB)) {
          return 0
        }

        return timeB - timeA
      },
    )

    return licenses
  }
}
