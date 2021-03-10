export default {
  production: false,
  auth: {
    jwtSecret: 'jwt-secret',
    secretToken: 'secret-token',
  },
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
  admin: {
    users:
      '[{"id":"8f8f6522-95c8-46dd-98ef-cbc198544871","nationalId":"3333333333","name":"Addi Admin"},{"id":"66430be4-a662-442b-bf97-1858a64ab685","nationalId":"4444444444","name":"Solla Sýsla"}]',
  },
}
