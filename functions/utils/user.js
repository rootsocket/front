import { TOKEN_TYPE } from './constants'
import { getCookie, setCookie } from './cookies'
import { jwt } from './jwt'

export const getTokenFromRequest = (request) => {
  return getCookie(request, 'auth')
}

export const getResetPasswordTokenFromRequest = (request) => {
  const { searchParams } = new URL(request.url)
  return searchParams.get('token')
}

export const getUnverifiedUserResetPasswordRequest = (request) => {
  // This is not a guarantee that the JWT is signed by us!
  // Use the response with caution.
  const token = getResetPasswordTokenFromRequest(request)
  if (token) return jwt.unsafeDecoode(token)

  return null
}

export const getUnverifiedUserFromRequest = (request) => {
  // This is not a guarantee that the JWT is signed by us!
  // Use the response with caution.
  const token = getTokenFromRequest(request)
  if (token) return jwt.unsafeDecoode(token)

  return null
}

export const setUserAuthCookie = async (env, response, user) => {
  setCookie(
    response,
    'auth',
    `${await jwtSignUser(env, user)}; Path=/; HttpOnly`
  )
}

const userSecret = (env, userPassword) => {
  return `${env.SECRET}${userPassword}`
}

export const jwtSignUser = async (env, user) => {
  delete user.password
  return await jwt.sign(
    { ...user, tokenType: TOKEN_TYPE.ACCESS },
    userSecret(env, user.password)
  )
}

export const jwtDecodeUser = async (env, userPassword, request) => {
  const unverifiedUser = getUnverifiedUserFromRequest(request)
  if (unverifiedUser.tokenType !== TOKEN_TYPE.ACCESS) return null
  else {
    delete unverifiedUser.tokenType
  }

  return await jwt.decode(
    getTokenFromRequest(request),
    userSecret(env, userPassword)
  )
}

export const jwtSignResetPassword = async (env, user) => {
  delete user.password
  user.tokenType = TOKEN_TYPE.RESET_PASSWORD
  return await jwt.sign(
    { email: user.email, tokenType: TOKEN_TYPE.RESET_PASSWORD },
    env.SECRET
  )
}

export const jwtDecodeResetPassword = async (env, request) => {
  const unverifiedUser = getUnverifiedUserResetPasswordRequest(request)
  if (unverifiedUser.tokenType !== TOKEN_TYPE.RESET_PASSWORD) return null
  else {
    delete unverifiedUser.tokenType
  }

  const token = getResetPasswordTokenFromRequest(request)
  return await jwt.decode(token, env.SECRET)
}

export const getUserResetPasswordUrl = async (env, user) => {
  const token = await jwtSignResetPassword(env, user)
  return `https://app.rootsocket.com/forgot?token=${token}`
}