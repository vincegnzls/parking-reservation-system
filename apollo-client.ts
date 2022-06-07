import { ApolloClient, InMemoryCache } from "@apollo/client"

const URI =
  process.env.NEXT_PUBLIC_VERCEL_URL &&
  process.env.NEXT_PUBLIC_VERCEL_URL.length
    ? `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/graphql`
    : process.env.NEXT_PUBLIC_GRAPHQL_URL

const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
})

export default client
