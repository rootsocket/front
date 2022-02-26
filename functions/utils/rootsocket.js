import { uuid } from './random'

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

  createSafeEmail(email) {
    return btoa(unescape(encodeURIComponent(email)))
  }

  validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }

  async createUser(email, password) {
    if (!this.validateEmail(email)) return null

    const safeEmail = this.createSafeEmail(email)
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
    const safeEmail = this.createSafeEmail(email)

    const userPath = `users/${safeEmail}.json`
    const hashedPassword = await this.makePassword(password)

    const user = await this.database.download(userPath)
    if (!user) return null
    if (user.password !== hashedPassword) return null

    return user
  }

  async getUser(email) {
    const cacheKey = 'USER_KEY'
    const safeEmail = this.createSafeEmail(email)
    const userPath = `users/${safeEmail}.json`

    let user = this.cache.get(cacheKey)
    if (!user) {
      user = await this.database.download(userPath)
      if (!user) return null

      this.cache.put(cacheKey, user, 60)
    }

    return user
  }

  async changeUserPassword(email, password) {
    const safeEmail = this.createSafeEmail(email)
    const userPath = `users/${safeEmail}.json`

    const user = await this.database.download(userPath)
    if (!user) return null

    const hashedPassword = await this.makePassword(password)
    user.password = hashedPassword
    await this.database.upload(userPath, user)

    return user
  }
}
