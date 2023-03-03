import { Inject, Injectable } from '@nestjs/common'
import { GenericLicenseClient } from '../../license.types'
import { OpenFirearmApi } from '@island.is/clients/firearm-license'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  SmartSolutionsApi,
  PassDataInput,
  Pass,
  RevokePassData,
  VerifyPassData,
  Result,
} from '@island.is/clients/smartsolutions'
import { createPkPassDataInput } from './firearmLicenseMapper'
import {
  format as formatNationalId,
  sanitize as sanitizeNationalId,
} from 'kennitala'
import { VerifyInputData } from '../../dto/verifyLicense.input'

@Injectable()
export class FirearmLicenseApiClientService implements GenericLicenseClient {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private firearmApi: OpenFirearmApi,
    private smartApi: SmartSolutionsApi,
  ) {}

  pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass | undefined>> {
    return this.smartApi.updatePkPass(inputData, formatNationalId(nationalId))
  }

  async pullUpdate(nationalId: string): Promise<Result<Pass | undefined>> {
    let data
    try {
      data = await Promise.all([
        this.firearmApi.getVerificationLicenseInfo(nationalId),
        this.firearmApi.getVerificationPropertyInfo(nationalId),
      ])
    } catch (e) {
      return {
        ok: false,
        error: {
          code: 13,
          message: 'Service error',
          data: JSON.stringify(e),
        },
      }
    }

    const [licenseInfo, propertyInfo] = data
    if (!licenseInfo) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No license info found for user',
        },
      }
    }

    const inputValues = createPkPassDataInput(
      licenseInfo,
      propertyInfo,
      nationalId,
    )

    if (!inputValues) {
      return {
        ok: false,
        error: {
          code: 4,
          message: 'Mapping failed, invalid data',
        },
      }
    }

    const thumbnail = licenseInfo.licenseImgBase64
    const payload: PassDataInput = {
      inputFieldValues: inputValues,
      thumbnail: thumbnail
        ? {
            imageBase64String: thumbnail
              .substring(thumbnail.indexOf(',') + 1)
              .trim(),
          }
        : null,
    }

    return this.smartApi.updatePkPass(payload, formatNationalId(nationalId))
  }

  revoke(nationalId: string): Promise<Result<RevokePassData>> {
    return this.smartApi.revokePkPass(formatNationalId(nationalId))
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(inputData: string): Promise<Result<VerifyPassData>> {
    //need to parse the scanner data
    let parsedInput
    try {
      parsedInput = JSON.parse(inputData) as VerifyInputData
      this.logger.debug(JSON.stringify(parsedInput))
    } catch (ex) {
      return {
        ok: false,
        error: {
          code: 12,
          message: 'Invalid input data',
        },
      }
    }

    const { code, date } = parsedInput

    if (!code || !date) {
      return {
        ok: false,
        error: {
          code: 4,
          message:
            'Invalid input data,  either code or date are missing or invalid',
        },
      }
    }

    const verifyRes = await this.smartApi.verifyPkPass({ code, date })

    if (!verifyRes.ok) {
      return verifyRes
    }

    if (!verifyRes.data.valid) {
      return {
        ok: true,
        data: {
          valid: false,
        },
      }
    }

    const passNationalId = verifyRes.data.pass?.inputFieldValues.find(
      (i) => i.passInputField.identifier === 'kt',
    )?.value

    if (!passNationalId) {
      return {
        ok: false,
        error: {
          code: 14,
          message: 'Missing pass data',
        },
      }
    }

    const sanitizedPassNationalId = sanitizeNationalId(passNationalId)

    const licenseInfo = await this.firearmApi.getVerificationLicenseInfo(
      sanitizedPassNationalId,
    )

    if (!licenseInfo) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'No license info found for user',
        },
      }
    }

    if (!licenseInfo.ssn) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'Missing nationalId for user',
        },
      }
    }
    //now we compare the data
    return {
      ok: true,
      data: {
        valid: licenseInfo.ssn === sanitizedPassNationalId,
      },
    }
  }
}
