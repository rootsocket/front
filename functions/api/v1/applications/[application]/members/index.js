import { jwtDecodeMemberInvitation } from '~/functions/utils/user'

export async function onRequestPost({ env, data, request }) {
  const { token } = await request.json()
  const { email, applicationIdentifier, role } =
    await jwtDecodeMemberInvitation(env, token)

  const application = await data.rootSocket.getApplication(
    applicationIdentifier
  )
  if (application) {
    const updatedApplication = await data.rootSocket.updateApplication(
      applicationIdentifier,
      { members: [...application.members, { email, role }] }
    )
    if (updatedApplication) {
      const user = await data.rootSocket.updateUser(data.user.email, {
        applications: [...data.user.applications, applicationIdentifier],
      })
      if (user) {
        return new Response(JSON.stringify(updatedApplication), { status: 200 })
      }
    }
  }

  return new Response(null, { status: 400 })
}
