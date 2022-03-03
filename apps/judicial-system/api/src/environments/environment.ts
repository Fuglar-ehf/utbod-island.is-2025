const devConfig = {
  production: false,
  auth: {
    samlEntryPoint: 'https://innskraning.island.is/?id=judicial-system.local',
    audience: 'localhost:4200',
    allowAuthBypass: true,
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-token',
  },
  auditTrail: {
    useGenericLogger: true,
  },
  backend: {
    url: 'http://localhost:3344',
  },
  features: {
    hidden: process.env.HIDDEN_FEATURES ?? '',
  },
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.SAML_ENTRY_POINT) {
    throw new Error('Missing SAML_ENTRY_POINT environment.')
  }
  if (!process.env.AUTH_JWT_SECRET) {
    throw new Error('Missing AUTH_JWT_SECRET environment.')
  }
  if (!process.env.SECRET_TOKEN) {
    throw new Error('Missing SECRET_TOKEN environment.')
  }
  if (!process.env.AUDIT_TRAIL_GROUP_NAME) {
    throw new Error('Missing AUDIT_TRAIL_GROUP_NAME environment.')
  }
  if (!process.env.AUDIT_TRAIL_REGION) {
    throw new Error('Missing AUDIT_TRAIL_REGION environment.')
  }
  if (!process.env.BACKEND_URL) {
    throw new Error('Missing BACKEND_URL environment.')
  }
}

const prodConfig = {
  production: true,
  auth: {
    samlEntryPoint: process.env.SAML_ENTRY_POINT,
    audience: process.env.AUTH_AUDIENCE,
    allowAuthBypass: process.env.ALLOW_AUTH_BYPASS === 'true',
    jwtSecret: process.env.AUTH_JWT_SECRET ?? '',
    secretToken: process.env.SECRET_TOKEN ?? '',
  },
  auditTrail: {
    useGenericLogger: process.env.AUDIT_TRAIL_USE_GENERIC_LOGGER === 'true',
    groupName: process.env.AUDIT_TRAIL_GROUP_NAME,
    serviceName: 'judicial-system-api',
    region: process.env.AUDIT_TRAIL_REGION,
  },
  backend: {
    url: process.env.BACKEND_URL,
  },
  features: {
    hidden: process.env.HIDDEN_FEATURES,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
