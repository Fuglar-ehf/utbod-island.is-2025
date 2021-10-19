import gql from 'graphql-tag'
import {
  EndorsementList,
  Endorsement,
  TemporaryVoterRegistry,
} from '../types/schema'

import { useQuery } from '@apollo/client'

export type UserVoterRegion = Pick<
  TemporaryVoterRegistry,
  'regionNumber' | 'regionName'
>

interface UserEndorsementsResponse {
  endorsementSystemUserEndorsements: any //TODO: update with new schemes when they are ready
}

interface UserEndorsementsListsResponse {
  endorsementSystemUserEndorsementLists: any //TODO: update with new schemes when they are ready
}

interface PetitionListResponse {
  endorsementSystemFindEndorsementLists: any
}
interface SinglePetition {
  endorsementSystemGetSingleEndorsementList?: EndorsementList
}
interface SingleEndorsement {
  endorsementSystemGetSingleEndorsement?: Endorsement
}

const GET_SINGLE_ENDORSEMENT = gql`
  query endorsementSystemGetSingleEndorsement(
    $input: FindEndorsementListInput!
  ) {
    endorsementSystemGetSingleEndorsement(input: $input) {
      id
      endorser
    }
  }
`

const GET_USER_ENDORSEMENTS = gql`
  query endorsementSystemUserEndorsements($input: EndorsementPaginationInput!) {
    endorsementSystemUserEndorsements(input: $input) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      data {
        id
        endorser
        endorsementList {
          id
          title
          description
          tags
          closedDate
        }
        meta {
          fullName
          address
        }
        created
        modified
      }
    }
  }
`

const GET_REGION_ENDORSEMENTS = gql`
  query endorsementSystemFindEndorsementLists(
    $input: PaginatedEndorsementListInput!
  ) {
    endorsementSystemFindEndorsementLists(input: $input) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      data {
        id
        title
        description
        closedDate
      }
    }
  }
`

export const GetSinglePetitionList = gql`
  query endorsementSystemGetSingleEndorsementList(
    $input: FindEndorsementListInput!
  ) {
    endorsementSystemGetSingleEndorsementList(input: $input) {
      meta
      title
      description
      owner
    }
  }
`
export const UnendorseList = gql`
  mutation unendorseList($input: FindEndorsementListInput!) {
    endorsementSystemUnendorseList(input: $input)
  }
`

export const EndorseList = gql`
  mutation endorsementSystemEndorseList($input: FindEndorsementListInput!) {
    endorsementSystemEndorseList(input: $input) {
      id
      endorser
      endorsementListId
      meta {
        fullName
      }
      created
      modified
    }
  }
`
export const EndorsementListsUserOwns = gql`
  query endorsementSystemUserEndorsementLists(
    $input: PaginatedEndorsementListInput!
  ) {
    endorsementSystemUserEndorsementLists(input: $input) {
      totalCount
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
      data {
        id
        title
        description
        closedDate
      }
    }
  }
`

export const useGetPetitionLists = () => {
  const { data: endorsementListsResponse } = useQuery<PetitionListResponse>(
    GET_REGION_ENDORSEMENTS,
    {
      variables: {
        input: {
          tags: 'generalPetition',
          limit: 20,
        },
      },
      pollInterval: 20000,
    },
  )

  return endorsementListsResponse?.endorsementSystemFindEndorsementLists ?? []
}

export const useGetUserLists = () => {
  const { data: endorsementResponse } = useQuery<UserEndorsementsResponse>(
    GET_USER_ENDORSEMENTS,
    {
      variables: {
        input: {
          limit: 20,
        },
      },
      pollInterval: 20000,
    },
  )
  return endorsementResponse?.endorsementSystemUserEndorsements ?? []
}

export const useListsUserOwns = () => {
  const { data: endorsementResponse } = useQuery<UserEndorsementsListsResponse>(
    EndorsementListsUserOwns,
    {
      variables: {
        input: {
          tags: 'generalPetition',
          limit: 20,
        },
      },
      pollInterval: 20000,
    },
  )
  return endorsementResponse?.endorsementSystemUserEndorsementLists ?? []
}

export const useGetSinglePetition = (listId: string) => {
  const { data: petition } = useQuery<SinglePetition>(GetSinglePetitionList, {
    variables: {
      input: {
        listId: listId,
      },
    },
  })
  return petition?.endorsementSystemGetSingleEndorsementList
}

export const useGetSingleEndorsement = (listId: string) => {
  const { data: endorsement } = useQuery<SingleEndorsement>(
    GET_SINGLE_ENDORSEMENT,
    {
      variables: {
        input: {
          listId: listId,
        },
      },
    },
  )
  return endorsement
}
