import { Application } from '~/types/application'

interface State {
  application: { applications: Application[] }
}

export const getCurrentApplication = (
  state: State,
  applicationIdentifier: string
): Application => {
  const apps = state.application.applications
  for (let x = 0; x < apps.length; x++) {
    const item = apps[x]
    if (item.identifier === applicationIdentifier) {
      return item
    }
  }

  throw new Error('No application found')
}
