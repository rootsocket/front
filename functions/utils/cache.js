export class Cache {
  constructor(env) {
    this.namespace = env.ROOTSOCKET
  }

  wrap(data, cacheTTLSeconds) {
    return JSON.stringify({
      data,
      timestamp: new Date().getTime() + cacheTTLSeconds * 1000,
    })
  }

  unwrap(wrappedData) {
    const { data, timestamp } = wrappedData
    if (timestamp < new Date().getTime()) {
      throw new Error('Cache expired')
    }
    return JSON.parse(data)
  }

  async get(key) {
    const response = await this.namespace.get(key)
    if (!response) return null

    try {
      const data = this.unwrap(response)
      return data
    } catch {
      this.namespace.delete(key)
      return null
    }
  }

  async put(key, value, cacheTTLSeconds = 30) {
    const data = this.wrap(value, cacheTTLSeconds)
    await this.namespace.put(key, data)
  }

  async delete(key) {
    await this.namespace.delete(key)
  }
}
