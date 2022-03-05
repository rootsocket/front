import { uuid } from '~/functions/utils/random'
import { KeyType } from '~/types/application'

export async function onRequestPost({ data, request, params }) {
  const { application: applicationIdentifier } = params
  const { type, expiresAt, hosts = [] } = await request.json()

  if (!Object.values(KeyType).includes(type)) {
    return new Response(null, { status: 400 })
  }

  if (!data.user.applications.includes(applicationIdentifier)) {
    return new Response(null, { status: 403 })
  }

  const application = await data.rootSocket.getApplication(
    applicationIdentifier
  )
  const updatedApplication = await data.rootSocket.updateApplication(
    applicationIdentifier,
    { keys: [...application.keys, { type, expiresAt, hosts, token: uuid() }] }
  )
  return new Response(JSON.stringify(updatedApplication), { status: 200 })
}
