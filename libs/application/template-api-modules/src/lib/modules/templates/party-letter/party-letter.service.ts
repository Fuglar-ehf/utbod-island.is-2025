import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'

interface CreateEndorsementListResponse {
  data: {
    endorsementSystemCreateEndorsementList: {
      id: string
    }
  }
}

@Injectable()
export class PartyLetterService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async createEndorsementList({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const CREATE_ENDORSEMENT_LIST_QUERY = `
      mutation {
        endorsementSystemCreateEndorsementList(input: {
          title: "${application.answers.partyName}",
          description: "${application.answers.partyLetter}",
          endorsementMeta: [fullName, address, signedTags],
          tags: [partyLetter2021],
          validationRules: [],
        }) {
          id
        }
      }
    `

    const endorsementList: CreateEndorsementListResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, CREATE_ENDORSEMENT_LIST_QUERY)
      .then((response) => response.json())

    // This gets written to externalData under the key createEndorsementList
    return {
      id: endorsementList.data.endorsementSystemCreateEndorsementList.id,
    }
  }
}
