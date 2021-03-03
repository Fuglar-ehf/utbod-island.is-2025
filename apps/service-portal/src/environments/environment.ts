// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

export default {
  production: false,
  identityServer: {
    IDENTITY_SERVER_ISSUER_URL: 'https://identity-server.dev01.devland.is',
  },
  sentry: {
    dsn:
      'https://3c45a55273774b91a897b85e0a1243d1@o406638.ingest.sentry.io/5501494',
  },
  featureFlags: {
    applications: false,
    documents: true,
    settings: true,
    finance: true,
    family: true,
    health: false,
    education: true,
    delegation: false,
    assets: false,
    drivingLicense: false,
    documentProvider: true,
  },
}
