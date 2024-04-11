import {
  BaseLicenseUpdateClient,
  LicenseType,
  LicenseUpdateClientService,
} from '@island.is/clients/license-client'
import { Pass, PassDataInput, Result } from '@island.is/clients/smartsolutions'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  BarcodeService,
  TOKEN_EXPIRED_ERROR,
} from '@island.is/services/license'
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { isJSON, isJWT } from 'class-validator'
import { uuid } from 'uuidv4'
import {
  RevokeLicenseRequest,
  RevokeLicenseResponse,
  UpdateLicenseRequest,
  UpdateLicenseResponse,
  VerifyLicenseRequest,
  VerifyLicenseResponse,
} from './dto'
import { ErrorType, LicenseId } from './license.types'
import { mapLicenseIdToLicenseType } from './utils/mapLicenseId'

const LOG_CATEGORY = 'license-api'

@Injectable()
export class LicenseService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly clientService: LicenseUpdateClientService,
    private readonly barcodeService: BarcodeService,
  ) {}

  private getErrorTypeByCode = (code: number): ErrorType =>
    code < 10 ? 'BadRequest' : 'ServerError'

  //Error message is an array to maintain consistency
  private getException = (errorType: ErrorType, details?: string | object) => {
    return errorType === 'BadRequest'
      ? new BadRequestException([details ?? 'Unknown error'])
      : new InternalServerErrorException([details ?? 'Unknown error'])
  }

  private generateRequestId = () => uuid()

  private async getClientByLicenseId(
    licenseId: LicenseId,
    requestId?: string,
  ): Promise<BaseLicenseUpdateClient> {
    const type = mapLicenseIdToLicenseType(licenseId)

    this.logger.debug('Retrieving a licence client by license id', {
      category: LOG_CATEGORY,
      requestId: requestId,
      type: type,
    })

    if (!type) {
      this.logger.error(`Invalid license type`, {
        category: LOG_CATEGORY,
        requestId: requestId,
        type,
      })
      throw new InternalServerErrorException(`Invalid license type`)
    }

    const service = await this.clientService.getLicenseUpdateClientByType(
      type as LicenseType,
      requestId,
    )

    this.logger.debug('Injecting the proper license client..', {
      category: LOG_CATEGORY,
      requestId: requestId,
      type: type,
    })

    if (!service) {
      this.logger.error(`Client service generation failed`, {
        category: LOG_CATEGORY,
        type,
      })
      throw new InternalServerErrorException(`Client service generation failed`)
    }
    this.logger.debug('Client injection successful', {
      category: LOG_CATEGORY,
      requestId: requestId,
      type: type,
    })

    return service
  }

  private async getClientByPassTemplateId(
    passTemplateId: string,
    requestId?: string,
  ): Promise<BaseLicenseUpdateClient> {
    this.logger.debug('Retrieving a licence client by pass template id', {
      category: LOG_CATEGORY,
      requestId: requestId,
      passTemplateId,
    })

    const service =
      await this.clientService.getLicenseUpdateClientByPassTemplateId(
        passTemplateId,
        requestId,
      )

    this.logger.debug('Injecting the proper license client..', {
      category: LOG_CATEGORY,
      requestId: requestId,
      passTemplateId,
    })

    if (!service) {
      this.logger.error(`Client service generation failed`, {
        category: LOG_CATEGORY,
        requestId: requestId,
        passTemplateId,
      })
      throw new InternalServerErrorException(`Client service generation failed`)
    }

    return service
  }

  private async pushUpdateLicense(
    service: BaseLicenseUpdateClient,
    expirationDate: string,
    nationalId: string,
    payload?: string,
    requestId?: string,
  ): Promise<Result<Pass | undefined>> {
    let updatePayload: PassDataInput = {
      expirationDate,
    }

    if (payload) {
      let parsedInputPayload
      try {
        parsedInputPayload = JSON.parse(payload)
      } catch (e) {
        this.logger.warn('Unable to parse payload', {
          category: LOG_CATEGORY,
          updateType: 'push',
          requestId,
        })
        throw this.getException(
          'BadRequest',
          'Unable to parse payload for push update',
        )
      }
      updatePayload = {
        ...updatePayload,
        ...parsedInputPayload,
      }
    }

    this.logger.debug('Update input parse successful, executing update', {
      category: LOG_CATEGORY,
      updateType: 'push',
      requestId,
    })

    return await service.pushUpdate(updatePayload, nationalId, requestId)
  }

  private async pullUpdateLicense(
    service: BaseLicenseUpdateClient,
    nationalId: string,
    requestId?: string,
  ): Promise<Result<Pass | undefined>> {
    /** PULL - Update electronic license with pulled data from service
     * 1. Fetch data from provider
     * 2. Parse and validate license data
     * 3. With good data, update the electronic license with the validated license data!
     */

    this.logger.debug('Executing update', {
      category: LOG_CATEGORY,
      updateType: 'pull',
      requestId,
    })

    return await service.pullUpdate(nationalId, requestId)
  }

  async updateLicense(
    licenseId: LicenseId,
    nationalId: string,
    inputData: UpdateLicenseRequest,
  ): Promise<UpdateLicenseResponse> {
    const requestId = inputData.requestId ?? this.generateRequestId()

    const service = await this.getClientByLicenseId(licenseId, requestId)

    this.logger.debug('License update initiated', {
      category: LOG_CATEGORY,
      requestId,
      updateType: inputData.licenseUpdateType,
    })

    let updateRes: Result<Pass | undefined>
    if (inputData.licenseUpdateType === 'push') {
      const { expiryDate, payload } = inputData

      if (!expiryDate) {
        this.logger.warn('Invalid request body, missing expiryDate', {
          category: LOG_CATEGORY,
          requestId,
          updateType: inputData.licenseUpdateType,
        })

        throw this.getException(
          'BadRequest',
          'Invalid request body, missing expiryDate',
        )
      }
      updateRes = await this.pushUpdateLicense(
        service,
        expiryDate,
        nationalId,
        payload,
        requestId,
      )
    } else {
      updateRes = await this.pullUpdateLicense(service, nationalId, requestId)
    }

    if (updateRes.ok) {
      this.logger.debug('License update successful', {
        category: LOG_CATEGORY,
        requestId,
        updateType: inputData.licenseUpdateType,
      })
      return {
        updateSuccess: true,
        data: updateRes.data,
      }
    }

    this.logger.error('License update failed', {
      category: LOG_CATEGORY,
      requestId,
      error: updateRes.error,
    })

    throw this.getException(
      this.getErrorTypeByCode(updateRes.error.code),
      updateRes.error.message,
    )
  }

  async revokeLicense(
    licenseId: LicenseId,
    nationalId: string,
    inputData?: RevokeLicenseRequest,
  ): Promise<RevokeLicenseResponse> {
    const requestId = inputData?.requestId ?? this.generateRequestId()
    const service = await this.getClientByLicenseId(licenseId, requestId)

    const revokeRes = await service.revoke(nationalId, requestId)

    this.logger.debug('License revoking initiated', {
      category: LOG_CATEGORY,
      requestId,
    })

    if (revokeRes.ok) {
      this.logger.debug('License revoked successfully', {
        category: LOG_CATEGORY,
        requestId,
      })
      return { revokeSuccess: revokeRes.data.success }
    }

    this.logger.error('License revoke failure', {
      category: LOG_CATEGORY,
      requestId,
      error: revokeRes.error,
    })
    throw this.getException(
      this.getErrorTypeByCode(revokeRes.error.code),
      revokeRes.error.message,
    )
  }

  async getDataFromToken(
    token: string,
    requestId: string,
  ): Promise<VerifyLicenseResponse> {
    try {
      const { c } = await this.barcodeService.verifyToken(token)
      const data = await this.barcodeService.getCache(c)

      if (!data) {
        this.logger.error('No data found in cache', {
          category: LOG_CATEGORY,
          requestId,
        })

        return {
          valid: false,
        }
      }

      return {
        valid: true,
        ...(data.extraData && { passIdentity: data.extraData }),
      }
    } catch (error) {
      if (error.name === TOKEN_EXPIRED_ERROR) {
        return {
          valid: false,
        }
      }
      this.logger.error(error.message, {
        category: LOG_CATEGORY,
        requestId,
        error,
      })

      throw new BadRequestException(error.message)
    }
  }

  async verifyLicense(
    inputData: VerifyLicenseRequest,
  ): Promise<VerifyLicenseResponse> {
    const requestId = inputData?.requestId ?? this.generateRequestId()

    if (isJWT(inputData.barcodeData)) {
      return this.getDataFromToken(inputData.barcodeData, requestId)
    }

    if (!isJSON(inputData.barcodeData)) {
      const jsonErrorMsg = 'Barcode data must be in JSON format'
      this.logger.warn(jsonErrorMsg, {
        category: LOG_CATEGORY,
        requestId,
      })

      throw new BadRequestException(jsonErrorMsg)
    }

    const { passTemplateId } = JSON.parse(inputData.barcodeData)

    this.logger.debug('License verification initiated', {
      category: LOG_CATEGORY,
      requestId,
    })

    if (!passTemplateId) {
      this.logger.warn('No pass template id supplied', {
        category: LOG_CATEGORY,
        requestId,
      })
      throw this.getException('BadRequest', 'Missing pass template id')
    }

    const service = await this.getClientByPassTemplateId(passTemplateId)

    const verifyRes = await service.verify(inputData.barcodeData, requestId)

    if (verifyRes.ok) {
      return {
        valid: verifyRes.data.valid,
        passIdentity: verifyRes.data.passIdentity,
      }
    }
    this.logger.error('Verify license failure', {
      category: LOG_CATEGORY,
      error: verifyRes.error,
      requestId,
    })

    throw this.getException(this.getErrorTypeByCode(verifyRes.error.code), {
      message: verifyRes.error.message,
      requestId,
    })
  }
}
