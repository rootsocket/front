import { captureError } from '@cfworker/sentry'

export const errorMiddleware = async ({ next, request, env }) => {
  // If we are in dev mode or any other mode that doesn't match with production we can throw
  const environment = env.ENVIRONMENT
  if (environment !== 'production' || environment !== 'staging') {
    return await next()
  }

  // Catches errors to Sentry in production
  try {
    return await next()
  } catch (err) {
    captureError(
      env.SENTRY_DSN,
      environment,
      'undefined',
      err,
      request,
      // Should we add data to identify a user account?
      'undefined'
    )
    // `${err.message}\n${err.stack}`
    return new Response(null, { status: 500 })
  }
}
