import { standardError } from '~/functions/utils/error'

export const onRequestPost = async ({ request, data }) => {
  const { email, password, newPassword } = await request.json()
  const user = await data.rootSocket.getUser(data.user.email)
  if (data.rootSocket.makePassword(password) !== user.password) {
    return new Response(standardError('Incorrect password'), { status: 400 })
  }

  if (email !== undefined) {
    if (data.rootSocket.validateEmail(email)) {
      // do stuff
    } else {
      return new Response(standardError('Incorrect email'), { status: 400 })
    }
  }

  if (newPassword !== undefined) {
    if (data.rootSocket.validatePassword(password)) {
      // do
    } else {
      return new Response(standardError('Incorrect password'), { status: 400 })
    }
  }

  return new Response(
    JSON.stringify(data.rootSocket.getUser(data.user.email)),
    { status: 200 }
  )
}
