import { getMemberInvitationUrl, getUserResetPasswordUrl } from './user'

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
      'Verify email address - RootSocket',
      'Hello, verify your email address.'
    )
  }

  async sendResetPassword(user) {
    const resetPasswordUrl = await getUserResetPasswordUrl(this.env, user)
    const message = `
        Hello,<br/><br/>

        We are contacting you from RootSocket because you requested a password reset.<br/>
        You can reset your password using the following URL:<br/><br/>

        <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>\n\n
      `
    await this.send(user.email, 'Reset password - RootSocket', message)
  }

  async sendApplicationInvitation(application, user, role) {
    const invitationEmailUrl = await getMemberInvitationUrl(
      this.env,
      application,
      user,
      role
    )
    const message = `
        Hello,<br/><br/>

        We are contacting you from RootSocket because you were invited to ${application.name}.<br/>
        You can join using the following URL, it will expire in a few hours:<br/><br/>

        <a href="${invitationEmailUrl}">${invitationEmailUrl}</a>\n\n
      `
    await this.send(
      user.email,
      `Invitation to ${application.name} - RootSocket`,
      message
    )
  }
}
