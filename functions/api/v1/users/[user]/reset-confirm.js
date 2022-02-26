import { jwtDecodeResetPassword } from '~/functions/utils/user'

export const onRequestPost = async ({ request, env, data }) => {
  const { password } = await request.json()
  const { email } = await jwtDecodeResetPassword(env, request)
  await data.rootSocket.changeUserPassword(email, password)

  return new Response(null, { status: 200 })
}
