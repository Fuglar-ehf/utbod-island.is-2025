import gql from 'graphql-tag'

export const GET_GENERIC_TAG_BY_SLUG_QUERY = gql`
  query GetGenericTagBySlug($input: GetGenericTagBySlugInput!) {
    getGenericTagBySlug(input: $input) {
      id
      slug
    }
  }
`
