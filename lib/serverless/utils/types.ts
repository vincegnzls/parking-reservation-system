import Redis from "ioredis"

export interface IContext {
  req: any
  res: any
  redis: Redis
}
