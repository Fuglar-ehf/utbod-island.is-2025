import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseEnumPipe,
  Post,
  Put,
} from '@nestjs/common'
import { LicenseService } from './license.service'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'
import {
  UpdateLicenseResponse,
  UpdateLicenseRequest,
  RevokeLicenseResponse,
  VerifyLicenseRequest,
  VerifyLicenseResponse,
} from './dto'
import { ApiHeader, ApiTags } from '@nestjs/swagger'
import { LicenseId } from './license.types'
import { NationalId } from '@island.is/nest/core'

@ApiHeader({
  name: 'X-Param-NationalId',
  description: "The user's national id",
})
@Controller({ version: ['1'], path: 'users/.nationalId/licenses/' })
@ApiTags('users-licenses')
@Audit()
export class UserLicensesController {
  constructor(private readonly licenseService: LicenseService) {}

  @Documentation({
    description: `The endpoint updates a single user's license. The method of update is according to the LicenseUpdateType parameter
    If Push: The license is updated with the data provided in the payload. If Pull: The license data is pulled and used to update
    the digital license`,
    response: {
      status: 200,
      type: UpdateLicenseResponse,
    },
    request: {
      params: {
        licenseId: {
          description: 'The license type',
          enum: LicenseId,
          enumName: 'LicenseId',
        },
      },
    },
  })
  @Put(':licenseId')
  async update(
    @NationalId() nationalId: string,
    @Param(
      'licenseId',
      new ParseEnumPipe(LicenseId, {
        exceptionFactory: () =>
          new BadRequestException('Invalid LicenseId in route'),
      }),
    )
    licenseId: LicenseId,
    @Body() data: UpdateLicenseRequest,
  ): Promise<UpdateLicenseResponse> {
    const response = await this.licenseService.updateLicense(
      licenseId,
      nationalId,
      data,
    )
    return response
  }

  @Documentation({
    description: `This endpoint revokes a user's license`,
    response: {
      status: 200,
      type: RevokeLicenseResponse,
    },
    request: {
      params: {
        licenseId: {
          description: 'The license type',
          enum: LicenseId,
          enumName: 'LicenseId',
        },
      },
    },
  })
  @Delete(':licenseId')
  async revoke(
    @NationalId() nationalId: string,
    @Param(
      'licenseId',
      new ParseEnumPipe(LicenseId, {
        exceptionFactory: () =>
          new BadRequestException('Invalid LicenseId in route parameter'),
      }),
    )
    licenseId: LicenseId,
  ) {
    const response = await this.licenseService.revokeLicense(
      licenseId,
      nationalId,
    )
    return response
  }
}

@Controller({ version: ['1'], path: 'licenses/' })
@ApiTags('licenses')
@Audit()
export class LicensesController {
  constructor(private readonly licenseService: LicenseService) {}
  @Documentation({
    description: `This endpoint verifies a user's license. Which means that the digital license and the actual license held by the
    relevant institution are compared. If everything adds up, the license is verified.`,
    response: {
      status: 200,
      type: VerifyLicenseResponse,
    },
  })
  @Post('/verify')
  async verify(@Body() data: VerifyLicenseRequest) {
    const response = await this.licenseService.verifyLicense(data)
    return response
  }
}
