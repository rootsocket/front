// import { Mail } from "~/functions/utils/email"
import { isCaptchaResponseGood } from '~/functions/utils/captcha'
import { standardError } from '~/functions/utils/error'
import { setUserAuthCookie } from '~/functions/utils/user'

export const onRequestPost = async ({ request, env, data }) => {
  const { email, password, captcha } = await request.json()
  if (!(await isCaptchaResponseGood(env, captcha))) {
    return new Response(standardError('Captcha failed'), { status: 400 })
  }

  const user = await data.rootSocket.createUser(email, password)

  // const mailer = new Mail(env)
  // await mailer.sendVerifyEmail(user)
  const response = new Response(JSON.stringify(user), { status: 200 })
  await setUserAuthCookie(env, response, user)
  return response
}
