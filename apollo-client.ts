import { ApolloClient, InMemoryCache } from "@apollo/client"

let URI = process.env.NEXT_PUBLIC_GRAPHQL_URL

if (
  process.env.NEXT_PUBLIC_VERCEL_URL &&
  process.env.NEXT_PUBLIC_VERCEL_URL.length
) {
  URI = `/api/graphql`
}

const client = new ApolloClient({
  uri: URI,
  cache: new InMemoryCache(),
})

export default client
