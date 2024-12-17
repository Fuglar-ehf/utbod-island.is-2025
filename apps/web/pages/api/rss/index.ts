import type { NextApiRequest, NextApiResponse } from 'next'
import { parseAsString, parseAsStringEnum } from 'next-usequerystate'

import { defaultLanguage } from '@island.is/shared/constants'
import type { Locale } from '@island.is/shared/types'
import { FRONTPAGE_NEWS_TAG_ID } from '@island.is/web/constants'
import initApollo from '@island.is/web/graphql/client'
import {
  ContentLanguage,
  GetEventsQuery,
  GetEventsQueryVariables,
  GetGenericListItemsQuery,
  GetGenericListItemsQueryVariables,
  GetNewsQuery,
  QueryGetNewsArgs,
} from '@island.is/web/graphql/schema'
import { linkResolver } from '@island.is/web/hooks'
import { isLocale } from '@island.is/web/i18n/I18n'
import { GET_NEWS_QUERY } from '@island.is/web/screens/queries'
import { GET_EVENTS_QUERY } from '@island.is/web/screens/queries/Events'
import { GET_GENERIC_LIST_ITEMS_QUERY } from '@island.is/web/screens/queries/GenericList'

interface Item {
  date: string | null | undefined
  fullUrl: string
  title: string
  description: string | null | undefined
}

const CONTENT_TYPES = ['news', 'genericList', 'event']
const PAGE_SIZE = 25

const extractTagsFromQuery = (query: NextApiRequest['query']) => {
  if (typeof query?.tags === 'string') {
    return [query.tags]
  }
  if (typeof query?.tags?.length === 'number' && query.tags.length > 0) {
    return query.tags
  }
  if (query?.organization) {
    return []
  }

  // If nothing is defined in query we'll show frontpage news
  return [FRONTPAGE_NEWS_TAG_ID]
}

const generateItemString = (item: Item) => {
  return `<item>
  <title>${item.title}</title>
  <link>${item.fullUrl}</link>
  ${item.description ? `<description>${item.description}</description>` : ''}
  ${item.date ? ` <pubDate>${item.date}</pubDate>` : ''}
  </item>`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const tags = extractTagsFromQuery(req.query)
  const locale = isLocale(req.query?.lang as string)
    ? (req.query.lang as Locale)
    : defaultLanguage
  const organization = req.query?.organization as string | undefined

  const contentType = parseAsStringEnum(CONTENT_TYPES)
    .withDefault('news')
    .parseServerSide(req.query?.contentType) as 'news' | 'genericList' | 'event'

  const apolloClient = initApollo({}, locale)

  const host = req.headers?.host
  const protocol = `http${host?.startsWith('localhost') ? '' : 's'}://`
  const baseUrl = `${protocol}${host}`

  let itemString = ''

  if (contentType === 'news') {
    const news = await apolloClient.query<GetNewsQuery, QueryGetNewsArgs>({
      query: GET_NEWS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          size: PAGE_SIZE,
          tags,
          organization,
        },
      },
    })

    itemString = (news?.data?.getNews?.items ?? [])
      .map((item) =>
        generateItemString({
          date: new Date(item.date).toUTCString(),
          description: item.intro,
          fullUrl: `${baseUrl}${
            organization
              ? linkResolver(
                  'organizationnews',
                  [organization, item.slug],
                  locale,
                ).href
              : linkResolver('news', [item.slug], locale).href
          }`,
          title: item.title,
        }),
      )
      .join('')
  }

  if (contentType === 'genericList') {
    const genericListId = parseAsString
      .withDefault('')
      .parseServerSide(req.query?.genericListId)

    const listItems = await apolloClient.query<
      GetGenericListItemsQuery,
      GetGenericListItemsQueryVariables
    >({
      query: GET_GENERIC_LIST_ITEMS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          size: PAGE_SIZE,
          tags,
          genericListId,
        },
      },
    })

    itemString = (listItems.data.getGenericListItems?.items ?? [])
      .map((item) =>
        generateItemString({
          title: item.title,
          description: '',
          fullUrl: `${baseUrl}`, // TODO
          date: item.date ? new Date(item.date).toUTCString() : '',
        }),
      )
      .join('')
  }

  if (contentType === 'event') {
    const events = await apolloClient.query<
      GetEventsQuery,
      GetEventsQueryVariables
    >({
      query: GET_EVENTS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          size: PAGE_SIZE,
          organization,
        },
      },
    })

    itemString = (events.data.getEvents?.items ?? [])
      .map((item) =>
        generateItemString({
          title: item.title,
          description: item.location.useFreeText ? item.location.freeText : '',
          fullUrl: organization
            ? `${baseUrl}${
                linkResolver(
                  'organizationevent',
                  [organization, item.slug],
                  locale,
                ).href
              }`
            : '',
          date: item.firstPublishedAt
            ? new Date(item.firstPublishedAt).toUTCString()
            : '',
        }),
      )
      .join('')
  }

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
  <channel>
  <title>Ísland.is</title>
  <link>${baseUrl}</link>
  <description>Ísland.is</description>
  ${itemString}
  </channel>
  </rss>`

  res.setHeader('Content-Type', 'text/xml;charset=UTF-8')
  return res.status(200).send(feed)
}
