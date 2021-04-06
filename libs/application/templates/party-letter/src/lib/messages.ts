import { defineMessages, MessageDescriptor } from 'react-intl'

type MessageDir = Record<string, Record<string, MessageDescriptor>>

export const m: MessageDir = {
  // Messages shared accross party letter application
  externalDataSection: defineMessages({
    title: {
      id: 'ple.application:terms.title',
      defaultMessage: 'Skilmálar',
      description: 'External data title',
    },
    subtitle: {
      id: 'ple.application:terms.subtitle',
      defaultMessage: 'Eftirfarandi gildir um umsókn og meðmælendasöfnun',
      description: 'External data subtitle',
    },
    dmrTitle: {
      id: 'ple.application:dmr.title',
      defaultMessage: 'Dómsmálaráðuneyti',
      description: 'External data DRM title',
    },
    dmrSubtitle: {
      id: 'ple.application:dmr.subtitle',
      defaultMessage: 'Skilmálar og reglugerðir',
      description: 'External data DRM subtitle',
    },
    nationalRegistryTitle: {
      id: 'ple.application:nationalRegistry.title',
      defaultMessage: 'Persónupplýsingar úr þjóðskrá',
      description: 'External data national registry title',
    },
    nationalRegistrySubtitle: {
      id: 'ple.application:nationalRegistry.subtitle',
      defaultMessage: 'Frekar skýring hér',
      description: 'External data national registry subtitle',
    },
    islandTitle: {
      id: 'ple.application:island.title',
      defaultMessage: 'Ísland.is',
      description: 'External data island.is title',
    },
    islandSubtitle: {
      id: 'ple.application:island.subtitle',
      defaultMessage: 'Lorem ipsum dolar sit amet, consectetur adipiscing elit',
      description: 'External data island.is subtitle',
    },
    agree: {
      id: 'ple.application:island.subtitle',
      defaultMessage: 'Lorem ipsum dolar sit amet, consectetur adipiscing elit',
      description: 'External data island.is subtitle',
    },
  }),
  recommendations: defineMessages({
    title: {
      id: 'ple.application:recommendations.title',
      defaultMessage: 'Safna meðmælum',
      description: 'Recommendations title',
    },
    linkDescription: {
      id: 'ple.application:recommendations.link.description',
      defaultMessage: 'Hér er hlekkur til að senda út á meðmælendur',
      description: 'Recommendations link description',
    },
    copyLinkButton: {
      id: 'ple.application:recommendations.link.button',
      defaultMessage: 'Afrita hlekk',
      description: 'Copy link button',
    },
    nameCount: {
      id: 'ple.application:recommendations.name.count',
      defaultMessage: 'nafn á lista (300)',
      description: 'X name on list',
    },
    namesCount: {
      id: 'ple.application:recommendations.names.count',
      defaultMessage: 'nöfn á lista (300)',
      description: 'X names on list',
    },
    invalidSignatures: {
      id: 'ple.application:recommendations.invalid.signatures',
      defaultMessage: 'Sjá einungis meðmæli í vafa',
      description: 'Only show invalid signatures',
    },
    searchbar: {
      id: 'ple.application:recommendations.search',
      defaultMessage: 'Leitaðu hér',
      description: 'Searchbar placeholder',
    },
    thDate: {
      id: 'ple.application:recommendations.th.date',
      defaultMessage: 'Dags skráð',
      description: 'Table header date',
    },
    thName: {
      id: 'ple.application:recommendations.th.name',
      defaultMessage: 'Nafn',
      description: 'Table header name',
    },
    thNationalNumber: {
      id: 'ple.application:recommendations.th.nationalnumber',
      defaultMessage: 'Kennitala',
      description: 'Table header national number',
    },
    thAddress: {
      id: 'ple.application:recommendations.th.address',
      defaultMessage: 'Heimilisfang',
      description: 'Table header address',
    },
    includePapers: {
      id: 'ple.application:recommendations.includePapers',
      defaultMessage: 'Ég ætla skila inn meðmælum á pappír*',
      description: 'Include paper signatures',
    },
    includePapersDisclaimerPt1: {
      id: 'ple.application:recommendations.includePapers.disclaimer1',
      defaultMessage:
        '*Fyrir meðmæli á pappír þarf að lista upp kennitölur meðmælenda í skjal og hlaða upp hér að neðan.',
      description: 'Include paper signatures disclaimer part 1',
    },
    includePapersDisclaimerPt2: {
      id: 'ple.application:recommendations.includePapers.disclaimer2',
      defaultMessage:
        '*Pappírsmeðmæli skulu einnig sendast með bréfpósti til yfirkjörstjórnar.',
      description: 'Include paper signatures disclaimer part 2',
    },
    noPaper: {
      id: 'ple.application:recommendations.paper.no',
      defaultMessage: 'Nei, ég er ekki með meðmælendur á pappír',
      description: 'No paper signatures',
    },
    yesPaper: {
      id: 'ple.application:recommendations.paper.yes',
      defaultMessage: 'Já, ég er með meðmælendur á pappír',
      description: 'Yes paper signatures',
    },
    fileUploadHeader: {
      id: 'ple.application:recommendations.fileupload.header',
      defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
      description: 'Header for file upload',
    },
    uploadDescription: {
      id: 'ple.application:recommendations.fileupload.description',
      defaultMessage: 'Tekið er við skjölum með endingu: .xlsx',
      description: 'Description for file upload',
    },
    uploadButtonLabel: {
      id: 'ple.application:recommendations.fileupload.label',
      defaultMessage: 'Velja skjöl til að hlaða upp',
      description: 'Label for file upload',
    },
  }),
  selectSSD: defineMessages({
    title: {
      id: 'ple.application:ssd.title',
      defaultMessage: 'Kennitala framboðs',
      description: 'Select SSD title',
    },
  }),
  selectPartyLetter: defineMessages({
    title: {
      id: 'ple.application:partyletter.title',
      defaultMessage: 'Skráðu nafn og listabókstaf',
      description: 'Party Letter title',
    },
    sectionTitle: {
      id: 'ple.application:partyletter.section.title',
      defaultMessage: 'Nafn flokks',
      description: 'Party Letter section title',
    },
    partyLetterLabel: {
      id: 'ple.application:partyletter.partyletter.label',
      defaultMessage: 'Listabókstafur sem óskað er eftir',
      description: 'Label for party letter input box',
    },
    partyLetterPlaceholder: {
      id: 'ple.application:partyletter.partyletter.placeholder',
      defaultMessage: 'Listabókstafur',
      description: 'Placeholder for party letter input box',
    },
    partyNameLabel: {
      id: 'ple.application:partyletter.partyname.label',
      defaultMessage: 'Nafn flokks',
      description: 'Label for party name input box',
    },
    partyNamePlaceholder: {
      id: 'ple.application:partyletter.partyname.placeholder',
      defaultMessage: 'Nafn',
      description: 'Placeholder for party name input box',
    },
    partyLetterSubtitle: {
      id: 'ple.application:partyletter.subtitle',
      defaultMessage:
        'Við alþingiskosningarnar 28. október 2017 buðu eftirtalin stjórnmálasamtök fram lista og voru þeir merktir sem hér segir:',
      description: 'Description before listing upp unavailable party letters',
    },
  }),
  overview: defineMessages({
    title: {
      id: 'ple.application:overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Overview title',
    },
    subtitle: {
      id: 'ple.application:overview.subtitle',
      defaultMessage:
        'Vinsamlegast farðu yfir gögnin hér að neðan til að staðfesta að réttar upplisýngar hafi verið gefnar upp.',
      description: 'Overview subtitle',
    },
    reviewTitle: {
      id: 'ple.application:overview.review.title',
      defaultMessage: 'Upplýsingar um listabókstaf',
      description: 'Overview review title',
    },
    partyLetter: {
      id: 'ple.application:overview.partyletter',
      defaultMessage: 'Listabókstafur',
      description: 'Overview label for party letter',
    },
    partyName: {
      id: 'ple.application:overview.partyname',
      defaultMessage: 'Nafn flokks',
      description: 'Overview label for party name',
    },
    responsibleParty: {
      id: 'ple.application:overview.responsible.party',
      defaultMessage: 'Ábyrgðarmaður',
      description: 'Overview label for responsible party',
    },
    signaturesCount: {
      id: 'ple.application:overview.signatures.count',
      defaultMessage: 'Fjöldi meðmælenda',
      description: 'Overview label for signatures count',
    },
    warningCount: {
      id: 'ple.application:overview.warning.count',
      defaultMessage: 'Fjöldi meðmælenda í vafa',
      description: 'Overview label for signatures count with warning',
    },
    includePapers: {
      id: 'ple.application:overview.include.papers',
      defaultMessage: 'Meðmælendur á pappír',
      description: 'Overview label for include papers checkbox',
    },
    submitButton: {
      id: 'ple.application:overview.submit.button',
      defaultMessage: 'Skila lista',
      description: 'Overview submit button',
    },
    finalTitle: {
      id: 'ple.application:overview.final.title',
      defaultMessage: 'Umsókn móttekin',
      description: 'Title after submit',
    },
    finalSubtitle: {
      id: 'ple.application:overview.final.subtitle',
      defaultMessage:
        'Þú munt fá skilaboð í tölvupósti þegar umsókn er í vinnslu',
      description: 'Subtitle after submit',
    },
  }),
  validationMessages: defineMessages({
    approveTerms: {
      id: 'ple.application:validationmessages.approveTerms',
      defaultMessage: 'Vinsamlegast samþykktu skilmála',
      description: 'Error message for terms and conditions',
    },
    ssd: {
      id: 'ple.application:validationmessages.ssd',
      defaultMessage: 'Vinsamlegast veldu kennitölu',
      description: 'Error message for selection ssd',
    },
    partyLetterOccupied: {
      id: 'ple.application:validationmessages.letter.occupied',
      defaultMessage: 'Bókstafur þegar á skrá',
      description: 'Error message if party letter is occupied',
    },
    partyLetterSingle: {
      id: 'ple.application:validationmessages.letter.single',
      defaultMessage: 'Bókstafur skal vera stakur',
      description: 'Error message if party letter is empty or > 1',
    },
    partyName: {
      id: 'ple.application:validationmessages.party.name',
      defaultMessage: 'Vinsamlegast veldu nafn á flokkinn',
      description: 'Error message if party name is empty',
    },
    signatureInvalid: {
      id: 'ple.application:validationmessages.signature.invalid',
      defaultMessage: 'Undirskrift ekki lengur gild',
      description: 'Error message if signature has new address',
    },
  }),
  collectSignatures: defineMessages({
    applicationTitle: {
      id: 'ple.application:collect.applicationtitle',
      defaultMessage: 'Listabókstafur',
      description: 'Title for collect signatures application',
    },
    stepTitle: {
      id: 'ple.application:collect.steptitle',
      defaultMessage: 'Samþykkja',
      description: 'Title for section step',
    },
    sectionTitle: {
      id: 'ple.application:collect.secitontitle',
      defaultMessage: 'Listabókstafs meðmælendalisti',
      description:
        'Partial title for section, party letter will be added programmatically',
    },
    nameInput: {
      id: 'ple.application:collect.name.input',
      defaultMessage: 'Nafn',
      description: 'Label and placeholder for name input field',
    },
    descriptionPt1: {
      id: 'ple.application:collect.descripton.pt.one',
      defaultMessage:
        'Með því að mæla með úthlutun tiltekins listabókstafs til tilgreinds stjórnamálaflokks samþykkir þú að viðkomandi stjórnmálaflokkur, dómsmálaráðuneytið og Þjóðskrá Íslands fái aðgang að þeim upplýsingum sem skráðar eru. Þeir aðilar hafa ekki heimild til að miðla þeim upplýsingum frekar.',
      description: 'Disclaimer description, first paragraph',
    },
    descriptionPt2: {
      id: 'ple.application:collect.descripton.pt.two',
      defaultMessage:
        'Þjóðskrá Íslands er heimilt, að beiðni dómsmálaráðuneytisins, að samkeyra meðmælendalistann við þjóðskrá að fullnægðum heimildum laga um persónuvernd og vinnslu persónuupplýsinga gilda hverju sinni.',
      description: 'Disclaimer description, second paragraph',
    },
    agreeTermsLabel: {
      id: 'ple.application:collect.agree.label',
      defaultMessage: 'Ég hef kynnt mér ofangreint',
      description: 'Label for terms and conditions',
    },
    submitButton: {
      id: 'ple.application:collect.submit.button',
      defaultMessage: 'Setja nafn mitt á lista',
      description: 'Title for submit button',
    },
  }),
  signatureDisclaimer: defineMessages({
    part1: {
      id: 'ple.application:signature.pt.1',
      defaultMessage: 'Ég lýsi því hér með yfir að ég mæli með því að',
      description: 'Part 1 of signature disclaimer',
    },
    part2: {
      id: 'ple.application:signature.pt.2',
      defaultMessage: 'fái úthlutað listabókstafnum',
      description: 'Part 2 of signature disclaimer',
    },
  }),
}
