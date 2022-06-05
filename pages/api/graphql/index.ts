/* eslint-disable no-empty */
import "reflect-metadata"
import { ApolloServer } from "apollo-server-micro"
import Cors from "micro-cors"
import type { PageConfig } from "next"
import { buildSchema } from "type-graphql"
import { HelloWorldResolver } from "../../../lib/serverless/graphql/resolvers/HelloWorldResolver"
import { AppDataSource } from "../../../lib/serverless/utils/db"
import { UserResolver } from "../../../lib/serverless/graphql/resolvers/UserResolver"
import Redis from "ioredis"
import { ParkingLotResolver } from "../../../lib/serverless/graphql/resolvers/ParkingLotResolver"
import { ApolloServerLoaderPlugin } from "type-graphql-dataloader"
import { getConnection } from "typeorm"
import { VehicleResolver } from "../../../lib/serverless/graphql/resolvers/VehicleResolver"

const cors = Cors()

// disable next js from handling this route
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}

// const REDIS_URL: string = process.env.REDIS_URL || ""
// const redis = new Redis(REDIS_URL)

const apolloServer = new ApolloServer({
  schema: await buildSchema({
    resolvers: [HelloWorldResolver, ParkingLotResolver, VehicleResolver],
  }),
  context: async ({ req, res }) => {
    try {
      await AppDataSource.initialize()
    } catch (_) {}

    return {
      req,
      res,
      // redis,
    }
  },
  plugins: [
    ApolloServerLoaderPlugin({
      typeormGetConnection: getConnection, // for use with TypeORM
    }),
  ],
})

await apolloServer.start()

export default cors((req, res) => {
  if (req.method === "OPTIONS") {
    res.end()
    return false
  }

  return apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res)
})
