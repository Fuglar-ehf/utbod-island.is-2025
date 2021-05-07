import { Field, ID, ObjectType } from '@nestjs/graphql'
import { GetNewsInput } from '../dto/getNews.input'
import { ILatestNewsSlice } from '../generated/contentfulTypes'
import { News } from './news.model'
import { SystemMetadata } from '@island.is/shared/types'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { mapGenericTag } from './genericTag.model'

@ObjectType()
export class LatestNewsSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field()
  readMoreText?: string

  @Field(() => [News])
  news!: GetNewsInput
}

export const mapLatestNewsSlice = ({
  fields,
  sys,
}: ILatestNewsSlice): SystemMetadata<LatestNewsSlice> => ({
  typename: 'LatestNewsSlice',
  id: sys.id,
  title: fields.title ?? '',
  readMoreText: fields.readMoreText ?? '',
  news: {
    tag: fields.newsTag ? mapGenericTag(fields.newsTag).id : '',
    lang:
      sys.locale === 'is-IS' ? 'is' : (sys.locale as ElasticsearchIndexLocale),
    size: 3,
    order: 'desc',
  },
})
