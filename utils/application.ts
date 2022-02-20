import { Application, Organization } from '~/types/application'

export const getCurrentApplication = (
  state: { application: { organizations: Organization[] } },
  applicationIdentifier: string
): Application => {
  const organizations = state.application.organizations

  for (let i = 0; i < organizations.length; i++) {
    const apps = organizations[i].applications
    for (let x = 0; x < apps.length; x++) {
      const item = apps[x]
      if (item.identifier === applicationIdentifier) {
        return item
      }
    }
  }

  throw new Error('No application found')
}
