import { defineMessages } from 'react-intl'

export const spmm = defineMessages({
  genderFemale: {
    id: 'sp.family:gender-female',
    defaultMessage: 'Kona',
  },
  genderFemaleMinor: {
    id: 'sp.family:gender-female-minor',
    defaultMessage: 'Stúlka',
  },
  genderMale: {
    id: 'sp.family:gender-male',
    defaultMessage: 'Karl',
  },
  genderMaleMinor: {
    id: 'sp.family:gender-male-minor',
    defaultMessage: 'Drengur',
  },
  genderTransgender: {
    id: 'sp.family:gender-transgender',
    defaultMessage: 'Kynsegin',
  },
  genderUnknown: {
    id: 'sp.family:gender-unknown',
    defaultMessage: 'Ekki vitað',
  },
  child: {
    id: 'sp.family:child',
    defaultMessage: 'Barn',
  },
  parent: {
    id: 'sp.family:parent',
    defaultMessage: 'Foreldri',
  },
  spouse: {
    id: 'sp.family:spouse',
    defaultMessage: 'Maki',
  },
  maritalStatusDivorced: {
    id: 'sp.family:marital-status-divorced',
    defaultMessage: 'Skilin(n) að lögum',
  },
  maritalStatusForeignResidence: {
    id: 'sp.family:marital-status-foreign-residence',
    defaultMessage:
      'Íslendingur með lögheimili erlendis; í hjúskap með útlendingi sem ekki er á skrá',
  },
  maritalStatusIcelandicResidence: {
    id: 'sp.family:marital-status-icelandic-residence',
    defaultMessage:
      'Íslendingur með lögheimili á Íslandi (t.d. námsmaður eða sendiráðsmaður); í hjúskap með útlendingi sem ekki er á skrá',
  },
  maritalStatusMarried: {
    id: 'sp.family:marital-status-married',
    defaultMessage: 'Gift/ur eða staðfest samvist',
  },
  maritalStatusMarriedLivingSep: {
    id: 'sp.family:marital-status-living-sep',
    defaultMessage: 'Hjón ekki í samvistum',
  },
  maritalStatusMarriedToForeign: {
    id: 'sp.family:marital-status-married-to-foreign',
    defaultMessage:
      'Íslendingur í hjúskap með útlendingi sem nýtur úrlendisréttar og verður því ekki skráður (t.d. varnarliðsmaður eða sendiráðsmaður)',
  },
  maritalStatusSeparated: {
    id: 'sp.family:marital-status-separated',
    defaultMessage: 'Skilin(n) að borði og sæng',
  },
  maritalStatusUnknown: {
    id: 'sp.family:marital-status-unknown',
    defaultMessage: 'Hjúskaparstaða óupplýst',
  },
  maritalStatusUnmarried: {
    id: 'sp.family:marital-status-unmarried',
    defaultMessage: 'Ógift/ur',
  },
  maritalStatusWidowed: {
    id: 'sp.family:marital-status-widowed',
    defaultMessage: 'Ekkill, ekkja',
  },
  userInfoDesc: {
    id: 'sp.family:user-info-description',
    defaultMessage:
      'Hér eru gögn um þig og fjölskyldu þína sem sótt eru til Þjóðskrár. Með því að smella á skoða upplýsingar er hægt að óska eftir breytingum á þeim upplýsingum.',
  },
  userFamilyMembersOnNumber: {
    id: 'sp.family:user-famly-on-nr',
    defaultMessage: 'Einstaklingar með sömu lögheimilistengsl',
  },
  childRegisterSuccess: {
    id: 'sp.family:child-registration-generic-success',
    defaultMessage: 'Athugasemd send til þjóðskrár',
  },
  childRegisterError: {
    id: 'sp.family:child-registration-generic-error',
    defaultMessage:
      'Villa við innsendingu á formi. Vinsamlegast reynið aftur síðar',
  },
  childRegisterModalButton: {
    id: 'sp.family:child-registration-modal-button',
    defaultMessage: 'Gera athugasemd við skráningu',
  },
  childRegisterRegistrationText: {
    id: 'sp.family:child-registration-text',
    defaultMessage: 'Athugasemdir vegna skráningar barns',
  },
  childRegisterParentName: {
    id: 'sp.family:child-registration-parent-name',
    defaultMessage: 'Nafn þess sem tilkynnir ranga skráningu: ',
  },
  childRegisterParentSSN: {
    id: 'sp.family:child-registration-parent-id',
    defaultMessage: 'Kennitala þess sem tilkynnir ranga skráningu: ',
  },
  childRegisterName: {
    id: 'sp.family:child-registration-name',
    defaultMessage: 'Nafn barns sem tilkynning á við: ',
  },
  childRegisterSSN: {
    id: 'sp.family:child-registration-ssn',
    defaultMessage: 'Kennitala barns sem tilkynning á við: ',
  },
  childRegisterSend: {
    id: 'sp.family:child-registration-send',
    defaultMessage: 'Senda tilkynningu',
  },
  givenName: {
    id: 'sp.family:person-given-name',
    defaultMessage: 'Eiginnafn',
  },
  middleName: {
    id: 'sp.family:person-middle-name',
    defaultMessage: 'Millinafn',
  },
  lastName: {
    id: 'sp.family:person-last-name',
    defaultMessage: 'Kenninafn',
  },
})

export const mCompany = defineMessages({
  subtitle: {
    id: 'sp.company:company-subtitle',
    defaultMessage:
      'Hér má nálgast upplýsingar úr fyrirtækjaskrá hjá Skattinum.',
  },
  name: {
    id: 'sp.company:name',
    defaultMessage: 'Nafn fyrirtækis',
  },
  registration: {
    id: 'sp.company:registration',
    defaultMessage: 'Stofnað/Skráð',
  },
  taxNr: {
    id: 'sp.company:tax-number',
    defaultMessage: 'Virðisaukaskattsnúmer',
  },
  operationForm: {
    id: 'sp.company:operation-form',
    defaultMessage: 'Rekstrarform',
  },
  industryClass: {
    id: 'sp.company:idustry-class',
    defaultMessage: 'ÍSAT Atvinnugreinaflokkun',
  },
})
