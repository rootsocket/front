import { uuid } from '~/functions/utils/random'

export async function onRequestGet({ data, request, params }) {
  const { application: applicationIdentifier } = params
  const { type, expiresAt, hosts = [] } = await request.json()

  const updatedApplication = await data.rootSocket.updateApplication(
    applicationIdentifier,
    { keys: [{ type, expiresAt, hosts, token: uuid() }] }
  )
  if (updatedApplication) {
    return new Response(JSON.stringify(updatedApplication), { status: 200 })
  }

  return new Response(null, { status: 400 })
}
