import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

import { CreateTaxReturnDataDto, TaxReturnDataApi } from '../../gen/fetch'

@Injectable()
export class SkatturinnClientService {
  constructor(private taxReturnApi: TaxReturnDataApi) {}

  private taxReturnApiWithAuth(auth: Auth) {
    return this.taxReturnApi.withMiddleware(new AuthMiddleware(auth))
  }

  async submitTaxReturn(auth: Auth, data: CreateTaxReturnDataDto) {
    return await this.taxReturnApiWithAuth(
      auth,
    ).taxReturnDataV1ControllerCreateTaxReturnDataV1({
      createTaxReturnDataDto: data,
    })
  }
}
