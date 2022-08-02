import { Injectable } from '@nestjs/common'
import {
  dateResolution,
  ElasticService,
  elasticTagField,
  SortDirection,
  SortField,
  sortRule,
} from '@island.is/content-search-toolkit'
import { ArticleCategory } from './models/articleCategory.model'
import { Article } from './models/article.model'
import { News } from './models/news.model'
import { GetNewsInput } from './dto/getNews.input'
import { GetArticlesInput } from './dto/getArticles.input'
import { NewsList } from './models/newsList.model'
import { GetNewsDatesInput } from './dto/getNewsDates.input'
import { Menu } from './models/menu.model'
import { GetMenuInput } from './dto/getMenu.input'
import { GetSingleMenuInput } from './dto/getSingleMenu.input'
import { GetOrganizationSubpageInput } from './dto/getOrganizationSubpage.input'
import { OrganizationSubpage } from './models/organizationSubpage.model'
import { GetPublishedMaterialInput } from './dto/getPublishedMaterial.input'
import { EnhancedAssetSearchResult } from './models/enhancedAssetSearchResult.model'
import { ApiResponse } from '@elastic/elasticsearch'
import { SearchResponse } from 'elastic'
import { MappedData } from '@island.is/content-search-indexer/types'
import { SupportQNA } from './models/supportQNA.model'
import { GetFeaturedSupportQNAsInput } from './dto/getFeaturedSupportQNAs.input'

@Injectable()
export class CmsElasticsearchService {
  constructor(private elasticService: ElasticService) {}

  async getArticleCategories(
    index: string,
    { size }: { size?: number },
  ): Promise<ArticleCategory[]> {
    const query = {
      types: ['webArticleCategory'],
      sort: [{ 'title.sort': { order: SortDirection.ASC } }] as sortRule[],
      size,
    }
    const categoryResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )

    return categoryResponse.hits.hits.map<ArticleCategory>((response) =>
      JSON.parse(response._source.response ?? '[]'),
    )
  }

  async getArticles(
    index: string,
    input: GetArticlesInput,
  ): Promise<Article[]> {
    const query = {
      types: ['webArticle'],
      tags: [] as elasticTagField[],
      sort: [{ 'title.sort': { order: SortDirection.ASC } }] as sortRule[],
      size: input.size,
    }

    if (input.sort === SortField.POPULAR) {
      query.sort = [
        { popularityScore: { order: SortDirection.DESC } },
        ...query.sort,
      ]
    }

    if (input.category) {
      query.tags.push({ type: 'category', key: input.category })
    }

    if (input.group) {
      query.tags.push({ type: 'group', key: input.group })
    }

    if (input.subgroup) {
      query.tags.push({ type: 'subgroup', key: input.subgroup })
    }

    if (input.organization) {
      query.tags.push({ type: 'organization', key: input.organization })
    }

    const articlesResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )
    return articlesResponse.hits.hits.map<Article>((response) =>
      JSON.parse(response._source.response ?? '[]'),
    )
  }

  async getNews(
    index: string,
    { size, page, order, month, year, tag }: GetNewsInput,
  ): Promise<NewsList> {
    let dateQuery
    if (year) {
      dateQuery = {
        date: {
          from: `${year}-${month?.toString().padStart(2, '0') ?? '01'}-01`, // create a date with the format YYYY-MM-DD
          to: `${year}-${month?.toString().padStart(2, '0') ?? '12'}-31`, // create a date with the format YYYY-MM-DD
        },
      }
    } else {
      dateQuery = {}
    }

    let tagQuery
    if (tag) {
      tagQuery = {
        tags: [
          {
            key: tag,
            type: 'genericTag',
          },
        ],
      }
    }

    const query = {
      types: ['webNews'],
      sort: [{ dateCreated: { order } }] as sortRule[],
      ...dateQuery,
      ...tagQuery,
      page,
      size,
    }

    const articlesResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )

    return {
      total: articlesResponse.hits.total.value,
      items: articlesResponse.hits.hits.map<News>((response) =>
        JSON.parse(response._source.response ?? '[]'),
      ),
    }
  }

  async getNewsDates(
    index: string,
    { order, tag }: GetNewsDatesInput,
  ): Promise<string[]> {
    let tagQuery
    if (tag) {
      tagQuery = {
        tags: [
          {
            key: tag,
            type: 'genericTag',
          },
        ],
      }
    }

    const query = {
      types: ['webNews'],
      field: 'dateCreated',
      resolution: 'month' as dateResolution,
      ...tagQuery,
      order,
    }

    const newsDatesResponse = await this.elasticService.getDateAggregation(
      index,
      query,
    )

    // we return dates as array of strings on the format y-M
    if (newsDatesResponse.aggregations) {
      return newsDatesResponse.aggregations.dates.buckets.map(
        (aggregationResult) => aggregationResult.key_as_string,
      )
    } else {
      return []
    }
  }

  async getSingleDocumentTypeBySlug<RequestedType>(
    index: string,
    { type, slug }: { type: string; slug: string },
  ): Promise<RequestedType | null> {
    // return a single news item by slug
    const query = { types: [type], tags: [{ type: 'slug', key: slug }] }
    const newsResponse = await this.elasticService.getSingleDocumentByMetaData(
      index,
      query,
    )
    const response = newsResponse.hits.hits?.[0]?._source?.response
    return response ? JSON.parse(response) : null
  }

  async getSingleOrganizationSubpage(
    index: string,
    { slug, organizationSlug }: GetOrganizationSubpageInput,
  ): Promise<OrganizationSubpage | null> {
    // return an organization page by organization slug and subpage slug
    const query = {
      types: ['webOrganizationSubpage'],
      tags: [
        { type: 'slug', key: slug },
        { type: 'organization', key: organizationSlug },
      ],
    }
    const subpageResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )

    const response = subpageResponse.hits.hits?.[0]?._source?.response
    return response ? JSON.parse(response) : null
  }

  async getSingleMenuByName(
    index: string,
    { name }: GetMenuInput,
  ): Promise<Menu | null> {
    // return a single news item by slug
    const query = { types: ['webMenu'], tags: [{ type: 'name', key: name }] }
    const menuResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )

    const response = menuResponse.hits.hits?.[0]?._source?.response
    return response ? JSON.parse(response) : null
  }

  async getSingleMenu<RequestedMenuType>(
    index: string,
    { id }: GetSingleMenuInput,
  ): Promise<RequestedMenuType | null> {
    // return a single menu by id
    const menuResponse = await this.elasticService.findById(index, id)
    const response = menuResponse.body?._source?.response
    return response ? JSON.parse(response) : null
  }

  async getPublishedMaterial(
    index: string,
    {
      organizationSlug,
      searchString,
      page = 1, // The page number is 1-based meaning that page 1 is the first page
      size = 10,
      tags,
      tagGroups,
      sort,
    }: GetPublishedMaterialInput,
  ): Promise<EnhancedAssetSearchResult> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const must: Record<string, any>[] = [
      {
        term: {
          type: {
            value: 'webEnhancedAsset',
          },
        },
      },
    ]

    if (organizationSlug)
      must.push({
        nested: {
          path: 'tags',
          query: {
            bool: {
              must: [
                {
                  term: {
                    'tags.key': organizationSlug,
                  },
                },
                {
                  term: {
                    'tags.type': 'organization',
                  },
                },
              ],
            },
          },
        },
      })

    const wildcardSearch = {
      wildcard: {
        title: '*',
      },
    }

    const multimatchSearch = {
      multi_match: {
        query: searchString ? searchString.toLowerCase() : '',
        fields: ['title'],
        type: 'phrase_prefix',
      },
    }

    must.push(!searchString ? wildcardSearch : multimatchSearch)

    const enhancedAssetResponse: ApiResponse<
      SearchResponse<MappedData>
    > = await this.elasticService.findByQuery(index, {
      sort: [
        {
          [sort.field]: {
            order: sort.order,
          },
        },
      ],
      query: {
        bool: {
          must: must.concat(generateGenericTagGroupQueries(tags, tagGroups)),
        },
      },
      size,
      from: (page - 1) * size,
    })

    return {
      total: enhancedAssetResponse.body.hits.total.value,
      items: enhancedAssetResponse.body.hits.hits.map((item) =>
        JSON.parse(item._source.response ?? '{}'),
      ),
    }
  }

  async getFeaturedSupportQNAs(
    index: string,
    input: GetFeaturedSupportQNAsInput,
  ): Promise<SupportQNA[]> {
    const query = {
      types: ['webQNA'],
      tags: [
        { type: 'organization', key: input.organization },
      ] as elasticTagField[],
      sort: [{ popularityScore: { order: SortDirection.DESC } }] as sortRule[],
      size: input.size,
    }

    const articlesResponse = await this.elasticService.getDocumentsByMetaData(
      index,
      query,
    )
    return articlesResponse.hits.hits.map<SupportQNA>((response) =>
      JSON.parse(response._source.response ?? '[]'),
    )
  }
}

const generateGenericTagGroupQueries = (
  tags: string[],
  tagGroups: Record<string, string[]>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queries: Record<string, any>[] = []

  Object.keys(tagGroups).forEach((tagGroup) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const should: Record<string, any>[] = []

    tags
      .filter((tag) => tagGroups[tagGroup].includes(tag))
      .forEach((tag) => {
        should.push({
          bool: {
            must: [
              {
                term: {
                  'tags.key': tag,
                },
              },
              {
                term: {
                  'tags.type': 'genericTag',
                },
              },
            ],
          },
        })
      })

    const query = {
      nested: {
        path: 'tags',
        query: {
          bool: {
            should,
          },
        },
      },
    }

    queries.push(query)
  })

  return queries
}
