import { defineMessages, MessageDescriptor } from 'react-intl'
type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const oldAgePensionFormMessage: MessageDir = {
  shared: defineMessages({
    institution: {
      id: 'oap.application:institution.name',
      defaultMessage: 'Tryggingastofnun',
      description: 'Tryggingastofnun',
    },
    applicationTitle: {
      id: 'oap.application:applicationTitle',
      defaultMessage: 'Umsókn um ellilífeyri',
      description: 'Application for old age pension',
    },
    formTitle: {
      id: 'oap.application:form.title',
      defaultMessage: 'Umsókn',
      description: 'Application',
    },
    yes: {
      id: 'oal.application:yes',
      defaultMessage: 'Já',
      description: 'Yes',
    },
    no: {
      id: 'oal.application:no',
      defaultMessage: 'Nei',
      description: 'No',
    },
    arrangementSection: {
      id: 'oal.application:arrangement.section',
      defaultMessage: 'Tilhögun',
      description: 'Arrangement',
    },
    homeAllowance: {
      id: 'oap.application:related.applications.homeAllowance',
      defaultMessage: 'Heimilisuppbót',
      description: 'Home allowance',
    },
  }),

  pre: defineMessages({
    prerequisitesSection: {
      id: 'oap.application:prerequisites.section',
      defaultMessage: 'Forsendur',
      description: 'Prerequisites',
    },
    externalDataSubSection: {
      id: 'oap.application:externalData.subSection',
      defaultMessage: 'Gagnaöflun',
      description: 'External Data',
    },
    checkboxProvider: {
      id: 'oap.application:checkbox.provider',
      defaultMessage:
        'Ég skil að ofangreindra gagna verður aflað í umsóknarferlinu',
      description: 'Checbox to confirm data provider',
    },
    userProfileInformationTitle: {
      id: 'oap.application:userprofile.title',
      defaultMessage: 'Upplýsingar frá Þjóðskrá',
      description: 'Information from Registers Iceland',
    },
    userProfileInformationSubTitle: {
      id: 'oap.application:userprofile.subtitle',
      defaultMessage:
        'Sækir upplýsingar um þig, maka og börn frá Þjóðskrá. Einnig eru sóttar upplýsingar um búsetu.',
      description:
        'Information about you, spouse and children will be retrieved from Registers Iceland. Information about residence will also be retrieved.',
    },
    skraInformationTitle: {
      id: 'oap.application:userprofile.title',
      defaultMessage: 'Upplýsingar af mínum síðum á Ísland.is',
      description: 'Information from your account at Ísland.is',
    },
    skraInformationSubTitle: {
      id: 'oap.application:userprofile.subtitle',
      defaultMessage:
        'Upplýsingar um netfang, símanúmer og bankareikning eru sóttar frá mínum síðum á Ísland.is.',
      description:
        'Information about email address, phone number and bank account will be retrieved from your account at Ísland.is.',
    },
    startApplication: {
      id: 'oal.application.start.application',
      defaultMessage: 'Hefja umsókn',
      description: 'Start application',
    },
    questionTitle: {
      id: 'oap.application:question.title',
      defaultMessage: 'Spurningar',
      description: 'Questions',
    },
    pensionFundAlertTitle: {
      id: 'oap.application:pension.fund.alert.title',
      defaultMessage: 'Lífeyrissjóðir',
      description: 'Pension funds',
    },
    pensionFundAlertDescription: {
      id: 'oap.application:pension.fund.alert.description',
      defaultMessage:
        'Þú verður að byrja á því að hafa samband við þá lífeyrissjóði sem þú hefur greitt í áður en þú getur sótt um ellilífeyrir.',
      description:
        'You must start by contacting the pension funds you have paid into before you can apply for a old age pension.',
    },
    pensionFundQuestionTitle: {
      id: 'oap.application:pension.fund.question.title',
      defaultMessage: 'Hefur þú sótt um í öllum þínum lífeyrissjóðum?',
      description: 'Have you applied to all your pension funds?',
    },
    fishermenQuestionTitle: {
      id: 'oap.application:fishermen.question.title',
      defaultMessage: 'Sækirðu um ellilífeyri sjómanna?',
      description: 'Are you applying for fishermen old-age pension?',
    },
    applicationTypeTitle: {
      id: 'pl.application:applicationType.title',
      defaultMessage: 'Tegund umsóknar',
      description: 'Type of application',
    },
    applicationTypeDescription: {
      id: 'pl.application:applicationType.description',
      defaultMessage: 'Vinsamlegast veldu tegund umsóknar',
      description: 'Vinsamlegast veldu tegund umsóknar',
    },
    retirementPensionApplicationTitle: {
      id: 'pl.application:retirementPension.application.title',
      defaultMessage: 'Umsókn um ellilífeyri',
      description: 'retirement pension application',
    },
    retirementPensionApplicationDescription: {
      id: 'pl.application:retirementPension.application.description',
      defaultMessage:
        'Þeir sem eru 65 ára og eldri og hafa átt lögheimili á Íslandi í minnst þrjú ár gætu átt einhvern rétt á ellilífeyri. Sækja þarf um ellilífeyri en almennt myndast réttur við 67 ára aldur.',
      description:
        'Those who are 65 years of age or older and have had legal residence in Iceland for at least three years may have some right to a retirement pension. You have to apply for retirement pension, but in general you are entitled to it at the age of 67.',
    },
    halfRetirementPensionApplicationTitle: {
      id: 'pl.application:halfRetirementPension.application.title',
      defaultMessage: 'Umsókn um hálfan ellilífeyri',
      description: 'Application for half retirement pension',
    },
    halfRetirementPensionApplicationDescription: {
      id: 'pl.application:halfRetirementPension.application.description',
      defaultMessage:
        'Hægt er að sækja um hálfan ellilífeyri hjá TR samhliða greiðslu hálfs lífeyris frá skyldubundnum atvinnutengdum lífeyrissjóðum.',
      description:
        'You can apply for a half retirement pension from TR together with the payment of half a pension from compulsory employment-related pension funds.',
    },
    fishermenApplicationTitle: {
      id: 'pl.application:fishermen.application.title',
      defaultMessage: 'Umsókn um ellilífeyri sjómanna',
      description: "Fishermen's retirement pension",
    },
    fishermenApplicationDescription: {
      id: 'pl.application:fishermen.application.description',
      defaultMessage:
        'Sá sem hefur stundað sjómennsku á lögskráðu íslensku skipi eða skipi gert út af íslenskum aðilum í 25 ár eða lengur getur átt rétt á ellilífeyri frá 60 ára aldri. Fjöldi lögskráðra daga á sjó þarf að vera að lágmarki 180 dagar að meðaltali á ári á 25 árum.',
      description:
        'Anyone who has practiced seamanship on a registered Icelandic ship or a ship built by Icelandic entities for 25 years or more can be entitled to a retirement pension from the age of 60. The number of legally registered days at sea must be a minimum of 180 days on average per year over 25 years.',
    },
  }),

  applicant: defineMessages({
    applicantSection: {
      id: 'oal.application:applicant.section',
      defaultMessage: 'Almennar upplýsingar',
      description: 'Applicant information',
    },
    applicantInfoSubSectionTitle: {
      id: 'oap.application:applicant.info.sub.section.title',
      defaultMessage: 'Upplýsingar um þig',
      description: 'Information about you',
    },
    applicantInfoSubSectionDescription: {
      id: 'oap.application:applicant.info.sub.section.description',
      defaultMessage:
        'Hérna eru upplýsingar um þig. Vinsamlegast farið yfir netfang og símanúmer til að tryggja að þær upplýsingar séu réttar. Athugið ef eftirfarandi upplýsingar eru ekki réttar þá þarf að breyta þeim hjá Þjóðskrá og koma svo aftur til að klára umsóknina.',
      description:
        'Here is information about you. Please review the email address and phone number to ensure that the information is correct. Note that if the following information is not correct, it must be changed at Registers Iceland and then come back to complete the application.',
    },
    applicantInfoName: {
      id: 'oap.application:applicant.info.name',
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    applicantInfoId: {
      id: 'oap.application:applicant.info.id',
      defaultMessage: 'Kennitala',
      description: 'National registry ID',
    },
    applicantInfoAddress: {
      id: 'oap.application:applicant.info.address',
      defaultMessage: 'Póstfang',
      description: 'Postal address',
    },
    applicantInfoPostalcode: {
      id: 'oap.application:applicant.info.postalcode',
      defaultMessage: 'Póstnúmer',
      description: 'Postal code',
    },
    applicantInfoMunicipality: {
      id: 'oap.application:applicant.info.municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Municipality',
    },
    applicantInfoEmail: {
      id: 'oap.application:applicant.info.email',
      defaultMessage: 'Netfang',
      description: 'Email address',
    },
    applicantInfoPhonenumber: {
      id: 'oap.application:applicant.info.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'Phone number',
    },
    applicantInfoMaritalTitle: {
      id: 'oap.application:applicant.info.martial.title',
      defaultMessage: 'Hjúskaparstaða þín',
      description: 'Your marital status',
    },
    applicantInfoMaritalStatus: {
      id: 'oap.application:applicant.info.marital.status',
      defaultMessage: 'Hjúskaparstaða',
      description: 'Marital status',
    },
    applicantInfoSpouseName: {
      id: 'oap.application:applicant.info.spouse.name',
      defaultMessage: 'Nafn maka',
      description: `Spouse's name`,
    },
  }),

  onePaymentPerYear: defineMessages({
    onePaymentPerYearTitle: {
      id: 'oap.application:one.payment.per.year.title',
      defaultMessage: 'Ein greiðsla á ári',
      description: 'One payment per year',
    },
    onePaymentPerYearDescription: {
      id: 'oap.application:one.payment.per.year.description',
      defaultMessage:
        'Vilt þú óska eftir að fá greiddan lífeyri einu sinni á ári? Þá eru réttindin reiknuð út þegar staðfest skattframtal liggur fyrir og eru greidd út í einu lagi. Ath með því að fá greitt einu sinni á ári fær viðkomandi nákvæmlega það sem hann á rétt á og losnar til dæmis við að fá á sig kröfu við uppgjör vegna ofgreiddra greiðslnna. Reynist inneign vera til staðar verður hún greidd með eingreiðslu þann 1. júní.',
      description: 'description',
    },
    onePaymentPerYearAlertTitle: {
      id: 'oap.application:one.payment.per.year.alert.title',
      defaultMessage: 'Athugið',
      description: 'Attention',
    },
    onePaymentPerYearAlertDescription: {
      id: 'oap.application:one.payment.per.year.alert.description',
      defaultMessage:
        'Að óska eftir að fá greiddan lífeyri einu sinni á ári hefur áhrif á allar þínar lífeyrisgreiðslur frá Tryggingastofnun og mánaðargreiðslur þínar munu stöðvast.',
      description: 'description',
    },
  }),

  connectedApplications: defineMessages({
    childSupport: {
      id: 'oap.application:related.applications.childSupport',
      defaultMessage: 'Barnalífeyri',
      description: 'Child support',
    },
    relatedApplicationsSection: {
      id: 'oap.application:related.applications.section',
      defaultMessage: 'Tengdar umsóknir',
      description: 'Related applications',
    },
    relatedApplicationsSectionDescription: {
      id: 'oap.application:related.applications.section.description',
      defaultMessage:
        'Hér eru tengdar umsóknir sem þú gætir átt rétt á. Hakaðu í þær umsóknir sem þú vilt sækja um.',
      description:
        'Here are related applications you may be eligible for. Check the applications you want to apply for.',
    },
  }),

  residence: defineMessages({
    residenceHistoryTitle: {
      id: 'oap.application:residence.history.title',
      defaultMessage: 'Búsetusaga',
      description: 'Residence history',
    },
    residenceHistoryDescription: {
      id: 'oap.application:residence.history.description',
      defaultMessage:
        'Hérna eru upplýsingar um búsetusögu þína eftir 1987. Full réttindi af ellilífeyri miðast við samtals 40 ára búsetu á Íslandi á tímabilinu 16-67 ára. Þegar búsetutími á Íslandi er styttri reiknast réttindin hlutfallslega miðað við búsetu. Athugið ef eftirfarandi upplýsingar eru ekki réttar þá þarf að breyta þeim hjá Þjóðskrá og koma svo aftur til að klára umsóknina.',
      description:
        'Here is information about your residence history after 1987. Full entitlement to old age pension is based on a total of 40 years of residence in Iceland between the ages of 16-67. When the period of residence in Iceland is shorter, the rights are calculated proportionally based on residence. Note that if the following information is not correct, it must be changed at Registers Iceland and then come back to complete the application.',
    },
    residenceHistoryQuestion: {
      id: 'oap.application:residence.history.question',
      defaultMessage: 'Hefur þú búið erlendis fyrir árið 1987?',
      description: 'Have you live abroad before 1987?',
    },
    residenceHistoryCountryTableHeader: {
      id: 'oap.application:residence.history.country.table.header',
      defaultMessage: 'Land',
      description: 'Country',
    },
    residenceHistoryPeriodFromTableHeader: {
      id: 'oap.application:residence.history.period.from.table.header',
      defaultMessage: 'Tímabil frá',
      description: 'Period from',
    },
    residenceHistoryPeriodToTableHeader: {
      id: 'oap.application:residence.history.period.to.table.header',
      defaultMessage: 'Tímabil til',
      description: 'Period to',
    },
  }),

  review: defineMessages({
    name: {
      id: 'oap.application:review.name',
      defaultMessage: 'Nafn',
      description: 'Name',
    },
    nationalId: {
      id: 'oap.application:review.nationalId',
      defaultMessage: 'Kennitala',
      description: 'National registry ID',
    },
    address: {
      id: 'oap.application:review.address',
      defaultMessage: 'Heimili',
      description: 'Address',
    },
    municipality: {
      id: 'oap.application:review.municipality',
      defaultMessage: 'Sveitarfélag',
      description: 'Municipality',
    },
    email: {
      id: 'oap.application:review.email',
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    phonenumber: {
      id: 'oap.application:review.phonenumber',
      defaultMessage: 'Símanúmer',
      description: 'phonenumber',
    },
    spouseName: {
      id: 'oap.application:review.spouse.name',
      defaultMessage: 'Nafn maka',
      description: `Spouse's name`,
    },
    period: {
      id: 'oap.application:review.period',
      defaultMessage: 'Tímabil',
      description: `Period`,
    },
    fishermen: {
      id: 'oap.application:review.fishermen',
      defaultMessage: 'Ellilífeyri sjómanna',
      description: `Fishermen`,
    },
    confirmSectionTitle: {
      id: 'oap.application:confirmation.section.title',
      defaultMessage: 'Staðfesting',
      description: 'Confirm',
    },
    confirmTitle: {
      id: 'oap.application:confirmation.title',
      defaultMessage: 'Senda inn umsókn',
      description: 'Submit application',
    },
    confirmationDescription: {
      id: 'oap.application:confirmation.description',
      defaultMessage:
        'Vinsamlegast farðu yfir umsóknina áður en þú sendir hana inn.',
      description: 'Please review the application before submitting.',
    },
  }),

  period: defineMessages({
    periodTitle: {
      id: 'oap.application:period.title',
      defaultMessage: 'Tímabil',
      description: 'Period',
    },
    periodDescription: {
      id: 'oap.application:period.description',
      defaultMessage:
        'Veldu dagsetningu sem þú vilt byrja að fá greitt ellilífeyri. Hægt er að sækja fyrir árið í ár og 2 ár aftur í tímann.',
      description:
        'Select the date you want to start receiving your retirement pension. You can apply for this year and 2 years back.',
    },
    periodAttachmentForEarlyRetirementTitle: {
      id: 'oap.application:period.attachedment.for.early.retirement.title',
      defaultMessage: 'Fylgiskjöl vegna snemmtöku',
      description: 'Early retirement attachment',
    },
    periodAttachmentForEarlyRetirementDescription: {
      id:
        'oap.application:period.attachedment.for.early.retirement.description',
      defaultMessage:
        'Hér getur þú skilað yfirliti úr lífeyrisgátt sem þú hefur áunnið þér réttindi í. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit an overview from the pension portal in which you have earned rights. Note that the document must be in .pdf format.',
    },
    periodInputMonth: {
      id: 'oap.application:period.input.month',
      defaultMessage: 'Mánuður',
      description: 'Month',
    },
    periodInputMonthDefaultText: {
      id: 'oap.application:period.input.month.default.text',
      defaultMessage: 'Veldu mánuð',
      description: 'Select month',
    },
    periodInputYear: {
      id: 'oap.application:period.input.year',
      defaultMessage: 'Ár',
      description: 'Year',
    },
    periodInputYearDefaultText: {
      id: 'oap.application:period.input.year.default.text',
      defaultMessage: 'Veldu ár',
      description: 'Select year',
    },
    january: {
      id: 'oap.application:period.january',
      defaultMessage: 'Janúar',
      description: 'January',
    },
    february: {
      id: 'oap.application:period.february',
      defaultMessage: 'Febrúar',
      description: 'February',
    },
    march: {
      id: 'oap.application:period.march',
      defaultMessage: 'Mars',
      description: 'March',
    },
    april: {
      id: 'oap.application:period.april',
      defaultMessage: 'Apríl',
      description: 'April',
    },
    may: {
      id: 'oap.application:period.may',
      defaultMessage: 'Maí',
      description: 'May',
    },
    june: {
      id: 'oap.application:period.june',
      defaultMessage: 'Júní',
      description: 'June',
    },
    july: {
      id: 'oap.application:period.july',
      defaultMessage: 'Júlí',
      description: 'July',
    },
    agust: {
      id: 'oap.application:period.agust',
      defaultMessage: 'Águst',
      description: 'Agust',
    },
    september: {
      id: 'oap.application:period.september',
      defaultMessage: 'September',
      description: 'September',
    },
    october: {
      id: 'oap.application:period.october',
      defaultMessage: 'Október',
      description: 'October',
    },
    november: {
      id: 'oap.application:period.november',
      defaultMessage: 'Nóvember',
      description: 'November',
    },
    desember: {
      id: 'oap.application:period.desember',
      defaultMessage: 'Desember',
      description: 'December',
    },
    periodAlertTitle: {
      id: 'oap.application:period.alert.title',
      defaultMessage: 'Til athugunar!',
      description: 'For consideration',
    },
    periodAlertMessage: {
      id: 'oap.application:period.alert.message',
      defaultMessage:
        'Þú ert að sækja um snemmtöku miðað við valið tímabil. Nánar um snemmtöku má lesa hér. Réttur ellilífeyris myndast 1. næsta mánuð eftir fæðingardag.',
      description:
        'You are applying for early admission based on the selected period. You can read more about early birding here. The right to old-age pension is established on the 1st of the following month after birthday.',
    },
  }),

  fileUpload: defineMessages({
    title: {
      id: 'oap.application:fileUpload.title',
      defaultMessage: 'Fylgiskjöl',
      description: 'Attachments',
    },
    attachmentButton: {
      id: 'pl.application:fileUpload.attachment.button',
      defaultMessage: 'Veldu skjal',
      description: 'Upload file',
    },
    attachmentHeader: {
      id: 'pl.application:fileUpload.attachment.header',
      defaultMessage: 'Dragðu skjalið hingað til að hlaða upp',
      description: 'Drag files here to upload',
    },
    attachmentDescription: {
      id: 'pl.application:fileUpload.attachment.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .pdf',
      description: 'Accepted documents with the following extensions: .pdf',
    },
    attachmentMaxSizeError: {
      id: 'pl.application:fileUpload.attachment.maxSizeError',
      defaultMessage: 'Hámark 5 MB á skrá',
      description: 'Max 5 MB per file',
    },
    earlyRetirementTitle: {
      id: 'oap.application:fileUpload.earlyRetirement.title',
      defaultMessage: 'Fylgiskjöl vegna snemmtöku',
      description: 'Early retirement attachment',
    },
    earlyRetirementDescription: {
      id: 'oap.application:fileUpload.earlyRetirement.description',
      defaultMessage:
        'Hér getur þú skilað yfirliti úr lífeyrisgátt sem þú hefur áunnið þér réttindi í. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit an overview from the pension portal in which you have earned rights. Note that the document must be in .pdf format.',
    },
    pensionFileTitle: {
      id: 'oap.application:fileUpload.pensionFile.title',
      defaultMessage: 'Fylgiskjöl lífeyrissjóða',
      description: 'Pension fund attachment',
    },
    pensionFileDescription: {
      id: 'oap.application:fileUpload.pensionFile.description',
      defaultMessage:
        'Hér getur þú skilað staðfestingu greiðslna hjá lífeyrissjóði. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can return confirmation of payments to the pension fund. Note that the document must be in .pdf format.',
    },
    fishermenFileTitle: {
      id: 'oap.application:fileUpload.pensionFile.title',
      defaultMessage: 'Fylgiskjöl sjómanna',
      description: 'Fishermen attachment',
    },
    fishermenFileDescription: {
      id: 'oap.application:fileUpload.pensionFile.description',
      defaultMessage:
        'Hér getur þú skilað gögnum sem staðfesta hversu marga daga þú hefur verið lögskráður á sjó. Dæmi um slík gögn eru; Yfirlit af stöðuskráningu sjómanns frá Samgöngustofu, sjóferðabækur sem gefnar voru út af Siglingastofnun Íslands, skattframtöl eða siglingavottorð frá Sýslumanni. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit data confirming how many days you have been legally registered at sea. Examples of such data are; An overview of the seafarers status registration from the Transport Agency, sea voyage books published by the Icelandic Maritime Administration, tax returns or sailing certificates from the County Commissioner. Note that the document must be in .pdf format.',
    },
    additionalFileTitle: {
      id: 'oap.application:fileUpload.additionalFile.title',
      defaultMessage: 'Fylgiskjöl viðbótagögn',
      description: 'Additional attachments',
    },
    additionalFileDescription: {
      id: 'oap.application:fileUpload.earlyRetirement.description',
      defaultMessage:
        'Hér getur þú skilað viðbótargögnum til Tryggingastofnunar. Til dæmis staðfestingu frá Þjóðskrá vegna rangar upplýsingar. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can submit additional data to TR. For example, confirmation from the National Registry due to incorrect information. Note that the document must be in .pdf format.',
    },
    homeAllowanceTitle: {
      id: 'oap.application:fileUppload.homeAllowance.title',
      defaultMessage: 'Fylgiskjöl Heimilisuppbóta',
      description: 'Home allowance additional files',
    },
    homeAllowanceLeaseAgreement: {
      id: 'oap.application:fileUppload.homeAllowance.leaseAgreement',
      defaultMessage:
        'Hér getur þú skilað undirritaðum leigusamningi. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        'Here you can upload the signed rental agreement. Note that the document must be in .pdf format.',
    },
    homeAllowanceSchoolConfirmation: {
      id: 'oap.application:fileUppload.homeAllowance.schoolConfirmation',
      defaultMessage:
        'Hér getur þú skilað vottorði um skólavist ungmennis. Athugaðu að skjalið þarf að vera á .pdf formi.',
      description:
        "Here you can upload a certificate of a young person's school attendance. Note that the document must be in .pdf format.",
    },
  }),

  comment: defineMessages({
    commentSection: {
      id: 'oap.application:comment.section',
      defaultMessage: 'Athugasemd',
      description: 'Comment',
    },
    description: {
      id: 'oap.application:comment.description',
      defaultMessage: 'Hafir þú einhverja athugasemd skildu hana eftir hér.',
      description: 'If you have any comments, leave them here.',
    },
    placeholder: {
      id: 'oap.application:comment.placeholder',
      defaultMessage: 'Skrifaðu hér athugasemd',
      description: 'Your comment',
    },
  }),

  homeAllowance: defineMessages({
    description: {
      id: 'oap.application:homeAllowance.description',
      defaultMessage:
        'Til að eiga rétt á heimilisuppbót verður umsækjandi að vera einhleypur og búa einn. Einnig er heimilt að greiða heimilisuppbót til lífeyrisþega ef maki dvelur á stofnun fyrir aldraða. Tvær undantekningar eru á þessu: býr með barni/börnum yngri en 18 ára eða 18-25 ára ungmenni/um  sem er í námi eða ef ungmenni yngra en 25 ára er með tímabundið aðsetur fjarri lögheimili vegna náms.',
      description:
        'To be eligible for housing allowance, the applicant must be single and live alone. It is also permitted to pay household allowance to the pensioner if the spouse stays in an institution for the elderly. There are two exceptions to this: lives with a child/children under the age of 18 or a young person aged 18-25 who is studying or if a young person under the age of 25 has a temporary residence away from their legal residence due to studies.',
    },
    housing: {
      id: 'oap.application:homeAllowance.housing',
      defaultMessage: 'Hvar býrð þú?',
      description: 'Where do you live?',
    },
    housingOwner: {
      id: 'oap.application:homeAllowance.housing.owner',
      defaultMessage: 'Bý í eigin húsnæði',
      description: 'Live in own place',
    },
    housingRenter: {
      id: 'oap.application:homeAllowance.housing.renter',
      defaultMessage: 'Bý í leiguhúsnæði',
      description: 'Live in a rented place',
    },
    childrenBetween18And25: {
      id: 'oap.application:homeAllowance.children.betweem18And25',
      defaultMessage:
        'Býr ungmenni á aldrinum 18-25 ára á heimilinu sem er í námi?',
      description:
        'Does a young person aged 18-25 live in the household who is studying?',
    },
    alertTitle: {
      id: 'oap.application:homeAllowance.alert.title',
      defaultMessage: 'Athuga',
      description: 'Attention',
    },
    alertDescription: {
      id: 'oap.application:homeAllowance.alert.description',
      defaultMessage:
        'Samkvæmt uppflettingu í Þjóðskrá býr einstaklingur eldri en 25 ára á sama lögheimili og þú. Ef þú telur þetta vera vitlaust skaltu hafa samband við Þjóðskrá til að laga þetta. Þegar þú ert búinn að gera viðeigandi breytingar hjá Þjóðskrá getur þú haldið áfram með umsóknina og skila inn skjali því til staðfestingar hér aftar í ferlinu.',
      description:
        'According National Register, a person older than 25 lives in the same legal address as yours. If you think this is wrong, contact the National Registry to fix it. When you have made the appropriate changes at the National Register, you can continue with the application and submit the document for confirmation later in the process.',
    },
  }),

  errors: defineMessages({
    phoneNumber: {
      id: 'oap.application:error.phonenumber',
      defaultMessage: 'Símanúmerið þarf að vera gilt.',
      description: 'The phone number must be valid.',
    },
  }),
}

export const validatorErrorMessages = defineMessages({
  periodStartDateNeeded: {
    id: 'pl.application:period.startDate.Needed',
    defaultMessage: 'Finn ekki byrjunardagsetning.',
    description: 'Could not calculate startDate.',
  },
  periodEndDateNeeded: {
    id: 'pl.application:period.endDate.Needed',
    defaultMessage: 'Finn ekki endadagsetning.',
    description: 'Could not calculate endDate.',
  },
  periodYear: {
    id: 'pl.application:period.year',
    defaultMessage: 'Vitlaust ár.',
    description: 'Invalid year.',
  },
  periodMonth: {
    id: 'pl.application:period.month',
    defaultMessage: 'Vitlaus mánuður.',
    description: 'Invalid month.',
  },
  requireAttachment: {
    id: 'pl.application:fileUpload.required.attachment',
    defaultMessage: 'Þú þarft að hlaða upp viðhenginu til að halda áfram.',
    description: 'Error message when the attachment file is not provided.',
  },
})
