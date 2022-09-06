import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_ARTICLE_QUERY = gql`
  query GetSingleArticle($input: GetSingleArticleInput!) {
    getSingleArticle(input: $input) {
      id
      slug
      title
      shortTitle
      intro
      importance
      showTableOfContents
      processEntryButtonText
      alertBanner {
        showAlertBanner
        bannerVariant
        title
        description
        linkTitle
        link {
          slug
          type
        }
        isDismissable
        dismissedForDays
      }
      body {
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
          config
        }
        config
      }
      processEntry {
        id
        processTitle
        processLink
        openLinkInModal
        buttonText
      }
      organization {
        id
        title
        shortTitle
        slug
        link
        logo {
          url
          width
          height
        }
        footerItems {
          title
          content {
            ...HtmlFields
          }
          serviceWebContent {
            ...HtmlFields
          }
          link {
            text
            url
          }
        }
      }
      relatedOrganization {
        title
        slug
        link
        logo {
          url
          width
          height
        }
      }
      responsibleParty {
        title
        slug
        link
        logo {
          url
          width
          height
        }
      }
      group {
        title
        slug
        description
      }
      category {
        id
        title
        slug
        description
      }
      relatedArticles {
        title
        slug
      }
      relatedContent {
        text
        url
      }
      subArticles {
        id
        title
        slug
        body {
          ...AllSlices
        }
        showTableOfContents
      }
      featuredImage {
        url
        title
        width
        height
      }
    }
  }
  ${slices}
`

export const GET_CONTENT_SLUG = gql`
  query GetContentSlug($input: GetContentSlugInput!) {
    getContentSlug(input: $input) {
      id
      title {
        en
        is
      }
      slug {
        en
        is
      }
      url {
        en
        is
      }
      type
    }
  }
`
