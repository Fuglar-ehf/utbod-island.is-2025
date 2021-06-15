import { Injectable } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { SharedTemplateApiService } from '../../shared'
import {
  generateAssignMinistryOfJusticeApplicationEmail,
  generateApplicationRejectedEmail,
  generateApplicationApprovedEmail,
} from './emailGenerators'
import { getSlugFromType } from '@island.is/application/core'

type ErrorResponse = {
  errors: {
    message: string
  }
}
type EndorsementListResponse =
  | {
      data: {
        endorsementSystemCreateEndorsementList: {
          id: string
        }
      }
    }
  | ErrorResponse

type CreatePartyLetterResponse =
  | {
      data: {
        partyLetterRegistryCreate: {
          partyLetter: string
          partyName: string
        }
      }
    }
  | ErrorResponse
@Injectable()
export class PartyLetterService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async assignMinistryOfJustice({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const CLOSE_ENDORSEMENT = `
    mutation {
      endorsementSystemCloseEndorsementList(input: {
        listId: "${
          (application.externalData?.createEndorsementList.data as any).id
        }",
      }) {
        id
        closedDate
      }
    }
  `
    const endorsementId: EndorsementListResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, CLOSE_ENDORSEMENT)
      .then((response) => response.json())

    if ('errors' in endorsementId) {
      throw new Error('Failed to close endorsement list')
    }

    await this.sharedTemplateAPIService.assignApplicationThroughEmail(
      generateAssignMinistryOfJusticeApplicationEmail,
      application,
    )
  }

  async applicationRejected({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const OPEN_ENDORSEMENT = `
      mutation {
        endorsementSystemOpenEndorsementList(input: {
          listId: "${
            (application.externalData?.createEndorsementList.data as any).id
          }",
        }) {
          id
          closedDate
        }
      }
    `
    const endorsementId: EndorsementListResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, OPEN_ENDORSEMENT)
      .then((response) => response.json())

    if ('errors' in endorsementId) {
      throw new Error('Failed to open endorsement list')
    }

    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationRejectedEmail,
      application,
    )
  }

  async applicationApproved({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService.sendEmail(
      generateApplicationApprovedEmail,
      application,
    )
  }

  async createEndorsementList({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const CREATE_ENDORSEMENT_LIST_QUERY = `
      mutation EndorsementSystemCreatePartyLetterEndorsementList($input: CreateEndorsementListDto!) {
        endorsementSystemCreateEndorsementList(input: $input) {
          id
        }
      }
    `
    const applicationSlug = getSlugFromType(application.typeId) as string

    const endorsementList: EndorsementListResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, CREATE_ENDORSEMENT_LIST_QUERY, {
        input: {
          title: application.answers.partyName,
          description: application.answers.partyLetter,
          endorsementMeta: ['fullName', 'address', 'signedTags'],
          tags: ['partyLetter2021'],
          validationRules: [
            {
              type: 'minAge',
              value: {
                age: 18,
              },
            },
          ],
          meta: {
            // to be able to link back to this application
            applicationTypeId: applicationSlug,
            applicationId: application.id,
          },
        },
      })
      .then((response) => response.json())

    if ('errors' in endorsementList) {
      throw new Error('Failed to create endorsement list')
    }

    // This gets written to externalData under the key createEndorsementList
    return {
      id: endorsementList.data.endorsementSystemCreateEndorsementList.id,
    }
  }

  async submitPartyLetter({
    application,
    authorization,
  }: TemplateApiModuleActionProps) {
    const CREATE_PARTY_LETTER_QUERY = `
    mutation {
      partyLetterRegistryCreate(input: {
        partyLetter: "${application.answers.partyLetter}",
        partyName: "${application.answers.partyName}",
        managers: []
      }) {
        partyName
        partyLetter
      }
    }
    `

    const partyLetter: CreatePartyLetterResponse = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, CREATE_PARTY_LETTER_QUERY)
      .then((response) => response.json())

    if ('errors' in partyLetter) {
      throw new Error('Failed to register party letter')
    }

    return partyLetter
  }
}
