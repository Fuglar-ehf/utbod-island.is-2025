import { Injectable } from '@nestjs/common'
import {
  DefaultApi as OfficialJournalOfIcelandApplicationApi,
  GetCommentsRequest,
  PostCommentRequest,
  PostApplicationRequest,
  GetCaseCommentsResponse,
} from '../../gen/fetch'

@Injectable()
export class OfficialJournalOfIcelandApplicationClientService {
  constructor(
    private readonly ojoiApplicationApi: OfficialJournalOfIcelandApplicationApi,
  ) {}

  async getComments(
    params: GetCommentsRequest,
  ): Promise<GetCaseCommentsResponse> {
    return await this.ojoiApplicationApi.getComments(params)
  }

  async postComment(params: PostCommentRequest): Promise<void> {
    await this.ojoiApplicationApi.postComment(params)
  }

  async postApplication(params: PostApplicationRequest): Promise<boolean> {
    try {
      await this.ojoiApplicationApi.postApplication(params)
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(false)
    }
  }
}
