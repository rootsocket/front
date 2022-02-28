import { setUserAuthCookieLogout } from '~/functions/utils/user'

export const onRequestPost = () => {
  const response = new Response(null, { status: 200 })
  setUserAuthCookieLogout(response)
  return response
}
