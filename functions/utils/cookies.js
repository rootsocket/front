export const getCookie = (request, key) => {
  if (request.headers) {
    const cookieString = request.headers.get('cookie')
    if (cookieString) {
      const allCookies = cookieString.split('; ')
      const targetCookie = allCookies.find((cookie) => cookie.includes(key))
      if (targetCookie) {
        return targetCookie.split('=')[1]
      }
    }
  }

  return null
}

export const setCookie = (response, key, value) => {
  response.headers.set('Set-Cookie', `${key}=${value}`)
}
