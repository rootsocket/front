import { getUserResetPasswordUrl } from './user'

export class Mail {
  constructor(env) {
    this.env = env
    this.from = 'noreply@mail.rootsocket.com'
  }

  htmlToText(input) {
    return input.replace(/<\/?[^>]+(>|$)/g, '')
  }

  async send(to, subject, message) {
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(this.env.MAIL_KEY)}`,
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: this.from,
              Name: 'RootSocket',
            },
            To: [
              {
                Email: to,
                Name: '',
              },
            ],
            Subject: subject,
            TextPart: this.htmlToText(message),
            HTMLPart: message,
            CustomID: 'AppGettingStartedTest',
          },
        ],
      }),
    })
    return await response.text()
  }

  // eslint-disable-next-line require-await
  async sendVerifyEmail(user) {
    await this.send(
      user.email,
      'Verify email address',
      'Hello, verify your email address.'
    )
  }

  async sendResetPassword(user) {
    const resetPasswordUrl = await getUserResetPasswordUrl(this.env, user)
    const message = `
        Hello,<br/><br/>

        We are contacting you from RootSocket because you requested a password reset.<br/>
        You can reset your password using the following URL:<br/><br/>

        <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
      `
    await this.send(user.email, 'Reset password', message)
  }
}
