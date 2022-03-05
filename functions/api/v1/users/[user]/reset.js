import { isCaptchaResponseGood } from '~/functions/utils/captcha'
import { Mail } from '~/functions/utils/email'
import { standardError } from '~/functions/utils/error'

export const onRequestPost = async ({ request, env, data }) => {
  const { email, captcha } = await request.json()
  if (!(await isCaptchaResponseGood(env, captcha))) {
    return new Response(standardError('Captcha failed'), { status: 400 })
  }

  const user = await data.rootSocket.getUser(email)
  const mailer = new Mail(env)
  await mailer.sendResetPassword(user)

  return new Response(null, { status: 200 })
}
