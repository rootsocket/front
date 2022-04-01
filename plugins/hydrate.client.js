export default ({ store }) => {
  if (store.state.auth.loggedIn) {
    store.dispatch('application/getApplications')
  }
}
