import { uuid } from './random'
import { memoizeAsync } from './memoize'
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

  validatePassword(_password) {
    return true
  }

  getUserCacheKey(email) {
    return `${this.createSafeInput(email)}_CACHE_KEY`
  }

  async createUser(email, password) {
    if (!this.validateEmail(email)) throw new Error(`Invalid email ${email}`)

    const safeEmail = this.createSafeInput(email)
    const userPath = `users/${safeEmail}.json`
    const hashedPassword = await this.makePassword(password)

    // We need to verify that there is no other user with this email
    const existingUser = await this.database.download(userPath)
    if (existingUser) throw new Error(`User with email ${email} already exists`)

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
    if (!user) throw new Error(`User with email ${email} does not exist`)
    if (user.password !== hashedPassword)
      throw new Error(`Password doesn't match for email ${email}`)

    return user
  }

  getUser = memoizeAsync(async (email) => {
    const cacheKey = this.getUserCacheKey(email)
    const safeEmail = this.createSafeInput(email)
    const userPath = `users/${safeEmail}.json`

    let user = await this.cache.get(cacheKey)
    if (!user) {
      user = await this.database.download(userPath)
      if (!user) throw new Error(`User with email ${email} does not exist`)

      this.cache.put(cacheKey, user, 60)
    }

    return user
  })

  getApplication = memoizeAsync(async (applicationIdentifier) => {
    const applicationPath = `applications/${applicationIdentifier}.json`
    const application = await this.database.download(applicationPath)
    if (!application)
      throw new Error(
        `Application with identifier ${applicationIdentifier} does not exist`
      )

    return application
  })

  async changeUserPassword(email, password) {
    const safeEmail = this.createSafeInput(email)
    const userPath = `users/${safeEmail}.json`

    const user = await this.database.download(userPath)
    if (!user) throw new Error(`User with email ${email} does not exist`)

    const hashedPassword = await this.makePassword(password)
    user.password = hashedPassword
    await this.database.upload(userPath, user)

    return user
  }

  async updateUser(email, data) {
    const safeEmail = this.createSafeInput(email)
    const userPath = `users/${safeEmail}.json`

    const user = await this.database.download(userPath)
    if (!user) throw new Error(`User with email ${email} does not exist`)

    const updatedUser = {
      ...user,
      ...data,
    }

    const isUserUpdated = await this.database.upload(userPath, updatedUser)
    if (!isUserUpdated)
      throw new Error(`User with email ${email} was not updated`)

    const cacheKey = this.getUserCacheKey(user.email)
    this.cache.put(cacheKey, updatedUser, 60)

    return updatedUser
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
      members: [{ role: UserRole.owner, email: user.email }],
    }
    const userRefreshed = await this.getUser(user.email)
    const updatedUser = {
      ...userRefreshed,
      applications: [...userRefreshed.applications, applicationIdentifier],
    }
    await this.database.upload(userPath, updatedUser)

    const cacheKey = this.getUserCacheKey(user.email)
    this.cache.put(cacheKey, updatedUser, 60)
    await this.database.upload(applicationPath, application)

    return application
  }

  async getApplications(applicationsIdentifier) {
    if (applicationsIdentifier.length === 0) return []

    const calls = []
    applicationsIdentifier.forEach((identifier) => {
      calls.push(
        (async () => {
          return await this.getApplication(identifier)
        })()
      )
    })

    return await Promise.all(calls)
  }

  async updateApplication(applicationIdentifier, data) {
    const applicationPath = `applications/${applicationIdentifier}.json`
    const application = await this.getApplication(applicationIdentifier)

    const updatedApplication = {
      ...application,
      ...data,
    }

    await this.database.upload(applicationPath, updatedApplication)
    return updatedApplication
  }

  async removeApplication(user, applicationIdentifier) {
    const safeEmail = this.createSafeInput(user.email)
    const userPath = `users/${safeEmail}.json`
    const applicationPath = `applications/${applicationIdentifier}.json`
    await this.database.delete(applicationPath)

    const userRefreshed = await this.getUser(user.email)
    const updatedUser = {
      ...userRefreshed,
      applications: userRefreshed.applications.filter(
        (i) => i !== applicationIdentifier
      ),
    }
    await this.database.upload(userPath, updatedUser)

    const cacheKey = this.getUserCacheKey(user.email)
    this.cache.put(cacheKey, updatedUser, 60)
    return true
  }
}
