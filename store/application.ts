import { Application, KeyType, UserRole } from '~/types/application'
import { normalizeString } from '~/utils/string'

interface State {
  applications: Application[]
  filters: {
    applications: {
      search: string
    }
  }
}

export const state = (): State => ({
  filters: {
    applications: {
      search: '',
    },
  },
  applications: [
    {
      identifier: 'UUIDv7',
      createdAt: 1645379187,
      name: 'Panorama Staging asdf asdfsa df sf dsafdsa f dsafdsa dsf a dsfaa wkl wfae feawjf alkf aekjlfa ejklaf jklfa wejlkfa wejklf eajklfa weljkf aweljk fewl',
      location: 'eu-west-1',
      keys: [
        {
          token: 'stringa wef awef awf e afwe awfe awfe afewa fea efwa',
          type: KeyType.private,
          hosts: [
            'www.google.com',
            'www.google.com',
            'www.google.com',
            'www.google.com',
            'www.google.com',
          ],
          expiresAt: 1645379187,
        },
        {
          token: 'string',
          type: KeyType.public,
          hosts: [],
          expiresAt: 1645379187,
        },
      ],
      members: [{ identifier: '', role: UserRole.normal }],
      allowClientSend: true,
      allowClientSubscription: false,
      allowAnalytics: true,
    },
    {
      identifier: 'UUIDv2117',
      name: 'Invisen not Staging',
      createdAt: 1645379187,
      location: 'eu-west-1',
      keys: [],
      allowClientSend: true,
      allowClientSubscription: false,
      allowAnalytics: true,
      members: [],
    },
    {
      identifier: 'UUIDv2117',
      name: 'Invisen not Staging',
      createdAt: 1645379187,
      location: 'eu-west-1',
      keys: [],
      allowClientSend: true,
      allowClientSubscription: false,
      allowAnalytics: true,
      members: [],
    },
    {
      identifier: 'UUIDv2117',
      name: 'Invisen not Staging',
      location: 'eu-west-1',
      createdAt: 1645379187,
      keys: [],
      allowClientSend: true,
      allowClientSubscription: false,
      allowAnalytics: true,
      members: [],
    },
    {
      identifier: 'UUIDv2117',
      createdAt: 1645379187,
      name: 'Invisen not Staging',
      location: 'eu-west-1',
      keys: [],
      allowClientSend: true,
      allowClientSubscription: false,
      allowAnalytics: true,
      members: [],
    },
    {
      identifier: 'UUIDv2117',
      createdAt: 1645379187,
      name: 'Invisen not Staging',
      location: 'eu-west-1',
      keys: [],
      allowClientSend: true,
      allowClientSubscription: false,
      allowAnalytics: true,
      members: [],
    },
    {
      identifier: 'UUIDv2117',
      name: 'Invisen not Staging',
      createdAt: 1645379187,
      location: 'eu-west-1',
      keys: [],
      allowClientSend: true,
      allowClientSubscription: false,
      allowAnalytics: true,
      members: [],
    },
  ],
})

export const mutations = {
  setApplications(state: State, payload: Application[]) {
    state.applications = payload
  },
  setApplicationsFilter(state: State, payload: { search: string }) {
    state.filters.applications.search = payload.search
  },
}

export const getters = {
  applications(state: State) {
    const searchTerm = normalizeString(
      state.filters.applications.search.toLowerCase()
    )
    if (searchTerm.length === 0) {
      return []
    }

    const filteredApplications = []
    const applications = state.applications

    for (let j = 0; j < applications.length; j++) {
      const application = applications[j]

      if (
        normalizeString(application.name.toLowerCase()).includes(searchTerm)
      ) {
        filteredApplications.push(application)
      }
    }

    return filteredApplications
  },
}
