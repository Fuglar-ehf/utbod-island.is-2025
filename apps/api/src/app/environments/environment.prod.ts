export default {
  production: true,
  xroad: {
    baseUrl: process.env.XROAD_BASE_PATH,
    clientId: process.env.XROAD_CLIENT_ID,
  },
  applicationSystem: {
    baseApiUrl: process.env.APPLICATION_SYSTEM_API_URL,
  },
  drivingLicense: {
    secret: process.env.DRIVING_LICENSE_SECRET,
  },
  education: {
    xroadLicenseServiceId: process.env.MMS_XROAD_LICENSE_SERVICE_ID,
    emailOptions: {
      sendFromEmail: process.env.SEND_FROM_EMAIL,
      useTestAccount: false,
      options: {
        region: process.env.EMAIL_REGION,
      },
    },
  },
  fileStorage: {
    uploadBucket: process.env.FILE_STORAGE_UPLOAD_BUCKET,
  },
  nationalRegistry: {
    baseSoapUrl: process.env.SOFFIA_SOAP_URL,
    user: process.env.SOFFIA_USER,
    password: process.env.SOFFIA_PASS,
    host: process.env.SOFFIA_HOST_URL,
  },
  healthInsurance: {
    wsdlUrl: process.env.HEALTH_INSURANCE_XROAD_WSDLURL,
    baseUrl: process.env.XROAD_BASE_PATH,
    username: process.env.HEALTH_INSURANCE_XROAD_USERNAME,
    password: process.env.HEALTH_INSURANCE_XROAD_PASSWORD,
    clientID: process.env.XROAD_CLIENT_ID,
    xroadID: process.env.XROAD_HEALTH_INSURANCE_ID,
  },
  userProfile: {
    userProfileServiceBasePath: process.env.SERVICE_USER_PROFILE_URL,
  },
  identityServer: {
    issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
    audience: '',
    jwksUri: process.env.IDENTITY_SERVER_JWKS_URI,
  },
  documentService: {
    basePath: process.env.POSTHOLF_BASE_PATH,
    clientId: process.env.POSTHOLF_CLIENTID ?? '',
    clientSecret: process.env.POSTHOLF_CLIENT_SECRET ?? '',
    tokenUrl: process.env.POSTHOLF_TOKEN_URL ?? '',
  },
  documentProviderService: {
    test: {
      basePath: process.env.DOCUMENT_PROVIDER_BASE_PATH_TEST,
      clientId: process.env.DOCUMENT_PROVIDER_CLIENTID_TEST ?? '',
      clientSecret: process.env.DOCUMENT_PROVIDER_CLIENT_SECRET_TEST ?? '',
      tokenUrl: process.env.DOCUMENT_PROVIDER_TOKEN_URL_TEST ?? '',
    },
    prod: {
      basePath: process.env.DOCUMENT_PROVIDER_BASE_PATH,
      clientId: process.env.DOCUMENT_PROVIDER_CLIENTID ?? '',
      clientSecret: process.env.DOCUMENT_PROVIDER_CLIENT_SECRET ?? '',
      tokenUrl: process.env.DOCUMENT_PROVIDER_TOKEN_URL ?? '',
    },
    documentsServiceBasePath: process.env.SERVICE_DOCUMENTS_BASEPATH,
  },
  syslumennService: {
    url: process.env.SYSLUMENN_HOST,
    username: process.env.SYSLUMENN_USERNAME,
    password: process.env.SYSLUMENN_PASSWORD,
  },
}
