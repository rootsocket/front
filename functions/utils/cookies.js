// This can only be consumed once
let cookieString
export const getCookie = (request, key) => {
  if (!cookieString) cookieString = request.headers.get('cookie')
  if (cookieString) {
    const allCookies = cookieString.split('; ')
    const targetCookie = allCookies.find((cookie) => cookie.includes(key))
    if (targetCookie) {
      return targetCookie.split('=')[1]
    }
  }

  return null
}

export const setCookie = (response, key, value) => {
  response.headers.set('Set-Cookie', `${key}=${value}`)
}
