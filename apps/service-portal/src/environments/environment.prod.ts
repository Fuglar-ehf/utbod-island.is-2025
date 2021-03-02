import { getStaticEnv } from '@island.is/utils/environment'

export default {
  production: true,
  identityServer: {
    IDENTITY_SERVER_ISSUER_URL: getStaticEnv(
      'SI_PUBLIC_IDENTITY_SERVER_ISSUER_URL',
    ),
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
    education: false,
    delegation: false,
    assets: false,
    drivingLicense: false,
    documentProvider: false,
  },
}
