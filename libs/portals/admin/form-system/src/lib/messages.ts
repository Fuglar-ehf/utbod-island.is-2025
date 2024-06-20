import { defineMessages } from 'react-intl'

export const m = defineMessages({
  rootName: {
    id: 'portals-admin.form-system:application-builder',
    defaultMessage: 'Umsóknarsmiður',
  },
  template: {
    id: 'portals-admin.form-system:template',
    defaultMessage: 'Forskrift',
  },
  organisation: {
    id: 'portals-admin.form-system:organisation',
    defaultMessage: 'Stofnun',
  },
  state: {
    id: 'portals-admin.form-system:state',
    defaultMessage: 'Staða',
  },
  name: {
    id: 'portals-admin.form-system:name',
    defaultMessage: 'Heiti',
  },
  nameEnglish: {
    id: 'portals-admin.form-system:name-english',
    defaultMessage: 'Heiti (enska)',
  },
  applicationName: {
    id: 'portals-admin.form-system:application-name',
    defaultMessage: 'Heiti umsóknar',
  },
  applicationNameEnglish: {
    id: 'portals-admin.form-system:application-name-english',
    defaultMessage: 'Heiti umsóknar (enska)',
  },
  description: {
    id: 'portals-admin.form-system:description',
    defaultMessage: 'Lýsing',
  },
  descriptionEnglish: {
    id: 'portals-admin.form-system:description-english',
    defaultMessage: 'Lýsing (enska)',
  },
  daysUntilExpiration: {
    id: 'portals-admin.form-system:days-until-expiration',
    defaultMessage: 'Líftími umsóknar',
  },
  deadline: {
    id: 'portals-admin.form-system:deadline',
    defaultMessage: 'Umsóknarfrestur',
  },
  basicSettings: {
    id: 'portals-admin.form-system:basic-settings',
    defaultMessage: 'Grunnstillingar',
  },
  allowProgress: {
    id: 'portals-admin.form-system:allow-progress',
    defaultMessage:
      'Leyfa notanda að halda áfram í umsókninni með ógild/óútfyllt gildi',
  },
  premisesTitle: {
    id: 'portals-admin.form-system:premises-title',
    defaultMessage:
      'Í þessu skrefi óskum við eftir samþykki fyrir því að upplýsingar um hlutaðeigandi aðila verði sóttar af Mínum síðum. Að auki er hægt að óska eftir heimild fyrir því að einhver af eftirfarandi vottorðum verði sótt í viðeigandi vefþjónustur',
  },
  premises: {
    id: 'portals-admin.form-system:premises',
    defaultMessage: 'Forsendur',
  },
  estateGuardianshipCertificate: {
    id: 'portals-admin.form-system:estate-guardianship-certificate',
    defaultMessage: 'Búsforræðisvottorð',
  },
  estateGuardianshipCertificateWithoutSeal: {
    id: 'portals-admin.form-system:estate-guardianship-certificate-without-seal',
    defaultMessage: 'Búsforræðisvottorð án stimpils',
  },
  certificateOfResidence: {
    id: 'portals-admin.form-system:certificate-of-residence',
    defaultMessage: 'Búsetuvottorð',
  },
  noDebtCertificate: {
    id: 'portals-admin.form-system:no-debt-certificate',
    defaultMessage: 'Skuldleysisvottorð',
  },
  criminalRecord: {
    id: 'portals-admin.form-system:criminal-record',
    defaultMessage: 'Sakavottorð',
  },
  criminalRecordWithoutSeal: {
    id: 'portals-admin.form-system:criminal-record-without-seal',
    defaultMessage: 'Sakavottorð án stimpils',
  },
  relevantParties: {
    id: 'portals-admin.form-system:relevant-parties',
    defaultMessage: 'Hlutaðeigandi aðilar',
  },
  selectIndividuals: {
    id: 'portals-admin.form-system:select-individuals',
    defaultMessage: 'Veldu þá einstaklinga sem mega opna þessa umsókn',
  },
  individual: {
    id: 'portals-admin.form-system:individual',
    defaultMessage: 'Einstaklingur (innskráður)',
  },
  individualOnBehalfPerson: {
    id: 'portals-admin.form-system:individual-on-behalf-person',
    defaultMessage: 'Einstaklingur í umboði annars einstaklings',
  },
  individualOnBehalfLegalEntity: {
    id: 'portals-admin.form-system:individual-on-behalf-legal-entity',
    defaultMessage: 'Einstaklingur í umboði lögaðila',
  },
  individualWithPowerOfAttorney: {
    id: 'portals-admin.form-system:individual-with-power-of-attorney',
    defaultMessage: 'Einstaklingur með prókúru',
  },
  defineRelevantParties: {
    id: 'portals-admin.form-system:define-relevant-parties',
    defaultMessage: 'Skilgreindu hlutaðeigandi aðila',
  },
  step: {
    id: 'portals-admin.form-system:step',
    defaultMessage: 'Skref',
  },
  group: {
    id: 'portals-admin.form-system:group',
    defaultMessage: 'Hópur',
  },
  input: {
    id: 'portals-admin.form-system:input',
    defaultMessage: 'Innsláttur',
  },
  allowMultiple: {
    id: 'portals-admin.form-system:allow-multiple',
    defaultMessage: 'Er fjölval',
  },
  saveAndContinue: {
    id: 'portals-admin.form-system:save-and-continue',
    defaultMessage: 'Vista og halda áfram',
  },
  addStep: {
    id: 'portals-admin.form-system:add-step',
    defaultMessage: 'Bæta við skrefi',
  },
  allowFileTypes: {
    id: 'portals-admin.form-system:allow-file-types',
    defaultMessage: 'Leyfa eftirfarandi skjalatýpur',
  },
  allowedFileTypes: {
    id: 'portals-admin.form-system:allowed-file-types',
    defaultMessage: 'Eftirfarandi skjalatýpur eru leyfðar',
  },
  // Input types
  bankAccount: {
    id: 'portals-admin.form-system:bank-account',
    defaultMessage: 'Bankareikningur',
  },
  bank: {
    id: 'portals-admin.form-system:bank',
    defaultMessage: 'Banki',
  },
  ledger: {
    id: 'portals-admin.form-system:ledger',
    defaultMessage: 'Höfuðbók',
  },
  accountNumber: {
    id: 'portals-admin.form-system:account-number',
    defaultMessage: 'Reikningsnúmer',
  },
  datePicker: {
    id: 'portals-admin.form-system:date-picker',
    defaultMessage: 'Dagsetningarval',
  },
  propertyNumber: {
    id: 'portals-admin.form-system:property-number',
    defaultMessage: 'Fasteignanúmer',
  },
  dropdownList: {
    id: 'portals-admin.form-system:dropdown-list',
    defaultMessage: 'Fellilisti',
  },
  listBuilder: {
    id: 'portals-admin.form-system:list-builder',
    defaultMessage: 'Listasmiður',
  },
  homestayNumber: {
    id: 'portals-admin.form-system:homestay-number',
    defaultMessage: 'Heimagistingarnúmer',
  },
  homestayOverview: {
    id: 'portals-admin.form-system:homestay-overview',
    defaultMessage: 'Heimagistingaryfirlit',
  },
  timeInput: {
    id: 'portals-admin.form-system:time-input',
    defaultMessage: 'Klukkinnsláttur',
  },
  iskNumberBox: {
    id: 'portals-admin.form-system:currency-number',
    defaultMessage: 'Krónutölubox',
  },
  iskSumBox: {
    id: 'portals-admin.form-system:currency-sum',
    defaultMessage: 'Krónutölusamtala',
  },
  textBox: {
    id: 'portals-admin.form-system:text-box',
    defaultMessage: 'Textainnsláttur',
  },
  message: {
    id: 'portals-admin.form-system:message',
    defaultMessage: 'Textalýsing',
  },
  // Labels and placeholders
  maxFileSize: {
    id: 'portals-admin.form-system:max-file-size',
    defaultMessage: 'Hámarksstærð skráa',
  },
  selectMaxFileSize: {
    id: 'portals-admin.form-system:select-max-file-size',
    defaultMessage: 'Veldu hámarksstærð',
  },
  maxFileAmount: {
    id: 'portals-admin.form-system:max-file-amount',
    defaultMessage: 'Hámarksfjöldi skráa',
  },
  selectMaxFileAmount: {
    id: 'portals-admin.form-system:select-max-file-amount',
    defaultMessage: 'Veldu hámarksfjölda',
  },
  previewAllowedFileTypes: {
    id: 'portals-admin.form-system:preview-allowed-file-types',
    defaultMessage: 'Eftirfarandi skjalatýpur eru leyfðar',
  },
  fileUploadButton: {
    id: 'portals-admin.form-system:file-upload-button',
    defaultMessage: 'Veldu skjöl til að hlaða upp',
  },
  customList: {
    id: 'portals-admin.form-system:custom-list',
    defaultMessage: 'Nýr fellilisti',
  },
  predeterminedLists: {
    id: 'portals-admin.form-system:predetermined-lists',
    defaultMessage: 'Tilbúnir fellilistar',
  },
  max120Days: {
    id: 'portals-admin.form-system:max-120-days',
    defaultMessage: 'Hámark 120 daga',
  },
  chooseDate: {
    id: 'portals-admin.form-system:choose-date',
    defaultMessage: 'Veldu dagsetningu',
  },
  chooseListType: {
    id: 'portals-admin.form-system:choose-list-type',
    defaultMessage: 'Veldu lista tegund',
  },
  addLink: {
    id: 'portals-admin.form-system:add-link',
    defaultMessage: 'Bæta við hlekk',
  },
  buttonText: {
    id: 'portals-admin.form-system:button-text',
    defaultMessage: 'Hnappatexti',
  },
  buttonTextEnglish: {
    id: 'portals-admin.form-system:button-text-english',
    defaultMessage: 'Hnappatexti (enska)',
  },
  url: {
    id: 'portals-admin.form-system:url',
    defaultMessage: 'Vefslóð',
  },
  largeTextArea: {
    id: 'portals-admin.form-system:large-text-area',
    defaultMessage: 'Stór textasvæði',
  },
  connect: {
    id: 'portals-admin.form-system:connect',
    defaultMessage: 'Tengja',
  },
  selected: {
    id: 'portals-admin.form-system:selected',
    defaultMessage: 'Sjálfvalið',
  },
  info: {
    id: 'portals-admin.form-system:info',
    defaultMessage: 'Upplýsingabóla',
  },
  infoEnglish: {
    id: 'portals-admin.form-system:info-english',
    defaultMessage: 'Upplýsingabóla (enska)',
  },
  addListItem: {
    id: 'portals-admin.form-system:add-list-item',
    defaultMessage: '+ Bæta við gildi',
  },
  finish: {
    id: 'portals-admin.form-system:finish',
    defaultMessage: 'Ljúka',
  },
  type: {
    id: 'portals-admin.form-system:type',
    defaultMessage: 'Tegund',
  },
  chooseType: {
    id: 'portals-admin.form-system:choose-type',
    defaultMessage: 'Veldu tegund',
  },
  required: {
    id: 'portals-admin.form-system:required',
    defaultMessage: 'Krafist',
  },
  email: {
    id: 'portals-admin.form-system:email',
    defaultMessage: 'Netfang',
  },
  namePerson: {
    id: 'portals-admin.form-system:name-person',
    defaultMessage: 'Nafn',
  },
  suggestions: {
    id: 'portals-admin.form-system:suggestions',
    defaultMessage: 'Tillögur',
  },
  preview: {
    id: 'portals-admin.form-system:preview',
    defaultMessage: 'Skoða',
  },
  lastModified: {
    id: 'portals-admin.form-system:last-modified',
    defaultMessage: 'Síðast breytt',
  },
  translations: {
    id: 'portals-admin.form-system:translations',
    defaultMessage: 'Þýðingar',
  },
  number: {
    id: 'portals-admin.form-system:number',
    defaultMessage: 'Númer',
  },
  actions: {
    id: 'portals-admin.form-system:actions',
    defaultMessage: 'Aðgerðir',
  },
  edit: {
    id: 'portals-admin.form-system:edit',
    defaultMessage: 'Breyta',
  },
  copy: {
    id: 'portals-admin.form-system:copy',
    defaultMessage: 'Afrita',
  },
  translateToEnglish: {
    id: 'portals-admin.form-system:translate-to-english',
    defaultMessage: 'Þýðing enska',
  },
  getUrl: {
    id: 'portals-admin.form-system:get-url',
    defaultMessage: 'Sækja slóð',
  },
  getJson: {
    id: 'portals-admin.form-system:get-json',
    defaultMessage: 'Sækja JSON',
  },
  // Error messages
  invalidEmail: {
    id: 'portals-admin.form-system:invalid-email',
    defaultMessage: 'Ógilt netfang',
  },
  maxFileError: {
    id: 'portals-admin.form-system:max-file-error',
    defaultMessage: 'Hámarksfjöldi skráa er',
  },
  nationalId: {
    id: 'portals-admin.form-system:national-id',
    defaultMessage: 'Kennitala',
  },
})
