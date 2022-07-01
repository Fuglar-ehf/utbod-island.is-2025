import { defineMessage, defineMessages } from 'react-intl'

export const rcRequestedHearingArrangements = {
  heading: defineMessage({
    id:
      'judicial.system.restriction_cases:requested_hearing_arrangements.heading',
    defaultMessage: 'Óskir um fyrirtöku',
    description:
      'Notaður sem titill á óskir um fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  sections: {
    prosecutor: defineMessages({
      heightenSecurityLevelLabel: {
        id:
          'judicial.system.restriction_cases:requested_hearing_arrangements.prosecutor.heighten_security_level_label',
        defaultMessage: 'Hækka öryggisstig',
        description:
          'Notaður sem texti í "Hækka öryggisstig" checkboxi á óskir um fyrirtöku skrefi í rannsóknarheimildum.',
      },
      heightenSecurityLevelInfo: {
        id:
          'judicial.system.restriction_cases:requested_hearing_arrangements.prosecutor.heighten_security_level_info',
        defaultMessage:
          'Með því að hækka öryggisstig á kröfunni verður krafan eingöngu aðgengileg þeim sem stofnaði kröfuna ásamt skráðum ákæranda í málinu.',
        description:
          'Notaður sem upplýsingatexti í "Hækka öryggisstig" checkboxi á óskir um fyrirtöku skrefi í rannsóknarheimildum.',
      },
    }),
    arrestDate: defineMessages({
      heading: {
        id:
          'judicial.system.restriction_cases:requested_hearing_arrangements.arrest_date.heading',
        defaultMessage: 'Tími handtöku',
        description:
          'Notaður sem titill fyrir "tími handtöku" hlutann á óskir um fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    translator: defineMessages({
      heading: {
        id:
          'judicial.system.restriction_cases:requested_hearing_arrangements.translator.heading',
        defaultMessage: 'Túlkur',
        description:
          'Notaður sem titill fyrir "Túlkur" hlutann á óskir um fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      label: {
        id:
          'judicial.system.restriction_cases:requested_hearing_arrangements.translator.label',
        defaultMessage: 'Nafn túlks',
        description:
          'Notaður sem titill í textaboxi fyrir "Túlkur" á óskir um fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      placeholder: {
        id:
          'judicial.system.restriction_cases:requested_hearing_arrangements.translator.placeholder',
        defaultMessage: 'Fullt nafn',
        description:
          'Notaður sem skýritexti í textaboxi fyrir "Túlkur" á óskir um fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
  modal: defineMessages({
    heading: {
      id:
        'judicial.system.restriction_cases:requested_hearing_arrangements.modal.heading',
      defaultMessage: 'Viltu senda tilkynningu?',
      description:
        'Notaður sem titill fyrir "viltu senda tilkynningu" tilkynningagluggan á óskir um fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
    textV2: {
      id:
        'judicial.system.restriction_cases:requested_hearing_arrangements.modal.text_v2',
      defaultMessage:
        'Með því að senda tilkynningu á dómara og dómritara á vakt um að krafa um {caseType, select, ADMISSION_TO_FACILITY {vistun í viðeigandi stofun} TRAVEL_BAN {farbann} other {gæsluvarhald}} sé í vinnslu flýtir það fyrir málsmeðferð og allir aðilar eru upplýstir.',
      description:
        'Notaður sem texti í "viltu senda tilkynningu" tilkynningaglugganum á óskir um fyrirtöku skrefi í gæsluvarðhalds-, vistunar- og farbannsmálum.',
    },
  }),
  prosecutorAccessModal: defineMessages({
    heading: {
      id:
        'judicial.system.restriction_cases:requested_hearing_arrangements.prosecutor_access_modal.heading',
      defaultMessage: 'Viltu skrá annan saksóknara á málið?',
      description:
        'Notaður sem titill fyrir "viltu skrá annan saksóknara á málið" tilkynningagluggan á óskir um fyrirtöku skrefi í rannsóknarheimildum.',
    },
    text: {
      id:
        'judicial.system.restriction_cases:requested_hearing_arrangements.prosecutor_access_modal.text',
      defaultMessage:
        'Með því að skrá annan saksóknara á málið lokast þinn aðgangur að málinu og það verður ekki lengur sýnilegt þér í listanum.',
      description:
        'Notaður sem texti í "viltu skrá annan saksóknara á málið" tilkynningaglugganum á óskir um fyrirtöku skrefi í rannsóknarheimildum.',
    },
    primaryButtonText: {
      id:
        'judicial.system.restriction_cases:requested_hearing_arrangements.prosecutor_access_modal.primary_button_text',
      defaultMessage: 'Já, halda áfram',
      description:
        'Notaður sem texti í "halda áfram" takkanum í tilkynningaglugganum á óskir um fyrirtöku skrefi í rannsóknarheimildum.',
    },
    secondaryButtonText: {
      id:
        'judicial.system.restriction_cases:requested_hearing_arrangements.prosecutor_access_modal.secondary_button_text',
      defaultMessage: 'Nei, hætta við',
      description:
        'Notaður sem texti í "hætta við" takkanum í tilkynningaglugganum á óskir um fyrirtöku skrefi í rannsóknarheimildum.',
    },
  }),
}
