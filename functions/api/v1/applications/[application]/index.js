export async function onRequestPut({ data, request, params }) {
  const { application: applicationIdentifier } = params
  const { allowClientSend, allowClientSubscription, allowAnalytics, name } =
    await request.json()

  if (!data.user.applications.includes(applicationIdentifier)) {
    return new Response(null, { status: 403 })
  }

  const application = await data.rootSocket.updateApplication(
    applicationIdentifier,
    { name, allowClientSend, allowAnalytics, allowClientSubscription }
  )
  return new Response(JSON.stringify(application), { status: 200 })
}

export async function onRequestDelete({ data, params }) {
  const { application: applicationIdentifier } = params

  if (!data.user.applications.includes(applicationIdentifier)) {
    return new Response(null, { status: 403 })
  }

  await data.rootSocket.removeApplication(data.user, applicationIdentifier)
  return new Response(null, { status: 204 })
}
