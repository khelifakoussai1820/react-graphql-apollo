import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { HttpLink } from '@apollo/client/link/http'

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})

export default client
