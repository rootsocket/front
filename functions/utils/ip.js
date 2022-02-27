export const getIP = (request) => {
  let ip = request.headers.get('X-Forwarded-For')
  if (!ip) {
    ip = request.headers.get('Cf-Connecting-Ip')
  }
  return ip
}
