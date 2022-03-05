import { TOKEN_TYPE } from './constants'
import { getCookie, setCookie } from './cookies'
import { jwt } from './jwt'

export const getTokenFromRequest = (request) => {
  return getCookie(request, 'auth')
}

export const getUnverifiedUserFromRequest = (request) => {
  // This is not a guarantee that the JWT is signed by us!
  // Use the response with caution.
  const token = getTokenFromRequest(request)
  return jwt.unsafeDecoode(token)
}

export const setUserAuthCookie = async (env, response, user) => {
  setCookie(
    response,
    'auth',
    // We only want to use this with HTTPS, JS shouldn't access it and only for our domain and don't send this cookie if a third-party domain
    // tries to send a request.
    `${await jwtSignUser(
      env,
      user
    )}; path=/; HttpOnly; Max-Age=2160000; Secure; SameSite=Strict;`
  )
}

export const setUserAuthCookieLogout = (response) => {
  setCookie(
    response,
    'auth',
    'Path=/; HttpOnly; Max-Age=1; Secure; SameSite=Strict;'
  )
}

const userSecret = (env, userPassword) => {
  return `${env.SECRET}${userPassword}`
}

export const jwtSignUser = async (env, user) => {
  const secretKey = userSecret(env, user.password)
  delete user.password
  return await jwt.sign(
    { ...user, tokenType: TOKEN_TYPE.ACCESS },
    secretKey,
    // 30 days
    60 * 60 * 24 * 30
  )
}

export const jwtDecodeUser = async (env, userPassword, token) => {
  if (!token) throw new Error('Token not provided')

  const unverifiedUser = jwt.unsafeDecoode(token)
  if (unverifiedUser.tokenType !== TOKEN_TYPE.ACCESS)
    throw new Error(
      `Incorrect token type, expected ${TOKEN_TYPE.ACCESS} got ${unverifiedUser.tokenType}`
    )
  else {
    delete unverifiedUser.tokenType
  }

  return await jwt.decode(token, userSecret(env, userPassword))
}

export const jwtSignResetPassword = async (env, user) => {
  delete user.password

  return await jwt.sign(
    { email: user.email, tokenType: TOKEN_TYPE.RESET_PASSWORD },
    env.SECRET
  )
}

export const jwtDecodeResetPassword = async (env, token) => {
  const unverifiedUser = jwt.unsafeDecoode(token)
  if (unverifiedUser.tokenType !== TOKEN_TYPE.RESET_PASSWORD)
    throw new Error(
      `Token type not ok, expected ${TOKEN_TYPE.RESET_PASSWORD} got ${unverifiedUser.tokenType}`
    )
  else {
    delete unverifiedUser.tokenType
  }

  return await jwt.decode(token, env.SECRET)
}

export const getUserResetPasswordUrl = async (env, user) => {
  const token = await jwtSignResetPassword(env, user)
  return `https://app.rootsocket.com/forgot?token=${token}`
}

export const jwtSignMemberInvitation = async (env, application, user, role) => {
  return await jwt.sign(
    {
      role,
      email: user.email,
      tokenType: TOKEN_TYPE.INVITATION,
      applicationIdentifier: application.identifier,
    },
    env.SECRET,
    // 4 hours
    60 * 60 * 4
  )
}

export const jwtDecodeMemberInvitation = async (env, token) => {
  const data = jwt.unsafeDecoode(token)
  if (data.tokenType !== TOKEN_TYPE.INVITATION)
    throw new Error(
      `Token type not ok, expected ${TOKEN_TYPE.INVITATION} got ${data.tokenType}`
    )
  else {
    delete data.tokenType
  }

  return await jwt.decode(token, env.SECRET)
}

export const getMemberInvitationUrl = async (env, application, user, role) => {
  const token = await jwtSignMemberInvitation(env, application, user, role)
  return `https://app.rootsocket.com/invite?token=${token}`
}
