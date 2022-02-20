export async function onRequestGet({ params }) {
  const res = await fetch(
    `https://rickandmortyapi.com/api/character/${params.id}`
  )
  const data = await res.json()
  const info = JSON.stringify(data)
  return new Response(info, null, 2)
}
