import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { OpenFirearmApi } from '@island.is/clients/firearm-license'
import {
  format as formatNationalId,
  sanitize as sanitizeNationalId,
} from 'kennitala'
import {
  Pass,
  PassDataInput,
  RevokePassData,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import {
  PassVerificationData,
  Result,
  VerifyInputData,
} from '../../../licenseClient.type'
import { createPkPassDataInput } from '../firearmLicenseMapper'
import { BaseLicenseUpdateClient } from '../../baseLicenseUpdateClient'

/** Category to attach each log message to */
//const LOG_CATEGORY = 'firearmlicense-service'
@Injectable()
export class FirearmLicenseUpdateClient extends BaseLicenseUpdateClient {
  constructor(
    @Inject(LOGGER_PROVIDER) protected logger: Logger,
    private openFirearmApi: OpenFirearmApi,
    protected smartApi: SmartSolutionsApi,
  ) {
    super(logger, smartApi)
  }

  pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Pass | undefined>> {
    return super.pushUpdate(inputData, formatNationalId(nationalId))
  }

  async pullUpdate(nationalId: string): Promise<Result<Pass>> {
    let data
    try {
      data = await Promise.all([
        this.openFirearmApi.getVerificationLicenseInfo(nationalId),
        this.openFirearmApi.getVerificationPropertyInfo(nationalId),
      ])
    } catch (e) {
      return {
        ok: false,
        error: {
          code: 13,
          message: 'External service error',
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

    if (!inputValues || !licenseInfo.expirationDate) {
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
      expirationDate: new Date(licenseInfo?.expirationDate).toISOString(),
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

  async revoke(nationalId: string): Promise<Result<RevokePassData>> {
    return super.revoke(formatNationalId(nationalId))
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(inputData: string): Promise<Result<PassVerificationData>> {
    //need to parse the scanner data
    let parsedInput
    try {
      parsedInput = JSON.parse(inputData) as VerifyInputData
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

    const licenseInfo = await this.openFirearmApi.getVerificationLicenseInfo(
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

    if (!licenseInfo.ssn || !licenseInfo.name) {
      return {
        ok: false,
        error: {
          code: 3,
          message: 'Missing nationalId or name for user',
        },
      }
    }

    //now we compare the data

    return {
      ok: true,
      data: {
        valid: licenseInfo.ssn === sanitizedPassNationalId,
        passIdentity: {
          name: licenseInfo.name,
          nationalId: licenseInfo.ssn,
          picture: licenseInfo.licenseImgBase64 ?? '',
        },
      },
    }
  }
}
