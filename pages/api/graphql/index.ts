/* eslint-disable no-empty */
import "reflect-metadata"
import { ApolloServer } from "apollo-server-micro"
import Cors from "micro-cors"
import type { PageConfig } from "next"
import { buildSchema } from "type-graphql"

import { AppDataSource } from "../../../lib/serverless/utils/db"
import { ParkingLotResolver } from "../../../lib/serverless/graphql/resolvers/ParkingLotResolver"
import { VehicleResolver } from "../../../lib/serverless/graphql/resolvers/VehicleResolver"
import { UserResolver } from "../../../lib/serverless/graphql/resolvers/UserResolver"
import { send } from "micro"

const cors = Cors()

// disable next js from handling this route
export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}

const apolloServer = new ApolloServer({
  schema: await buildSchema({
    resolvers: [UserResolver, ParkingLotResolver, VehicleResolver],
  }),
  context: async ({ req, res }) => {
    try {
      await AppDataSource.initialize()
    } catch (_) {}

    return {
      req,
      res,
    }
  },
  introspection: true,
})

await apolloServer.start()

export default cors((req, res) => {
  if (req.method === "OPTIONS") {
    send(res, 200, "ok")
  }

  return apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res)
})
