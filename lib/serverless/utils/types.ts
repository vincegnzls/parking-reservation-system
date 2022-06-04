import Redis from "ioredis"

export interface IContext {
  req: Request & { session: any }
  res: Response
  redis: Redis
}
