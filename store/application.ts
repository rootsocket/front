import UAParser from 'ua-parser-js'
import {
  Application,
  ApplicationRegion,
  Key,
  User,
  Connection,
  TokenType,
} from '~/types/application'
import { normalizeString } from '~/utils/string'
import { VuexApplicationState, VuexRequest } from '~/types/vuex'
import { processRequest } from '~/utils/request'
import { sortObjectByValue } from '~/utils/objects'

const request = {
  data: undefined,
  loading: false,
  error: undefined,
  ttl: 0,
  key: '',
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
  connections: request,
  token: request,
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
  setConnectionsRequest(
    state: VuexApplicationState,
    payload: VuexRequest<Connection[]>
  ) {
    state.connections = { ...state.connections, ...payload }
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
  setTokenRequest(
    state: VuexApplicationState,
    payload: VuexRequest<{ token: string }>
  ) {
    state.token = { ...state.token, ...payload }
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
  async getApplications({ state, commit }: any, data: { force: boolean }) {
    return await processRequest({
      commit,
      mutation: 'setApplicationsRequest',
      process: async () => {
        if (!data?.force && state.applications.ttl > new Date().getTime()) {
          return state.applications
        }

        return await (this as any).$axios.get(
          `${process.env.apiUrl}api/v1/applications/`
        )
      },
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
        return response
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
        return response
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
        return response
      },
    })
  },
  async createKey(
    { commit, state }: any,
    data: { identifier: string; expiresAt: string; name: string }
  ) {
    return await processRequest({
      commit,
      mutation: 'setCreateKeyRequest',
      process: async () => {
        const response = await (this as any).$axios.post(
          `${process.env.apiUrl}api/v1/applications/${data.identifier}/keys/`,
          { expiresAt: data.expiresAt, name: data.name }
        )
        commit('setApplicationsRequest', {
          data: state.applications.data.map((app: Application) =>
            app.identifier === data.identifier
              ? { ...app, keys: [...(app.keys ?? []), response.data] }
              : app
          ),
          error: undefined,
        })
        return response
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
        return response
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
        return response
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
        dispatch('getApplications', { force: true })
        return response
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
        return response
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

        if (data.email) {
          const auth = (this as any).$auth
          auth.setUser({ ...auth.user, email: data.email })
          auth.$storage.setState('loggedIn', true)
        }
        return response
      },
    })
  },
  async getConnections(
    { commit, dispatch, state }: any,
    data: { identifier: string; force: boolean }
  ) {
    const cacheKey = `${data.identifier}`

    return await processRequest({
      commit,
      mutation: 'setConnectionsRequest',
      process: async () => {
        if (
          state.connections.key === cacheKey &&
          !data?.force &&
          state.connections.ttl > new Date().getTime()
        ) {
          return state.connections
        }

        const { token } = await dispatch('createToken', {
          action: TokenType.getConnections,
          identifier: data.identifier,
        })

        const response = await (this as any).$axios.get(
          `${location.protocol}//${process.env.wsDomain}/api/v1/connections/`,
          { headers: { Authorization: token } }
        )

        const results: Array<string> = Object.values(response.data)

        if (results.length === 0) {
          return { data: {} }
        }

        const time: Record<string, { count: number; order: number }> = {}
        const userAgent: Record<string, number> = {}
        const os: Record<string, number> = {}
        const locale = (this as any).app.i18n.locale

        results.forEach((i) => {
          try {
            const parsedResult = JSON.parse(i)
            const parsedUA = new UAParser(parsedResult.userAgent)
            const result = parsedUA.getResult()

            const browserName = result.browser.name ?? ''
            const uaCount = userAgent[browserName] ?? 0
            userAgent[browserName] = uaCount + 1

            const osName = result.os.name ?? ''
            const osCount = os[osName] ?? 0
            os[osName] = osCount + 1

            const parsedDate = new Date(parsedResult.createdAt * 1000)
            parsedDate.setMinutes(0)
            const newDate = parsedDate.toLocaleString(locale, {
              hour: 'numeric',
              minute: '2-digit',
              month: 'long',
              year: 'numeric',
              day: '2-digit',
            })
            const fullDateData = time[newDate] ?? {
              count: 0,
              order: parsedResult.createdAt,
            }
            fullDateData.count = fullDateData.count + 1
            time[newDate] = fullDateData
          } catch {
            // this will happen if there are connection that opened without having analytics on.
            const browserName = '-'
            const uaCount = userAgent[browserName] ?? 0
            userAgent[browserName] = uaCount + 1

            const osName = '-'
            const osCount = os[osName] ?? 0
            os[osName] = osCount + 1
          }
        })

        return {
          data: {
            time: sortObjectByValue(time, (a, b) =>
              b[1].order > a[1].order ? -1 : 1
            ),
            userAgent: sortObjectByValue(userAgent, (a, b) => (b > a ? 1 : -1)),
            os: sortObjectByValue(os, (a, b) => (b > a ? 1 : -1)),
          },
        }
      },
      key: cacheKey,
    })
  },
  async createToken(
    { commit }: any,
    data: { action: TokenType; identifier: string }
  ) {
    return await processRequest({
      commit,
      mutation: 'setTokenRequest',
      process: async () =>
        await (this as any).$axios.post(
          `${process.env.apiUrl}api/v1/applications/${data.identifier}/tokens/`,
          { action: data.action }
        ),
    })
  },
}
