import gql from 'graphql-tag'

export const GET_AUCTIONS_QUERY = gql`
  query GetAuctions($input: GetAuctionsInput!) {
    getAuctions(input: $input) {
      id
      title
      type
      date
      updatedAt
      organization {
        title
      }
    }
  }
`

export const GET_AUCTION_QUERY = gql`
  query GetAuction($input: GetAuctionInput!) {
    getAuction(input: $input) {
      id
      title
      type
      date
      updatedAt
      content
      organization {
        title
      }
    }
  }
`
