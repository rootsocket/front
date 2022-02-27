import { Database } from '../utils/database'
import { RootSocket } from '../utils/rootsocket'
import {
  getTokenFromRequest,
  getUnverifiedUserFromRequest,
  jwtDecodeUser,
} from '../utils/user'

export const authMiddleware = async ({ request, next, data, env }) => {
  // Rejects connection if the user is not identified.
  const unverifiedUser = getUnverifiedUserFromRequest(request)
  if (unverifiedUser) {
    const cache = new Cache()
    const db = new Database(env, cache)
    const rootSocket = new RootSocket(db, cache)

    const user = await rootSocket.getUser(unverifiedUser.email)
    if (user) {
      try {
        // At this point we know the user exists but we don't know if the JWT is valid, lets verify it.
        const decodedUserInfo = await jwtDecodeUser(
          env,
          user.password,
          getTokenFromRequest(request)
        )
        if (decodedUserInfo) {
          // We are using both objects because we want to update the user with the latest info
          data.user = { ...decodedUserInfo, ...user }
          return await next()
        }
      } catch (e) {
        // pass
      }
    }
  }

  return new Response(null, { status: 401 })
}
