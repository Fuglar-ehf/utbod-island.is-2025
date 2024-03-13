import { defineMessages } from 'react-intl'

export const translationStrings = defineMessages({
  introduction: {
    id: 'web.pensionCalculator:introduction#markdown',
    defaultMessage:
      'Í reiknivélinni getur þú sett inn mismunandi forsendur og séð hvernig það hefur áhrif á greiðslurnar þínar. Lífeyrir er fyrir flesta grunnlífeyrir frá Tryggingastofnun og viðbótagreiðslur. Ef þú ert með aðrar tekjur en lífeyri frá TR, getur það haft áhrif á réttindin þín.',
    description: 'Upplýsingar efst á fyrstu síðu',
  },
  pensionStartIsDelayed: {
    id: 'web.pensionCalculator:pensionStartIsDelayed',
    defaultMessage: 'Þú vilt hefja töku eftir 67 ára aldur',
    description: 'Upplýsingar sem birtast ef þú vilt seinka töku ellilífeyris',
  },
  pensionStartIsHurried: {
    id: 'web.pensionCalculator:pensionStartIsHurried',
    defaultMessage: 'Þú vilt hefja töku fyrir 67 ára aldur',
    description: 'Upplýsingar sem birtast ef þú vilt flýta töku ellilífeyris',
  },
  hasSpouseYesLabel: {
    id: 'web.pensionCalculator:hasSpouseYesLabel',
    defaultMessage: 'Á maka',
    description: 'Hjúskaparstaða, á maka',
  },
  hasSpouseNoLabel: {
    id: 'web.pensionCalculator:hasSpouseNoLabel',
    defaultMessage: 'Á ekki maka',
    description: 'Hjúskaparstaða, á ekki maka',
  },
  livesAloneYesLabel: {
    id: 'web.pensionCalculator:livesAloneYesLabel',
    defaultMessage: 'Býr ein(n)',
    description: 'Heimilisaðstæður, býr ein(n)',
  },
  livesAloneNoLabel: {
    id: 'web.pensionCalculator:livesAloneNoLabel',
    defaultMessage: 'Býr ekki ein(n)',
    description: 'Heimilisaðstæður, býr ekki ein(n)',
  },
  basePensionRetirementLabel: {
    id: 'web.pensionCalculator:basePensionRetirementLabel',
    defaultMessage: 'Ellilífeyrir',
    description: 'Tegund lífeyris, Ellilífeyrir',
  },
  basePensionFishermanRetirementLabel: {
    id: 'web.pensionCalculator:basePensionFishermanRetirementLabel',
    defaultMessage: 'Ellilífeyrir sjómanna',
    description: 'Tegund lífeyris, Ellilífeyrir sjómanna',
  },
  basePensionDisabilityLabel: {
    id: 'web.pensionCalculator:basePensionDisabilityLabel',
    defaultMessage: 'Örorkulífeyrir',
    description: 'Tegund lífeyris, Örorkulífeyrir',
  },
  basePensionRehabilitationLabel: {
    id: 'web.pensionCalculator:basePensionRehabilitationLabel',
    defaultMessage: 'Endurhæfingarlífeyrir',
    description: 'Tegund lífeyris, Endurhæfingarlífeyrir',
  },
  basePensionHalfRetirementLabel: {
    id: 'web.pensionCalculator:basePensionHalfRetirementLabel',
    defaultMessage: 'Hálfur ellilífeyrir',
    description: 'Tegund lífeyris, Hálfur ellilífeyrir',
  },
  childCountOptionsNoneLabel: {
    id: 'web.pensionCalculator:childCountOptionsNoneLabel',
    defaultMessage: 'Ekkert barn',
    description: 'Börn yngri en 18 ára, Ekkert barn',
  },
  childCountOptionsOneLabel: {
    id: 'web.pensionCalculator:childCountOptionsOneLabel',
    defaultMessage: '1 barn',
    description: 'Börn yngri en 18 ára, 1 barn',
  },
  childCountOptionsTwoLabel: {
    id: 'web.pensionCalculator:childCountOptionsTwoLabel',
    defaultMessage: '2 börn',
    description: 'Börn yngri en 18 ára, 1 barn',
  },
  childCountOptionsThreeLabel: {
    id: 'web.pensionCalculator:childCountOptionsThreeLabel',
    defaultMessage: '3 börn',
    description: 'Börn yngri en 18 ára, 3 börn',
  },
  childCountOptionsFourLabel: {
    id: 'web.pensionCalculator:childCountOptionsFourLabel',
    defaultMessage: '4 börn',
    description: 'Börn yngri en 18 ára, 4 börn',
  },
  childCountOptionsFiveLabel: {
    id: 'web.pensionCalculator:childCountOptionsFiveLabel',
    defaultMessage: '5 börn',
    description: 'Börn yngri en 18 ára, 5 börn',
  },
  childCountOptionsSixLabel: {
    id: 'web.pensionCalculator:childCountOptionsSixLabel',
    defaultMessage: '6 börn',
    description: 'Börn yngri en 18 ára, 6 börn',
  },
  childCountOptionsSevenLabel: {
    id: 'web.pensionCalculator:childCountOptionsSevenLabel',
    defaultMessage: '7 börn',
    description: 'Börn yngri en 18 ára, 7 börn',
  },
  childCountOptionsEightLabel: {
    id: 'web.pensionCalculator:childCountOptionsEightLabel',
    defaultMessage: '8 börn',
    description: 'Börn yngri en 18 ára, 8 börn',
  },
  childCountOptionsNineLabel: {
    id: 'web.pensionCalculator:childCountOptionsNineLabel',
    defaultMessage: '9 börn',
    description: 'Börn yngri en 18 ára, 9 börn',
  },
  typeOfPeriodIncomeMonthLabel: {
    id: 'web.pensionCalculator:typeOfPeriodIncomeMonthLabel',
    defaultMessage: 'Mánaðartekjur',
    description: 'Mánaðartekjur',
  },
  typeOfPeriodIncomeYearLabel: {
    id: 'web.pensionCalculator:typeOfPeriodIncomeYearLabel',
    defaultMessage: 'Árstekjur',
    description: 'Árstekjur',
  },
  amountDisclaimer: {
    id: 'web.pensionCalculator:amountDisclaimer',
    defaultMessage: 'Skráðu allar upphæðir fyrir skatt',
    description: 'Skráðu allar upphæðir fyrir skatt',
  },
  taxCardRatioLabel: {
    id: 'web.pensionCalculator:taxCardRatioLabel',
    defaultMessage: 'Hlutfall skattkorts hjá TR',
    description: 'Hlutfall skattkorts hjá TR',
  },
  taxCardRatioHeading: {
    id: 'web.pensionCalculator:taxCardRatioHeading',
    defaultMessage: 'Upplýsingar um nýtingu skattkorts',
    description:
      'Texti fyrir ofan lýsingu varðandi "Hlutfall skattkorts hjá TR"',
  },
  taxCardRatioDescription: {
    id: 'web.pensionCalculator:taxCardRatioDescription',
    defaultMessage: 'Skrá hlutfall skattkorts sem á að nýta',
    description: 'Lýsing varðandi "Hlutfall skattkorts hjá TR"',
  },
  incomeHeading: {
    id: 'web.pensionCalculator:incomeHeading',
    defaultMessage: 'Upplýsingar um atvinnutekjur',
    description:
      'Texti fyrir ofan lýsingu varðandi "Tekjur m.a. af atvinnu og atvinnuleysisbótum"',
  },
  incomeLabel: {
    id: 'web.pensionCalculator:incomeLabel',
    defaultMessage: 'Tekjur m.a. af atvinnu, eftirlaunum og atvinnuleysisbótum',
    description: 'Tekjur m.a. af atvinnu, eftirlaunum og atvinnuleysisbótum',
  },
  incomeDescription: {
    id: 'web.pensionCalculator:incomeDescription',
    defaultMessage:
      'Laun frá vinnuveitanda, reiknað endurgjald, verktakagreiðslur, atvinnuleysisbætur, aðrar tekjur af atvinnurekstri, fæðingarorlof, hlunnindi og styrkir.',
    description:
      'Lýsing varðandi "Tekjur m.a. af atvinnu og atvinnuleysisbótum"',
  },
  pensionPaymentsLabel: {
    id: 'web.pensionCalculator:pensionPaymentsLabel',
    defaultMessage: 'Greiðslur frá lífeyrissjóðum',
    description: 'Greiðslur frá lífeyrissjóðum',
  },
  pensionPaymentsHeading: {
    id: 'web.pensionCalculator:pensionPaymentsHeading',
    defaultMessage: 'Greiðslur frá lífeyrissjóðum',
    description:
      'Texti fyrir ofan lýsingu varðandi "Greiðslur frá lífeyrissjóðum"',
  },
  pensionPaymentsDescription: {
    id: 'web.pensionCalculator:pensionPaymentsDescription',
    defaultMessage:
      'Allar greiðslur frá lífeyrissjóðum, lífeyristryggingafélagi, makalífeyrir, séreign og séreignasparnaður. Það er gott að gera ráð fyrir vísitöluhækkunum og áætla meira í lífeyrissjóðsgreiðslur heldur en minna.',
    description: 'Lýsing varðandi "Greiðslur frá lífeyrissjóðum"',
  },
  privatePensionPaymentsLabel: {
    id: 'web.pensionCalculator:privatePensionPaymentsLabel',
    defaultMessage: 'Greiðslur viðbótarlífeyrissparnaðar',
    description: 'Greiðslur viðbótarlífeyrissparnaðar',
  },
  privatePensionPaymentsHeading: {
    id: 'web.pensionCalculator:privatePensionPaymentsHeading',
    defaultMessage: 'Greiðslur úr viðbótarlífeyrissparnaði',
    description: 'Greiðslur viðbótarlífeyrissparnaðar',
  },
  privatePensionPaymentsDescription: {
    id: 'web.pensionCalculator:privatePensionPaymentsDescription',
    defaultMessage:
      'Viðbótarlífeyrissparnaður er sparnaður þar sem þú greiðir 2% eða 4% af launum og laungreiðandi leggur 2% fram á móti.',
    description: 'Lýsing varðandi "Greiðslur viðbótarlífeyrissparnaðar"',
  },
  otherIncomeLabel: {
    id: 'web.pensionCalculator:otherIncomeLabel',
    defaultMessage: 'Aðrar tekjur',
    description: 'Aðrar tekjur',
  },
  otherIncomeHeading: {
    id: 'web.pensionCalculator:otherIncomeHeading',
    defaultMessage: 'Aðrar tekjur',
    description: 'Texti fyrir ofan lýsingu varðandi "Aðrar tekjur"',
  },
  otherIncomeDescription: {
    id: 'web.pensionCalculator:otherIncomeDescription',
    defaultMessage:
      'Styrkir og félagsleg aðstoð svo sem náms- og vísindastyrkir, fæðingarstyrkir og félagsleg aðstoð. Greiðslur eða skaðabætur frá tryggingafélagi eða stéttarfélagi.',
    description: 'Lýsing varðandi "Aðrar tekjur"',
  },
  capitalIncomeLabel: {
    id: 'web.pensionCalculator:capitalIncomeLabel',
    defaultMessage: 'Fjármagnstekjur',
    description: 'Fjármagnstekjur',
  },
  capitalIncomeHeading: {
    id: 'web.pensionCalculator:capitalIncomeHeading',
    defaultMessage: 'Fjármagnstekjur',
    description: 'Fjármagnstekjur',
  },
  capitalIncomeDescription: {
    id: 'web.pensionCalculator:capitalIncomeDescription#markdown',
    defaultMessage:
      'Vextir og verðbætur af innistæðum í banka og verðbréfum, leigutekjur, arður af hlutabréfum, söluhagnaður af hlutabréfum og öðrum eignum. Allar fjármagnstekjur eru sameiginlegar fyrir hjón og sambýlisfólk. Þessar upphæðir þurfa að vera samanlögð upphæð fyrir ykkur bæði. Í útreikningi er tekið tillit til þess og fjármagnstekjunum skipt til helminga.',
    description: 'Lýsing varðandi "Fjármagnstekjur"',
  },
  benefitsFromMunicipalityLabel: {
    id: 'web.pensionCalculator:benefitsFromMunicipalityLabel',
    defaultMessage: 'Skattskyldar bætur sveitarfélaga',
    description: 'Skattskyldar bætur sveitarfélaga',
  },
  benefitsFromMunicipalityHeading: {
    id: 'web.pensionCalculator:benefitsFromMunicipalityHeading',
    defaultMessage: 'Skattskyldar bætur sveitarfélaga',
    description:
      'Texti fyrir ofan lýsingu varðandi "Skattskyldar bætur sveitarfélaga"',
  },
  benefitsFromMunicipalityDescription: {
    id: 'web.pensionCalculator:benefitsFromMunicipalityDescription',
    defaultMessage:
      'Hér á að setja skattskyldar bætur frá sveitarfélögunum. Húsaleigubætur eru ekki skattskyldar og því þarf ekki að taka þær fram',
    description: 'Lýsing varðandi "Skattskyldar bætur sveitarfélaga"',
  },
  premiumLabel: {
    id: 'web.pensionCalculator:premiumLabel',
    defaultMessage: 'Frádregin iðgjöld í lífeyrissjóði',
    description: 'Frádregin iðgjöld í lífeyrissjóði',
  },
  premiumHeading: {
    id: 'web.pensionCalculator:premiumHeading',
    defaultMessage: 'Frádregin iðgjöld í lífeyrissjóði',
    description: 'Frádregin iðgjöld í lífeyrissjóði',
  },
  premiumDescription: {
    id: 'web.pensionCalculator:premiumDescription',
    defaultMessage: 'Iðgjöld í sérsjóði og lífeyrissjóði',
    description: 'Lýsing varðandi "Frádregin iðgjöld í lífeyrissjóði"',
  },
  foreignBasicPensionLabel: {
    id: 'web.pensionCalculator:foreignBasicPensionLabel',
    defaultMessage: 'Erlendur grunnlífeyrir',
    description: 'Erlendur grunnlífeyrir',
  },
  foreignBasicPensionHeading: {
    id: 'web.pensionCalculator:foreignBasicPensionHeading',
    defaultMessage: 'Erlendur grunnlífeyrir',
    description: 'Erlendur grunnlífeyrir',
  },
  foreignBasicPensionDescription: {
    id: 'web.pensionCalculator:foreignBasicPensionDescription',
    defaultMessage:
      'Ef þú færð lífeyri frá erlendri almannatryggingastofnun þarf að skrá upphæðina í íslenskum krónum.',
    description: 'Lýsing á erlendum grunnlífeyrir',
  },
  calculateResults: {
    id: 'web.pensionCalculator:calculateResults',
    defaultMessage: 'Reikna niðurstöður',
    description: 'Reikna niðurstöður',
  },
  incomeBeforeTaxHeading: {
    id: 'web.pensionCalculator:incomeBeforeTax',
    defaultMessage: 'Tekjur fyrir skatt',
    description: 'H3, Tekjur fyrir skatt',
  },
  mainIncomeHeading: {
    id: 'web.pensionCalculator:mainIncomeHeading',
    defaultMessage: 'Tekjur',
    description: 'H2, Tekjur',
  },
  incomeDisclaimer: {
    id: 'web.pensionCalculator:incomeDisclaimer#markdown',
    defaultMessage:
      'Reiknivélin miðar við jafnar tekjur alla mánuði ársins. Í umsókn er hægt að óska eftir greiðslum samkvæmt atvinnutekjum hvers mánaðar.',
    description: 'Fyrirvari um tekjur',
  },
  hasLivedAbroadLabel: {
    id: 'web.pensionCalculator:hasLivedAbroadLabel',
    defaultMessage: 'Hefur búið erlendis',
    description: 'Hefur búið erlendis',
  },
  hasLivedAbroadNo: {
    id: 'web.pensionCalculator:hasLivedAbroadNo',
    defaultMessage: 'Nei',
    description: 'Hefur búið erlendis, Nei',
  },
  hasLivedAbroadYes: {
    id: 'web.pensionCalculator:hasLivedAbroadYes',
    defaultMessage: 'Já',
    description: 'Hefur búið erlendis, Já',
  },
  livingConditionAbroadInYearsLabel: {
    id: 'web.pensionCalculator:livingConditionAbroadInYearsLabel',
    defaultMessage: 'Fjöldi ára erlendrar búsetu frá 16 til 67 ára',
    description: 'Fjöldi ára erlendrar búsetu',
  },
  yearsSuffix: {
    id: 'web.pensionCalculator:yearsSuffix',
    defaultMessage: ' ár',
    description: ' ár',
  },
  ageOfFirst75DisabilityAssessment: {
    id: 'web.pensionCalculator:ageOfFirst75DisabilityAssessment',
    defaultMessage: 'Fyrsta örorkumat',
    description: 'Fyrsta örorkumat',
  },
  livingConditionAbroadInYearsPlaceholder: {
    id: 'web.pensionCalculator:livingConditionAbroadInYearsPlaceholder',
    defaultMessage: '0 ár',
    description: '0 ár',
  },
  ageOfFirst75DisabilityAssessmentSuffix: {
    id: 'web.pensionCalculator:ageOfFirst75DisabilityAssessmentSuffix',
    defaultMessage: 'ára',
    description: 'Það sem stendur á eftir það sem notandi slær inn (43 "ára")',
  },
  ageOfFirst75RehabilitationAssessment: {
    id: 'web.pensionCalculator:ageOfFirst75RehabilitationAssessment',
    defaultMessage: 'Fyrsta endurhæfingarmat',
    description: 'Fyrsta 75% endurhæfingarmat',
  },
  ageOfFirst75DisabilityAssessmentPlaceholder: {
    id: 'web.pensionCalculator:ageOfFirst75DisabilityAssessmentPlaceholder',
    defaultMessage: ' ',
    description: 'Placeholder fyrir Endurhæfingarlífeyrir og Örorkulífeyrir',
  },
  livingConditionRatioLabel: {
    id: 'web.pensionCalculator:livingConditionRatioLabel',
    defaultMessage: 'Búsetuhlutfall',
    description: 'Búsetuhlutfall',
  },
  childCountLabel: {
    id: 'web.pensionCalculator:childCount',
    defaultMessage: 'Börn yngri en 18 ára',
    description: 'Börn yngri en 18 ára',
  },
  childCountPlaceholder: {
    id: 'web.pensionCalculator:childCountPlaceholder',
    defaultMessage: 'Veldu fjölda barna',
    description: 'Börn yngri en 18 ára, placeholder',
  },
  livingConditionLabel: {
    id: 'web.pensionCalculator:livingConditionLabel',
    defaultMessage: 'Heimilisaðstæður',
    description: 'Heimilisaðstæður',
  },
  livingConditionPlaceholder: {
    id: 'web.pensionCalculator:livingConditionPlaceholder',
    defaultMessage: 'Heimilisaðstæður',
    description: 'Heimilisaðstæður, placeholder',
  },
  hasSpouseLabel: {
    id: 'web.pensionCalculator:hasSpouseLabel',
    defaultMessage: 'Hjúskaparstaða',
    description: 'Hjúskaparstaða',
  },
  hasSpousePlaceholder: {
    id: 'web.pensionCalculator:hasSpousePlaceholder',
    defaultMessage: 'Hjúskaparstaða',
    description: 'Hjúskaparstaða, placeholder',
  },
  yourCircumstancesHeading: {
    id: 'web.pensionCalculator:yourCircumstancesHeading',
    defaultMessage: 'Þínar aðstæður',
    description: 'H2, Þínar aðstæður',
  },
  startOfPaymentsDescription: {
    id: 'web.pensionCalculator:startOfPaymentsDescription',
    defaultMessage:
      'Ellilífeyrir er eftirágreiddur og miðað er við að taka hefjist við 67 ára aldur.',
    description: 'Lýsing varðandi "Hvenær viltu hefja töku á ellilífeyri"',
  },
  typeOfBasePensionLabel: {
    id: 'web.pensionCalculator:typeOfBasePensionLabel',
    defaultMessage: 'Tegund lífeyris',
    description: 'Tegund lífeyris',
  },
  dateOfCalculationsLabel: {
    id: 'web.pensionCalculator:dateOfCalculationsLabel',
    defaultMessage: 'Allar reiknivélar',
    description: 'Val á milli ára',
  },
  dateOfCalculationsPlaceholder: {
    id: 'web.pensionCalculator:dateOfCalculationsPlaceholder',
    defaultMessage: 'Veldu ár',
    description: 'Val á milli ára, placeholder',
  },
  disclaimer: {
    id: 'web.pensionCalculator:disclaimer',
    defaultMessage:
      'Vinsamlegast athugið að reiknivélin gefur ekki bindandi niðurstöður',
    description: 'Fyrirvari',
  },
  mainTitle: {
    id: 'web.pensionCalculator:mainTitle',
    defaultMessage: 'Reiknivél lífeyris',
    description: 'Aðal titill',
  },
  resultDisclaimer: {
    id: 'web.pensionCalculator:resultDisclaimer',
    defaultMessage:
      'Vinsamlega hafðu í huga að reiknivélin reiknar greiðslur miðað við þær forsendur sem þú gefur upp. Líkanið er einungis til leiðbeiningar en veitir ekki bindandi upplýsingar um endanlega afgreiðslu máls eða greiðslufjárhæðir',
    description: 'Fyrirvari á niðurstöðuskjá',
  },
  highlightedResultItemHeading: {
    id: 'web.pensionCalculator:highlighedResultItemHeading',
    defaultMessage: 'Samtals greiðslur frá TR eftir skatt',
    description: 'H2, Samtals greiðslur frá TR eftir skatt',
  },
  changeAssumptions: {
    id: 'web.pensionCalculator:changeAssumptions',
    defaultMessage: 'Breyta forsendum',
    description: 'Fara til baka og breyta forsendum',
  },
  resultDetailsLabel: {
    id: 'web.pensionCalculator:resultDetailsLabel',
    defaultMessage: 'Sundurliðun',
    description: 'Sundurliðun',
  },
  print: {
    id: 'web.pensionCalculator:print',
    defaultMessage: 'Prenta',
    description: 'Prenta',
  },
  noResultsCanBeShown: {
    id: 'web.pensionCalculator:noResultsCanBeShown',
    defaultMessage: 'Ekki tókst sækja útreikning miðað við gefnar forsendur',
    description:
      'Aðvörunarskilaboð ef vefþjónusta skilar ekki gögnum miðað við innslegnar forsendur',
  },
  perMonth: {
    id: 'web.pensionCalculator:perMonth',
    defaultMessage: 'Á mánuði',
    description: 'Á mánuði',
  },
  perYear: {
    id: 'web.pensionCalculator:perYear',
    defaultMessage: 'Á ári',
    description: 'Á ári',
  },
  startOfPaymentsHeading: {
    id: 'web.pensionCalculator:startOfPaymentsHeading',
    defaultMessage: 'Upphaf greiðslna',
    description: 'H2, Upphaf greiðslna',
  },
  TR_PAYMENTS: {
    id: 'web.pensionCalculator:TR_PAYMENTS',
    defaultMessage: 'Greiðslur frá Tryggingastofnun',
    description: 'Greiðslur frá Tryggingastofnun',
  },
  INCOME_FROM_OTHERS: {
    id: 'web.pensionCalculator:INCOME_FROM_OTHERS',
    defaultMessage: 'Tekjur frá öðrum',
    description: 'Tekjur frá öðrum',
  },
  CAPITAL_INCOME: {
    id: 'web.pensionCalculator:CAPITAL_INCOME',
    defaultMessage: 'Fjármagnstekjur',
    description: 'Fjármagnstekjur',
  },
  TOTAL_INCOME: {
    id: 'web.pensionCalculator:TOTAL_INCOME',
    defaultMessage: 'Tekjur samtals',
    description: 'Tekjur samtals',
  },
  january: {
    id: 'web.pensionCalculator:january',
    defaultMessage: 'Janúar',
    description: 'January',
  },
  february: {
    id: 'web.pensionCalculator:february',
    defaultMessage: 'Febrúar',
    description: 'February',
  },
  march: {
    id: 'web.pensionCalculator:march',
    defaultMessage: 'Mars',
    description: 'March',
  },
  april: {
    id: 'web.pensionCalculator:april',
    defaultMessage: 'Apríl',
    description: 'April',
  },
  may: {
    id: 'web.pensionCalculator:may',
    defaultMessage: 'Maí',
    description: 'May',
  },
  june: {
    id: 'web.pensionCalculator:june',
    defaultMessage: 'Júní',
    description: 'June',
  },
  july: {
    id: 'web.pensionCalculator:july',
    defaultMessage: 'Júlí',
    description: 'July',
  },
  august: {
    id: 'web.pensionCalculator:august',
    defaultMessage: 'Ágúst',
    description: 'August',
  },
  september: {
    id: 'web.pensionCalculator:september',
    defaultMessage: 'September',
    description: 'September',
  },
  october: {
    id: 'web.pensionCalculator:october',
    defaultMessage: 'Október',
    description: 'October',
  },
  november: {
    id: 'web.pensionCalculator:november',
    defaultMessage: 'Nóvember',
    description: 'November',
  },
  december: {
    id: 'web.pensionCalculator:desember',
    defaultMessage: 'Desember',
    description: 'December',
  },
  birthMonthAndYearDescription: {
    id: 'web.pensionCalculator:birthMonthAndYearDescription',
    defaultMessage:
      'Veldu fæðingarmánuð og ár til að sjá hvenær þú átt rétt á að hefja töku ellilífeyris.',
    description: 'Lýsing fyrir ofan fæðingarmánuð og ár reiti',
  },
  startMonthAndYearDescription: {
    id: 'web.pensionCalculator:startMonthAndYearDescription',
    defaultMessage:
      'Þú getur byrjað töku ellilífeyris frá {month} {year}. Þú getur flýtt um 2 ár eða frestað töku ellilífeyris.',
    description:
      'Lýsing fyrir ofan mánuð og ár reit varðandi hvenær notandi vill hefja töku á ellilífeyri',
  },
  birthMonthLabel: {
    id: 'web.pensionCalculator:birthMonthLabel',
    defaultMessage: 'Mánuður',
    description: 'Birth month',
  },
  birthMonthPlaceholder: {
    id: 'web.pensionCalculator:birthMonthPlaceholder',
    defaultMessage: 'Mánuður',
    description: 'Birth month, placeholder',
  },
  birthYearLabel: {
    id: 'web.pensionCalculator:birthYearLabel',
    defaultMessage: 'Ár',
    description: 'Birth year',
  },
  birthYearPlaceholder: {
    id: 'web.pensionCalculator:birthYearPlaceholder',
    defaultMessage: 'Ár',
    description: 'Birth year, placeholder',
  },
  startMonthLabel: {
    id: 'web.pensionCalculator:startMonthLabel',
    defaultMessage: 'Mánuður',
    description: 'Mánuður sem notandi hefur töku á lífeyri',
  },
  startMonthPlaceholder: {
    id: 'web.pensionCalculator:startMonthPlaceholder',
    defaultMessage: 'Mánuður',
    description: 'Mánuður sem notandi hefur töku á lífeyri, placeholder',
  },
  startYearLabel: {
    id: 'web.pensionCalculator:startYearLabel',
    defaultMessage: 'Ár',
    description: 'Ár sem notandi hefur töku á lífeyri',
  },
  startYearPlaceholder: {
    id: 'web.pensionCalculator:startYearPlaceholder',
    defaultMessage: 'Ár',
    description: 'Ár sem notandi hefur töku á lífeyri, placeholder',
  },
  'REIKNH.GRUNNLIFELLI': {
    id: 'web.pensionCalculator:REIKNH.GRUNNLIFELLI',
    defaultMessage: 'Ellilífeyrir',
    description: 'Niðurstöðuskjár, Ellilífeyrir',
  },
  'REIKNH.HEIMILISUPPBOT': {
    id: 'web.pensionCalculator:REIKNH.HEIMILISUPPBOT',
    defaultMessage: 'Heimilisuppbót',
    description: 'Niðurstöðuskjár, Heimilisuppbót',
  },
  'REIKNH.ORLOFSDESEMBERUPPB': {
    id: 'web.pensionCalculator:REIKNH.ORLOFSDESEMBERUPPB',
    defaultMessage: 'Orlofs- og desemberuppbætur',
    description: 'Niðurstöðuskjár, Orlofs- og desemberuppbætur',
  },
  'REIKNH.SAMTALSTRFYRIRSK': {
    id: 'web.pensionCalculator:REIKNH.SAMTALSTRFYRIRSK',
    defaultMessage: 'Samtals frá TR fyrir skatt',
    description: 'Niðurstöðuskjár, Samtals frá TR fyrir skatt',
  },
  'REIKNH.FRADRSKATTURTR1': {
    id: 'web.pensionCalculator:REIKNH.FRADRSKATTURTR1',
    defaultMessage: 'Frádreginn skattur TR (1. og 2. skattþrep)',
    description: 'Niðurstöðuskjár, Frádreginn skattur TR (1. og 2. skattþrep)',
  },
  'REIKNH.PERSAFSLTRMEIRA': {
    id: 'web.pensionCalculator:REIKNH.PERSAFSLTRMEIRA',
    defaultMessage: 'Persónuafsláttur af greiðslum TR (nýting skattkorts 22%)',
    description: 'Niðurstöðuskjár, Persónuafsláttur',
  },
  'REIKNH.SAMTALSTREFTIRSK': {
    id: 'web.pensionCalculator:REIKNH.SAMTALSTREFTIRSK',
    defaultMessage: 'Samtals frá TR eftir skatt',
    description: 'Niðurstöðuskjár, Samtals frá TR eftir skatt',
  },
  'REIKNH.TEKJURAFATVINNU': {
    id: 'web.pensionCalculator:REIKNH.TEKJURAFATVINNU',
    defaultMessage: 'Tekjur af atvinnu',
    description: 'Niðurstöðuskjár, Tekjur af atvinnu',
  },
  'REIKNH.GRFRALIFEYRISSJ': {
    id: 'web.pensionCalculator:REIKNH.GRFRALIFEYRISSJ',
    defaultMessage: 'Greiðslur frá lífeyrissjóðum',
    description: 'Niðurstöðuskjár, Greiðslur frá lífeyrissjóðum',
  },
  'REIKNH.GRFRASEREIGNASJ': {
    id: 'web.pensionCalculator:REIKNH.GRFRASEREIGNASJ',
    defaultMessage: 'Greiðslur úr séreignarsjóðum',
    description: 'Niðurstöðuskjár, Greiðslur úr séreignarsjóðum',
  },
  'REIKNH.ADRARTEKJUR': {
    id: 'web.pensionCalculator:REIKNH.ADRARTEKJUR',
    defaultMessage: 'Aðrar tekjur',
    description: 'Niðurstöðuskjár, Aðrar tekjur',
  },
  'REIKNH.SKATTSKBAETURSV': {
    id: 'web.pensionCalculator:REIKNH.SKATTSKBAETURSV',
    defaultMessage: 'Skattskyldar bætur sveitarfélaga',
    description: 'Niðurstöðuskjár, Skattskyldar bætur sveitarfélaga',
  },
  'REIKNH.FRADRIDGJLIFEYR': {
    id: 'web.pensionCalculator:REIKNH.FRADRIDGJLIFEYR',
    defaultMessage: 'Frádregin iðgjöld í lífeyrissjóði',
    description: 'Niðurstöðuskjár, Frádregin iðgjöld í lífeyrissjóði',
  },
  'REIKNH.SAMTALSFYRIRSK': {
    id: 'web.pensionCalculator:REIKNH.SAMTALSFYRIRSK',
    defaultMessage: 'Samtals fyrir skatt',
    description: 'Niðurstöðuskjár, Samtals fyrir skatt',
  },
  'REIKNH.PERSAFSLMEIRA': {
    id: 'web.pensionCalculator:REIKNH.PERSAFSLMEIRA',
    defaultMessage: 'Persónuafsláttur (nýting skattkorts 78%)',
    description: 'Niðurstöðuskjár, Persónuafsláttur (nýting skattkorts 78%)',
  },
  'REIKNH.SAMTALSEFTIRSK': {
    id: 'web.pensionCalculator:REIKNH.SAMTALSEFTIRSK',
    defaultMessage: 'Samtals frá öðrum eftir skatt',
    description: 'Niðurstöðuskjár, Samtals frá öðrum eftir skatt',
  },
  'REIKNH.FJARMAGNSTEKJUR': {
    id: 'web.pensionCalculator:REIKNH.FJARMAGNSTEKJUR',
    defaultMessage: 'Fjármagnstekjur',
    description: 'Niðurstöðuskjár, Fjármagnstekjur',
  },
  'REIKNH.SAMTFJARMTEKESK': {
    id: 'web.pensionCalculator:REIKNH.SAMTFJARMTEKESK',
    defaultMessage: 'Samtals fjármagnstekjur eftir skatt',
    description: 'Niðurstöðuskjár, Samtals fjármagnstekjur eftir skatt',
  },
  'REIKNH.GREIDSLURFRATR': {
    id: 'web.pensionCalculator:REIKNH.GREIDSLURFRATR',
    defaultMessage: 'Greiðslur frá Tryggingastofnun',
    description: 'Niðurstöðuskjár, Greiðslur frá Tryggingastofnun',
  },
  'REIKNH.TEKJURFRAODRUM': {
    id: 'web.pensionCalculator:REIKNH.TEKJURFRAODRUM',
    defaultMessage: 'Tekjur frá öðrum',
    description: 'Niðurstöðuskjár, Tekjur frá öðrum',
  },
  'REIKNH.FJARMTEKSAMANT': {
    id: 'web.pensionCalculator:REIKNH.FJARMTEKSAMANT',
    defaultMessage: 'Fjármagnstekjur samanteknar',
    description: 'Niðurstöðuskjár, Fjármagnstekjur samanteknar',
  },
  'REIKNH.TEKJURSAMTALS': {
    id: 'web.pensionCalculator:REIKNH.TEKJURSAMTALS',
    defaultMessage: 'Tekjur samtals',
    description: 'Niðurstöðuskjár, Tekjur samtals',
  },
  'REIKNH.FRADRSTADGR': {
    id: 'web.pensionCalculator:REIKNH.FRADRSTADGR',
    defaultMessage: 'Frádregin staðgreiðsla',
    description: 'Niðurstöðuskjár, Frádregin staðgreiðsla',
  },
  'REIKNH.FRADRFJARMTEKSK': {
    id: 'web.pensionCalculator:REIKNH.FRADRFJARMTEKSK',
    defaultMessage: 'Frádreginn fjármagnstekjuskattur',
    description: 'Niðurstöðuskjár, Frádreginn fjármagnstekjuskattur',
  },
  'REIKNH.FRADRSKATTSAMT': {
    id: 'web.pensionCalculator:REIKNH.FRADRSKATTSAMT',
    defaultMessage: 'Frádregnir skattar samtals',
    description: 'Niðurstöðuskjár, Frádregnir skattar samtals',
  },
  'REIKNH.AFBORGKRAFNATR': {
    id: 'web.pensionCalculator:REIKNH.AFBORGKRAFNATR',
    defaultMessage: 'Afborganir krafna hjá TR',
    description: 'Niðurstöðuskjár, Afborganir krafna hjá TR',
  },
  'REIKNH.SAMTRADSTTEKESK': {
    id: 'web.pensionCalculator:REIKNH.SAMTRADSTTEKESK',
    defaultMessage: 'Samtals ráðstöfunartekjur eftir skatt',
    description: 'Niðurstöðuskjár, Samtals ráðstöfunartekjur eftir skatt',
  },
  'REIKNH.GRUNNLIFENDURH': {
    id: 'web.pensionCalculator:REIKNH.GRUNNLIFENDURH',
    defaultMessage: 'Endurhæfingarlífeyrir',
    description: 'Niðurstöðuskjár, Endurhæfingarlífeyrir',
  },
  'REIKNH.ALDURSVIDBOT': {
    id: 'web.pensionCalculator:REIKNH.ALDURSVIDBOT',
    defaultMessage: 'Aldursviðbót',
    description: 'Niðurstöðuskjár, Aldursviðbót',
  },
  'REIKNH.TEKJUTRYGGING': {
    id: 'web.pensionCalculator:REIKNH.TEKJUTRYGGING',
    defaultMessage: 'Tekjutrygging',
    description: 'Niðurstöðuskjár, Tekjutrygging',
  },
  'REIKNH.FRAMFAERSLUUPPB': {
    id: 'web.pensionCalculator:REIKNH.FRAMFAERSLUUPPB',
    defaultMessage: 'Framfærsluuppbót',
    description: 'Niðurstöðuskjár, Framfærsluuppbót',
  },
  'REIKNH.FRADRSKATTURTR2': {
    id: 'web.pensionCalculator:REIKNH.FRADRSKATTURTR2',
    defaultMessage: 'Frádreginn skattur (1. og 2. skattþrep)',
    description: 'Niðurstöðuskjár, Frádreginn skattur (1. og 2. skattþrep)',
  },
  'REIKNH.GRUNNLIFORORKA': {
    id: 'web.pensionCalculator:REIKNH.GRUNNLIFORORKA',
    defaultMessage: 'Örorkulífeyrir',
    description: 'Niðurstöðuskjár, Örorkulífeyrir',
  },
  'REIKNH.GRUNNLIFHALFURELLI': {
    id: 'web.pensionCalculator:REIKNH.GRUNNLIFHALFURELLI',
    defaultMessage: 'Hálfur ellilífeyrir',
    description: 'Niðurstöðuskjár, Hálfur ellilífeyrir',
  },
  'REIKNHH.ALFHEIMILISUPPBOT': {
    id: 'web.pensionCalculator:REIKNHH.ALFHEIMILISUPPBOT',
    defaultMessage: 'Hálf heimilisuppbót',
    description: 'Niðurstöðuskjár, Hálf heimilisuppbót',
  },
  'REIKNH.GRUNNLIFELLISJOM': {
    id: 'web.pensionCalculator:REIKNH.GRUNNLIFELLISJOM',
    defaultMessage: 'Ellilífeyrir sjómanna',
    description: 'Niðurstöðuskjár, Ellilífeyrir sjómanna',
  },
  'REIKNH.FRADRSKATTUR1': {
    id: 'web.pensionCalculator:REIKNH.FRADRSKATTUR1',
    defaultMessage: 'Frádreginn skattur',
    description: 'Niðurstöðuskjár, Frádreginn skattur',
  },
  highlighedResultItemHeadingForTotalAfterTaxFromTR: {
    id: 'web.pensionCalculator:REIKNH.highlighedResultItemHeadingForTotalAfterTaxFromTR',
    defaultMessage: 'Þar af greiðslur frá TR',
    description: 'Texti efst, Þar af greiðslur frá TR',
  },
})
