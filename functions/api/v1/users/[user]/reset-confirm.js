import {
  jwtDecodeResetPassword,
  setUserAuthCookie,
} from '~/functions/utils/user'

export const onRequestPost = async ({ request, env, data }) => {
  const { password, token } = await request.json()
  const { email } = (await jwtDecodeResetPassword(env, token)) ?? {}
  if (email) {
    const user = await data.rootSocket.changeUserPassword(email, password)
    if (user) {
      const response = new Response(JSON.stringify(user), { status: 200 })
      await setUserAuthCookie(env, response, user)
      return response
    }
  }

  return new Response(null, { status: 400 })
}
