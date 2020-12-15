export default {
  production: true,
  identityServer: {
    IDENTITY_SERVER_ISSUER_URL:
      window.location.origin === 'https://beta.staging01.devland.is/minarsidur'
        ? 'https://beta.dev01.devland.is/minarsidur'
        : window.location.origin === 'https://island.is/minarsidur'
        ? 'https://innskra.island.is'
        : 'https://identity-server.dev01.devland.is',
  },
  sentry: {
    dsn:
      'https://3c45a55273774b91a897b85e0a1243d1@o406638.ingest.sentry.io/5501494',
  },
}
