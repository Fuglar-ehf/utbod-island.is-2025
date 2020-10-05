import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IArticle } from '../generated/contentfulTypes'
import { Slice, mapDocument } from './slice.model'

import { ArticleCategory, mapArticleCategory } from './articleCategory.model'
import { ArticleGroup, mapArticleGroup } from './articleGroup.model'
import { ArticleSubgroup, mapArticleSubgroup } from './articleSubgroup.model'
import { Organization, mapOrganization } from './organization.model'
import { SubArticle, mapSubArticle } from './subArticle.model'

@ObjectType()
export class Article {
  @Field()
  typename: string

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field({ nullable: true })
  shortTitle?: string

  @Field({ nullable: true })
  intro?: string

  @Field({ nullable: true })
  containsApplicationForm: boolean

  @Field({ nullable: true })
  importance: number

  @Field(() => [Slice])
  body: Array<typeof Slice>

  @Field(() => ArticleCategory, { nullable: true })
  category?: ArticleCategory

  @Field(() => ArticleGroup, { nullable: true })
  group?: ArticleGroup

  @Field(() => ArticleSubgroup, { nullable: true })
  subgroup?: ArticleSubgroup

  @Field(() => [Organization], { nullable: true })
  organization?: Array<Organization>

  @Field(() => [SubArticle])
  subArticles: Array<SubArticle>

  @Field(() => [Article], { nullable: true })
  relatedArticles?: Array<Article>
}

export const mapArticle = ({ fields, sys }: IArticle): Article => ({
  typename: 'Article',
  id: sys.id,
  title: fields.title ?? '',
  shortTitle: fields.shortTitle ?? '',
  slug: fields.slug ?? '',
  intro: fields.intro ?? '',
  containsApplicationForm: fields.containsApplicationForm ?? false,
  importance: fields.importance ?? 0,
  body: fields.content ? mapDocument(fields.content, sys.id + ':body') : [],
  category: fields.category ? mapArticleCategory(fields.category) : null,
  group: fields.group ? mapArticleGroup(fields.group) : null,
  subgroup: fields.subgroup ? mapArticleSubgroup(fields.subgroup) : null,
  organization: (fields.organization ?? [])
    .filter(
      (organization) => organization.fields?.title && organization.fields?.slug,
    )
    .map(mapOrganization),
  subArticles: (fields.subArticles ?? [])
    .filter((subArticle) => subArticle.fields?.title && subArticle.fields?.slug)
    .map(mapSubArticle),
  relatedArticles: [], // populated by resolver
})
