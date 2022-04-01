export const processRequest = async ({
  commit,
  mutation,
  process,
}: {
  commit: any
  mutation: string
  process: () => Promise<any>
}) => {
  try {
    commit(mutation, { isLoading: true })
    const response = await process()
    commit(mutation, {
      data: response.data,
      error: undefined,
      ttl: new Date().getTime() + 60 * 1000, // 60 seconds
    })
    return response.data
  } catch (e: any) {
    commit(mutation, { data: undefined, error: e.message })
    throw e
  } finally {
    commit(mutation, { isLoading: false })
  }
}