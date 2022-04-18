export interface Key {
  identifier: string
  category: KeyType
  // UNIX timestamp
  expiresAt: number
}

// User also needs a mapping between user email and user identifier
// that way we can use it in applications.
export interface User {
  identifier: string
  email: string
}

export enum UserRole {
  // There can only be 1 owner per application, billing info will be collected from this user.
  owner = 1,
  // Members can only see applications but cannot edit them or do anything.
  normal = 2,
}

export enum ApplicationRegion {
  euCentral1 = 'eu-central-1',
}

export interface Member {
  role: UserRole
  email: string
  identifier: string
  createdAt: string
  accepted: boolean
}

export interface Application {
  identifier: string
  // UNIX timestamp
  createdAt: number
  name: string
  region: string
  keys?: Key[]
  // Allows a connection to send messages to other connections.
  allowClientSend: boolean
  // Subscription to channels will only be available through the API.
  allowChannelSubscription: boolean
  // Subscriptions to channel require an auth token
  allowChannelAuthorization: boolean
  // Collects information from the client when a user connects to a WebSocket.
  allowClientData: boolean
  members?: Member[]
}

export interface Connection {
  identifier: string
  startedAt: string
  endedAt: string
  ipAddress: string
  userAgent: string
  // messages sent and received by connection
  messages: number
}

export enum TokenType {
  createConnection = 'createConn',
  getConnections = 'getConn',
}
