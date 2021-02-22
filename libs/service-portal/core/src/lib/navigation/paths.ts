export enum ServicePortalPath {
  // Mínar síður
  MinarSidurRoot = '/',
  MinarSidurSignInOidc = '/signin-oidc',
  MinarSidurSilentSignInOidc = '/silent/signin-oidc',

  // Applications
  ApplicationRoot = '/umsoknir',
  ApplicationIntroduction = '/umsoknir-kynning',
  ApplicationNewApplication = '/umsoknir/ny-umsokn',
  ApplicationOpenApplications = '/umsoknir/opnar-umsoknir',
  ApplicationPrescription = '/umsoknir/lyfsedlar',
  ApplicationDrivingLicense = '/umsoknir/okuskirteini',

  // Settings
  SettingsRoot = '/stillingar',

  // Family
  FamilyRoot = '/min-gogn/fjolskyldan',
  FamilyMember = '/min-gogn/fjolskyldan/:nationalId',
  MyInfoRoot = '/min-gogn',
  UserInfo = '/min-gogn/minar-upplysingar',
  RealEstateExternal = 'https://minarsidur.island.is/minar-sidur/min-gogn/fasteignir',

  // Fjarmal
  FinanceRoot = '/fjarmal',
  FinanceVehicles = 'https://mitt.samgongustofa.is/',
  FinancePayments = '/greidslur',
  FinanceExternal = 'https://minarsidur.island.is/minar-sidur/fjarmal/fjarmal-stada-vid-rikissjod-og-stofnanir/',

  // Electronic Documents
  ElectronicDocumentsRoot = '/rafraen-skjol',
  ElectronicDocumentsFileDownload = '/rafraen-skjol/:id',

  // Heilsa
  HealthRoot = '/heilsa',

  // Education
  EducationRoot = '/menntun',
  EducationExternal = 'https://minarsidur.island.is/minar-sidur/menntun/namsferill/',

  // Assets
  AssetsRoot = '/eignir',

  // Messages
  MessagesRoot = '/skilabod',

  // My licenses
  MyLicensesRoot = '/min-rettindi',
  ParentalLeave = '/min-rettindi/faedingarorlof',
  DrivingLicense = '/min-rettindi/okuskirteini',

  // User Profile
  UserProfileRoot = '/stillingar',
  UserProfileEditPhoneNumber = '/stillingar/breyta-simanumeri',
  UserProfileEditEmail = '/stillingar/breyta-netfangi',
  UserProfileEditLanguage = '/stillingar/breyta-tungumali',
  UserProfileEmailConfirmation = '/stillingar/stadfesta-netfang/:hash',

  // DocumentProvider
  // Temporary change to the value of DocumentProviderRoot; skjalaveita -> skjalaveitur. In the first
  // release there will only be a limited number of features and this change creates a better UX in
  // that scenario.
  DocumentProviderRoot = '/skjalaveitur', // Breytt path
  DocumentProviderDocumentProvidersSingle = '/skjalaveitur/:nationalId',
  // DocumentProviderDocumentProviders = '/skjalaveita/skjalaveitendur',
  // DocumentProviderMyCategories = '/skjalaveita/minir-flokkar',
  // DocumentProviderSettingsRoot = '/skjalaveita/skjalaveita-stillingar',
  // DocumentProviderSettingsEditInstituion = '/skjalaveita/skjalaveita-stillingar/breyta-stofnun',
  // DocumentProviderSettingsEditResponsibleContact = '/skjalaveita/skjalaveita-stillingar/breyta-abyrgdarmanni',
  // DocumentProviderSettingsEditTechnicalContact = '/skjalaveita/skjalaveita-stillingar/breyta-taeknilegum-tengilid',
  // DocumentProviderSettingsEditUserHelpContact = '/skjalaveita/skjalaveita-stillingar/breyta-notendaadstod',
  // DocumentProviderSettingsEditEndpoints = '/skjalaveita/skjalaveita-stillingar/breyta-endapunkt',
  // DocumentProviderTechnicalInfo = '/skjalaveita/taeknilegar-upplysingar',
  // DocumentProviderStatistics = '/skjalaveita/tolfraedi',
}
