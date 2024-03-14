import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { LicenseClient, LicenseType, Result } from '../../licenseClient.type'
import { FetchError } from '@island.is/clients/middlewares'
import { PassportsService, Passport } from '@island.is/clients/passports'

@Injectable()
export class PassportsClient implements LicenseClient<LicenseType.Passport> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private passportService: PassportsService,
  ) {}

  clientSupportsPkPass = false
  type = LicenseType.Passport

  async getLicenses(user: User): Promise<Result<Array<Passport>>> {
    try {
      const licenseInfo = await this.passportService.getCurrentPassport(user)
      return { ok: true, data: [licenseInfo] }
    } catch (e) {
      let error
      if (e instanceof FetchError) {
        //404 - no license for user, still ok!
        if (e.status === 404) {
          return { ok: true, data: [] }
        } else {
          error = {
            code: 13,
            message: 'Service failure',
            data: JSON.stringify(e.body),
          }
        }
      } else {
        const unknownError = e as Error
        error = {
          code: 99,
          message: 'Unknown error',
          data: JSON.stringify(unknownError),
        }
      }

      return {
        ok: false,
        error,
      }
    }
  }
}
