import { Application } from '~/types/application'
import { VuexApplicationState } from '~/types/vuex'

interface State {
  application: VuexApplicationState
}

export const getCurrentApplication = (
  state: State,
  applicationIdentifier: string
): Application => {
  const apps = state.application.applications.data ?? []
  for (let x = 0; x < apps.length; x++) {
    const item = apps[x]
    if (item.identifier === applicationIdentifier) {
      return item
    }
  }

  throw new Error('No application found')
}
