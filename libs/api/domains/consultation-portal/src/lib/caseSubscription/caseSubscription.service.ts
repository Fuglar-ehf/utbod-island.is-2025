import { Injectable } from '@nestjs/common'
import {
  CaseSubscriptionApi,
  ApiCaseSubscriptionCaseIdGetRequest,
  ApiCaseSubscriptionCaseIdPostRequest,
  ApiCaseSubscriptionCaseIdDeleteRequest,
} from '@island.is/clients/consultation-portal'
import { CaseSubscriptionResult } from '../models/caseSubscriptionResult.model'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { PostCaseSubscriptionTypeInput } from '../dto/postCaseSubscriptionType.input'
import { GetCaseInput } from '../dto/case.input'

@Injectable()
export class CaseSubscriptionService {
  constructor(private caseSubscriptionApi: CaseSubscriptionApi) {}

  private caseSubscriptionApiWithAuth(auth: User) {
    return this.caseSubscriptionApi.withMiddleware(new AuthMiddleware(auth))
  }

  async deleteCaseSubscription(auth: User, input: GetCaseInput): Promise<void> {
    const requestParams: ApiCaseSubscriptionCaseIdDeleteRequest = {
      caseId: input.caseId,
    }

    const response = await this.caseSubscriptionApiWithAuth(
      auth,
    ).apiCaseSubscriptionCaseIdDelete(requestParams)

    return response
  }

  async getCaseSubscriptionType(
    auth: User,
    input: GetCaseInput,
  ): Promise<CaseSubscriptionResult> {
    const requestParams: ApiCaseSubscriptionCaseIdGetRequest = {
      caseId: input.caseId,
    }
    const response = await this.caseSubscriptionApiWithAuth(
      auth,
    ).apiCaseSubscriptionCaseIdGet(requestParams)
    return response
  }

  async postCaseSubscriptionType(
    auth: User,
    input: PostCaseSubscriptionTypeInput,
  ): Promise<void> {
    const requestParams: ApiCaseSubscriptionCaseIdPostRequest = {
      caseId: input.caseId,
      postCaseSubscriptionCommand: input.postCaseSubscriptionCommand,
    }
    const response = await this.caseSubscriptionApiWithAuth(
      auth,
    ).apiCaseSubscriptionCaseIdPost(requestParams)
    return response
  }
}
