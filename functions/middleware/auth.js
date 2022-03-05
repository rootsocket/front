import {
  getTokenFromRequest,
  getUnverifiedUserFromRequest,
  jwtDecodeUser,
} from '../utils/user'

export const authMiddleware = async ({ request, next, data, env }) => {
  // Rejects connection if the user is not identified.
  const unverifiedUser = getUnverifiedUserFromRequest(request)
  if (unverifiedUser) {
    const user = await data.rootSocket.getUser(unverifiedUser.email)
    // At this point we know the user exists but we don't know if the JWT is valid, lets verify it.
    const decodedUserInfo = await jwtDecodeUser(
      env,
      user.password,
      getTokenFromRequest(request)
    )
    // We are using both objects because we want to update the user with the latest info
    data.user = { ...decodedUserInfo, ...user }
    return await next()
  }

  return new Response(null, { status: 401 })
}
