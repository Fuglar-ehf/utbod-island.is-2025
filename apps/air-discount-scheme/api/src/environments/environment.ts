if (process.env.NODE_ENV === 'production') {
  if (!process.env.BACKEND_URL) {
    throw new Error('Missing BACKEND_URL environment.')
  }
}

const devConfig = {
  production: false,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  accessGroups: {
    developers: process.env.DEVELOPERS,
    admins: process.env.ADMINS,
  },
  identityServerAuth: {
    issuer: process.env.IDENTITY_SERVER_DOMAIN
      ? `https://${process.env.IDENTITY_SERVER_DOMAIN}`
      : 'https://identity-server.dev01.devland.is',
    audience: '@vegagerdin.is',
  },
  auth: {
    audience: '@vegagerdin.is',
    jwtSecret: 'securesecret',
  },
  idsTokenCookieName: 'next-auth.session-token',
  backendUrl: 'http://localhost:4248',
}

const prodConfig = {
  production: true,
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
  accessGroups: {
    developers: process.env.DEVELOPERS,
    admins: process.env.ADMINS,
  },
  identityServerAuth: {
    issuer: process.env.IDENTITY_SERVER_DOMAIN
      ? `https://${process.env.IDENTITY_SERVER_DOMAIN}`
      : '',
    audience: '@vegagerdin.is',
  },
  auth: {
    audience: process.env.AUTH_AUDIENCE,
    jwtSecret: process.env.AUTH_JWT_SECRET,
  },
  idsTokenCookieName: '__Secure-next-auth.session-token',
  backendUrl: process.env.BACKEND_URL ?? 'http://localhost:4248',
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
