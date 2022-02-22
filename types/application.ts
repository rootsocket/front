export enum KeyType {
  private = 'private',
  public = 'public',
}

export interface Key {
  token: string
  type: KeyType
  hosts: string[]
  // UNIX timestamp
  expiresAt: number
}

export interface Application {
  identifier: string
  // UNIX timestamp
  createdAt: number
  name: string
  location: string
  keys: Key[]
  // Allows a connection to send messages to other connections.
  allowClientSend: boolean
  // Subscription to channels will only be available through the API.
  allowClientSubscription: boolean
  // Collects information from the client when a user connects to a WebSocket.
  allowAnalytics: boolean
}

export interface User {
  identifier: string
  email: string
  // Organization identifier as an Array
  organizations: string[]
}

export enum UserRole {
  // There can only be 1 owner per organization, billing info will be collected from this user.
  owner = 'owner',
  // Members can only see applications but cannot edit them or do anything.
  normal = 'normal',
}

export interface Organization {
  name: string
  identifier: string
  applications: Application[]
  members?: User &
    {
      role: UserRole
    }[]
}
