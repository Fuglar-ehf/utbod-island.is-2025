import { SearchInput } from '../types'
import { tagAggregationQueryFragment } from './tagAggregation'
import { TagQuery, tagQuery } from './tagQuery'
import { typeAggregationQuery } from './typeAggregation'
import { processAggregationQuery } from './processAggregation'

const getBoostForType = (type: string, defaultBoost: string | number = 1) => {
  if (type === 'webArticle') {
    // The number 55 was chosen since it was the threshold between the highest scoring news and the highest scoring article in search results
    // The test that determined this boost was to type in "Umsókn um fæðingarorlof" and compare the news and article scores
    return 55
  }
  return defaultBoost
}

export const searchQuery = (
  {
    queryString,
    size = 10,
    page = 1,
    types = [],
    tags = [],
    excludedTags = [],
    contentfulTags = [],
    countTag = [],
    countTypes = false,
    countProcessEntry = false,
  }: SearchInput,
  aggregate = true,
) => {
  const should = []
  const must: TagQuery[] = []
  const mustNot: TagQuery[] = []
  let minimumShouldMatch = 1

  should.push({
    simple_query_string: {
      query: queryString,
      fields: ['title.stemmed^15', 'title.compound', 'content.stemmed^5'],
      analyze_wildcard: true,
      default_operator: 'and',
    },
  })

  // if we have types restrict the query to those types
  if (types?.length) {
    minimumShouldMatch++ // now we have to match at least one type and the search query

    types.forEach((type) => {
      const [value, boost = 1] = type.split('^')
      should.push({
        term: {
          type: {
            value,
            boost: getBoostForType(value, boost),
          },
        },
      })
    })
  }

  if (tags?.length) {
    tags.forEach((tag) => {
      must.push(tagQuery(tag))
    })
  }

  if (excludedTags?.length) {
    excludedTags.forEach((tag) => {
      mustNot.push(tagQuery(tag))
    })
  }

  if (contentfulTags?.length) {
    contentfulTags
      .map((ct) => ({ key: ct, type: 'contentfultag' }))
      .forEach((tag) => {
        must.push(tagQuery(tag))
      })
  }

  const aggregation = { aggs: {} }

  if (aggregate) {
    if (countTag) {
      // set the tag aggregation as the only aggregation
      aggregation.aggs = tagAggregationQueryFragment(countTag).aggs
    }

    if (countTypes) {
      // add tag aggregation, handle if there is already an existing aggregation
      aggregation.aggs = { ...aggregation.aggs, ...typeAggregationQuery().aggs }
    }

    if (countProcessEntry) {
      aggregation.aggs = {
        ...aggregation.aggs,
        ...processAggregationQuery().aggs,
      }
    }
  }

  return {
    query: {
      bool: {
        should,
        must,
        must_not: mustNot,
        minimum_should_match: minimumShouldMatch,
      },
    },
    ...(Object.keys(aggregation.aggs).length ? aggregation : {}), // spread aggregations if we have any
    size,
    from: (page - 1) * size, // if we have a page number add it as offset for pagination
  }
}
