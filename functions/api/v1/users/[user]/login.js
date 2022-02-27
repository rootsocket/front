import { isCaptchaResponseGood } from '~/functions/utils/captcha'
import { standardError } from '~/functions/utils/error'
import { setUserAuthCookie } from '~/functions/utils/user'

export const onRequestPost = async ({ request, env, data }) => {
  const { email, password, captcha } = await request.json()
  if (!(await isCaptchaResponseGood(env, captcha))) {
    return new Response(standardError('Captcha failed'), { status: 400 })
  }

  const user = await data.rootSocket.login(email, password)
  if (user) {
    const response = new Response(JSON.stringify(user), { status: 200 })
    await setUserAuthCookie(env, response, user)
    return response
  }

  return new Response(standardError('Incorrect credentials'), { status: 400 })
}
