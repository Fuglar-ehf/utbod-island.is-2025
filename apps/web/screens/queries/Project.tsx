import gql from 'graphql-tag'
import { nestedOneColumnTextFields, slices } from './fragments'

export const GET_PROJECT_PAGE_QUERY = gql`
  query GetProjectPage($input: GetProjectPageInput!) {
    getProjectPage(input: $input) {
      id
      title
      slug
      theme
      sidebar
      sidebarLinks {
        primaryLink {
          text
          url
        }
        childrenLinks {
          text
          url
        }
      }
      subtitle
      intro
      content {
        ...AllSlices
      }
      stepper {
        id
        title
        steps {
          id
          title
          slug
          stepType
          subtitle {
            ...HtmlFields
          }
          text {
            ...HtmlFields
          }
          isAnswer
          options
          config
        }
        config
      }
      slices {
        ...AllSlices
      }
      newsTag {
        id
        title
        slug
      }
      projectSubpages {
        title
        slug
        content {
          ...AllSlices
        }
        renderSlicesAsTabs
        slices {
          ...AllSlices
          ...NestedOneColumnTextFields
        }
      }
      featuredImage {
        url
        contentType
        width
        height
      }
    }
  }
  ${slices}
  ${nestedOneColumnTextFields}
`
