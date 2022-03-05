import { ApplicationRegion } from '~/types/application'

export async function onRequestGet({ data }) {
  const applications = await data.rootSocket.getApplications(
    data.user.applications
  )
  return new Response(JSON.stringify(applications), { status: 200 })
}

export async function onRequestPost({ data, request }) {
  const { name, region } = await request.json()

  if (!Object.values(ApplicationRegion).includes(region)) {
    return new Response(null, { status: 400 })
  }

  const application = await data.rootSocket.createApplication(
    data.user,
    name,
    region
  )
  return new Response(JSON.stringify(application), { status: 200 })
}
