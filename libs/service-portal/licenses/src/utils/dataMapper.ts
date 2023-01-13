import { m } from '../lib/messages'

interface Category {
  id:
    | 'A'
    | 'AM'
    | 'A1'
    | 'A2'
    | 'B'
    | 'Ba'
    | 'BE'
    | 'Bff'
    | 'C'
    | 'CE'
    | 'Ca'
    | 'C1'
    | 'C1a'
    | 'C1E'
    | 'D'
    | 'DE'
    | 'D1'
    | 'Da'
    | 'D1a'
    | 'D1E'
    | 'T'

  color:
    | 'blue'
    | 'darkerBlue'
    | 'purple'
    | 'white'
    | 'red'
    | 'mint'
    | 'rose'
    | 'blueberry'
  name: string

  text: string | undefined

  icon?: 'A' | 'AM' | 'B' | 'BE' | 'C' | 'CE' | 'D' | 'DE'
}

const categoryText = [
  {
    id: 'A',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<p>bifhjóli, en undir það flokkast</p>' +
      "<ol type='a'>" +
      '<li>bifhjól á þremur hjólum með meira afl en 15 kW,</li>' +
      '<li>ökutæki sem flokkast undir A2-flokk og</li>' +
      '<li>tvíhjóla bifhjól án hliðarvagns þar sem hlutfall vélarafls og eigin þyngdar fer yfir 0,2 kW/kg, eða vélarafl fer yfir 35 kW.</li>' +
      '</ol>' +
      '</div>',
  },
  {
    id: 'AM',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<p>léttu bifhjóli á tveimur eða þremur hjólum, með vélarstærð ekki yfir 50cc ekki hannað fyrir meiri hraða en 45 km.</p>' +
      '</div>',
  },
  {
    id: 'A1',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<p>bifhjóli á tveimur hjólum, með eða án hliðarvagns með slagrými sem er ekki yfir 125 sm³, með afl sem er ekki yfir 11 kW og með afl/þyngdar-hlutfall sem er ekki yfir 0,1 kW/kg, einnig bifhjóli á þremur hjólum með afl sem er ekki yfir 15 kW, réttindi í AM-flokki fylgir.</p>' +
      '</div>',
  },
  {
    id: 'A2',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<p>bifhjóli, en undir það flokkast</p>' +
      "<ol type='a'>" +
      '<li>tvíhjóla bifhjól með eða án hliðarvagns þar sem hlutfall vélarafls og eigin þyngdar fer ekki yfir 0,2kW/kg. Þá má vélarafl bifhjólsins ekki fara yfir 35 kW,</li>' +
      '<li>ökutæki í AM og A1-flokki og</li>' +
      '<li>torfærutæki s.s. vélsleða.</li>' +
      '</ol>' +
      '</div>',
  },
  {
    id: 'B',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<p>bifreið sem gerð er fyrir 8 farþega eða færri auk ökumanns og er 3.500 kg eða minna að leyfðri heildarþyngd sem tengja má við:</p>' +
      '<ol>' +
      '<li>eftirvagn/tengitæki sem er 750 kg eða minna að leyfðri heildarþyngd eða</li>' +
      '<li>eftirvagn/tengitæki sem er meira en 750 kg að leyfðri heildarþyngd enda sé vagnlest 3.500 kg eða minna að leyfðri heildarþyngd,</li>' +
      '<li>bifhjóli á fjórum eða fleiri hjólum</li>' +
      '<li>léttu bifhjóli í AM-flokki,</li>' +
      '<li>bifhjóli á þremur hjólum í A1-, A2- eða A-flokki með þeirri takmörkun að sá sem er yngri en 21 árs má ekki stjórna slíku bifhjóli með afl yfir 15 kW,</li>' +
      '<li>dráttarvél í T-flokki</li>' +
      '<li>vinnuvél (akstur á vegum) og</li>' +
      '<li>torfærutæki, s.s. vélsleða.</li>' +
      '</ol>' +
      '</div>',
  },
  {
    id: 'BE',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<p>bifreið í B-flokki með eftirvagn/tengitæki sem er ekki meira en 3.500 kg að leyfðri heildarþyngd.</p>' +
      '</div>',
  },
  {
    id: 'C',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<p>bifreið sem gerð er fyrir 8 farþega eða færri auk ökumanns og er meira en 3.500 kg að leyfðri heildarþyngd sem tengja má við eftirvagn/tengitæki sem er 750 kg eða minna að leyfðri heildarþyngd.</p>' +
      '</div>',
  },
  {
    id: 'C1',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<p>bifreið sem gerð er fyrir 8 farþega eða færri auk ökumanns og er meira en 3.500 kg en ekki meira en 7.500 kg að leyfðri heildarþyngd sem tengja má við eftirvagn/tengitæki sem er 750 kg eða minna að leyfðri heildarþyngd.</p>' +
      '</div>',
  },
  {
    id: 'CE',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<p>bifreið í C-flokki með eftirvagn/tengitæki sem er meira en 750 kg að leyfðri heildarþyngd.</p>' +
      '</div>',
  },
  {
    id: 'C1E',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<ol>' +
      '<li>bifreið í C1-flokki með eftirvagn/tengitæki meira en 750 kg að leyfðri heildarþyngd og má leyfð heildarþyngd vagnlestar ekki vera meiri en 12.000 kg og</li>' +
      '<li>bifreið í B-flokki með eftirvagn/tengitæki meira en 3.500 kg að leyfðri heildarþyngd og má leyfð heildarþyngd vagnlestar ekki vera meiri en 12.000 kg.</li>' +
      '</ol>' +
      '</div>',
  },
  {
    id: 'D',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<p>bifreið sem gerð er fyrir fleiri en 8 farþega auk ökumanns sem tengja má við eftirvagn/tengitæki sem er 750 kg eða minna að leyfðri heildarþyngd.</p>' +
      '</div>',
  },
  {
    id: 'D1',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<p>bifreið sem er ekki lengri en 8 m og gerð er fyrir 16 farþega eða færri auk ökumanns sem tengja má við eftirvagn/tengitæki sem er 750 kg eða minna að leyfðri heildarþyngd.</p>' +
      '</div>',
  },
  {
    id: 'DE',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<p>bifreið í D-flokki með eftirvagn/tengitæki sem er meira en 750 kg að leyfðri heildarþyngd.</p>' +
      '</div>',
  },
  {
    id: 'D1E',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<p>bifreið í D1-flokki með eftirvagn/tengitæki sem er meira en 750 kg að leyfðri heildarþyngd.</p>' +
      '</div>',
  },
  {
    id: 'T',
    text:
      '<div>' +
      '<p>Veitir rétt til að stjórna:</p>' +
      '<p>dráttarvél í almennri umferð með eftirvagn/tengitæki.</p>' +
      '</div>',
  },
  {
    id: '400',
    text:
      '<div>' +
      '<p>Veitir rétt til farþegaflutninga í atvinnuskyni á fólksbifreið. Réttinda aflað frá og með 1. mars 1988 án hópbifreiðaréttinda (D- eða D 1-flokks). Farþegafjöldi að hámarki 8 farþegar.</p>' +
      '</div>',
  },
  {
    id: '425',
    text:
      '<div>' +
      '<p>Veitir rétt til farþegaflutninga í atvinnuskyni á hópbifreið. Farþegafjöldi meira en 8 farþegar.</p>' +
      '</div>',
  },
  {
    id: '450',
    text:
      '<div>' +
      '<p>Veitir rétt til farþegaflutninga í atvinnuskyni á fólks- og hópbifreið. Farþegafjöldi ótakmarkaður eða farþegar að hámarki 16 ef leigubifreiðaréttinda var aflað fyrir 1. mars 1988 án hópbifreiðaréttinda (D-flokks).</p>' +
      '</div>',
  },
  {
    id: '100',
    text:
      '<div>' +
      '<p>Réttindi á fólksbifreið þyngri en 3.500 að leyfðri heildarþyngd t.d. húsbíla.</p>' +
      '</div>',
  },
  {
    id: '110',
    text:
      '<div>' +
      '<p>Réttindi á vörubifreið skráð fyrir allt að 5 tonna burðargetu.</p>' +
      '</div>',
  },
  {
    id: '900',
    text: '<div>' + '<p>Líffæragjafi.</p>' + '</div>',
  },
  {
    id: '95',
    text:
      '<div>' +
      '<p>Veitir rétt til vöru- og farþegaflutninga í atvinnuskyni.</p>' +
      '</div>',
  },
]

export const mapCategory = (id: string): Category => {
  switch (id) {
    case 'A':
      return {
        id,
        color: 'rose',
        name: 'Bifhjól',
        text: categoryText.find((x) => x.id === 'A')?.text ?? undefined,
        icon: 'A',
      }

    case 'AM':
      return {
        id,
        color: 'rose',
        name: 'Létt bifhjól',
        text: categoryText.find((x) => x.id === 'AM')?.text ?? undefined,
        icon: 'AM',
      }

    case 'A1':
      return {
        id,
        color: 'rose',
        name: 'Bifhjól',
        text: categoryText.find((x) => x.id === 'A1')?.text ?? undefined,
        icon: 'AM',
      }

    case 'A2':
      return {
        id,
        color: 'rose',
        name: 'Bifhjól',
        text: categoryText.find((x) => x.id === 'A2')?.text ?? undefined,
        icon: 'AM',
      }

    case 'B':
      return {
        id,
        color: 'purple',
        name: 'Fólksbifreið',
        text: categoryText.find((x) => x.id === 'B')?.text ?? undefined,
        icon: 'B',
      }
    case 'BE':
      return {
        id,
        color: 'purple',
        name: 'Fólksbifreið með eftirvagn',
        text: categoryText.find((x) => x.id === 'BE')?.text ?? undefined,
        icon: 'BE',
      }

    case 'Ba':
      return {
        id,
        color: 'mint',
        name: 'Fólksbifreið í atvinnuskyni',
        text: categoryText.find((x) => x.id === 'Ba')?.text ?? undefined,
        icon: 'B',
      }

    case 'Bff':
      return {
        id,
        color: 'mint',
        name: 'Leigubifreið',
        text: categoryText.find((x) => x.id === 'Bff')?.text ?? undefined,
        icon: 'B',
      }

    case 'C':
      return {
        id,
        color: 'blue',
        name: 'Vörubifreið',
        text: categoryText.find((x) => x.id === 'C')?.text ?? undefined,
        icon: 'C',
      }

    case 'CE':
      return {
        id,
        color: 'blue',
        name: 'Vörubifreið með eftirvagn',
        text: categoryText.find((x) => x.id === 'CE')?.text ?? undefined,
        icon: 'CE',
      }

    case 'C1':
      return {
        id,
        color: 'blue',
        name: 'Lítil vörubifreið',
        text: categoryText.find((x) => x.id === 'C1')?.text ?? undefined,
        icon: 'C',
      }

    case 'C1E':
      return {
        id,
        color: 'blue',
        name: 'Lítil vörubifreið með eftirvagn',
        text: categoryText.find((x) => x.id === 'C1E')?.text ?? undefined,
        icon: 'CE',
      }

    case 'Ca':
      return {
        id,
        color: 'mint',
        name: 'Vörubifreið í atvinnuskyni',
        text: categoryText.find((x) => x.id === 'Ca')?.text ?? undefined,
        icon: 'C',
      }

    case 'C1a':
      return {
        id,
        color: 'mint',
        name: 'Lítil vörubifreið í atvinnuskyni',
        text: categoryText.find((x) => x.id === 'C1a')?.text ?? undefined,
        icon: 'C',
      }

    case 'D':
      return {
        id,
        color: 'red',
        name: 'Hópbifreið',
        text: categoryText.find((x) => x.id === 'D')?.text ?? undefined,
        icon: 'D',
      }

    case 'DE':
      return {
        id,
        color: 'red',
        name: 'Hópbifreið með eftirvagn',
        text: categoryText.find((x) => x.id === 'DE')?.text ?? undefined,
        icon: 'DE',
      }

    case 'D1':
      return {
        id,
        color: 'red',
        name: 'Lítil hópbifreið',
        text: categoryText.find((x) => x.id === 'D1')?.text ?? undefined,
        icon: 'D',
      }

    case 'D1E':
      return {
        id,
        color: 'red',
        name: 'Lítil hópbifreið með eftirvagn',
        text: categoryText.find((x) => x.id === 'D1E')?.text ?? undefined,
        icon: 'DE',
      }

    case 'Da':
      return {
        id,
        color: 'mint',
        name: 'Hópbifreið í atvinnuskyni',
        text: categoryText.find((x) => x.id === 'Da')?.text ?? undefined,
        icon: 'D',
      }

    case 'D1a':
      return {
        id,
        color: 'mint',
        name: 'Lítil hópbifreið í atvinnuskyni',
        text: categoryText.find((x) => x.id === 'D1a')?.text ?? undefined,
        icon: 'D',
      }

    case 'T':
      return {
        id,
        color: 'blueberry',
        name: 'Dráttarvél',
        text: categoryText.find((x) => x.id === 'T')?.text ?? undefined,
        icon: undefined,
      }

    default:
      return {
        id: id as Category['id'],
        color: 'white',
        name: id,
        text: undefined,
        icon: undefined,
      }
  }
}

enum LicenseType {
  DriversLicense = 'DriversLicense',
  HuntingLicense = 'HuntingLicense',
  AdrLicense = 'AdrLicense',
  MachineLicense = 'MachineLicense',
  FirearmLicense = 'FirearmLicense',
  DisabilityLicense = 'DisabilityLicense',
}
enum LicenseProviderId {
  NationalPoliceCommissioner = 'NationalPoliceCommissioner',
  EnvironmentAgency = 'EnvironmentAgency',
  AdministrationOfOccupationalSafetyAndHealth = 'AdministrationOfOccupationalSafetyAndHealth',
  SocialInsuranceAdministration = 'SocialInsuranceAdministration',
}
enum LicenseProviderPath {
  vinnueftirlitid = 'vinnueftirlitid',
  umhverfisstofnun = 'umhverfisstofnun',
  rikislogreglustjori = 'rikislogreglustjori',
  tryggingastofnun = 'tryggingastofnun',
}

export const getLicenseDetailHeading = (type: string) => {
  switch (type) {
    case LicenseType.DriversLicense:
      return {
        title: m.yourDrivingLicense,
        text: m.drivingLicenseDescription,
      }
      break
    case LicenseType.AdrLicense:
      return { title: m.yourADRLicense, text: m.adrLicenseDescription }
      break
    case LicenseType.MachineLicense:
      return {
        title: m.yourMachineLicense,
        text: m.machineLicenseDescription,
      }
      break
    case LicenseType.FirearmLicense:
      return {
        title: m.yourFirearmLicense,
        text: m.firearmLicenseDescription,
      }
      break
    case LicenseType.DisabilityLicense:
      return {
        title: m.yourDisabilityicense,
        text: m.disabilityLicenseDescription,
      }
      break
    default:
      return {
        title: m.license,
        text: '',
      }
      break
  }
}
export const getTitleAndLogo = (type: string) => {
  switch (type) {
    case LicenseType.DriversLicense:
      return { title: m.drivingLicense, logo: './assets/images/rls.svg' }
    case LicenseType.AdrLicense:
      return {
        title: m.ADRLicense,
        logo: './assets/images/adr_machine.svg',
      }
    case LicenseType.MachineLicense:
      return {
        title: m.machineLicense,
        logo: './assets/images/adr_machine.svg',
      }

    case LicenseType.FirearmLicense:
      return {
        title: m.firearmLicense,
        logo: './assets/images/rls.svg',
      }
    case LicenseType.DisabilityLicense:
      return {
        title: m.disabilityLicense,
        logo: './assets/images/tr.svg',
      }
    default:
      return { title: m.license, logo: './assets/images/island.svg' }
  }
}

enum LicenseTypePath {
  okurettindi = 'okurettindi',
  skotvopnaleyfi = 'skotvopnaleyfi',
  adrrettindi = 'adrrettindi',
  vinnuvelarettindi = 'vinnuvelarettindi',
  ororkuskirteini = 'ororkuskirteini',
}

export const getPathFromType = (type: string) => {
  switch (type) {
    case LicenseType.AdrLicense:
      return LicenseTypePath.adrrettindi
      break
    case LicenseType.DriversLicense:
      return LicenseTypePath.okurettindi
      break
    case LicenseType.FirearmLicense:
      return LicenseTypePath.skotvopnaleyfi
      break
    case LicenseType.MachineLicense:
      return LicenseTypePath.vinnuvelarettindi
      break
    case LicenseType.DisabilityLicense:
      return LicenseTypePath.ororkuskirteini
      break
    default:
      return ''
      break
  }
}

export const getTypeFromPath = (path: string) => {
  switch (path) {
    case LicenseTypePath.adrrettindi:
      return LicenseType.AdrLicense
      break
    case LicenseTypePath.okurettindi:
      return LicenseType.DriversLicense
      break
    case LicenseTypePath.skotvopnaleyfi:
      return LicenseType.FirearmLicense
      break
    case LicenseTypePath.vinnuvelarettindi:
      return LicenseType.MachineLicense
      break
    case LicenseTypePath.ororkuskirteini:
      return LicenseType.DisabilityLicense
      break
    default:
      return undefined
      break
  }
}

export const getPathFromProviderId = (id: string) => {
  switch (id) {
    case LicenseProviderId.AdministrationOfOccupationalSafetyAndHealth:
      return LicenseProviderPath.vinnueftirlitid
      break
    case LicenseProviderId.EnvironmentAgency:
      return LicenseProviderPath.umhverfisstofnun
      break
    case LicenseProviderId.NationalPoliceCommissioner:
      return LicenseProviderPath.rikislogreglustjori
      break
    case LicenseProviderId.SocialInsuranceAdministration:
      return LicenseProviderPath.tryggingastofnun
      break
    default:
      return ''
      break
  }
}
