/* eslint-disable @typescript-eslint/no-use-before-define */
import { getLocalizedEntries } from './contentful'
import { logger } from '@island.is/logging'
import { ApolloError } from 'apollo-server-express'
import { Entry } from 'contentful'
import { Article } from './models/article.model'
import { AboutPage } from './models/aboutPage.model'
import { LandingPage } from './models/landingPage.model'
import { News } from './models/news.model'
import { Link } from './models/link.model'
import { LinkList } from './models/linkList.model'
import { PageHeaderSlice } from './models/slices/pageHeaderSlice.model'
import { TimelineEvent } from './models/timelineEvent.model'
import { TimelineSlice } from './models/slices/timelineSlice.model'
import { Story } from './models/story.model'
import { StorySlice } from './models/slices/storySlice.model'
import { MailingListSignupSlice } from './models/slices/mailingListSignupSlice.model'
import { HeadingSlice } from './models/slices/headingSlice.model'
import { LinkCard } from './models/linkCard.model'
import { LinkCardSlice } from './models/slices/linkCardSlice.model'
import { LatestNewsSlice } from './models/slices/latestNewsSlice.model'
import { LogoListSlice } from './models/slices/logoListSlice.model'
import { IconBullet } from './models/bullets/iconBullet.model'
import { NumberBullet } from './models/bullets/numberBullet.model'
import { NumberBulletGroup } from './models/bullets/numberBulletGroup.model'
import { BulletEntry } from './models/bullets/bulletEntry.model'
import { BulletListSlice } from './models/slices/bulletListSlice.model'
import { Slice } from './models/slices/slice.model'
import { Pagination } from './models/pagination.model'
import { GetNewsListInput } from './dto/getNewsList.input'
import { PaginatedNews } from './models/paginatedNews.model'
import { GetAboutPageInput } from './dto/getAboutPage.input'
import { GetLandingPageInput } from './dto/getLandingPage.input'
import { Namespace } from './models/namespace.model'
import { Image } from './models/image.model'

type CmsPage = Omit<AboutPage, 'slices'> & {
  slices: Entry<typeof Slice>[]
}

const formatArticle = ({ sys, fields }): Article => ({
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  group: fields.group?.fields,
  category: fields.category?.fields,
  content: JSON.stringify(fields.content),
})

const formatImage = ({ fields }): Image => ({
  url: fields.file.url,
  title: fields.title,
  contentType: fields.file.contentType,
  width: fields.file.details.image.width,
  height: fields.file.details.image.height,
})

const formatNewsItem = ({ fields, sys }): News => ({
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  intro: fields.intro,
  image: formatImage(fields.image),
  date: fields.date,
  content: JSON.stringify(fields.content),
})

const formatLink = ({ fields }): Link => ({
  text: fields.text,
  url: fields.url,
})

const formatPageHeaderSlice = ({ fields, sys }): PageHeaderSlice =>
  new PageHeaderSlice({
    id: sys.id,
    title: fields.title,
    introduction: fields.introduction,
    navigationText: fields.navigationText,
    links: fields.links.map(formatLink),
    slices: fields.slices.map(formatSlice),
  })

const formatLinks = ({ fields }): LinkList => ({
  title: fields.title,
  links: (fields.links ?? []).map(formatLink),
})

const formatTimelineEvent = ({ fields, sys }): TimelineEvent => ({
  id: sys.id,
  title: fields.title,
  date: fields.date,
  numerator: fields.numerator,
  denominator: fields.denominator,
  label: fields.label ?? '',
  body: fields.body && JSON.stringify(fields.body),
  tags: fields.tags ?? [],
  link: fields.link ?? '',
})

const formatTimelineSlice = ({ fields, sys }): TimelineSlice =>
  new TimelineSlice({
    id: sys.id,
    title: fields.title,
    events: fields.events.map(formatTimelineEvent),
  })

const formatStory = ({ fields, sys }): Story => ({
  title: fields.title ?? '',
  label: fields.label ?? '',
  date: sys.createdAt,
  readMoreText: fields.readMoreText,
  logo: formatImage(fields.logo),
  intro: fields.intro,
  body: fields.body && JSON.stringify(fields.body),
})

const formatStorySlice = ({ fields, sys }): StorySlice =>
  new StorySlice({
    id: sys.id,
    readMoreText: fields.readMoreText ?? '',
    stories: fields.stories.map(formatStory),
  })

const formatMailingListSignup = ({ fields, sys }): MailingListSignupSlice =>
  new MailingListSignupSlice({
    id: sys.id,
    title: fields.title ?? '',
    description: fields.description ?? '',
    inputLabel: fields.inputLabel ?? '',
    buttonText: fields.buttonText ?? '',
  })

const formatSectionHeading = ({ fields, sys }): HeadingSlice =>
  new HeadingSlice({
    id: sys.id,
    title: fields.title ?? '',
    body: fields.body ?? '',
  })

const formatLinkCard = ({ fields }): LinkCard => ({
  title: fields.title ?? '',
  body: fields.body ?? '',
  link: fields.link ?? '',
  linkText: fields.linkText ?? '',
})

const formatLinkCardSlice = ({ fields, sys }): LinkCardSlice =>
  new LinkCardSlice({
    id: sys.id,
    title: fields.title ?? '',
    cards: fields.cards.map(formatLinkCard),
  })

const formatLatestNews = ({ fields, sys }): LatestNewsSlice =>
  new LatestNewsSlice({
    id: sys.id,
    title: fields.title ?? '',
    news: [],
  })

const formatLogoListSlice = ({ fields, sys }): LogoListSlice =>
  new LogoListSlice({
    id: sys.id,
    title: fields.title,
    body: fields.body,
    images: fields.images.map(formatImage),
  })

const formatIconBullet = ({ fields, sys }): IconBullet =>
  new IconBullet({
    id: sys.id,
    title: fields.title,
    body: fields.body,
    icon: formatImage(fields.icon),
    url: fields.url,
    linkText: fields.linkText,
  })

const formatNumberBullet = ({ fields, sys }): NumberBullet => ({
  id: sys.id,
  title: fields.title,
  body: fields.body,
})

const formatNumberBulletGroup = ({ fields, sys }): NumberBulletGroup =>
  new NumberBulletGroup({
    id: sys.id,
    defaultVisible: fields.defaultVisible,
    bullets: fields.bullets.map(formatNumberBullet),
  })

const formatBulletEntry = ({ fields, sys }): typeof BulletEntry => {
  switch (sys.contentType.sys.id) {
    case 'iconBullet':
      return formatIconBullet({ fields, sys })
    case 'numberBulletSection':
      return formatNumberBulletGroup({ fields, sys })
  }
}

const formatBulletListSlice = ({ fields, sys }): BulletListSlice =>
  new BulletListSlice({
    id: sys.id,
    bullets: fields.bullets.map(formatBulletEntry),
  })

const formatSlice = (slice: Entry<typeof Slice>): typeof Slice => {
  const sliceName = slice.sys.contentType.sys.id
  switch (sliceName) {
    case 'pageHeader':
      return formatPageHeaderSlice(slice)
    case 'timeline':
      return formatTimelineSlice(slice)
    case 'mailingListSignup':
      return formatMailingListSignup(slice)
    case 'sectionHeading':
      return formatSectionHeading(slice)
    case 'cardSection':
      return formatLinkCardSlice(slice)
    case 'storySection':
      return formatStorySlice(slice)
    case 'logoListSlice':
      return formatLogoListSlice(slice)
    case 'latestNewsSlice':
      return formatLatestNews(slice)
    case 'bigBulletList':
      return formatBulletListSlice(slice)
    default:
      throw new ApolloError(`Can not convert to slice: ${sliceName}`)
  }
}

const formatAboutPage = ({ fields }: Entry<CmsPage>): AboutPage => ({
  slices: fields.slices.map(formatSlice),
  title: fields.title,
  theme: fields.theme.toLowerCase(),
  seoDescription: fields.seoDescription ?? '',
})

const formatLandingPage = ({ fields }): LandingPage => ({
  title: fields.title,
  slug: fields.slug,
  introduction: fields.introduction,
  image: fields.image && formatImage(fields.image),
  actionButton: fields.actionButton && formatLink(fields.actionButton),
  links: fields.links && formatLinks(fields.links),
  content: fields.content && JSON.stringify(fields.content),
})

const makePage = (
  page: number,
  perPage: number,
  totalResults: number,
): Pagination => ({
  page,
  perPage,
  totalResults,
  totalPages: Math.ceil(totalResults / perPage),
})

const errorHandler = (name: string) => {
  return (error: Error) => {
    logger.error(error)
    throw new ApolloError('Failed to resolve request in ' + name)
  }
}

export const getArticle = async (
  slug: string,
  lang: string,
): Promise<Article | null> => {
  const result = await getLocalizedEntries<Article>(lang, {
    ['content_type']: 'article',
    'fields.slug': slug,
    include: 10,
  }).catch(errorHandler('getArticle'))

  // if we have no results
  if (!result.total) {
    return null
  }

  return formatArticle(result.items[0])
}

export const getNews = async (lang: string, slug: string) => {
  const r = await getLocalizedEntries<News>(lang, {
    ['content_type']: 'news',
    include: 10,
    'fields.slug': slug,
  }).catch(errorHandler('getNews'))

  return r.items[0] && formatNewsItem(r.items[0])
}

export const getNewsList = async ({
  lang = 'is-IS',
  year,
  month,
  ascending = false,
  page = 1,
  perPage = 10,
}: GetNewsListInput): Promise<PaginatedNews> => {
  const params = {
    ['content_type']: 'news',
    include: 10,
    order: (ascending ? '' : '-') + 'fields.date',
    skip: (page - 1) * perPage,
    limit: perPage,
  }

  if (year) {
    params['fields.date[gte]'] = new Date(year, month ?? 0, 1)
    params['fields.date[lt]'] =
      month != undefined
        ? new Date(year, month + 1, 1)
        : new Date(year + 1, 0, 1)
  }

  const r = await getLocalizedEntries<News>(lang, params).catch(
    errorHandler('getNewsList'),
  )

  return {
    page: makePage(page, perPage, r.total),
    news: r.items.map(formatNewsItem),
  }
}

export const getAboutPage = async ({
  lang,
}: GetAboutPageInput): Promise<AboutPage | null> => {
  const result = await getLocalizedEntries<CmsPage>(lang, {
    ['content_type']: 'page',
    include: 10,
    order: '-sys.createdAt',
  }).catch(errorHandler('getPage'))

  if (!result.total) {
    return null
  }

  return formatAboutPage(result.items[0])
}

export const getLandingPage = async ({
  lang,
  slug,
}: GetLandingPageInput): Promise<LandingPage> => {
  const result = await getLocalizedEntries<any>(lang, {
    ['content_type']: 'landingPage',
    'fields.slug': slug,
    include: 10,
  }).catch(errorHandler('getLandingPage'))

  if (!result.total) {
    return null
  }

  return formatLandingPage(result.items[0])
}

export const getNamespace = async (
  namespace: string,
  lang: string,
): Promise<Namespace | null> => {
  const result = await getLocalizedEntries<Namespace>(lang, {
    ['content_type']: 'uiConfiguration',
    'fields.namespace': namespace,
  }).catch(errorHandler('getNamespace'))

  // if we have no results
  if (!result.total) {
    return null
  }

  const [
    {
      fields: { fields },
    },
  ] = result.items

  return {
    namespace,
    fields: JSON.stringify(fields),
  }
}
