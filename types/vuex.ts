export interface VuexRequest<T> {
  data?: T
  isLoading: boolean
  error?: { status: number; message: string }
}
