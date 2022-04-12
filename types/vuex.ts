import { Application, Connection, User } from './application'

export interface VuexRequest<T> {
  data?: T
  loading: boolean
  error?: { status: number; message: string }
}

export interface VuexApplicationState {
  applications: VuexRequest<Application[]>
  createApplication: VuexRequest<Application>
  updateApplication: VuexRequest<Application>
  deleteApplication: VuexRequest<null>
  createKey: VuexRequest<Application>
  deleteKey: VuexRequest<Application>
  inviteMember: VuexRequest<null>
  acceptInvitation: VuexRequest<null>
  deleteMember: VuexRequest<null>
  updateAccount: VuexRequest<User>
  registerAccount: VuexRequest<User>
  deleteAccount: VuexRequest<null>
  connections: VuexRequest<Connection[]>
  filters: {
    applications: {
      search: string
    }
  }
}
