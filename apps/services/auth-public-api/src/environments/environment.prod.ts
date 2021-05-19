import { XRoadMemberClass } from '@island.is/utils/api'

export default {
  production: true,
  auth: {
    issuer: process.env.IDS_ISSUER,
    jwksUri: process.env.JWKS_URI,
  },
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
}
