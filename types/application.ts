export enum KeyType {
  private = 'private',
  public = 'public',
}

export interface Key {
  token: string
  type: KeyType
  hosts: string[]
  expiresAt: number
}

export interface Application {
  identifier: string
  createdAt: number
  name: string
  location: string
  keys: Key[]
  allowClientSend: boolean
  allowClientSubscription: boolean
  allowAnalytics: boolean
}

export interface Organization {
  name: string
  identifier: string
  applications: Application[]
}
