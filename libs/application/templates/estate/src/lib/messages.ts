import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // Application begin
  institutionName: {
    id: 'es.application:institution.name',
    defaultMessage: 'Sýslumenn',
    description: 'Institution name',
  },
  draftTitle: {
    id: 'es.application:draft.title',
    defaultMessage: 'Drög',
    description: 'Draft title',
  },
  draftDescription: {
    id: 'es.application:draft.description',
    defaultMessage: 'Drög að ólokinni umsókn',
    description: 'Draft description',
  },
  // Application end

  // Prereqs title
  prerequisitesTitle: {
    id: 'es.application:prerequisitesTitle',
    defaultMessage: 'Ákvörðun um skipti dánarbús',
    description: '',
  },
  prerequisitesSubtitle: {
    id: 'es.application:prerequisitesSubtitle#markdown',
    defaultMessage:
      'Við skipti á dánarbúi er hægt að fara fjórar leiðir. Velja þarf eina leið samanber eftirfarandi:',
    description: '',
  },
  institution: {
    id: 'es.application:institution',
    defaultMessage: 'Sýslumenn',
    description: '',
  },
  confirmButton: {
    id: 'es.application:confirmButton',
    defaultMessage: 'Staðfesta',
    description: '',
  },

  // Data collection - external data providers
  dataCollectionTitle: {
    id: 'es.application:dataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: '',
  },
  dataCollectionSubtitle: {
    id: 'es.application:dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: '',
  },
  dataCollectionCheckbox: {
    id: 'es.application:dataCollectionCheckbox',
    defaultMessage: 'Ég skil að ofangreindra gagna verður aflað',
    description: '',
  },
  dataCollectionNoEstatesError: {
    id: 'es.application:dataCollectionNoEstatesError',
    defaultMessage:
      'Þú ert ekki skráð/ur fyrir dánarbúi hjá sýslumanni. Ef þú telur svo vera skaltu hafa samband við sýslumann.',
    description:
      'User not eligible for estate or no estates found bound to their national id',
  },
  deceasedInfoProviderTitle: {
    id: 'es.application:deceasedInfoProviderTitle',
    defaultMessage: 'Upplýsingar um hinn látna',
    description: '',
  },
  deceasedInfoProviderSubtitle: {
    id: 'es.application:deceasedInfoProviderSubtitle',
    defaultMessage:
      'Upplýsingar frá sýslumanni um kennitölu, dánardag, lögheimili, erfingja, eignir og hvort arfleifandi hafi skilað inn erfðaskrá eða gert kaupmála.',
    description: '',
  },
  personalInfoProviderTitle: {
    id: 'es.application:personalInfoProviderTitle',
    defaultMessage: 'Persónuupplýsingar um þig',
    description: '',
  },
  personalInfoProviderSubtitle: {
    id: 'es.application:personalInfoProviderSubtitle',
    defaultMessage: 'Upplýsingar frá Þjóðskrá um kennitölu og lögheimili.',
    description: '',
  },
  settingsInfoProviderTitle: {
    id: 'es.application:settingsInfoProviderTitle',
    defaultMessage: 'Stillingar frá Ísland.is',
    description: '',
  },
  settingsInfoProviderSubtitle: {
    id: 'es.application:settingsInfoProviderSubtitle',
    defaultMessage: 'Persónustillingar þínar (sími og netfang) frá Ísland.is.',
    description: '',
  },

  // The deceased
  theDeceased: {
    id: 'es.application:theDeceased',
    defaultMessage: 'Hinn látni',
    description: '',
  },
  nameOfTheDeceased: {
    id: 'es.application:nameOfTheDeceased',
    defaultMessage: 'Nafn hins látna',
    description: '',
  },
  deathDate: {
    id: 'es.application:deathDate',
    defaultMessage: 'Dánardagur',
    description: '',
  },
  deathDateNotRegistered: {
    id: 'es.application:deathDateNotRegistered',
    defaultMessage: 'Dánardagur ekki skráður',
    description: '',
  },

  // Applicant
  announcer: {
    id: 'es.application:announcer',
    defaultMessage: 'Tilkynnandi',
    description: '',
  },
  announcerNoAssets: {
    id: 'es.application:announcerNoAssets',
    defaultMessage: 'Yfirlýsandi eignaleysis',
    description: '',
  },
  announcerPermitToPostpone: {
    id: 'es.application:announcerPermitToPostpone',
    defaultMessage: 'Umsækjandi um leyfi til setu í óskiptu búi',
    description: '',
  },
  announcerPTP: {
    id: 'es.application:announcerPTP',
    defaultMessage: 'Umsækjandi',
    description: '',
  },
  applicantsInfoSubtitle: {
    id: 'es.application:applicantsInfoSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og athugaðu hvort þær séu réttar.',
    description: '',
  },
  name: {
    id: 'es.application:name',
    defaultMessage: 'Nafn',
    description: '',
  },
  nationalId: {
    id: 'es.application:nationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  address: {
    id: 'es.application:address',
    defaultMessage: 'Lögheimili',
    description: '',
  },
  phone: {
    id: 'es.application:phone',
    defaultMessage: 'Símanúmer',
    description: '',
  },
  email: {
    id: 'es.application:email',
    defaultMessage: 'Netfang',
    description: '',
  },

  // Estate members, assets, vehicles
  estateMembersTitle: {
    id: 'es.application:estateMembersTitle',
    defaultMessage: 'Erfingjar',
    description: '',
  },
  estateMembersSubtitle: {
    id: 'es.application:estateMembersSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og athugaðu hvort þær séu réttar.',
    description: '',
  },
  estateMembers: {
    id: 'es.application:estateMembers',
    defaultMessage: 'Erfingjar',
    description: '',
  },
  estateMember: {
    id: 'es.application:estateMember',
    defaultMessage: 'Erfingi',
    description: '',
  },
  estateMemberAdvocateWarningTitle: {
    id: 'es.application:estateMemberAdvocateWarningTitle',
    defaultMessage: 'Vinsamlegast athugið',
    description: '',
  },
  estateMemberAdvocateWarningDescription: {
    id: 'es.application:estateMemberAdvocateWarningDescription',
    defaultMessage:
      'Þegar viðkomandi aðili nær ekki 18 ára aldri, þarf að skrá málsvara fyrir hans hönd.',
    description: '',
  },
  estateMembersHeaderDescription: {
    id: 'es.application:estateMembersHeaderDescription',
    defaultMessage: 'Vantar uppl hér',
    description: '',
  },
  willsInCustody: {
    id: 'es.application:willsInCustody',
    defaultMessage: 'Erfðaskrá í vörslu sýslumanns',
    description: '',
  },
  agreements: {
    id: 'es.application:agreements',
    defaultMessage: 'Kaupmáli',
    description: '',
  },
  otherWills: {
    id: 'es.application:otherWills',
    defaultMessage: 'Vitneskja um aðra erfðaskrá',
    description: '',
  },
  properties: {
    id: 'es.application:properties',
    defaultMessage: 'Eignir',
    description: '',
  },
  propertiesTitle: {
    id: 'es.application:propertiesTitle',
    defaultMessage: 'Innlendar og erlendar eignir á dánardegi hins látna',
    description: '',
  },
  propertiesDescription: {
    id: 'es.application:propertiesDescription',
    defaultMessage: 'Tilgreina skal allar hjúskapareignir beggja hjóna.',
    description: '',
  },
  realEstate: {
    id: 'es.application:realEstate',
    defaultMessage: 'Fasteignir',
    description: '',
  },
  realEstateRepeaterHeader: {
    id: 'es.application:realEstateRepeaterHeader',
    defaultMessage: 'Fasteign',
    description: '',
  },
  realEstateDescription: {
    id: 'es.application:realEstateDescription',
    defaultMessage: 'Til dæmis íbúðarhús, sumarhús, lóðir og jarðir',
    description: '',
  },
  inventoryTitle: {
    id: 'es.application:inventoryTitle',
    defaultMessage: 'Innbú',
    description: '',
  },
  inventoryDescription: {
    id: 'es.application:inventoryDescription',
    defaultMessage: 'Til dæmis bækur og málverk',
    description: '',
  },
  inventoryTextField: {
    id: 'es.application:inventoryTextField',
    defaultMessage: 'Upplýsingar um innbú',
    description: '',
  },
  inventoryValueTitle: {
    id: 'es.application:inventoryValueTitle',
    defaultMessage: 'Matsverð samtals',
    description: '',
  },
  inventoryTextFieldPlaceholder: {
    id: 'es.application:inventoryTextFieldPlaceholder',
    defaultMessage: 'Skráðu inn upplýsingar um innbú hér',
    description: '',
  },
  vehicles: {
    id: 'es.application:vehicles',
    defaultMessage: 'Farartæki',
    description: '',
  },
  vehiclesDescription: {
    id: 'es.application:vehiclesDescription',
    defaultMessage: 'Til dæmis ökutæki, flugvélar og skip.',
    description: '',
  },

  // Bank Info
  estateBankInfo: {
    id: 'es.application:estateBankInfo',
    defaultMessage: 'Innstæður í bönkum og sparisjóðum',
    description: '',
  },
  estateBankInfoDescription: {
    id: 'es.application:estateBankInfoDescription',
    defaultMessage:
      'Innstæður í bæði innlendum og erlendum bönkum og sparisjóðum',
    description: '',
  },
  bankAccount: {
    id: 'es.application:bankAccount',
    defaultMessage: 'Bankareikningur',
    description: '',
  },
  bankAccountBalance: {
    id: 'es.application:bankAccountBalance',
    defaultMessage: 'Innistæða með vöxtum á dánardegi',
    description: '',
  },
  bankAccountPlaceholder: {
    id: 'es.application:bankAccountPlaceholder',
    defaultMessage: 'xxxx - xx - xxxxxx',
    description: '',
  },
  bankAccountRepeaterButton: {
    id: 'es.application:bankAccountRepeaterButton',
    defaultMessage: 'Bæta við bankareikning',
    description: '',
  },

  // Claims
  claimsTitle: {
    id: 'es.application:claimsTitle',
    defaultMessage: 'Verðbréf og kröfur',
    description: '',
  },
  claimsDescription: {
    id: 'es.application:claimsDescription',
    defaultMessage: 'Útgefandi og fjárhæð með vöxtum',
    description: '',
  },
  claimsPublisher: {
    id: 'es.application:claimsPublisher',
    defaultMessage: 'Útgefandi',
    description: '',
  },
  claimsAmount: {
    id: 'es.application:claimsAmount',
    defaultMessage: 'Fjárhæð með vöxtum á dánardegi',
    description: '',
  },
  claimsRepeaterButton: {
    id: 'es.application:claimsRepeaterButton',
    defaultMessage: 'Bæta við verðbréfum',
    description: '',
  },

  // Stocks
  stocksTitle: {
    id: 'es.application:stocksTitle',
    defaultMessage: 'Hlutabréf',
    description: '',
  },
  stocksDescription: {
    id: 'es.application:stocksDescription',
    defaultMessage: 'Nafn og kennitala ef um einstakling er að ræða.',
    description: '',
  },
  stocksOrganization: {
    id: 'es.application:stocksOrganization',
    defaultMessage: 'Útgefandi',
    description: '',
  },
  stocksNationalId: {
    id: 'es.application:stocksNationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  stocksFaceValue: {
    id: 'es.application:stocksFaceValue',
    defaultMessage: 'Nafnverð',
    description: '',
  },
  stocksRateOfChange: {
    id: 'es.application:stocksRateOfChange',
    defaultMessage: 'Gengi',
    description: '',
  },
  stocksValue: {
    id: 'es.application:stocksValue',
    defaultMessage: 'Verðmæti á dánardegi',
    description: '',
  },
  stocksRepeaterButton: {
    id: 'es.application:stocksRepeaterButton',
    defaultMessage: 'Bæta við hlutabréfum',
    description: '',
  },

  // Money & deposit
  moneyAndDepositTitle: {
    id: 'es.application:moneyAndDepositTitle',
    defaultMessage: 'Peningar og bankahólf',
    description: '',
  },
  moneyAndDepositDescription: {
    id: 'es.application:moneyAndDepositDescription',
    defaultMessage: 'Nafn og kennitala ef um einstakling er að ræða',
    description: '',
  },
  moneyAndDepositText: {
    id: 'es.application:moneyAndDepositText',
    defaultMessage: 'Upplýsingar um peninga eða bankahólf',
    description: '',
  },
  moneyAndDepositPlaceholder: {
    id: 'es.application:moneyAndDepositPlaceholder',
    defaultMessage: 'Skráðu inn upplýsingar hér',
    description: '',
  },
  moneyAndDepositValue: {
    id: 'es.application:moneyAndDepositValue',
    defaultMessage: 'Fjárhæð á dánardegi',
    description: '',
  },

  // Other assets
  otherAssetsTitle: {
    id: 'es.application:otherAssetsTitle',
    defaultMessage: 'Aðrar eignir',
    description: '',
  },
  otherAssetsDescription: {
    id: 'es.application:otherAssetsDescription',
    defaultMessage: 'Til dæmis hugverkaréttindi, búseturéttur o.fl.',
    description: '',
  },
  otherAssetsText: {
    id: 'es.application:otherAssetsText',
    defaultMessage: 'Upplýsingar um aðrar eignir',
    description: '',
  },
  otherAssetsPlaceholder: {
    id: 'es.application:otherAssetsPlaceholder',
    defaultMessage: 'Skráðu inn upplýsingar hér',
    description: '',
  },
  otherAssetsValue: {
    id: 'es.application:otherAssetsValue',
    defaultMessage: 'Fjárhæð á dánardegi',
    description: '',
  },

  // Debts
  acceptDebtsLabel: {
    id: 'es.application:acceptDebtsLabel',
    defaultMessage:
      'Ég lýsi því yfir, að eftir minni bestu vitund nema eignir búsins ekki meira en kostnaði af útför og að eignirnar séu tæmandi taldar hér að ofan. Gegn því að fá eignirnar framseldar mér, mun ég kosta útför hins látna.',
    description: '',
  },
  debtsTitle: {
    id: 'es.application:debtsTitle',
    defaultMessage: 'Skuldir',
    description: '',
  },
  debtsDescription: {
    id: 'es.application:debtsDescription',
    defaultMessage: 'Innlendar og erlendar skuldir',
    description: '',
  },
  debtsCreditorHeader: {
    id: 'es.application:debtsCreditorHeader',
    defaultMessage: 'Kröfuhafi',
    description: '',
  },
  debtsCreditorName: {
    id: 'es.application:debtsCreditorName',
    defaultMessage: 'Nafn kröfuhafa',
    description: '',
  },
  debtsNationalId: {
    id: 'es.application:debtsNationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  debtsBalance: {
    id: 'es.application:debtsBalance',
    defaultMessage: 'Eftirstöðvar á dánardegi',
    description: '',
  },
  debtsRepeaterButton: {
    id: 'es.application:debtsRepeaterButton',
    defaultMessage: 'Bæta við skuldum',
    description: '',
  },
  // Representative
  representativeTitle: {
    id: 'es.application:representativeTitle',
    defaultMessage: 'Umboðsmenn',
    description: '',
  },
  representativeDescription: {
    id: 'es.application:representativeDescription',
    defaultMessage: 'Vanalega er valinn umboðsmaður...',
    description: '',
  },

  // Overview
  overviewTitle: {
    id: 'es.application:overviewTitle',
    defaultMessage: 'Yfirlit',
    description: '',
  },
  overviewSubtitleWithoutAssets: {
    id: 'es.application:overviewSubtitleWithoutAssets',
    defaultMessage: 'Þú hefur lýst yfir eignaleysi dánarbús.',
    description: '',
  },
  overviewSubtitleDivisionOfEstate: {
    id: 'es.application:overviewSubtitleDivisionOfEstate#markdown',
    defaultMessage:
      'Þú hefur valið að lýsa því yfir að þú óskir eftir að ofangreint dánarbú verði tekið til opinberra skipta. Nánari upplýsingar um skilyrði opinberra skipta má finna á eftirfarandi vefslóð á Ísland.is',
    description: '',
  },
  overviewSubtitlePermitToPostpone: {
    id: 'es.application:overviewSubtitlePermitToPostpone#markdown',
    defaultMessage:
      'Þú hefur nú útfyllt beiðni um leyfi til setu í óskiptu búi.',
    description: '',
  },
  overviewSubtitleDivisionOfEstateByHeirs: {
    id: 'es.application:overviewSubtitleDivisionOfEstateByHeirs#markdown',
    defaultMessage: 'Þú hefur nú útfyllt beiðni um einkaskipti.',
    description: '',
  },
  divisionOfEstateByHeirsTerms: {
    id: 'es.application:divisionOfEstateByHeirsTerms',
    defaultMessage: 'Skilmálar',
    description: '',
  },
  divisionOfEstateByHeirsText: {
    id: 'es.application:divisionOfEstateByHeirsText#markdown',
    defaultMessage:
      'Sýslumaður hefur móttekið beiðni þína um einkaskipti. Hún verður nú tekin til afgreiðslu og upplýsingar um afgreiðslu beiðninnar send í pósthólf þitt á Ísland.is.',
    description: '',
  },
  divisionOfEstateByHeirsSubmissionCheckbox: {
    id: 'es.application:divisionOfEstateByHeirsSubmissionCheckbox',
    defaultMessage: 'Ég hef lesið skilmálana',
    description: '',
  },

  // Submit
  submitApplication: {
    id: 'es.application:submitApplication',
    defaultMessage: 'Senda inn beiðni',
    description: '',
  },

  // Done
  doneTitle: {
    id: 'es.application:doneTitle',
    defaultMessage: 'Beiðni móttekin',
    description: '',
  },
  divisionOfEstateDoneSubtitle: {
    id: 'es.application:divisionOfEstateDoneSubtitle#markdown',
    defaultMessage:
      'Sýslumaður hefur móttekið yfirlýsingu þína um að þú óskir eftir að dánarbúið verði tekið til opinberra skipta. Yfirlýsingin verður nú tekin til meðferðar hjá sýslumanni. Reynist skilyrði til þess að senda dánarbúið í opinber skipti verður það gert í framhaldinu. Þér mun berast tilkynning um slíkt inn á pósthólf þitt á Ísland.is.',
    description: '',
  },
  estateWithoutAssetsSubtitle: {
    id: 'es.application:estateWithoutAssetsSubtitle#markdown',
    defaultMessage:
      'Sýslumaður hefur móttekið yfirlýsingu þína um eignaleysi dánarbús. Hún verður yfirfarin af sýslumanni og afgreiðsla sýslumanns í kjölfarið send í pósthólf þitt á Ísland.is.',
    description: '',
  },
  permitToPostponeEstateDivisionSubtitle: {
    id: 'es.application:permitToPostponeEstateDivisionSubtitle#markdown',
    defaultMessage:
      'Sýslumaður hefur móttekið beiðni þína um leyfi til setu í óskiptu búi. Hún verður nú tekin til afgreiðslu og upplýsingar um afgreiðslu beiðninnar send í pósthólf þitt á Ísland.is.',
    description: '',
  },
  divisionOfEstateByHeirsSubtitle: {
    id: 'es.application:divisionOfEstateByHeirsSubtitle#markdown',
    defaultMessage:
      'Sýslumaður hefur móttekið beiðni þína um einkaskipti. Hún verður nú tekin til afgreiðslu og upplýsingar um afgreiðslu beiðninnar send í pósthólf þitt á Ísland.is.',
    description: '',
  },

  // Validation errors
  errorPhoneNumber: {
    id: 'es.application:error.errorPhoneNumber',
    defaultMessage: 'Símanúmer virðist ekki vera rétt',
    description: 'Phone number is invalid',
  },
  errorEmail: {
    id: 'es.application:error.errorEmail',
    defaultMessage: 'Netfang virðist ekki vera rétt',
    description: 'Email is invalid',
  },
  errorRelation: {
    id: 'es.application:error.errorRelation',
    defaultMessage: 'Tengsl virðast ekki vera rétt',
    description: 'Relation is invalid',
  },
  fillOutRates: {
    id: 'es.application:error.fillOutRates',
    defaultMessage: 'Vinsamlegast fylltu út í alla reiti',
    description: '',
  },

  // Assets
  errorNumberEmpty: {
    id: 'es.application:error.errorNumberEmpty',
    defaultMessage: 'Númer má ekki vera tómt',
    description: 'Invalid general asset number error message',
  },

  // Inheritance step
  inheritanceAddMember: {
    id: 'es.application:inheritanceAddMember',
    defaultMessage: 'Bæta við erfingja',
    description: 'Inheritance step add member of estate',
  },
  inheritanceDisableMember: {
    id: 'es.application:inheritanceDisableMember',
    defaultMessage: 'Afvirkja',
    description: 'Inheritance step disable member of estate',
  },
  inheritanceEnableMember: {
    id: 'es.application:inheritanceEnableMember',
    defaultMessage: 'Virkja',
    description: 'Inheritance step enable member of estate',
  },
  inheritanceKtLabel: {
    id: 'es.application:inheritanceKtLabel',
    defaultMessage: 'Kennitala',
    description: 'National id label',
  },
  inheritanceRelationLabel: {
    id: 'es.application:inheritanceRelationLabel',
    defaultMessage: 'Tengsl',
    description: 'Relation label',
  },
  inheritanceRelationPlaceholder: {
    id: 'es.application:inheritanceRelationPlaceholder',
    defaultMessage: 'Veldu tengsl',
    description: 'Relation placeholder',
  },
  inheritanceNameLabel: {
    id: 'es.application:inheritanceNameLabel',
    defaultMessage: 'Nafn',
    description: 'Name label',
  },
  inheritanceCustodyLabel: {
    id: 'es.application:inheritanceCustodyLabel',
    defaultMessage: 'Forsjáraðili',
    description: 'Custody label',
  },
  inheritanceForeignCitizenshipLabel: {
    id: 'es.application:inheritanceForeignCitizenshipLabel',
    defaultMessage: 'Aðili án íslenskrar kennitölu',
    description: '',
  },
  inheritanceDayOfBirthLabel: {
    id: 'es.application:inheritanceDayOfBirthLabel',
    defaultMessage: 'Fæðingardagur',
    description: 'Day of birth label',
  },

  // Properties
  realEstatesTitle: {
    id: 'es.application:realEstatesTitle',
    defaultMessage: 'Fasteignir',
    description: 'Real estates and lands title',
  },
  realEstatesDescription: {
    id: 'es.application:realEstatesDescription',
    defaultMessage: 'Til dæmis íbúðarhús, sumarhús, lóðir og jarðir.',
    description: 'Real estates and lands description',
  },
  vehiclesTitle: {
    id: 'es.application:vehiclesTitle',
    defaultMessage: 'Faratæki',
    description: 'Vehicles title',
  },
  vehiclesPlaceholder: {
    id: 'es.application:vehiclesPlaceholder',
    defaultMessage: 't.d. Toyota Yaris',
    description: 'Placeholder for vehicles type',
  },
  otherPropertiesTitle: {
    id: 'es.application:otherPropertiesTitle',
    defaultMessage: 'Aðrar eignir',
    description: 'Other properties title',
  },
  otherPropertiesDescription: {
    id: 'es.application:otherPropertiesDescription',
    defaultMessage: 'Merktu við það sem á við eftir bestu vitund.',
    description: 'Other properties description',
  },
  otherPropertiesAccounts: {
    id: 'es.application:otherPropertiesAccounts',
    defaultMessage: 'Bankareikningar, verðbréf eða hlutabréf',
    description: 'Other properties option: Accounts',
  },
  otherPropertiesOwnBusiness: {
    id: 'es.application:otherPropertiesOwnBusiness',
    defaultMessage: 'Eigin rekstur',
    description: 'Other properties option: Own business',
  },
  otherPropertiesResidence: {
    id: 'es.application:otherPropertiesResidence',
    defaultMessage: 'Búseturéttur vegna kaupleigu íbúða',
    description: 'Other properties option: Residence',
  },
  otherPropertiesAssetsAbroad: {
    id: 'es.application:otherPropertiesAssetsAbroad',
    defaultMessage: 'Eignir erlendis',
    description: 'Other properties option: Assets abroad',
  },
  propertyNumber: {
    id: 'es.application:propertyNumber',
    defaultMessage: 'Fastanúmer',
    description: 'Property number label',
  },
  propertyShare: {
    id: 'es.application:propertyShare',
    defaultMessage: 'Eignarhluti',
    description: 'Property share label',
  },
  addProperty: {
    id: 'es.application:addProperty',
    defaultMessage: 'Bæta við fasteign',
    description: 'Add property',
  },
  addVehicle: {
    id: 'es.application:addVehicle',
    defaultMessage: 'Bæta við ökutæki',
    description: 'Add vehicle',
  },
  vehicleNumberLabel: {
    id: 'es.application:vehicleNumberLabel',
    defaultMessage: 'Skráninganúmer ökutækis',
    description: 'Vehicle number label',
  },
  vehicleTypeLabel: {
    id: 'es.application:vehicleTypeLabel',
    defaultMessage: 'Tegund faratækis',
    description: 'Vehicle type label',
  },
})
