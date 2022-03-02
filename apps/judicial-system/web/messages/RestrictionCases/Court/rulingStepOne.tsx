import { defineMessage, defineMessages } from 'react-intl'

export const rcRulingStepOne = {
  title: defineMessage({
    id: 'judicial.system.restriction_cases:ruling_step_one.title',
    defaultMessage: 'Úrskurður',
    description:
      'Notaður sem titill á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  sections: {
    prosecutorDemands: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.prosecutor_demands.title',
        defaultMessage: 'Dómkröfur',
        description:
          'Notaður sem titill fyrir "dómkröfur" hlutann á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.prosecutor_demands.label',
        defaultMessage: 'Krafa lögreglu',
        description:
          'Notaður sem titill fyrir í "Krafa lögreglu" textaboxi á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.prosecutor_demands.placeholder',
        defaultMessage: 'Hvað hafði ákæruvaldið að segja?',
        description:
          'Notaður sem skýritexti fyrir í "Hvað hafði ákæruvaldið að segja?" textabox á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    courtCaseFacts: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.court_case_facts.title',
        defaultMessage: 'Greinargerð um málsatvik',
        description:
          'Notaður sem titill fyrir "greinargerð um málsatvik" hlutann á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.court_case_facts.tooltip',
        defaultMessage:
          'Greinargerð lögreglu er forbókuð hér fyrir neðan. Hægt er að breyta textanum og mun hann birtast með þeim hætti í úrskurði dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um málsatvik" titlinn á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.court_case_facts.label',
        defaultMessage: 'Greinargerð um málsatvik',
        description:
          'Notaður sem titill fyrir "greinargerð um málsatvik" innsláttarsvæðið á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.court_case_facts.placeholder',
        defaultMessage:
          'Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?',
        description:
          'Notaður sem skýritexti fyrir "greinargerð um málsatvik" innsláttarsvæðið á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum..',
      },
    }),
    courtLegalArguments: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.court_legal_arguments.title',
        defaultMessage: 'Greinargerð um lagarök',
        description:
          'Notaður sem titill fyrir "Greinargerð um lagarök" hlutann á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.court_legal_arguments.tooltip',
        defaultMessage:
          'Greinargerð lögreglu er forbókuð hér fyrir neðan. Hægt er að breyta textanum og mun hann birtast með þeim hætti í úrskurði dómara.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "greinargerð um lagarök" titlinn á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.court_legal_arguments.label',
        defaultMessage: 'Greinargerð um lagarök',
        description:
          'Notaður sem titill fyrir "Lagarök" innsláttarsvæðið á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.court_legal_arguments.placeholder',
        defaultMessage:
          'Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?',
        description:
          'Notaður sem skýritexti fyrir "greinargerð um málsatvik" innsláttarsvæðið á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    decision: defineMessages({
      title: {
        id: 'judicial.system.restriction_cases:ruling_step_one.decision.title',
        defaultMessage: 'Úrskurður',
        description:
          'Notaður sem titill fyrir "Úrskurður" hlutann á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      acceptLabel: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.decision.accept_label',
        defaultMessage: 'Krafa um {caseType} samþykkt',
        description:
          'Notaður sem texti við radio takka með vali um að samþykkja gæsluvarðhald á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      partiallyAcceptLabel: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.decision.partially_accept_label',
        defaultMessage: 'Krafa um gæsluvarðhald tekin til greina að hluta',
        description:
          'Notaður sem texti við radio takka með vali um að samþykkja gæsluvarðhald að hluta á úrskurðar skrefi í gæsluvarðhaldsmálum.',
      },
      rejectLabel: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.decision.reject_label',
        defaultMessage: 'Kröfu um {caseType} hafnað',
        description:
          'Notaður sem texti við radio takka með vali um að hafna gæsluvarðhaldi á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      dismissLabel: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.decision.dismiss_label',
        defaultMessage: 'Kröfu um {caseType} vísað frá',
        description:
          'Notaður sem texti við radio takka með vali um að vísa máli frá á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      acceptingAlternativeTravelBanLabel: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.decision.accepting_alternative_travel_ban_label',
        defaultMessage: 'Kröfu um gæsluvarðhald hafnað en úrskurðað í farbann',
        description:
          'Notaður sem texti við radio takka með vali um að hafna gæsluvarðhaldi en úrskurða í farbann á úrskurðar skrefi í gæsluvarðhaldsmálum.',
      },
    }),
    ruling: defineMessages({
      title: {
        id: 'judicial.system.restriction_cases:ruling_step_one.ruling.title',
        defaultMessage: 'Niðurstaða',
        description:
          'Notaður sem titill fyrir "Niðurstaða" hlutann á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    custodyRestrictions: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.custody_restrictions.title',
        defaultMessage: 'Takmarkanir á gæslu',
        description:
          'Notaður sem titill fyrir "Takmarkanir á gæslu" hlutann á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      isolation: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.custody_restrictions.isolation',
        defaultMessage: '{genderedAccused} skal sæta einangrun',
        description:
          'Notaður sem texti sem segir til um einangrun á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    conclusion: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.conclusion.title',
        defaultMessage: 'Úrskurðarorð',
        description:
          'Notaður sem titill fyrir "Úrskurðarorð" hlutann á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.conclusion.label',
        defaultMessage: 'Úrskurðarorð',
        description:
          'Notaður sem titill fyrir "Úrskurðarorð" innsláttarsvæði á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.conclusion.placeholder',
        defaultMessage: 'Hver eru úrskurðarorðin',
        description:
          'Notaður sem placeholder fyrir "Úrskurðarorð" innsláttarsvæði á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      dismissingAutofill: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.conclusion.dismissing_autofill',
        defaultMessage:
          'Kröfu um að {genderedAccused}, {accusedName}, sæti{extensionSuffix} {caseType} er vísað frá.',
        description:
          'Notaður sem sjálfgefinn texti í "Úrskurðarorð" textaboxi þegar kröfu er vísað frá á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      rejectingAutofill: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.conclusion.rejecting_autofillv1',
        defaultMessage:
          'Kröfu um að {genderedAccused}, {accusedName}{accusedNationalId}sæti{extensionSuffix} {caseType} er hafnað.',
        description:
          'Notaður sem sjálfgefinn texti í "Úrskurðarorð" textaboxi þegar kröfu er hafnað á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      acceptingAutofill: {
        id:
          'judicial.system.restriction_cases:ruling_step_one.conclusion.accepting_autofillv1',
        defaultMessage:
          '{genderedAccused}, {accusedName}{accusedNationalId}skal sæta {caseTypeAndExtensionSuffix}, þó ekki lengur en til {validToDate}.{isolationSuffix}',
        description:
          'Notaður sem sjálfgefinn texti í "Úrskurðarorð" textaboxi þegar krafa er samþykkt á úrskurðar skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
}
