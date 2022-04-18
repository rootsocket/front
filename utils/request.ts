export const processRequest = async ({
  commit,
  mutation,
  process,
  key = '',
}: {
  commit: any
  mutation: string
  process: () => Promise<any>
  key?: string
}) => {
  try {
    commit(mutation, { loading: true })
    const response = await process()
    commit(mutation, {
      data: response.data,
      error: undefined,
      ttl: new Date().getTime() + 20 * 1000, // 60 seconds
      key,
    })
    return response.data
  } catch (e: any) {
    commit(mutation, { data: undefined, error: e.message })
    throw e
  } finally {
    commit(mutation, { loading: false })
  }
}
