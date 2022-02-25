// import { Database } from '~/functions/utils/database'
import { jwt } from '~/functions/utils/jwt'
import { uuid } from '~/functions/utils/random'
// import { RootSocket } from '~/functions/utils/rootsocket'

export async function onRequestGet({ env }) {
  const SECRET = env.SECRET || 'sa'

  // const db = new Database(env)
  // const rootSocket = new RootSocket(db)
  // const res = await db._getAuthorizeAccountData()

  const signedValue = await jwt.sign({ data: uuid() }, SECRET)

  return new Response(signedValue, null, 2)
}
