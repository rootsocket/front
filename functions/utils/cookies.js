export const getCookie = (request, key) => {
  const cookieString = request.headers.get('Cookie')
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
