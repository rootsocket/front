import { setUserAuthCookie } from '~/functions/utils/user'

export const onRequestPost = async ({ request, env, data }) => {
  const { email, password } = await request.json()
  const user = await data.rootSocket.login(email, password)
  if (user) {
    const response = new Response(null, { status: 200 })
    await setUserAuthCookie(env, response, user)
    return response
  }
  return new Response(null, { status: 400 })
}
