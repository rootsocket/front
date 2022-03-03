import { UserRole } from '~/types/application'

export async function onRequestPost({ data, request, params }) {
  const { application: applicationIdentifier } = params
  const { email } = await request.json()

  if (!data.user.applications.includes(applicationIdentifier)) {
    return new Response(null, { status: 403 })
  }

  const application = await data.rootSocket.getApplication(
    applicationIdentifier
  )
  if (application) {
    if (
      application.members.find(
        (i) =>
          i.email === email ||
          (i.role === UserRole.owner && i.email === data.user.email)
      )
    ) {
      const updatedApplication = await data.rootSocket.updateApplication(
        applicationIdentifier,
        { members: application.members.filter((i) => i.email !== email) }
      )
      if (updatedApplication) {
        const user = await data.rootSocket.updateUser(data.user.email, {
          applications: data.user.applications.filter(
            (i) => i !== applicationIdentifier
          ),
        })
        if (user) {
          return new Response(JSON.stringify(updatedApplication), {
            status: 200,
          })
        }
      }
    }
  }

  return new Response(null, { status: 400 })
}
