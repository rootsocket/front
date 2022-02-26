export function onRequestGet({ env }) {
  return new Response(JSON.stringify(env), { status: 200 })
}
