import { Application } from '~/types/application'
import { normalizeString } from '~/utils/string'
import { VuexRequest } from '~/types/vuex'

interface State {
  applications: VuexRequest<Application[]>
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
  applications: {
    data: [],
    isLoading: false,
    error: undefined,
  },
})

export const mutations = {
  setApplicationsRequest(state: State, payload: VuexRequest<Application[]>) {
    state.applications = { ...state.applications, ...payload }
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
    const applications = state.applications.data ?? []

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

export const actions = {
  async getApplications({ commit }: any) {
    try {
      commit('setApplicationsRequest', { isLoading: true })
      const response = await (this as any).$axios.get(
        `${process.env.apiUrl}api/v1/applications/`
      )
      commit('setApplicationsRequest', {
        data: response.data,
        error: undefined,
      })
      return response
    } catch (e: any) {
      commit('setApplicationsRequest', { data: undefined, error: e.message })
      throw e
    } finally {
      commit('setApplicationsRequest', { isLoading: false })
    }
  },
}
