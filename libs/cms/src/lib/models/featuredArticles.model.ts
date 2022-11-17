import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IFeaturedArticles } from '../generated/contentfulTypes'

import { SystemMetadata } from 'api-cms-domain'
import { Image, mapImage } from './image.model'
import { Link, mapLink } from './link.model'
import { ArticleReference, mapArticleReference } from './articleReference'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { SortField } from '@island.is/content-search-toolkit'
import { GetArticlesInput } from '../dto/getArticles.input'
import { Article } from './article.model'

@ObjectType()
export class FeaturedArticles {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => Image, { nullable: true })
  image?: Image | null

  @Field(() => [ArticleReference])
  articles?: Array<ArticleReference>

  @Field({ nullable: true })
  automaticallyFetchArticles?: boolean

  @Field()
  sortBy?: 'popularity' | 'importance'

  @Field(() => [Article])
  resolvedArticles!: GetArticlesInput

  @Field(() => Link, { nullable: true })
  link?: Link | null

  @Field(() => Boolean, { nullable: true })
  hasBorderAbove?: boolean
}

export const mapFeaturedArticles = ({
  sys,
  fields,
}: IFeaturedArticles): SystemMetadata<FeaturedArticles> => ({
  typename: 'FeaturedArticles',
  id: sys.id,
  title: fields.title ?? '',
  image: fields.image ? mapImage(fields.image) : null,
  articles: (fields.articles ?? []).map(mapArticleReference),
  automaticallyFetchArticles: fields.automaticallyFetchArticles ?? false,
  sortBy: fields.sortBy ?? 'popularity',
  resolvedArticles: {
    lang:
      sys.locale === 'is-IS' ? 'is' : (sys.locale as ElasticsearchIndexLocale),
    size: fields.automaticallyFetchArticles ? fields.articleCount ?? 5 : 0,
    sort: SortField.POPULAR,
    ...(!!fields.organization && {
      organization: fields.organization?.fields.slug ?? '',
    }),
    ...(!!fields.category && {
      category: fields.category?.fields.slug ?? '',
    }),
    ...(!!fields.group && {
      group: fields.group?.fields.slug ?? '',
    }),
    ...(!!fields.subgroup && {
      subgroup: fields.subgroup?.fields.slug ?? '',
    }),
  },
  link: fields.link ? mapLink(fields.link) : null,
  hasBorderAbove: fields.hasBorderAbove ?? true,
})
