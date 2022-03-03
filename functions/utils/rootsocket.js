import { uuid } from './random'
import { UserRole } from '~/types/application'

export class RootSocket {
  constructor(database, cache) {
    this.cache = cache
    this.database = database
  }

  async makePassword(password) {
    const enc = new TextEncoder('utf-8').encode(password)
    const data = await crypto.subtle.digest('SHA-256', enc)
    return [...new Uint8Array(data)]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  createSafeInput(email) {
    return btoa(unescape(encodeURIComponent(email)))
  }

  validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }

  getUserCacheKey(email) {
    return `${this.createSafeInput(email)}_CACHE_KEY`
  }

  async createUser(email, password) {
    if (!this.validateEmail(email)) return null

    const safeEmail = this.createSafeInput(email)
    const userPath = `users/${safeEmail}.json`
    const hashedPassword = await this.makePassword(password)

    // We need to verify that there is no other user with this email
    const existingUser = await this.database.download(userPath)
    if (existingUser) return null

    const user = {
      identifier: uuid(),
      password: hashedPassword,
      applications: [],
      verified: false,
      email,
    }
    await this.database.upload(userPath, user)

    return user
  }

  async login(email, password) {
    const safeEmail = this.createSafeInput(email)

    const userPath = `users/${safeEmail}.json`
    const hashedPassword = await this.makePassword(password)

    const user = await this.database.download(userPath)
    if (!user) return null
    if (user.password !== hashedPassword) return null

    delete user.password
    return user
  }

  async getUser(email) {
    const cacheKey = this.getUserCacheKey(email)
    const safeEmail = this.createSafeInput(email)
    const userPath = `users/${safeEmail}.json`

    let user = await this.cache.get(cacheKey)
    if (!user) {
      user = await this.database.download(userPath)
      if (!user) return null

      this.cache.put(cacheKey, user, 60)
    }

    return user
  }

  async changeUserPassword(email, password) {
    const safeEmail = this.createSafeInput(email)
    const userPath = `users/${safeEmail}.json`

    const user = await this.database.download(userPath)
    if (!user) return null

    const hashedPassword = await this.makePassword(password)
    user.password = hashedPassword
    await this.database.upload(userPath, user)

    return user
  }

  async createApplication(user, name, region) {
    const safeEmail = this.createSafeInput(user.email)
    const userPath = `users/${safeEmail}.json`
    const applicationIdentifier = uuid()
    const applicationPath = `applications/${applicationIdentifier}.json`
    const application = {
      name,
      region,
      identifier: applicationIdentifier,
      createdAt: new Date().getTime(),
      keys: [],
      allowClientSend: false,
      allowClientSubscription: true,
      allowAnalytics: true,
      members: [{ role: UserRole.owner, identifier: user.identifier }],
    }
    const userRefreshed = await this.getUser(user.email)
    const updatedUser = {
      ...userRefreshed,
      applications: [...userRefreshed.applications, applicationIdentifier],
    }
    const isUserUpdated = await this.database.upload(userPath, updatedUser)

    if (isUserUpdated) {
      const cacheKey = this.getUserCacheKey(user.email)
      this.cache.put(cacheKey, updatedUser, 60)
      const isApplicationCreated = await this.database.upload(
        applicationPath,
        application
      )

      if (isApplicationCreated) {
        return application
      }
    }

    return null
  }

  async getApplications(applicationsIdentifier) {
    if (applicationsIdentifier.length === 0) return []

    const calls = []
    applicationsIdentifier.forEach((identifier) => {
      calls.push(
        (async () => {
          const applicationPath = `applications/${identifier}.json`
          return await this.database.download(applicationPath)
        })()
      )
    })

    return await Promise.all(calls)
  }

  async getApplication(applicationIdentifier) {
    const applicationPath = `applications/${applicationIdentifier}.json`
    const application = await this.database.download(applicationPath)
    if (!application) return null

    return application
  }

  async updateApplication(applicationIdentifier, data) {
    const applicationPath = `applications/${applicationIdentifier}.json`
    const application = await this.getApplication(applicationIdentifier)
    if (!application) return null

    const updatedApplication = {
      ...application,
      ...data,
    }

    const isApplicationUpdated = await this.database.upload(
      applicationPath,
      updatedApplication
    )
    if (!isApplicationUpdated) return null
    return updatedApplication
  }

  async removeApplication(user, applicationIdentifier) {
    const safeEmail = this.createSafeInput(user.email)
    const userPath = `users/${safeEmail}.json`
    const applicationPath = `applications/${applicationIdentifier}.json`
    const isApplicationDeleted = await this.database.delete(applicationPath)

    if (isApplicationDeleted) {
      const userRefreshed = await this.getUser(user.email)
      const updatedUser = {
        ...userRefreshed,
        applications: userRefreshed.applications.filter(
          (i) => i !== applicationIdentifier
        ),
      }
      const isUserUpdated = await this.database.upload(userPath, updatedUser)

      if (isUserUpdated) {
        const cacheKey = this.getUserCacheKey(user.email)
        this.cache.put(cacheKey, updatedUser, 60)
        return true
      }
    }

    return false
  }
}
