import {
  jwtDecodeResetPassword,
  setUserAuthCookie,
} from '~/functions/utils/user'

export const onRequestPost = async ({ request, env, data }) => {
  const { password, token } = await request.json()
  const { email } = await jwtDecodeResetPassword(env, token)

  const user = await data.rootSocket.changeUserPassword(email, password)

  const response = new Response(JSON.stringify(user), { status: 200 })
  await setUserAuthCookie(env, response, user)
  return response
}
