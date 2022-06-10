import { ApolloClient, InMemoryCache } from "@apollo/client"

const URI = process.env.NEXT_PUBLIC_GRAPHQL_URL

const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
  credentials: "include",
})

export default client
