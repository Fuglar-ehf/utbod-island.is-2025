import { Inject, Injectable } from '@nestjs/common'
import { MMSApi } from '@island.is/clients/mms'
import { HealthDirectorateClientService } from '@island.is/clients/health-directorate'
import type { User } from '@island.is/auth-nest-tools'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { OccupationalLicensesList } from './models/occupationalLicenseList.model'
import { isDefined } from '@island.is/shared/utils'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import {
  EducationalLicense,
  OccupationalLicenseStatus,
  HealthDirectorateLicense,
  OccupationalLicenseType,
  OccupationalLicenseResponse,
} from './models/occupationalLicense.model'
import {
  OccupationalLicensesError,
  OccupationalLicensesErrorStatus,
} from './models/occupationalLicenseError.model'
import { DownloadServiceConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { handle404 } from '@island.is/clients/middlewares'

const LOG_CATEGORY = 'occupational-licenses-service'

type HealthDirectorateStatusValues =
  | 'Í gildi'
  | 'Ógilt'
  | 'Í gildi - Takmörkun'
  | 'Svipting'
  | 'Afsal'

type OccupationalLicenseResult<T> =
  | {
      items: T[]
      type: 'data'
      error?: never
    }
  | {
      items?: never
      error: OccupationalLicensesError
      type: 'error'
    }

@Injectable()
export class OccupationalLicensesService {
  constructor(
    private healthDirectorateApi: HealthDirectorateClientService,
    private mmsApi: MMSApi,
    @Inject(DownloadServiceConfig.KEY)
    private readonly downloadService: ConfigType<typeof DownloadServiceConfig>,

    private readonly featureFlagService: FeatureFlagService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private checkHealthDirectorateValidity = (
    status: HealthDirectorateStatusValues | string,
  ): OccupationalLicenseStatus => {
    switch (status) {
      case 'Í gildi':
        return OccupationalLicenseStatus.valid
      case 'Í gildi - Takmörkun':
        return OccupationalLicenseStatus.limited
      case 'Svipting':
        return OccupationalLicenseStatus.revoked
      case 'Afsal':
        return OccupationalLicenseStatus.waived
      case 'Ógilt':
        return OccupationalLicenseStatus.error
      default:
        this.logger.log('Unknown health directorate status', {
          category: LOG_CATEGORY,
          status: status,
        })
        return OccupationalLicenseStatus.error
    }
  }

  private checkEducationalValidity = (
    validFrom: string,
  ): OccupationalLicenseStatus => {
    return new Date(validFrom) < new Date()
      ? OccupationalLicenseStatus.valid
      : OccupationalLicenseStatus.error
  }

  async getHealthDirectorateLicenseById(
    user: User,
    id: string,
  ): Promise<OccupationalLicenseResponse> {
    try {
      const licenses = await this.healthDirectorateApi
        .getHealthDirectorateLicense(user)
        .catch(handle404)

      const item =
        licenses &&
        licenses
          .map((license) => {
            if (
              !license.leyfi ||
              !license.starfsstett ||
              !license.gildirFra ||
              !license.leyfisnumer ||
              !license.id ||
              !license.logadiliID ||
              !license.kennitala ||
              !license.nafn ||
              !license.stada
            )
              return null
            return {
              institution: OccupationalLicenseType.HEALTH,
              id: license.id.toString(),
              legalEntityId: license.logadiliID,
              holderName: license.nafn,
              profession: license.starfsstett,
              type: license.leyfi,
              number: license.leyfisnumer,
              validFrom: license.gildirFra?.toString(),
              status: this.checkHealthDirectorateValidity(license.stada),
            }
          })
          .filter(isDefined)
          .find((license) => license.id === id)

      return {
        items: item ? [item] : [],
        errors: [],
      }
    } catch (e) {
      this.logger.error(`Error getting health directorate license by id`, {
        ...e,
        category: LOG_CATEGORY,
      })
      return {
        items: [],
        errors: [
          {
            message: 'Error getting health directorate license by id',
            institution: OccupationalLicenseType.HEALTH,
            status: OccupationalLicensesErrorStatus.INTERNAL_SERVER_ERROR,
          },
        ],
      }
    }
  }

  async getHealthDirectorateLicense(
    user: User,
  ): Promise<OccupationalLicenseResult<HealthDirectorateLicense>> {
    try {
      const licenses = await this.healthDirectorateApi
        .getHealthDirectorateLicense(user)
        .catch(handle404)

      const items =
        licenses &&
        licenses
          .map((license) => {
            if (
              !license.leyfi ||
              !license.starfsstett ||
              !license.gildirFra ||
              !license.leyfisnumer ||
              !license.id ||
              !license.logadiliID ||
              !license.kennitala ||
              !license.nafn ||
              !license.stada
            )
              return null
            return {
              institution: OccupationalLicenseType.HEALTH,
              id: license.id.toString(),
              legalEntityId: license.logadiliID,
              holderName: license.nafn,
              profession: license.starfsstett,
              type: license.leyfi,
              number: license.leyfisnumer,
              validFrom: license.gildirFra?.toString(),
              status: this.checkHealthDirectorateValidity(license.stada),
            }
          })
          .filter(isDefined)

      return {
        items: items ? items : [],
        type: 'data',
      }
    } catch (e) {
      this.logger.error(`Error getting health directorate license`, {
        ...e,
        category: LOG_CATEGORY,
      })
      return {
        error: {
          message: 'Error getting health directorate license',
          institution: OccupationalLicenseType.HEALTH,
          status: OccupationalLicensesErrorStatus.INTERNAL_SERVER_ERROR,
        },
        type: 'error',
      }
    }
  }

  async getEducationalLicensesById(
    user: User,
    id: string,
  ): Promise<OccupationalLicenseResponse> {
    try {
      const licenses = await (this.mmsApi.getLicenses(user.nationalId) ?? [])

      const item =
        licenses
          .map((license) => ({
            institution: OccupationalLicenseType.EDUCATION,
            id: license.id,
            type: license.issuer,
            profession: license.type,
            validFrom: license.issued,
            status: this.checkEducationalValidity(license.issued),
            downloadUrl: `${this.downloadService.baseUrl}/download/v1/occupational-licenses/education/${id}`,
          }))
          .find((license) => license.id === id) ?? null

      return { items: item ? [item] : [], errors: [] }
    } catch (e) {
      this.logger.error(`Error getting educational license by id`, {
        ...e,
        category: LOG_CATEGORY,
      })
      return {
        items: [],
        errors: [
          {
            message: 'Error getting educational license by id',
            institution: OccupationalLicenseType.EDUCATION,
            status: OccupationalLicensesErrorStatus.INTERNAL_SERVER_ERROR,
          },
        ],
      }
    }
  }

  async getEducationalLicenses(
    user: User,
  ): Promise<OccupationalLicenseResult<EducationalLicense>> {
    try {
      const licenses = await (this.mmsApi.getLicenses(user.nationalId) ?? [])

      const items = licenses.map((license) => ({
        institution: OccupationalLicenseType.EDUCATION,
        id: license.id,
        type: license.issuer,
        profession: license.type,
        validFrom: license.issued,
        status: this.checkEducationalValidity(license.issued),
      }))

      return {
        items: items,
        type: 'data',
      }
    } catch (e) {
      this.logger.error(`Error getting educational licenses`, {
        ...e,
        category: LOG_CATEGORY,
      })
      return {
        type: 'error',
        error: {
          message: 'Error getting educational licenses',
          institution: OccupationalLicenseType.EDUCATION,
          status: OccupationalLicensesErrorStatus.INTERNAL_SERVER_ERROR,
        },
      }
    }
  }

  async getOccupationalLicenses(user: User): Promise<OccupationalLicensesList> {
    const allowHealthDirectorate = await this.featureFlagService.getValue(
      Features.occupationalLicensesHealthDirectorate,
      false,
      user,
    )
    const errors: OccupationalLicensesError[] = []
    const items: Array<EducationalLicense | HealthDirectorateLicense> = []

    if (allowHealthDirectorate) {
      const healthDirectorateLicenses = await this.getHealthDirectorateLicense(
        user,
      )
      if (healthDirectorateLicenses.type === 'data') {
        items.push(...healthDirectorateLicenses.items)
      } else {
        errors.push(healthDirectorateLicenses.error)
      }
    }
    const educationalLicenses = await this.getEducationalLicenses(user)

    if (educationalLicenses.type === 'data') {
      items.push(...educationalLicenses.items)
    } else {
      errors.push(educationalLicenses.error)
    }

    return {
      count: items.length,
      items,
      errors,
    }
  }
}
