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
  const user = await data.rootSocket.getUser(email)

  const isApplicationOwner = (i) =>
    i.email === data.user.email && i.role === UserRole.owner
  const isSameUser = (i) => i.email === email && data.user.email === email

  if (
    !application.members.some(
      (i) =>
        i.role !== UserRole.owner && (isSameUser(i) || isApplicationOwner(i))
    )
  ) {
    return new Response(null, { status: 403 })
  }

  await data.rootSocket.updateApplication(applicationIdentifier, {
    members: application.members.filter((i) => i.email !== email),
  })
  await data.rootSocket.updateUser(email, {
    applications: user.applications.filter((i) => i !== applicationIdentifier),
  })
  return new Response(null, {
    status: 204,
  })
}
