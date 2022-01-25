import { defineMessages } from 'react-intl'

export const icCourtRecord = {
  sections: {
    courtAttendees: defineMessages({
      defendantNotPresentAutofill: {
        id:
          'judicial.system.investigation_cases:court_record.court_attendees.defendant_not_present_autofill_v1',
        defaultMessage:
          'Varnaraðil{defendantSuffix} er{areSuffix} ekki viðstaddur sbr. 104. gr. laga 88/2008 um meðferð sakamála.',
        description:
          'Notaður sem sjálfgefinn texti í "Mættir eru" textaboxi á þingbókar skrefi í rannsóknarheimildum',
      },
    }),
    accusedBookings: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.title',
        defaultMessage: 'Bókanir um varnaraðila',
        description:
          'Notaður sem titill fyrir "Bókarnir um varnaraðila" hlutann í rannsóknarheimildum.',
      },
      label: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.label',
        defaultMessage: 'Afstaða varnaraðila og aðrar bókanir',
        description:
          'Notaður sem titill í "Afstaða varnaraðila og aðrar bókanir" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.placeholder',
        defaultMessage: 'Nánari útlistun á afstöðu sakbornings',
        description:
          'Notaður sem skýritexti í "Afstaða varnaraðila og aðrar bókanir" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.tooltip-2',
        defaultMessage:
          'Hér er hægt að bóka í þingbók um réttindi og afstöðu varnaraðila, ásamt bókunum t.d. um verjanda og túlk. Hægt er að sleppa öllum bókunum hér, t.d. ef varnaraðili er ekki viðstaddur.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "Afstaða varnaraðila og aðrar bókanir" svæðið í rannsóknarheimildum.',
      },
      autofillRightToRemainSilent: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.autofill_right_to_remain_silent',
        defaultMessage:
          'Varnaraðila er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Sakborningur er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.',
        description:
          'Sjálfgefinn texti í "Afstaða kærða og aðrar bókanir" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      autofillCourtDocumentOne: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.autofill_court_document_one',
        defaultMessage: 'Varnaraðila er kynnt krafa á dómskjali nr. 1.',
        description:
          'Sjálfgefinn texti í "Afstaða kærða og aðrar bókanir" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      autofillAccusedPlea: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.autofill_accused_plea',
        defaultMessage:
          'Varnaraðili mótmælir kröfunni / Varnaraðili samþykkir kröfuna',
        description:
          'Sjálfgefinn texti í "Afstaða kærða og aðrar bókanir" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      autofillDefender: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.autofill_defender',
        defaultMessage:
          '{defender} lögmaður er skipaður verjandi varnaraðila að hans ósk.',
        description:
          'Sjálfgefinn texti í "Afstaða kærða og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      autofillTranslator: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.autofill_translator',
        defaultMessage:
          '{translator} túlkar fyrir varnaraðila það sem fram fer í þinghaldinu.',
        description:
          'Sjálfgefinn texti í "Afstaða kærða og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      autofillSpokeperson: {
        id:
          'judicial.system.investigation_cases:court_record.accused_bookings.autofill_spokeperson',
        defaultMessage:
          'Í dóminn er mætt/ur {spokesperson} lögmaður sem dómari skipar nú til að gæta hagsmuna þess aðila sem krafan beinist að. Hann/hún hefur undirritað heit skv. 2. mgr. 84. gr. laga númer 88/2008 um meðferð sakamála.',
        description:
          'Sjálfgefinn texti í "Afstaða kærða og aðrar bókanir" textaboxi á þingbókar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    courtLocation: defineMessages({
      label: {
        id:
          'judicial.system.investigation_cases:court_record.court_location.label',
        defaultMessage: 'Hvar var dómþing haldið?',
        description:
          'Notaður sem titill í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      placeholder: {
        id:
          'judicial.system.investigation_cases:court_record.court_location.placeholder',
        defaultMessage:
          'Staðsetning þinghalds, t.d. "í Héraðsdómi Reykjavíkur"',
        description:
          'Notaður sem skýritexti í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.investigation_cases:court_record.court_location.tooltip',
        defaultMessage:
          'Sláðu inn staðsetningu dómþings í þágufalli með forskeyti sem hefst á litlum staf. Dæmi "í Héraðsdómi Reykjavíkur". Staðsetning mun birtast með þeim hætti í upphafi þingbókar.',
        description:
          'Notaður sem upplýsingatexti í "Hvar var dómþing haldið?" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
    }),
    courtDocuments: defineMessages({
      header: {
        id:
          'judicial.system.investigation_cases:court_record.court_documents.header',
        defaultMessage: 'Dómskjöl',
        description:
          'Notað sem fyrirsögn í "Dómskjöl" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      tag: {
        id:
          'judicial.system.investigation_cases:court_record.court_documents.tag',
        defaultMessage: 'Þingmerkt nr. 1',
        description:
          'Notað sem tagg í "Dómskjöl" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
      text: {
        id:
          'judicial.system.investigation_cases:court_record.court_documents.text',
        defaultMessage: 'Rannsóknargögn málsins liggja frammi.',
        description:
          'Notað sem útskýringar texti í "Dómskjöl" textaboxi á þingbókar skrefi í rannsóknarheimildum.',
      },
    }),
  },
}
