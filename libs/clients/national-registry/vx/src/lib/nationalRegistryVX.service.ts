import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

import { PeopleApi, Person } from '../../gen/fetch'

@Injectable()
export class NationalRegistryVXClientService {
  constructor(private peopleApi: PeopleApi) {}

  private peopleApiWithAuth(auth: Auth) {
    return this.peopleApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getPerson(auth: User): Promise<Person> {
    return await this.peopleApiWithAuth(
      auth,
    ).nationalRegistryControllerGetByNationalId({
      nationalId: auth.nationalId,
    })
  }
}
