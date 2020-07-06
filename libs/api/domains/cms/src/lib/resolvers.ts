import { Resolvers } from '@island.is/api/schema'
import { getArticle, getNews, getNewsList, getNamespace } from './services'

export const resolvers: Resolvers = {
  Query: {
    getArticle(_, { input }) {
      return getArticle(input?.slug ?? '', input?.lang ?? 'is-IS')
    },
    getNews(_, { input }) {
      return getNews(input.lang ?? 'is-IS', input.slug)
    },
    getNewsList(_, { input }) {
      return getNewsList(
        input?.lang ?? 'is-IS',
        input?.year,
        input?.month,
        input?.ascending,
        input?.offset ?? 0,
        input?.limit ?? 10,
      )
    },
    getNamespace(_, { input }) {
      return getNamespace(input?.namespace ?? '', input?.lang ?? 'is-IS')
    },
  },
}

export default resolvers
