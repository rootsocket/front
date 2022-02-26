import { Cache } from '../utils/cache'
import { Database } from '../utils/database'
import { RootSocket } from '../utils/rootsocket'

export const fillMiddleware = async ({ next, data, env }) => {
  data.cache = new Cache(env)
  data.database = new Database(env, data.cache)
  data.rootSocket = new RootSocket(data.database, data.cache)
  return await next()
}
