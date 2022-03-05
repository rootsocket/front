import { Application, ApplicationRegion } from '~/types/application'
import { normalizeString } from '~/utils/string'
import { VuexApplicationState, VuexRequest } from '~/types/vuex'

export const state = (): VuexApplicationState => ({
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
  createApplication: {
    data: undefined,
    isLoading: false,
    error: undefined,
  },
})

export const mutations = {
  setApplicationsRequest(
    state: VuexApplicationState,
    payload: VuexRequest<Application[]>
  ) {
    state.applications = { ...state.applications, ...payload }
  },
  setCreateApplicationRequest(
    state: VuexApplicationState,
    payload: VuexRequest<Application>
  ) {
    state.createApplication = { ...state.createApplication, ...payload }
  },
  setApplicationsFilter(
    state: VuexApplicationState,
    payload: { search: string }
  ) {
    state.filters.applications.search = payload.search
  },
}

export const getters = {
  applications(state: VuexApplicationState) {
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
  async createApplication(
    { state, commit }: any,
    data: { name: string; region: ApplicationRegion }
  ) {
    try {
      commit('setCreateApplicationRequest', { isLoading: true })
      const response = await (this as any).$axios.post(
        `${process.env.apiUrl}api/v1/applications/`,
        data
      )

      const applications = [...state.applications.data, response.data]

      commit('setCreateApplicationRequest', {
        data: response.data,
        error: undefined,
      })
      commit('setApplicationsRequest', {
        data: applications,
      })

      return response
    } finally {
      commit('setCreateApplicationRequest', { isLoading: false })
    }
  },
}
