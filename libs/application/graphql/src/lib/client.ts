import fetch from 'cross-fetch'
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { setContext } from '@apollo/client/link/context'

let token = ''

export const setClientAuthToken = (value: string) => {
  token = value
}

const retryLink = new RetryLink()

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations,
        )}, Path: ${path}`,
      ),
    )

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

const authLink = setContext(async (_, { headers }) => ({
  headers: {
    ...headers,
    authorization: token ? `Bearer ${token}` : '',
  },
}))

export const initializeClient = (baseApiUrl: string) => {
  const httpLink = new HttpLink({
    uri: `${baseApiUrl}/api/graphql`,
    fetch,
  })

  return new ApolloClient({
    link: ApolloLink.from([retryLink, errorLink, authLink, httpLink]),
    cache: new InMemoryCache(),
  })
}
