// Set for auth library environment in local development
process.env.AUTH_JWT_SECRET = 'securesecret'

export default {
  production: false,
  notifications: {
    judgeMobileNumber: process.env.JUDGE_MOBILE_NUMBER,
    prisonEmail: process.env.PRISON_EMAIL,
    prisonAdminEmail: process.env.PRISON_ADMIN_EMAIL,
  },
  email: {
    fromEmail: 'gudjon@kolibri.is',
    fromName: 'Guðjón Guðjónsson',
    replyToEmail: 'gudjon@kolibri.is',
    replyToName: 'Guðjón Guðjónsson',
  },
  smsOptions: {
    url: 'https://smsapi.devnova.is',
    username: 'IslandIs_User_Development',
    password: process.env.NOVA_PASSWORD,
  },
  signingOptions: {
    url: 'https://developers.dokobit.com',
    accessToken: process.env.DOKOBIT_ACCESS_TOKEN,
  },
  emailOptions: {
    useTestAccount: true,
  },
}
