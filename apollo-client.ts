import { ApolloClient, InMemoryCache } from "@apollo/client"

const URI =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_GRAPHQL_URL
    : `${process.env.VERCEL_URL}/api/graphql`

const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
})

export default client
