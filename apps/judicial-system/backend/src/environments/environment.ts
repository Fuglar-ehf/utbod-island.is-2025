const devConfig = {
  production: false,
  auth: {
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-backend-api-token',
  },
  smsOptions: {
    url: 'https://smsapi.devnova.is',
    username: 'IslandIs_User_Development',
    password: process.env.NOVA_PASSWORD ?? '',
  },
  emailOptions: {
    useTestAccount: (process.env.EMAIL_USE_TEST_ACCOUNT ?? 'true') === 'true',
    options: {
      region: process.env.EMAIL_REGION ?? '',
    },
  },
  admin: {
    users:
      '[{"id":"8f8f6522-95c8-46dd-98ef-cbc198544871","nationalId":"3333333333","name":"Addi Admin","title":"notendaumsjón"},{"id":"66430be4-a662-442b-bf97-1858a64ab685","nationalId":"4444444444","name":"Solla Sýsla","title":"notendaumsjón"}]',
  },
  files: {
    region: 'eu-west-1',
    bucket: 'island-is-dev-upload-judicial-system',
    timeToLivePost: '15',
    timeToLiveGet: '5',
  },
  events: {
    url: process.env.EVENT_URL,
    errorUrl: process.env.ERROR_EVENT_URL,
  },
}

if (process.env.NODE_ENV === 'production') {
  if (!process.env.AUTH_JWT_SECRET) {
    throw new Error('Missing AUTH_JWT_SECRET environment.')
  }
  if (!process.env.BACKEND_ACCESS_TOKEN) {
    throw new Error('Missing BACKEND_ACCESS_TOKEN environment.')
  }
  if (!process.env.COURTS_MOBILE_NUMBERS) {
    throw new Error('Missing COURTS_MOBILE_NUMBERS environment.')
  }
  if (!process.env.PRISON_EMAIL) {
    throw new Error('Missing PRISON_EMAIL environment.')
  }
  if (!process.env.PRISON_ADMIN_EMAIL) {
    throw new Error('Missing PRISON_ADMIN_EMAIL environment.')
  }
  if (!process.env.EMAIL_FROM) {
    throw new Error('Missing EMAIL_FROM environment.')
  }
  if (!process.env.EMAIL_FROM_NAME) {
    throw new Error('Missing EMAIL_FROM_NAME environment.')
  }
  if (!process.env.EMAIL_REPLY_TO) {
    throw new Error('Missing EMAIL_REPLY_TO environment.')
  }
  if (!process.env.EMAIL_REPLY_TO_NAME) {
    throw new Error('Missing EMAIL_REPLY_TO_NAME environment.')
  }
  if (!process.env.NOVA_URL) {
    throw new Error('Missing NOVA_URL environment.')
  }
  if (!process.env.NOVA_USERNAME) {
    throw new Error('Missing NOVA_USERNAME environment.')
  }
  if (!process.env.NOVA_PASSWORD) {
    throw new Error('Missing NOVA_PASSWORD environment.')
  }
  if (!process.env.EMAIL_REGION) {
    throw new Error('Missing EMAIL_REGION environment.')
  }
  if (!process.env.ADMIN_USERS) {
    throw new Error('Missing ADMIN_USERS environment.')
  }
  if (!process.env.S3_REGION) {
    throw new Error('Missing S3_REGION environment.')
  }
  if (!process.env.S3_BUCKET) {
    throw new Error('Missing S3_BUCKET environment.')
  }
  if (!process.env.S3_TIME_TO_LIVE_POST) {
    throw new Error('Missing S3_TIME_TO_LIVE_POST environment.')
  }
  if (!process.env.S3_TIME_TO_LIVE_GET) {
    throw new Error('Missing S3_TIME_TO_LIVE_GET environment.')
  }
  if (!process.env.XROAD_TLS_BASE_PATH_WITH_ENV) {
    throw new Error('Missing XROAD_TLS_BASE_PATH_WITH_ENV environment.')
  }
  if (!process.env.XROAD_CLIENT_ID) {
    throw new Error('Missing XROAD_CLIENT_ID environment.')
  }
  if (!process.env.XROAD_CLIENT_CERT) {
    throw new Error('Missing XROAD_CLIENT_CERT environment.')
  }
  if (!process.env.XROAD_CLIENT_KEY) {
    throw new Error('Missing XROAD_CLIENT_KEY environment.')
  }
  if (!process.env.XROAD_CLIENT_PEM) {
    throw new Error('Missing XROAD_CLIENT_PEM environment.')
  }
  if (!process.env.XROAD_POLICE_API_PATH) {
    throw new Error('Missing XROAD_POLICE_API_PATH environment.')
  }
  if (!process.env.XROAD_POLICE_MEMBER_CODE) {
    throw new Error('Missing XROAD_POLICE_MEMBER_CODE environment.')
  }
  if (!process.env.COMPLETED_CASE_OVERVIEW_URL) {
    throw new Error('Missing COMPLETED_CASE_OVERVIEW_URL environment.')
  }
  if (!process.env.PROSECUTOR_RESTRICTION_CASE_OVERVIEW_URL) {
    throw new Error(
      'Missing PROSECUTOR_RESTRICTION_CASE_OVERVIEW_URL environment.',
    )
  }
  if (!process.env.PROSECUTOR_INVESTIGATION_CASE_OVERVIEW_URL) {
    throw new Error(
      'Missing PROSECUTOR_INVESTIGATION_CASE_OVERVIEW_URL environment.',
    )
  }
}

const prodConfig = {
  production: true,
  auth: {
    jwtSecret: process.env.AUTH_JWT_SECRET ?? '',
    secretToken: process.env.BACKEND_ACCESS_TOKEN ?? '',
  },
  smsOptions: {
    url: process.env.NOVA_URL ?? '',
    username: process.env.NOVA_USERNAME ?? '',
    password: process.env.NOVA_PASSWORD ?? '',
  },
  emailOptions: {
    useTestAccount: false,
    options: {
      region: process.env.EMAIL_REGION ?? '',
    },
  },
  admin: {
    users: process.env.ADMIN_USERS ?? '',
  },
  files: {
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET ?? '',
    timeToLivePost: process.env.S3_TIME_TO_LIVE_POST ?? '',
    timeToLiveGet: process.env.S3_TIME_TO_LIVE_GET ?? '',
  },
  events: {
    url: process.env.EVENT_URL,
    errorUrl: process.env.ERROR_EVENT_URL,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
