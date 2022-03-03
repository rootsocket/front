export async function onRequestDelete({ data, params }) {
  const { application: applicationIdentifier, key } = params

  const application = data.rootSocket.getApplication(applicationIdentifier)
  const updatedApplication = await data.rootSocket.updateApplication(
    applicationIdentifier,
    { keys: application.keys.filter((i) => i.token !== key) }
  )
  if (updatedApplication) {
    return new Response(JSON.stringify(updatedApplication), { status: 200 })
  }

  return new Response(null, { status: 400 })
}
