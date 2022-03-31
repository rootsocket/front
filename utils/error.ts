export const getErrorMessage = (error: any) => {
  if (error.response) {
    return error.response.data.detail
  } else if (error.request) {
    return JSON.stringify(error.request)
  } else {
    return error.message
  }
}
