import { XRoadMemberClass } from '@island.is/shared/utils/server'

const devConfig = {
  production: false,
  auth: {
    audience: '@identityserver.api',
    issuer: 'https://localhost:6001',
  },
  port: 4333,
  rsk: {
    xroad: {
      basePath: 'http://localhost:8081/r1/IS-DEV',
      memberClass: XRoadMemberClass.GovernmentInstitution,
      memberCode: '10006',
      apiPath:
        '/Skatturinn-Protected/company-registry-v1/api/companyregistry/members',
      clientId: 'IS-DEV/GOV/10000/island-is-client',
    },
    username: process.env.RSK_USERNAME,
    password: process.env.RSK_PASSWORD,
  },
  nationalRegistry: {
    authMiddlewareOptions: {
      forwardUserInfo: false,
    },
  },
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.IDENTITY_SERVER_ISSUER_URL) {
    throw new Error('Missing IDENTITY_SERVER_ISSUER_URL environment.')
  }
}

const prodConfig = {
  production: true,
  auth: {
    audience: '@identityserver.api',
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL!,
  },
  port: 3333,
  rsk: {
    xroad: {
      basePath: process.env.XROAD_BASE_PATH_WITH_ENV,
      memberClass: XRoadMemberClass.GovernmentInstitution,
      memberCode: process.env.XROAD_RSK_MEMBER_CODE,
      apiPath: process.env.XROAD_RSK_API_PATH,
      clientId: process.env.XROAD_RSK_CLIENT_ID,
    },
    username: process.env.RSK_USERNAME,
    password: process.env.RSK_PASSWORD,
  },
  nationalRegistry: {
    authMiddlewareOptions: {
      forwardUserInfo: false,
    },
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
