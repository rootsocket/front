import { Application } from './application'

export interface VuexRequest<T> {
  data?: T
  isLoading: boolean
  error?: { status: number; message: string }
}

export interface VuexApplicationState {
  applications: VuexRequest<Application[]>
  createApplication: VuexRequest<Application>
  filters: {
    applications: {
      search: string
    }
  }
}
