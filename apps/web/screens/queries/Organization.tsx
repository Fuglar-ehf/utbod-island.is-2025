import gql from 'graphql-tag'

export const GET_ORGANIZATIONS_QUERY = gql`
  query GetOrganizations($input: GetOrganizationsInput!) {
    getOrganizations(input: $input) {
      items {
        id
        slug
        title
        description
        link
        tag {
          id
          title
        }
      }
    }
  }
`

export const GET_ORGANIZATION_QUERY = gql`
  query GetOrganization($input: GetOrganizationInput!) {
    getOrganization(input: $input) {
      id
      slug
      title
      shortTitle
      internalSite
      logo {
        title
        url
      }
      link
      tag {
        id
        title
      }
      description
      organizationPage {
        id
        title
        description
        slices {
          ... on HeadingSlice {
            id
            title
            body
          }
          ... on Districts {
            id
            title
            description
            image {
              url
            }
          }
          ... on FeaturedArticles {
            id
            title
            image {
              url
            }
            articles {
              title
              slug
              isApplication
            }
          }
        }
        menuLinks {
          text
          url
        }
      }
      suborganizations {
        shortTitle
        link
        description
      }
    }
  }
`

export const GET_ORGANIZATION_SUBPAGE_QUERY = gql`
  query GetOrganizationSubpage($input: GetOrganizationSubpageInput!) {
    getOrganizationSubpage(input: $input) {
      title
      slug
    }
  }
`

export const GET_ORGANIZATION_TAGS_QUERY = gql`
  query GetOrganizationTags($input: GetOrganizationTagsInput!) {
    getOrganizationTags(input: $input) {
      items {
        id
        title
      }
    }
  }
`

export const GET_ORGANIZATION_NEWS_QUERY = gql`
  query GetOrganizationNews($input: GetOrganizationNewsInput!) {
    getOrganizationNews(input: $input) {
      slug
      title
      date
      featuredImage {
        url
      }
      introduction
    }
  }
`
