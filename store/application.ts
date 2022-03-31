import { Application, ApplicationRegion, Key, User } from '~/types/application'
import { normalizeString } from '~/utils/string'
import { VuexApplicationState, VuexRequest } from '~/types/vuex'
import { processRequest } from '~/utils/request'

const request = {
  data: undefined,
  isLoading: false,
  error: undefined,
}

export const state = (): VuexApplicationState => ({
  filters: {
    applications: {
      search: '',
    },
  },
  applications: request,
  createApplication: request,
  updateApplication: request,
  deleteApplication: request,
  createKey: request,
  deleteKey: request,
  inviteMember: request,
  acceptInvitation: request,
  deleteMember: request,
  updateAccount: request,
  deleteAccount: request,
  registerAccount: request,
})

export const mutations = {
  setApplicationsFilter(
    state: VuexApplicationState,
    payload: { search: string }
  ) {
    state.filters.applications.search = payload.search
  },
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
  setUpdateApplicationRequest(
    state: VuexApplicationState,
    payload: VuexRequest<Application>
  ) {
    state.updateApplication = { ...state.updateApplication, ...payload }
  },
  setDeleteApplicationRequest(
    state: VuexApplicationState,
    payload: VuexRequest<null>
  ) {
    state.deleteApplication = { ...state.deleteApplication, ...payload }
  },
  setCreateKeyRequest(
    state: VuexApplicationState,
    payload: VuexRequest<Application>
  ) {
    state.createKey = { ...state.createKey, ...payload }
  },
  setDeleteKeyRequest(
    state: VuexApplicationState,
    payload: VuexRequest<Application>
  ) {
    state.deleteKey = { ...state.deleteKey, ...payload }
  },
  setInviteMemberRequest(
    state: VuexApplicationState,
    payload: VuexRequest<null>
  ) {
    state.inviteMember = { ...state.inviteMember, ...payload }
  },
  setAcceptInvitationRequest(
    state: VuexApplicationState,
    payload: VuexRequest<null>
  ) {
    state.acceptInvitation = { ...state.acceptInvitation, ...payload }
  },
  setDeleteMemberRequest(
    state: VuexApplicationState,
    payload: VuexRequest<null>
  ) {
    state.deleteMember = { ...state.deleteMember, ...payload }
  },
  setUpdateAccountRequest(
    state: VuexApplicationState,
    payload: VuexRequest<User>
  ) {
    state.updateAccount = { ...state.updateAccount, ...payload }
  },
  setRegisterAccountRequest(
    state: VuexApplicationState,
    payload: VuexRequest<User>
  ) {
    state.registerAccount = { ...state.registerAccount, ...payload }
  },
  setDeleteAccountRequest(
    state: VuexApplicationState,
    payload: VuexRequest<null>
  ) {
    state.deleteAccount = { ...state.deleteAccount, ...payload }
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
    return await processRequest({
      commit,
      mutation: 'setApplicationsRequest',
      process: async () =>
        await (this as any).$axios.get(
          `${process.env.apiUrl}api/v1/applications/`
        ),
    })
  },
  async createApplication(
    { state, commit }: any,
    data: { name: string; region: ApplicationRegion }
  ) {
    return await processRequest({
      commit,
      mutation: 'setCreateApplicationRequest',
      process: async () => {
        const response = await (this as any).$axios.post(
          `${process.env.apiUrl}api/v1/applications/`,
          data
        )
        const applications = [...(state.applications.data ?? []), response.data]
        commit('setApplicationsRequest', {
          data: applications,
          error: undefined,
        })
        return response.data
      },
    })
  },
  async registerAccount(
    { commit }: any,
    data: { email: string; password: string; captcha: string }
  ) {
    return await processRequest({
      commit,
      mutation: 'setRegisterAccountRequest',
      process: async () =>
        await (this as any).$axios.post(
          `${process.env.apiUrl}api/v1/users/register/`,
          data
        ),
    })
  },
  async updateApplication({ state, commit }: any, data: Partial<Application>) {
    return await processRequest({
      commit,
      mutation: 'setUpdateApplicationRequest',
      process: async () => {
        const response = await (this as any).$axios.put(
          `${process.env.apiUrl}api/v1/applications/${data.identifier}/`,
          { ...data, name: data.name?.trim() }
        )
        const applications = state.applications.data.map(
          (application: Application) =>
            application.identifier === data.identifier
              ? { ...application, ...data }
              : application
        )
        commit('setApplicationsRequest', {
          data: applications,
          error: undefined,
        })
        return response.data
      },
    })
  },
  async deleteApplication({ commit, state }: any, data: Application) {
    return await processRequest({
      commit,
      mutation: 'setDeleteApplicationRequest',
      process: async () => {
        const response = await (this as any).$axios.delete(
          `${process.env.apiUrl}api/v1/applications/${data.identifier}/`
        )
        commit('setApplicationsRequest', {
          data: state.applications.data.filter(
            (app: Application) => app.identifier !== data.identifier
          ),
          error: undefined,
        })
        return response.data
      },
    })
  },
  async createKey(
    { commit, state }: any,
    data: { identifier: string; expiresAt: string; category: KeyType }
  ) {
    return await processRequest({
      commit,
      mutation: 'setCreateKeyRequest',
      process: async () => {
        const response = await (this as any).$axios.post(
          `${process.env.apiUrl}api/v1/applications/${data.identifier}/keys/`,
          { expiresAt: data.expiresAt, category: data.category }
        )
        commit('setApplicationsRequest', {
          data: state.applications.data.map((app: Application) =>
            app.identifier === data.identifier
              ? { ...app, keys: [...(app.keys ?? []), response.data] }
              : app
          ),
          error: undefined,
        })
        return response.data
      },
    })
  },
  async deleteKey(
    { commit, state }: any,
    data: { identifier: string; keyIdentifier: string }
  ) {
    return await processRequest({
      commit,
      mutation: 'setDeleteKeyRequest',
      process: async () => {
        const response = await (this as any).$axios.delete(
          `${process.env.apiUrl}api/v1/applications/${data.identifier}/keys/${data.keyIdentifier}/`
        )
        commit('setApplicationsRequest', {
          data: state.applications.data.map((app: Application) =>
            app.identifier === data.identifier
              ? {
                  ...app,
                  keys: (app.keys ?? []).filter(
                    (k: Key) => k.identifier !== data.keyIdentifier
                  ),
                }
              : app
          ),
          error: undefined,
        })
        return response.data
      },
    })
  },
  async inviteMember(
    { commit, state }: any,
    data: { identifier: string; email: string }
  ) {
    return await processRequest({
      commit,
      mutation: 'setInviteMemberRequest',
      process: async () => {
        const response = await (this as any).$axios.post(
          `${process.env.apiUrl}api/v1/applications/${data.identifier}/members/`,
          { email: data.email }
        )

        commit('setApplicationsRequest', {
          data: state.applications.data.map((app: Application) =>
            app.identifier === data.identifier
              ? { ...app, members: [...(app?.members ?? []), response.data] }
              : app
          ),
          error: undefined,
        })
        return response.data
      },
    })
  },
  async acceptInvitation(
    { commit, dispatch }: any,
    data: { token: string; identifier: string }
  ) {
    return await processRequest({
      commit,
      mutation: 'setAcceptInvitationRequest',
      process: async () => {
        const response = await (this as any).$axios.put(
          `${process.env.apiUrl}api/v1/applications/${data.identifier}/members/`,
          { token: data.token }
        )
        dispatch('getApplications')
        return response.data
      },
    })
  },
  async deleteMember(
    { commit, state }: any,
    data: { identifier: string; userIdentifier: string }
  ) {
    return await processRequest({
      commit,
      mutation: 'setDeleteMemberRequest',
      process: async () => {
        const response = await (this as any).$axios.delete(
          `${process.env.apiUrl}api/v1/applications/${data.identifier}/members/${data.userIdentifier}/`
        )
        commit('setApplicationsRequest', {
          data: state.applications.data.map((app: Application) =>
            app.identifier === data.identifier
              ? {
                  ...app,
                  members: app.members?.filter(
                    (m: any) => m.identifier !== data.userIdentifier
                  ),
                }
              : app
          ),
          error: undefined,
        })
        return response.data
      },
    })
  },
  async updateAccount(
    { commit }: any,
    data: {
      email: string
      password: string
      currentPassword: string
      delete: boolean
    }
  ) {
    return await processRequest({
      commit,
      mutation: 'setUpdateAccountRequest',
      process: async () => {
        const response = await (this as any).$axios.put(
          `${process.env.apiUrl}api/v1/users/me/`,
          data
        )
        const auth = (this as any).$auth
        auth.setUser({ ...auth.user, email: data.email })
        return response.data
      },
    })
  },
}
