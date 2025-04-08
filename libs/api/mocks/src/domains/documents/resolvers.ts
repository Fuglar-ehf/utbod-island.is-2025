import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Slice: {
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },
  Query: {
    documentsV2: () => {
      return store.documentsV2
    },
  },
}
