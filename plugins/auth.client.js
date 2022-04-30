export default ({ app, $auth, $axios, $toast, redirect }) => {
  $auth.onRedirect((to) => {
    return app.localePath(to)
  })

  $axios.onError((error) => {
    const response = error.response || {}
    const code = parseInt(response.status || 0)
    if (code === 401 || code === 403) {
      $auth.logout()
      redirect('/')
    } else if (code >= 500) {
      $toast.show(`Server error`)
    } else if (!$axios.isCancel(error)) {
      // any other error, except cancelled requests
    }
  })
}
