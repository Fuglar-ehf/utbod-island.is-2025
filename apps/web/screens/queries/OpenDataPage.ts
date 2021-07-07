import gql from 'graphql-tag'

export const GET_OPEN_DATA_PAGE_QUERY = gql`
  query GetOpenDataPage($input: GetOpenDataPageInput!) {
    getOpenDataPage(input: $input) {
      pageTitle
      pageDescription
      pageHeaderGraph {
        title
        type
        data
        datakeys
      }
      link
      linkTitle
      statisticsCardsSection {
        title
        statistic
        image {
          id
          url
          title
          contentType
          width
          height
        }
      }
      chartSectionTitle
      externalLinkCardSelection {
        id
        title
        cards {
          title
          body
          link
          linkText
        }
      }
      graphCards {
        graphTitle
        graphDescription
        organization
        graph {
          title
          type
          data
          datakeys
        }
      }
      externalLinkSectionTitle
      externalLinkSectionDescription
      externalLinkSectionImage {
        id
        url
        title
        contentType
        width
        height
      }
    }
  }
`
