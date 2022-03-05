import { jwtDecodeMemberInvitation } from '~/functions/utils/user'

export async function onRequestPost({ env, data, request }) {
  const { token } = await request.json()
  const { email, applicationIdentifier, role } =
    await jwtDecodeMemberInvitation(env, token)

  const application = await data.rootSocket.getApplication(
    applicationIdentifier
  )

  const updatedApplication = await data.rootSocket.updateApplication(
    applicationIdentifier,
    { members: [...application.members, { email, role }] }
  )

  await data.rootSocket.updateUser(data.user.email, {
    applications: [...data.user.applications, applicationIdentifier],
  })

  return new Response(JSON.stringify(updatedApplication), { status: 200 })
}
