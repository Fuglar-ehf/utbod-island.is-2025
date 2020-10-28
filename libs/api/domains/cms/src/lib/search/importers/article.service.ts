import { MappedData } from '@island.is/api/content-search'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'

import { IArticle } from '../../generated/contentfulTypes'
import { mapArticle, Article } from '../../models/article.model'

import { createTerms, extractStringsFromObject } from './utils'

@Injectable()
export class ArticleSyncService {
  processSyncData(items) {
    return items.filter((item) => item.sys.contentType.sys.id === 'article')
  }

  doMapping(entries: IArticle[]): MappedData[] {
    logger.info('Mapping articles', { count: entries.length })

    return entries
      .map<MappedData | boolean>((entry) => {
        let mapped: Article

        try {
          entry.fields.relatedArticles = entry.fields?.relatedArticles?.[0]
            ?.fields
            ? (entry.fields.relatedArticles.map(
                ({
                  sys,
                  fields: { relatedArticles, ...prunedRelatedArticlesFields },
                }) => ({
                  sys,
                  fields: prunedRelatedArticlesFields,
                }),
              ) as IArticle[])
            : []

          // we consider article that dont have a title to be empty
          if (!mapped.title) {
            throw new Error('Trying to import empty article entry')
          }

          mapped = mapArticle(entry)
          const type = 'webArticle'
          return {
            _id: mapped.id,
            title: mapped.title,
            content: extractStringsFromObject(mapped.body),
            type,
            termPool: createTerms([
              mapped.title,
              mapped.category?.title,
              mapped.group?.title,
            ]),
            response: JSON.stringify({ ...mapped, __typename: type }),
            tags: [
              {
                key: entry.fields?.group?.fields?.slug,
                value: entry.fields?.group?.fields?.title,
                type: 'group',
              },
              {
                key: entry.fields?.category?.fields?.slug,
                value: entry.fields?.category?.fields?.title,
                type: 'category',
              },
              ...mapped.otherCategories.map((x) => ({
                key: x.slug,
                value: x.title,
                type: 'category',
              })),
              {
                key: entry.fields?.slug,
                type: 'slug',
              },
            ],
            dateCreated: entry.sys.createdAt,
            dateUpdated: new Date().getTime().toString(),
          }
        } catch (error) {
          logger.warn('Failed to import article', { error: error.message })
          return false
        }
      })
      .filter((value): value is MappedData => Boolean(value))
  }
}
