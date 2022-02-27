export const isCaptchaResponseGood = async (env, captchaResponse) => {
  const params = new URLSearchParams()
  params.append('response', captchaResponse)
  params.append('secret', env.CAPTCHA_SECRET)

  const raw = await fetch('https://hcaptcha.com/siteverify', {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  if (raw.status === 200) {
    const response = await raw.json()
    return response && response.success
  }

  return false
}
