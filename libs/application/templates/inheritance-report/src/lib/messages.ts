import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // Application begin
  applicationName: {
    id: 'ir.application:applicationName',
    defaultMessage: 'Erfðafjárskýrsla eftir andlát',
    description: '',
  },
  institutionName: {
    id: 'ir.application:institution.name',
    defaultMessage: 'Sýslumenn',
    description: '',
  },
  draftTitle: {
    id: 'ir.application:draft.title',
    defaultMessage: 'Drög',
    description: '',
  },
  draftDescription: {
    id: 'ir.application:draft.description',
    defaultMessage: 'Drög að ólokinni umsókn',
    description: '',
  },
  institution: {
    id: 'ir.application:institution',
    defaultMessage: 'Sýslumenn',
    description: '',
  },
  confirmButton: {
    id: 'ir.application:confirmButton',
    defaultMessage: 'Staðfesta',
    description: '',
  },

  // Data collection - external data providers
  dataCollectionTitle: {
    id: 'ir.application:dataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: '',
  },
  dataCollectionSubtitle: {
    id: 'ir.application:dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: '',
  },
  dataCollectionCheckbox: {
    id: 'ir.application:dataCollectionCheckbox',
    defaultMessage: 'Ég skil að ofangreindra gagna verður aflað',
    description: '',
  },
  dataCollectionNoEstatesError: {
    id: 'ir.application:dataCollectionNoEstatesError',
    defaultMessage:
      'Þú ert ekki skráð/ur fyrir dánarbúi hjá sýslumanni. Ef þú telur svo vera skaltu hafa samband við sýslumann.',
    description:
      'User not eligible for estate or no estates found bound to their national id',
  },
  deceasedInfoProviderTitle: {
    id: 'ir.application:deceasedInfoProviderTitle',
    defaultMessage: 'Upplýsingar um hinn látna',
    description: '',
  },
  deceasedInfoProviderSubtitle: {
    id: 'ir.application:deceasedInfoProviderSubtitle',
    defaultMessage:
      'Upplýsingar frá sýslumanni um kennitölu, dánardag, lögheimili, erfingja, eignir og hvort arfleifandi hafi skilað inn erfðaskrá eða gert kaupmála.',
    description: '',
  },
  personalInfoProviderTitle: {
    id: 'ir.application:personalInfoProviderTitle',
    defaultMessage: 'Persónuupplýsingar um þig',
    description: '',
  },
  personalInfoProviderSubtitle: {
    id: 'ir.application:personalInfoProviderSubtitle',
    defaultMessage: 'Upplýsingar frá Þjóðskrá um kennitölu og lögheimili.',
    description: '',
  },
  settingsInfoProviderTitle: {
    id: 'ir.application:settingsInfoProviderTitle',
    defaultMessage: 'Stillingar frá Ísland.is',
    description: '',
  },
  settingsInfoProviderSubtitle: {
    id: 'ir.application:settingsInfoProviderSubtitle',
    defaultMessage: 'Persónustillingar þínar (sími og netfang) frá Ísland.is.',
    description: '',
  },
  financialInformationProviderTitle: {
    id: 'ir.application:financialInformationProviderTitle',
    defaultMessage: 'Fjárhagsupplýsingar úr skattaskýrslu hins látna',
    description: '',
  },
  financialInformationProviderSubtitle: {
    id: 'ir.application:financialInformationProviderSubtitle',
    defaultMessage: 'vantar hér',
    description: '',
  },

  // Applicant's Information
  applicantsInfo: {
    id: 'ir.application:applicantsInfo',
    defaultMessage: 'Samskiptaupplýsingar',
    description: '',
  },
  applicantsInfoSubtitle: {
    id: 'ir.application:applicantsInfoSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
    description: '',
  },
  name: {
    id: 'ir.application:name',
    defaultMessage: 'Nafn',
    description: '',
  },
  nationalId: {
    id: 'ir.application:nationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  address: {
    id: 'ir.application:address',
    defaultMessage: 'Lögheimili',
    description: '',
  },
  phone: {
    id: 'ir.application:phone',
    defaultMessage: 'Símanúmer',
    description: '',
  },
  email: {
    id: 'ir.application:email',
    defaultMessage: 'Netfang',
    description: '',
  },

  // Inheritance report submit
  irSubmitTitle: {
    id: 'ir.application:irSubmitTitle',
    defaultMessage: 'Skil á erfðafjárskýrslu',
    description: '',
  },
  irSubmitSubtitle: {
    id: 'ir.application:irSubmitSubtitle',
    defaultMessage:
      'Við uppgjör dánarbús þurfa erfingjarnir að fylla út erfðafjárskýrslu og skila til sýslumanns. Þú hefur valið að skila inn erfðafjárskýrslu fyrir:',
    description: '',
  },

  // The deceased
  theDeceased: {
    id: 'ir.application:theDeceased',
    defaultMessage: 'Hinn látni',
    description: '',
  },
  nameOfTheDeceased: {
    id: 'ir.application:nameOfTheDeceased',
    defaultMessage: 'Nafn hins látna',
    description: '',
  },
  deathDate: {
    id: 'ir.application:deathDate',
    defaultMessage: 'Dánardagur',
    description: '',
  },
  deathDateNotRegistered: {
    id: 'ir.application:deathDateNotRegistered',
    defaultMessage: 'Dánardagur ekki skráður',
    description: '',
  },

  // Estate Properties
  propertiesTitle: {
    id: 'ir.application:propertiesTitle',
    defaultMessage: 'Eignir',
    description: '',
  },
  propertiesDescription: {
    id: 'ir.application:propertiesDescription',
    defaultMessage:
      'Vinsamlegast tilgreindu allar eignir arfleifanda utan atvinnurekstrar. Ef ekkert á við vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  realEstate: {
    id: 'ir.application:realEstate',
    defaultMessage: 'Fasteignir',
    description: '',
  },
  realEstateRepeaterHeader: {
    id: 'ir.application:realEstateRepeaterHeader',
    defaultMessage: 'Fasteign',
    description: '',
  },
  realEstateDescription: {
    id: 'ir.application:realEstateDescription',
    defaultMessage: 'Til dæmis íbúðarhús, sumarhús, lóðir og jarðir',
    description: '',
  },
  inventoryTitle: {
    id: 'ir.application:inventoryTitle',
    defaultMessage: 'Innbú',
    description: '',
  },
  inventoryDescription: {
    id: 'ir.application:inventoryDescription',
    defaultMessage: 'Til dæmis bækur og málverk',
    description: '',
  },
  inventoryTextField: {
    id: 'ir.application:inventoryTextField',
    defaultMessage: 'Upplýsingar um innbú',
    description: '',
  },
  inventoryValueTitle: {
    id: 'ir.application:inventoryValueTitle',
    defaultMessage: 'Matsverð samtals',
    description: '',
  },
  inventoryTextFieldPlaceholder: {
    id: 'ir.application:inventoryTextFieldPlaceholder',
    defaultMessage: 'Skráðu inn upplýsingar um innbú hér',
    description: '',
  },
  addInventory: {
    id: 'ir.application:addInventory',
    defaultMessage: 'Bæta við innbúi',
    description: 'Add property',
  },
  vehicles: {
    id: 'ir.application:vehicles',
    defaultMessage: 'Farartæki',
    description: '',
  },
  vehiclesDescription: {
    id: 'ir.application:vehiclesDescription',
    defaultMessage: 'Til dæmis ökutæki, flugvélar og skip.',
    description: '',
  },
  propertyNumber: {
    id: 'ir.application:propertyNumber',
    defaultMessage: 'Fastanúmer',
    description: 'Property number label',
  },
  propertyShare: {
    id: 'ir.application:propertyShare',
    defaultMessage: 'Eignarhluti',
    description: 'Property share label',
  },
  inheritanceDisableMember: {
    id: 'ir.application:inheritanceDisableMember',
    defaultMessage: 'Afvirkja',
    description: 'Inheritance step disable member of estate',
  },
  inheritanceEnableMember: {
    id: 'ir.application:inheritanceEnableMember',
    defaultMessage: 'Virkja',
    description: 'Inheritance step enable member of estate',
  },
  addProperty: {
    id: 'ir.application:addProperty',
    defaultMessage: 'Bæta við fasteign',
    description: 'Add property',
  },
  vehiclesTitle: {
    id: 'ir.application:vehiclesTitle',
    defaultMessage: 'Faratæki',
    description: 'Vehicles title',
  },
  vehiclesPlaceholder: {
    id: 'ir.application:vehiclesPlaceholder',
    defaultMessage: 't.d. Toyota Yaris',
    description: 'Placeholder for vehicles type',
  },
  addVehicle: {
    id: 'ir.application:addVehicle',
    defaultMessage: 'Bæta við ökutæki',
    description: 'Add vehicle',
  },
  vehicleNumberLabel: {
    id: 'ir.application:vehicleNumberLabel',
    defaultMessage: 'Skráninganúmer ökutækis',
    description: 'Vehicle number label',
  },
  vehicleTypeLabel: {
    id: 'ir.application:vehicleTypeLabel',
    defaultMessage: 'Tegund faratækis',
    description: 'Vehicle type label',
  },

  // Bank Info
  estateBankInfo: {
    id: 'ir.application:estateBankInfo',
    defaultMessage: 'Innstæður í bönkum og sparisjóðum',
    description: '',
  },
  estateBankInfoDescription: {
    id: 'ir.application:estateBankInfoDescription',
    defaultMessage:
      'Innstæður í bæði innlendum og erlendum bönkum og sparisjóðum',
    description: '',
  },
  bankAccount: {
    id: 'ir.application:bankAccount',
    defaultMessage: 'Innistæða',
    description: '',
  },
  bankAccountBalance: {
    id: 'ir.application:bankAccountBalance',
    defaultMessage: 'Innistæða með vöxtum á dánardegi',
    description: '',
  },
  bankAccountPlaceholder: {
    id: 'ir.application:bankAccountPlaceholder',
    defaultMessage: 'xxxx - xx - xxxxxx',
    description: '',
  },
  bankAccountRepeaterButton: {
    id: 'ir.application:bankAccountRepeaterButton',
    defaultMessage: 'Bæta við bankareikningi',
    description: '',
  },

  // Claims
  claimsTitle: {
    id: 'ir.application:claimsTitle',
    defaultMessage: 'Verðbréf og kröfur',
    description: '',
  },
  claimsDescription: {
    id: 'ir.application:claimsDescription',
    defaultMessage: 'Útgefandi og fjárhæð með vöxtum',
    description: '',
  },
  claimsPublisher: {
    id: 'ir.application:claimsPublisher',
    defaultMessage: 'Útgefandi',
    description: '',
  },
  claimsAmount: {
    id: 'ir.application:claimsAmount',
    defaultMessage: 'Fjárhæð með vöxtum á dánardegi',
    description: '',
  },
  claimsRepeaterButton: {
    id: 'ir.application:claimsRepeaterButton',
    defaultMessage: 'Bæta við verðbréfum',
    description: '',
  },

  // Stocks
  stocksTitle: {
    id: 'ir.application:stocksTitle',
    defaultMessage: 'Hlutabréf',
    description: '',
  },
  stocksDescription: {
    id: 'ir.application:stocksDescription',
    defaultMessage: 'Nafn og kennitala ef um einstakling er að ræða.',
    description: '',
  },
  stocksOrganization: {
    id: 'ir.application:stocksOrganization',
    defaultMessage: 'Útgefandi',
    description: '',
  },
  stocksNationalId: {
    id: 'ir.application:stocksNationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  stocksFaceValue: {
    id: 'ir.application:stocksFaceValue',
    defaultMessage: 'Nafnverð',
    description: '',
  },
  stocksRateOfChange: {
    id: 'ir.application:stocksRateOfChange',
    defaultMessage: 'Gengi',
    description: '',
  },
  stocksValue: {
    id: 'ir.application:stocksValue',
    defaultMessage: 'Verðmæti á dánardegi',
    description: '',
  },
  stocksRepeaterButton: {
    id: 'ir.application:stocksRepeaterButton',
    defaultMessage: 'Bæta við hlutabréfum',
    description: '',
  },

  // Money & deposit
  moneyTitle: {
    id: 'ir.application:moneyTitle',
    defaultMessage: 'Peningar',
    description: '',
  },
  moneyDescription: {
    id: 'ir.application:moneyDescription',
    defaultMessage: 'Samtals fjárhæð peninga',
    description: '',
  },
  moneyText: {
    id: 'ir.application:moneyText',
    defaultMessage: 'Upplýsingar um peninga',
    description: '',
  },
  moneyPlaceholder: {
    id: 'ir.application:moneyPlaceholder',
    defaultMessage: 'Skráðu inn upplýsingar hér',
    description: '',
  },
  moneyValue: {
    id: 'ir.application:moneyValue',
    defaultMessage: 'Fjárhæð á dánardegi',
    description: '',
  },
  addMoney: {
    id: 'ir.application:addMoney',
    defaultMessage: 'Bæta við peningum',
    description: '',
  },

  // Other assets
  otherAssetsTitle: {
    id: 'ir.application:otherAssetsTitle',
    defaultMessage: 'Aðrar eignir',
    description: '',
  },
  otherAssetsDescription: {
    id: 'ir.application:otherAssetsDescription',
    defaultMessage: 'Til dæmis hugverkaréttindi, búseturéttur o.fl.',
    description: '',
  },
  otherAssetsText: {
    id: 'ir.application:otherAssetsText',
    defaultMessage: 'Upplýsingar um aðrar eignir',
    description: '',
  },
  otherAssetsPlaceholder: {
    id: 'ir.application:otherAssetsPlaceholder',
    defaultMessage: 'Skráðu inn upplýsingar hér',
    description: '',
  },
  otherAssetsValue: {
    id: 'ir.application:otherAssetsValue',
    defaultMessage: 'Fjárhæð á dánardegi',
    description: '',
  },
  addAsset: {
    id: 'ir.application:addAsset',
    defaultMessage: 'Bæta við öðrum eignum',
    description: '',
  },
  assetHeaderText: {
    id: 'ir.application:assetHeaderText',
    defaultMessage: 'Eign',
    description: '',
  },
  otherAssetsTotal: {
    id: 'ir.application:otherAssetsTotal',
    defaultMessage: 'Matsverð annarra eigna samtals á dánardegi',
    description: '',
  },

  // AssetsOverview
  overview: {
    id: 'ir.application:overview',
    defaultMessage: 'Yfirlit',
    description: '',
  },
  assetOverview: {
    id: 'ir.application:assetOverview',
    defaultMessage: 'Yfirlit eigna',
    description: '',
  },
  assetOverviewDescription: {
    id: 'ir.application:assetOverviewDescription',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
    description: '',
  },
  realEstateEstimation: {
    id: 'ir.application:realEstateEstimation',
    defaultMessage: 'Fasteignamat samtals á dánardegi',
    description: '',
  },
  marketValue: {
    id: 'ir.application:marketValue',
    defaultMessage: 'Markaðsverð samtals á dánardegi',
    description: '',
  },
  totalValue: {
    id: 'ir.application:totalValue',
    defaultMessage: 'Verðmæti samtals á dánardegi',
    description: '',
  },
  banksBalance: {
    id: 'ir.application:banksBalance',
    defaultMessage: 'Innistæða í bönkum með vöxtum á dánardegi',
    description: '',
  },
  totalValueOfAssets: {
    id: 'ir.application:totalValueOfAssets',
    defaultMessage: 'Samtals virði eigna',
    description: '',
  },
  total: {
    id: 'ir.application:total',
    defaultMessage: 'Samtals',
    description: '',
  },

  // Debts
  debtsAndFuneralCost: {
    id: 'ir.application:debtsAndFuneralCost',
    defaultMessage: 'Skuldir og útfararkostnaður',
    description: '',
  },
  domesticAndForeignDebts: {
    id: 'es.application:debtsDescription',
    defaultMessage: 'Innlendar og erlendar skuldir',
    description: '',
  },
  domesticAndForeignDebtsDescription: {
    id: 'es.application:domesticAndForeignDebtsDescription',
    defaultMessage: 'Tilgreinið kennitölu ef um einstakling er að ræða',
    description: '',
  },
  funeralCostTitle: {
    id: 'es.application:funeralCostTitle',
    defaultMessage: 'Útfarakostnaður',
    description: '',
  },
  amount: {
    id: 'es.application:funeralCostAmount',
    defaultMessage: 'Fjárhæð',
    description: '',
  },
  debtsTitle: {
    id: 'es.application:debtsTitle',
    defaultMessage: 'Skuldir',
    description: '',
  },
  debtsCreditorHeader: {
    id: 'ir.application:debtsCreditorHeader',
    defaultMessage: 'Skuld',
    description: '',
  },
  debtsCreditorName: {
    id: 'ir.application:debtsCreditorName',
    defaultMessage: 'Nafn kröfuhafa',
    description: '',
  },
  creditorsNationalId: {
    id: 'ir.application:creditorsNationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  debtsBalance: {
    id: 'ir.application:debtsBalance',
    defaultMessage: 'Eftirstöðvar á dánardegi',
    description: '',
  },
  debtsRepeaterButton: {
    id: 'ir.application:debtsRepeaterButton',
    defaultMessage: 'Bæta við skuldum',
    description: '',
  },
  publicChargesTitle: {
    id: 'ir.application:publicChargesTitle',
    defaultMessage: 'Opinber gjöld',
    description: '',
  },
  publicChargesDescription: {
    id: 'ir.application:publicChargesDescription',
    defaultMessage: 'Skuld við opinberar stofnanir',
    description: '',
  },
  publicChargesRepeaterButton: {
    id: 'ir.application:publicChargesRepeaterButton',
    defaultMessage: 'Bæta við opinberum gjöldum',
    description: '',
  },
  publicChargeHeader: {
    id: 'ir.application:publicChargeHeader',
    defaultMessage: 'Gjald',
    description: '',
  },
  totalValueOfDebts: {
    id: 'ir.application:totalValueOfDebts',
    defaultMessage: 'Samtals virði skulda',
    description: '',
  },

  // DebtsOverview
  totalAmount: {
    id: 'ir.application:totalAmount',
    defaultMessage: 'Samtals fjárhæð',
    description: '',
  },

  // Business
  business: {
    id: 'ir.application:business',
    defaultMessage: 'Atvinnurekstur',
    description: '',
  },
  businessTitle: {
    id: 'ir.application:businessTitle',
    defaultMessage: 'Eignir og skuldir í atvinnurekstri',
    description: '',
  },
  businessDescription: {
    id: 'ir.application:businessDescription',
    defaultMessage:
      'Vinsamlegast tilgreindu allar eignir og skuldir arfláta í atvinnurekstri',
    description: '',
  },
  businessAssets: {
    id: 'ir.application:businessAssets',
    defaultMessage: 'Eignir í atvinnurekstri',
    description: '',
  },
  businessAssetsDescription: {
    id: 'ir.application:businessAssetsDescription',
    defaultMessage:
      'Aðrar eignir en fasteignir, t.d. vélar og tæki í landbúnaði. Færast á markaðsverði.',
    description: '',
  },
  businessAsset: {
    id: 'ir.application:businessAsset',
    defaultMessage: 'Hvaða eign',
    description: '',
  },
  businessAssetAmount: {
    id: 'ir.application:businessAssetAmount',
    defaultMessage: 'Fjárhæð á dánardegi',
    description: '',
  },
  businessAssetRepeaterButton: {
    id: 'ir.application:businessAssetRepeaterButton',
    defaultMessage: 'Bæta við eign',
    description: '',
  },
  businessAssetRepeaterHeader: {
    id: 'ir.application:businessAssetRepeaterHeader',
    defaultMessage: 'Eign',
    description: '',
  },
  businessDebtsTitle: {
    id: 'ir.application:businessDebtsTitle',
    defaultMessage: 'Skuldir',
    description: '',
  },
  businessDebts: {
    id: 'ir.application:businessDebts',
    defaultMessage: 'Skuldir í atvinnurekstri',
    description: '',
  },
  businessDebtsDescription: {
    id: 'ir.application:businessDebtsDescription',
    defaultMessage: 'Tilgreinið kennitölu ef um einstakling er að ræða',
    description: '',
  },
  businessOverview: {
    id: 'ir.application:businessOverview',
    defaultMessage: 'Yfirlit eigna og skulda í atvinnurekstri',
    description: '',
  },
  businessOverviewDescription: {
    id: 'ir.application:businessOverviewDescription',
    defaultMessage:
      'Vinsamlegast tilgreindu allar eignir arfleifanda utan atvinnurekstrar. Ef ekkert á við vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  businessEquity: {
    id: 'ir.application:businessEquity',
    defaultMessage: 'Eigið fé í atvinnurekstri',
    description: '',
  },

  // Heirs
  spousesShare: {
    id: 'ir.application:spousesShare',
    defaultMessage: 'Búshluti eftirlifandi maka',
    description: '',
  },
  propertyForExchange: {
    id: 'ir.application:propertyForExchange',
    defaultMessage: 'Eign til skipta',
    description: '',
  },
  propertyForExchangeDescription: {
    id: 'ir.application:propertyForExchangeDescription',
    defaultMessage:
      'Frá dregst búshluti eftirlifandi maka skv. reglum hjúskaparlaga nr. 31/1993 (50% eigna).',
    description: '',
  },
  propertyForExchangeAndHeirs: {
    id: 'ir.application:propertyForExchangeAndHeirs',
    defaultMessage: 'Eign til skipta og erfingjar',
    description: '',
  },
  totalDeduction: {
    id: 'ir.application:totalDeduction',
    defaultMessage: 'Samtals frádráttur (búshluti maka)',
    description: '',
  },
  netProperty: {
    id: 'ir.application:netProperty',
    defaultMessage: 'Hrein eign (eignir - skuldir + eigið fé í atvinnurekstri)',
    description: '',
  },
  netPropertyForExchange: {
    id: 'ir.application:netPropertyForExchange',
    defaultMessage: 'Hrein eign til skiptis',
    description: '',
  },
  heirsAndPartition: {
    id: 'ir.application:heirsAndPartition',
    defaultMessage: 'Erfingjar og skipting',
    description: '',
  },
  heirsAndPartitionDescription: {
    id: 'ir.application:heirsAndPartitionDescription',
    defaultMessage:
      'Skrá skal netfang erfingja vegna tilkynninga skattstjóra skv. 9. og 10. gr. laga nr. 14/2004',
    description: '',
  },
  heirsName: {
    id: 'ir.application:heirsName',
    defaultMessage: 'Nafn',
    description: '',
  },
  heirsNationalId: {
    id: 'ir.application:heirsNationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  heirsEmail: {
    id: 'ir.application:heirsEmail',
    defaultMessage: 'Netfang',
    description: '',
  },
  heirsPhone: {
    id: 'ir.application:heirsPhone',
    defaultMessage: 'Símanúmer',
    description: '',
  },
  heirsRelation: {
    id: 'ir.application:heirsRelation',
    defaultMessage: 'Tengsl við arfláta',
    description: '',
  },
  heirsInheritanceRate: {
    id: 'ir.application:heirsInheritanceRate',
    defaultMessage: 'Arfshlutfall (%)',
    description: '',
  },
  taxableInheritance: {
    id: 'ir.application:taxableInheritance',
    defaultMessage: 'Skattskyldur arfur',
    description: '',
  },
  taxFreeInheritance: {
    id: 'ir.application:taxFreeInheritance',
    defaultMessage: 'Óskattskyldur arfur',
    description: '',
  },
  inheritanceAmount: {
    id: 'ir.application:inheritanceAmount',
    defaultMessage: 'Fjárhæð arfshluta',
    description: '',
  },
  inheritanceTax: {
    id: 'ir.application:inheritanceTax',
    defaultMessage: 'Erfðafjárskattur',
    description: '',
  },
  addHeir: {
    id: 'ir.application:addHeir',
    defaultMessage: 'Bæta við erfingja',
    description: '',
  },
  heir: {
    id: 'ir.application:heir',
    defaultMessage: 'Erfingi',
    description: '',
  },
  heirAdditionalInfo: {
    id: 'ir.application:heirAdditionalInfo',
    defaultMessage: 'Athugasemdir erfingja',
    description: '',
  },
  heirAdditionalInfoDescription: {
    id: 'ir.application:heirAdditionalInfoDescription',
    defaultMessage:
      'Skýringar og athugasemdir erfingja og/eða þeirra sem afhenda fyrirframgreiddan arf',
    description: '',
  },
  info: {
    id: 'ir.application:info',
    defaultMessage: 'Athugasemdir',
    description: '',
  },
  infoPlaceholder: {
    id: 'ir.application:infoPlaceholder',
    defaultMessage: 'Skráðu inn athugasemdir hér',
    description: '',
  },
  heirsOverviewDescription: {
    id: 'ir.application:heirsOverviewDescription',
    defaultMessage:
      'Vinsamlegast tilgreindu allar eignir arfleifanda utan atvinnurekstrar. Ef ekkert á við vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  totalPercentage: {
    id: 'ir.application:totalPercentage',
    defaultMessage: 'Samtals arfshlutfall',
    description: '',
  },

  // Done
  submitReport: {
    id: 'ir.application:submitReport',
    defaultMessage: 'Senda inn skýrslu',
    description: '',
  },
  doneTitle: {
    id: 'ir.application:doneTitle',
    defaultMessage: 'Erfðafjárskýrsla móttekin',
    description: '',
  },
})
