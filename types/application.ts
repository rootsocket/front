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

// User also needs a mapping between user email and user identifier
// that way we can use it in applications.
export interface User {
  identifier: string
  email: string
  // Application identifier as an Array
  applications: string[]
}

export enum UserRole {
  // There can only be 1 owner per application, billing info will be collected from this user.
  owner = 'owner',
  // Members can only see applications but cannot edit them or do anything.
  normal = 'normal',
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
  members: {
    role: UserRole
    // User identifier
    identifier: string
  }[]
}

export interface Connection {
  identifier: string
  // UNIX timestamp
  startAt: number
  // UNIX timestamp
  finishAt: number
  ipAddress: string
  userAgent: string
  // messages sent and received by connection
  messages: number
}
