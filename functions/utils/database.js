export class Database {
  CACHE_KEY_AUTHORIZE_ACCOUNT = 'B2_AUTH'
  CACHE_KEY_UPLOAD = 'B2_UPLOAD'

  b2_authorize_account =
    'https://api.backblazeb2.com/b2api/v2/b2_authorize_account'

  b2_get_upload_url = '<apiUrl>/b2api/v2/b2_get_upload_url'
  b2_upload = '<uploadUrl>'
  b2_download = '<downloadUrl>/file/<bucket>/<path>'
  b2_list_file_names = '<apiUrl>/b2api/v2/b2_list_file_names'
  b2_delete_file_version = '<apiUrl>/b2api/v2/b2_delete_file_version'

  uploadUrl = null
  authorizeAccount = null
  namespace = null
  accountAuth = null

  constructor(env) {
    this.namespace = env.ROOTSOCKET
    this.accountAuth = env.ACCOUNT_AUTH
  }

  async _getUploadUrl() {
    if (this.uploadUrl) return this.uploadUrl

    let res = await this.namespace.get(this.CACHE_KEY_UPLOAD)
    if (!res) {
      const bucketId = await this.getBucketId()
      const url = this.b2_get_upload_url.replace(
        '<apiUrl>',
        await this.getApiUrl()
      )
      const response = await fetch(url, {
        method: 'POST',
        body: { bucketId },
        headers: { Authorization: await this.getAuthorizationToken() },
      })
      res = await response.json()
      this.namespace.put(this.CACHE_KEY_UPLOAD, JSON.stringify(res))
    } else {
      res = JSON.parse(res)
    }

    this.uploadUrl = res
    return res
  }

  async _getAuthorizeAccountData() {
    if (this.authorizeAccount) return this.authorizeAccount

    let res = await this.namespace.get(this.CACHE_KEY_AUTHORIZE_ACCOUNT)
    if (!res) {
      const response = await fetch(this.b2_authorize_account, {
        method: 'GET',
        headers: { Authorization: `Basic ${this.accountAuth}` },
      })
      res = await response.json()
      this.namespace.put(this.CACHE_KEY_AUTHORIZE_ACCOUNT, JSON.stringify(res))
    } else {
      res = JSON.parse(res)
    }

    this.authorizeAccount = res
    return res
  }

  async getBucketId() {
    const res = await this._getAuthorizeAccountData()
    return res.allowed.bucketId
  }

  async getBucketName() {
    const res = await this._getAuthorizeAccountData()
    return res.allowed.bucketName
  }

  async getApiUrl() {
    const res = await this._getAuthorizeAccountData()
    return res.apiUrl
  }

  async getAuthorizationToken() {
    const res = await this._getAuthorizeAccountData()
    return res.authorizationToken
  }

  async getDownloadUrl() {
    const res = await this._getAuthorizeAccountData()
    return res.downloadUrl
  }

  async getUploadAuthorizationToken() {
    const res = await this._getUploadUrl()
    return res.authorizationToken
  }

  async getUploadUrl() {
    const res = await this._getUploadUrl()
    return res.uploadUrl
  }

  async getFileId(name) {
    const url = this.b2_list_file_names.replace(
      '<apiUrl>',
      await this.getApiUrl()
    )

    const bucketId = await this.getBucketId()
    const res = await fetch(url, {
      method: 'POST',
      body: { bucketId, startFileName: name },
      headers: { Authorization: await this.getAuthorizationToken() },
    })
    const parsed = await res.json()

    return parsed.fileId
  }

  async download(name) {
    const url = this.b2_download
      .replace('<downloadUrl>', await this.getDownloadUrl())
      .replace('<bucket>', await this.getBucketName())
      .replace('<path>', name)
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: await this.getAuthorizationToken() },
    })
    return await res.json()
  }

  async upload(name, body) {
    const url = await this.getUploadUrl()
    const res = await fetch(url, {
      method: 'POST',
      body,
      headers: {
        Authorization: await this.getAuthorizationToken(),
        'Content-Type': 'application/json',
        'X-Bz-File-Name': name,
        'X-Bz-Content-Sha1': 'do_not_verify',
      },
    })
    return await res.json()
  }

  async delete(name) {
    const url = this.b2_delete_file_version.replace(
      '<apiUrl>',
      await this.getApiUrl()
    )
    const fileId = await this.getFileId(name)
    const res = await fetch(url, {
      method: 'POST',
      body: { fileId, fileName: name },
      headers: { Authorization: await this.getAuthorizationToken() },
    })
    return await res.json()
  }
}
