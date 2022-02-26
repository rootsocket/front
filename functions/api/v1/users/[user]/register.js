// import { Mail } from "~/functions/utils/email"
import { setUserAuthCookie } from '~/functions/utils/user'

export const onRequestPost = async ({ request, env, data }) => {
  const { email, password } = await request.json()
  const user = await data.rootSocket.createUser(email, password)
  if (user) {
    // const mailer = new Mail(env)
    // await mailer.sendVerifyEmail(user)
    const response = new Response(null, { status: 200 })
    await setUserAuthCookie(env, response, user)
    return response
  }
  return new Response(null, { status: 400 })
}
