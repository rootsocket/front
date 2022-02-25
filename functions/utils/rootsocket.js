export class RootSocket {
  constructor(database) {
    this.database = database
  }

  async createUser() {
    return await this.client.fetch({
      body: JSON.stringify({ test: 'test' }),
      url: this.endpoint,
      method: 'POST',
    })
  }
}
