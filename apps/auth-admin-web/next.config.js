const withTreat = require('next-treat')()
const withHealthcheckConfig = require('./next-modules/withHealthcheckConfig')
const { createSecureHeaders } = require('next-secure-headers')

const { NEXT_PUBLIC_BACKEND_URL } = 'http://localhost:4200/backend'

module.exports = withTreat(
  withHealthcheckConfig({
    basePath: '/admin',
    cssModules: false,
    serverRuntimeConfig: {
      // Will only be available on the server side
      // Requests made by the server are internal request made directly to the api hostname
      backendUrl: NEXT_PUBLIC_BACKEND_URL,
    },
    publicRuntimeConfig: {
      backendUrl: '',
    },
    env: {
      API_MOCKS: process.env.API_MOCKS || '',
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: createSecureHeaders({
            contentSecurityPolicy: {
              directives: {
                defaultSrc: "'self'",
                objectSrc: "'none'",
                frameSrc: "'none'",
                baseURI: "'self'",
                styleSrc: ["'self' 'unsafe-inline'"],
                scriptSrc: ["'self'"],
                connectSrc: ["'self'"],
              },
            },
            forceHTTPSRedirect: [
              true,
              { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true },
            ],
            nosniff: 'nosniff',
            frameGuard: 'deny',
            referrerPolicy: 'no-referrer',
          }),
        },
      ]
    },
    poweredByHeader: false,
  }),
)
