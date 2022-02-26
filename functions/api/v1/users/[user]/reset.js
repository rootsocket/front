import { Mail } from '~/functions/utils/email'

export const onRequestPost = async ({ request, env, data }) => {
  const { email } = await request.json()
  const user = await data.rootSocket.getUser(email)
  const mailer = new Mail(env)
  await mailer.sendResetPassword(user)

  return new Response(null, { status: 200 })
}
