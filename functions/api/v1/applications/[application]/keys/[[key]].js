export async function onRequestDelete({ data, params }) {
  const { application: applicationIdentifier, key: keys } = params
  // Cloudflare is not working correctly here and doesn't allow multiple single params.
  const key = keys[0]

  if (!data.user.applications.includes(applicationIdentifier)) {
    return new Response(null, { status: 403 })
  }

  const application = await data.rootSocket.getApplication(
    applicationIdentifier
  )
  const updatedApplication = await data.rootSocket.updateApplication(
    applicationIdentifier,
    { keys: application.keys.filter((i) => i.token !== key) }
  )
  return new Response(JSON.stringify(updatedApplication), { status: 200 })
}
