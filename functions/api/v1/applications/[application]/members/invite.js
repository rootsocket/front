import { Mail } from '~/functions/utils/email'
import { UserRole } from '~/types/application'

export async function onRequestPost({ data, request, params, env }) {
  const { application: applicationIdentifier } = params
  const { email, role } = await request.json()

  if (!Object.values(UserRole).includes(role)) {
    return new Response(null, { status: 400 })
  }

  if (!data.user.applications.includes(applicationIdentifier)) {
    return new Response(null, { status: 403 })
  }

  const application = await data.rootSocket.getApplication(
    applicationIdentifier
  )
  if (application) {
    if (!application.members.find((i) => i.email === email)) {
      const user = await data.rootSocket.getUser(email)
      if (user) {
        const mailer = new Mail(env)
        await mailer.sendApplicationInvitation(application, user, role)
        return new Response(null, { status: 200 })
      }
    }
  }

  return new Response(null, { status: 400 })
}
