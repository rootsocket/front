interface CaptchaState {
  captcha: { ttl: number }
}

export const state = (): CaptchaState => ({
  captcha: {
    ttl: 0,
  },
})

export const getters = {
  isActive(state: CaptchaState) {
    return state.captcha.ttl >= new Date().getTime()
  },
}

export const mutations = {
  setCaptchaExpires(state: CaptchaState) {
    state.captcha.ttl = new Date().getTime() + 60 * 60 * 1000 // time + 1 hour (comes from backend)
  },
}
