import { User } from '@island.is/auth-nest-tools'
import {
  LicenseClient,
  LicenseClientService,
  LicenseType,
  LicenseVerifyExtraDataResult,
} from '@island.is/clients/license-client'
import { CmsContentfulService } from '@island.is/cms'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  BarcodeService,
  TOKEN_EXPIRED_ERROR,
} from '@island.is/services/license'

import { Locale } from '@island.is/shared/types'
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { isJSON, isJWT } from 'class-validator'
import isString from 'lodash/isString'

import ShortUniqueId from 'short-unique-id'
import { GenericUserLicense } from './dto/GenericUserLicense.dto'
import { UserLicensesResponse } from './dto/UserLicensesResponse.dto'
import {
  VerifyLicenseBarcodeResult,
  VerifyLicenseBarcodeError,
} from './dto/VerifyLicenseBarcodeResult.dto'
import {
  GenericLicenseFetchResult,
  GenericLicenseMapper,
  GenericLicenseOrganizationSlug,
  GenericLicenseType,
  GenericLicenseTypeType,
  GenericLicenseUserdata,
  GenericUserLicenseFetchStatus,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
} from './licenceService.type'
import {
  AVAILABLE_LICENSES,
  DEFAULT_LICENSE_ID,
  LICENSE_MAPPER_FACTORY,
} from './licenseService.constants'

const LOG_CATEGORY = 'license-service'

export type GetGenericLicenseOptions = {
  includedTypes?: Array<GenericLicenseTypeType>
  excludedTypes?: Array<GenericLicenseTypeType>
  force?: boolean
  onlyList?: boolean
}

const { randomUUID } = new ShortUniqueId({ length: 16 })
const COMMON_VERIFY_ERROR = {
  valid: false,
  error: VerifyLicenseBarcodeError.ERROR,
}

@Injectable()
export class LicenseServiceService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly barcodeService: BarcodeService,
    private readonly licenseClient: LicenseClientService,
    private readonly cmsContentfulService: CmsContentfulService,

    @Inject(LICENSE_MAPPER_FACTORY)
    private readonly licenseMapperFactory: (
      type: GenericLicenseType,
    ) => Promise<GenericLicenseMapper | null>,
  ) {}

  private async getOrganization(
    slug: GenericLicenseOrganizationSlug,
    locale: Locale,
  ) {
    return this.cmsContentfulService.getOrganization(slug, locale)
  }

  /**
   * Maps the generic license type to the actual license type used by the license clients
   */
  private mapLicenseType = (type: GenericLicenseType) =>
    type === GenericLicenseType.DriversLicense
      ? LicenseType.DrivingLicense
      : (type as unknown as LicenseType)

  /**
   * Maps the client license type to the generic license type
   */
  private mapGenericLicenseType = (type: LicenseType) =>
    type === LicenseType.DrivingLicense
      ? GenericLicenseType.DriversLicense
      : (type as unknown as GenericLicenseType)

  private async getLicenseLabels(locale: Locale) {
    const licenseLabels = await this.cmsContentfulService.getNamespace(
      'Licenses',
      locale,
    )

    return {
      labels: licenseLabels?.fields
        ? JSON.parse(licenseLabels?.fields)
        : undefined,
    }
  }

  private async fetchLicenses(
    user: User,
    licenseClient: LicenseClient<LicenseType>,
  ): Promise<GenericLicenseFetchResult> {
    if (!licenseClient) {
      throw new InternalServerErrorException('License service failed')
    }

    const licenseRes = await licenseClient.getLicenses(user)

    if (!licenseRes.ok) {
      return {
        data: [],
        fetch: {
          status: GenericUserLicenseFetchStatus.Error,
          updated: new Date(),
        },
      }
    }

    return {
      data: licenseRes.data,
      fetch: {
        status: GenericUserLicenseFetchStatus.Fetched,
        updated: new Date(),
      },
    }
  }

  async getUserLicenses(
    user: User,
    locale: Locale,
    { includedTypes, excludedTypes, onlyList }: GetGenericLicenseOptions = {},
  ): Promise<UserLicensesResponse> {
    const licenses: GenericUserLicense[] = []

    for await (const license of AVAILABLE_LICENSES) {
      if (excludedTypes && excludedTypes.indexOf(license.type) >= 0) {
        continue
      }

      if (includedTypes && includedTypes.indexOf(license.type) < 0) {
        continue
      }

      if (!onlyList) {
        const genericLicenses = await this.getLicensesOfType(
          user,
          locale,
          license.type,
        )

        genericLicenses
          ?.filter(
            (gl) => gl.license.status === GenericUserLicenseStatus.HasLicense,
          )
          .forEach((gl) => licenses.push(gl))
      }
    }
    return {
      nationalId: user.nationalId,
      licenses: licenses ?? [],
    }
  }
  async getAllLicenses(
    user: User,
    locale: Locale,
    { includedTypes, excludedTypes, onlyList }: GetGenericLicenseOptions = {},
  ): Promise<GenericUserLicense[]> {
    const licenses: GenericUserLicense[] = []

    for await (const license of AVAILABLE_LICENSES) {
      if (excludedTypes && excludedTypes.indexOf(license.type) >= 0) {
        continue
      }

      if (includedTypes && includedTypes.indexOf(license.type) < 0) {
        continue
      }

      if (!onlyList) {
        const genericLicenses = await this.getLicensesOfType(
          user,
          locale,
          license.type,
        )

        genericLicenses
          ?.filter(
            (gl) => gl.license.status === GenericUserLicenseStatus.HasLicense,
          )
          .forEach((gl) => licenses.push(gl))
      }
    }
    return licenses
  }

  async getLicensesOfType(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
  ): Promise<Array<GenericUserLicense> | null> {
    const licenseTypeDefinition = AVAILABLE_LICENSES.find(
      (i) => i.type === licenseType,
    )

    const mappedLicenseType = this.mapLicenseType(licenseType)
    const licenseService = await this.licenseClient.getClientByLicenseType<
      typeof mappedLicenseType
    >(mappedLicenseType)

    if (!licenseTypeDefinition || !licenseService) {
      this.logger.error(`Invalid license type. type: ${licenseType}`, {
        category: LOG_CATEGORY,
      })
      return null
    }

    const orgData = licenseTypeDefinition.orgSlug
      ? await this.getOrganization(licenseTypeDefinition.orgSlug, locale)
      : undefined
    const licenseLabels = await this.getLicenseLabels(locale)
    const licenseRes = await this.fetchLicenses(user, licenseService)

    const mapper = await this.licenseMapperFactory(licenseType)

    if (!mapper) {
      this.logger.warn('Service failure. No mapper created', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const licensesPayload =
      licenseRes.fetch.status !== GenericUserLicenseFetchStatus.Error
        ? mapper.parsePayload(licenseRes.data, locale, licenseLabels)
        : []

    const mappedLicenses = licensesPayload.map((lp) => {
      const licenseUserData: GenericLicenseUserdata = {
        status: GenericUserLicenseStatus.Unknown,
        pkpassStatus: GenericUserLicensePkPassStatus.Unknown,
      }

      if (lp) {
        licenseUserData.pkpassStatus = licenseService.clientSupportsPkPass
          ? (licenseService.licenseIsValidForPkPass?.(
              lp.rawData,
            ) as unknown as GenericUserLicensePkPassStatus) ??
            GenericUserLicensePkPassStatus.Unknown
          : GenericUserLicensePkPassStatus.NotAvailable
        licenseUserData.status = GenericUserLicenseStatus.HasLicense
      } else {
        licenseUserData.status = GenericUserLicenseStatus.NotAvailable
      }

      return {
        nationalId: user.nationalId,
        license: {
          ...licenseTypeDefinition,
          status: licenseUserData.status,
          pkpassStatus: licenseUserData.pkpassStatus,
          title: orgData?.title,
          logo: orgData?.logo?.url,
        },
        fetch: {
          ...licenseRes.fetch,
          updated: licenseRes.fetch.updated.getTime().toString(),
        },
        payload:
          {
            ...lp,
            rawData: lp.rawData ?? undefined,
          } ?? undefined,
      }
    })

    return (
      mappedLicenses ?? [
        {
          nationalId: user.nationalId,
          license: {
            ...licenseTypeDefinition,
            status: GenericUserLicenseStatus.Unknown,
            pkpassStatus: GenericUserLicenseStatus.Unknown,
            title: orgData?.title,
            logo: orgData?.logo?.url,
          },
          fetch: {
            ...licenseRes.fetch,
            updated: licenseRes.fetch.updated.getTime().toString(),
          },
          payload: undefined,
        },
      ]
    )
  }

  async getLicense(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
    licenseId?: string,
  ): Promise<GenericUserLicense | null> {
    const licensesOfType =
      (await this.getLicensesOfType(user, locale, licenseType)) ?? []

    if (!licenseId || licenseId === DEFAULT_LICENSE_ID) {
      return licensesOfType[0] ?? null
    }

    return (
      licensesOfType.find(
        (l) => l.payload?.metadata?.licenseId === licenseId,
      ) ?? null
    )
  }

  async getClient<Type extends LicenseType>(type: LicenseType) {
    const client = await this.licenseClient.getClientByLicenseType<Type>(type)

    if (!client) {
      const msg = `Invalid license type. "${type}"`
      this.logger.warn(msg, { category: LOG_CATEGORY })

      throw new InternalServerErrorException(msg)
    }

    return client
  }

  async generatePkPassUrl(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
  ): Promise<string> {
    const mappedLicenseType = this.mapLicenseType(licenseType)
    const client = await this.getClient(mappedLicenseType)

    if (!client.clientSupportsPkPass) {
      this.logger.warn('client does not support pkpass', {
        category: LOG_CATEGORY,
        type: licenseType,
      })
      throw new BadRequestException(
        `License client does not support pkpass, type: ${licenseType}`,
      )
    }

    if (!client.getPkPassUrl) {
      this.logger.error('License client has no getPkPassUrl implementation', {
        category: LOG_CATEGORY,
        type: licenseType,
      })
      throw new BadRequestException(
        `License client has no getPkPassUrl implementation, type: ${licenseType}`,
      )
    }

    if (!client.clientSupportsPkPass) {
      this.logger.warn('client does not support pkpass', {
        category: LOG_CATEGORY,
        type: licenseType,
      })
      throw new BadRequestException(
        `License client does not support pkpass, type: ${licenseType}`,
      )
    }

    if (!client.getPkPassUrl) {
      this.logger.error('License client has no getPkPassUrl implementation', {
        category: LOG_CATEGORY,
        type: licenseType,
      })
      throw new BadRequestException(
        `License client has no getPkPassUrl implementation, type: ${licenseType}`,
      )
    }

    const pkPassRes = await client.getPkPassUrl(user)

    if (pkPassRes.ok) {
      return pkPassRes.data
    }

    throw new InternalServerErrorException(
      `Unable to get pkpass for ${licenseType} for user`,
    )
  }

  async generatePkPassQRCode(
    user: User,
    locale: Locale,
    licenseType: GenericLicenseType,
  ): Promise<string> {
    const mappedLicenseType = this.mapLicenseType(licenseType)
    const client = await this.getClient(mappedLicenseType)

    if (!client.clientSupportsPkPass) {
      this.logger.warn('client does not support pkpass', {
        category: LOG_CATEGORY,
        type: licenseType,
      })
      throw new BadRequestException(
        `License client does not support pkpass, type: ${licenseType}`,
      )
    }

    if (!client.getPkPassQRCode) {
      this.logger.error(
        'License client has no getPkPassQRCode implementation',
        {
          category: LOG_CATEGORY,
          type: licenseType,
        },
      )
      throw new BadRequestException(
        `License client has no getPkPassQRCode implementation, type: ${licenseType}`,
      )
    }

    const pkPassRes = await client.getPkPassQRCode(user)

    if (pkPassRes.ok) {
      return pkPassRes.data
    }

    throw new InternalServerErrorException(
      `Unable to get pkpass for ${licenseType} for user`,
    )
  }

  async verifyPkPassDeprecated(data: string): Promise<PkPassVerification> {
    if (!data) {
      this.logger.warn('Missing input data for pkpass verification', {
        category: LOG_CATEGORY,
      })
      throw new Error(`Missing input data`)
    }

    const { passTemplateId }: { passTemplateId?: string } = JSON.parse(data)

    if (!passTemplateId) {
      throw new BadRequestException('Invalid pass template id supplied')
    }

    /*
     * PkPass barcodes provide a PassTemplateId that we can use to
     * map barcodes to license types.
     * Drivers licenses do NOT return a barcode so if the pass template
     * id is missing, then it's a driver's license.
     * Otherwise, map the id to its corresponding license type
     */
    const licenseService = await this.licenseClient.getClientByPassTemplateId(
      passTemplateId,
    )

    if (!licenseService) {
      throw new Error(`Invalid pass template id: ${passTemplateId}`)
    }

    if (!licenseService.clientSupportsPkPass) {
      this.logger.warn('client does not support pkpass', {
        category: LOG_CATEGORY,
        passTemplateId,
      })
      throw new BadRequestException(
        `License client does not support pkpass, passTemplateId: ${passTemplateId}`,
      )
    }

    if (
      !licenseService.verifyPkPassDeprecated ||
      !licenseService.verifyPkPass
    ) {
      const missingMethodMsg =
        'License client has no verifyPkPass nor verifyPkPassDeprecated implementation'
      this.logError(missingMethodMsg, {
        passTemplateId,
      })

      throw new BadRequestException(
        `${missingMethodMsg}, passTemplateId: ${passTemplateId}`,
      )
    }

    if (licenseService?.verifyPkPassDeprecated) {
      const verification = await licenseService.verifyPkPassDeprecated(data)

      if (!verification.ok) {
        throw new InternalServerErrorException(
          'Unable to verify pkpass for user',
        )
      }

      return verification.data
    }

    const verifyPkPassRes = await licenseService.verifyPkPass(data)

    if (!verifyPkPassRes.ok) {
      throw new InternalServerErrorException(`Unable to verify pkpass for user`)
    }

    return {
      valid: verifyPkPassRes.data.valid,
      // Make sure to return the data as a string to be backwards compatible
      data: JSON.stringify(verifyPkPassRes.data.data),
    }
  }

  async createBarcode(user: User, genericUserLicense: GenericUserLicense) {
    const code = randomUUID()
    const genericUserLicenseType = genericUserLicense.license.type
    const licenseType = this.mapLicenseType(genericUserLicenseType)

    const client = await this.getClient<typeof licenseType>(licenseType)

    if (!client.clientSupportsPkPass) {
      this.logger.warn('License type does not support barcode', {
        licenseType,
      })

      return null
    }

    let extraData: LicenseVerifyExtraDataResult<LicenseType> | undefined

    if (client?.verifyExtraData) {
      extraData = await client.verifyExtraData(user)

      if (!extraData) {
        const msg = `Unable to verify extra data for license: ${licenseType}`
        this.logger.error(msg, { category: LOG_CATEGORY })

        throw new InternalServerErrorException(msg)
      }
    }

    const [token] = await Promise.all([
      // Create a token with the version and a server reference (Redis key) code
      this.barcodeService.createToken({
        v: '2',
        t: licenseType,
        c: code,
      }),
      // Store license data in cache so that we can fetch data quickly when verifying the barcode
      this.barcodeService.setCache(code, {
        nationalId: user.nationalId,
        licenseType,
        extraData,
      }),
    ])

    return token
  }

  logError(error: Error | string, meta?: Record<string, unknown>) {
    this.logger.error(isString(error) ? error : error.message, {
      category: LOG_CATEGORY,
      ...(isString(error) ? {} : { error }),
      ...meta,
    })
  }

  async getDataFromToken(token: string): Promise<VerifyLicenseBarcodeResult> {
    let code: string | undefined

    try {
      const payload = await this.barcodeService.verifyToken(token)
      code = payload.c
    } catch (error) {
      this.logError(error)

      if (error.message.includes(TOKEN_EXPIRED_ERROR)) {
        return {
          valid: false,
          error: VerifyLicenseBarcodeError.TOKEN_EXPIRED,
        }
      }

      return COMMON_VERIFY_ERROR
    }

    const data = await this.barcodeService.getCache(code)

    if (!data) {
      this.logError('No data found in cache')

      return COMMON_VERIFY_ERROR
    }

    const licenseType = this.mapGenericLicenseType(data.licenseType)

    return {
      valid: true,
      licenseType,
      data: data.extraData
        ? {
            ...data.extraData,
            // type here is used to resolve the union type in the graphql schema
            type: licenseType,
          }
        : null,
    }
  }

  async verifyLicenseBarcode(
    data: string,
  ): Promise<VerifyLicenseBarcodeResult> {
    if (isJWT(data)) {
      return this.getDataFromToken(data)
    }

    if (!isJSON(data)) {
      this.logError('Invalid JSON data')

      return COMMON_VERIFY_ERROR
    }

    const { passTemplateId }: { passTemplateId?: string } = JSON.parse(data)

    if (!passTemplateId) {
      this.logError('No passTemplateId found in data')

      return COMMON_VERIFY_ERROR
    }

    const client = await this.licenseClient.getClientByPassTemplateId(
      passTemplateId,
    )

    if (!client) {
      this.logError(
        'Invalid passTemplateId supplied to getClientByPassTemplateId',
      )

      return COMMON_VERIFY_ERROR
    }

    if (!client.verifyPkPass) {
      this.logError('License client has no verifyPkPass implementation')

      return COMMON_VERIFY_ERROR
    }

    const res = await client.verifyPkPass(data)

    if (!res.ok) {
      this.logError('Unable to verify pkpass for user')

      return COMMON_VERIFY_ERROR
    }

    const licenseData = res.data.data
    const licenseType = this.mapGenericLicenseType(client.type)

    return {
      valid: true,
      licenseType,
      data: licenseData
        ? {
            type: licenseType,
            ...licenseData,
          }
        : null,
    }
  }
}
