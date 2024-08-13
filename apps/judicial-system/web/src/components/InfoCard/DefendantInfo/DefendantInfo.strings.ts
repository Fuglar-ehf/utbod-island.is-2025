import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  appealExpirationDate: {
    id: 'judicial.system.core:info_card.defendant_info.appeal_expiration_date',
    defaultMessage: 'Áfrýjunarfrestur dómfellda er til {appealExpirationDate}',
    description: 'Notað til að birta áfrýjunarfrest dómfellda í ákæru.',
  },
  appealDateExpired: {
    id: 'judicial.system.core:info_card.defendant_info.appeal_date_expired',
    defaultMessage: 'Áfrýjunarfrestur dómfellda var til {appealExpirationDate}',
    description:
      'Notað til að láta vita að áfrýjunarfrestur í ákæru er útrunninn.',
  },
  appealDateNotBegun: {
    id: 'judicial.system.core:info_card.defendant_info.appeal_date_not_begun',
    defaultMessage: 'Áfrýjunarfrestur dómfellda er ekki hafinn',
    description:
      'Notaður til að láta vita að áfrýjunarfrestur dómfellda er ekki hafinn.',
  },
  serviceRequirementNotRequired: {
    id: 'judicial.system.core:info_card.defendant_info.service_requirement_not_required',
    defaultMessage: 'Dómfelldi var viðstaddur dómþing',
    description: 'Notað til að láta vita birting dóms er ekki nauðsynleg.',
  },
  serviceRequirementNotApplicable: {
    id: 'judicial.system.core:info_card.defendant_info.service_requirement_not_applicable',
    defaultMessage: 'Birting dóms ekki þörf',
    description: 'Notað til að láta vita birting dóms er ekki nauðsynleg.',
  },
  defender: {
    id: 'judicial.system.core:info_card.defendant_info.defender',
    defaultMessage: 'Verjandi',
    description: 'Notað til að birta titil á verjanda í ákæru.',
  },
  verdictDisplayedDate: {
    id: 'judicial.system.core:info_card.defendant_info.verdict_displayed_date',
    defaultMessage: 'Dómur birtur {date}',
    description: 'Notað til að birta dagsetningu þegar dómur var birtur.',
  },
  noDefenderAssigned: {
    id: 'judicial.system.core:info_card.defendant_info.no_defender_assigned',
    defaultMessage: 'Ekki skráður',
    description:
      'Notað til að láta vita að enginn verjandi er skráður í ákæru.',
  },
  spokesperson: {
    id: 'judicial.system.core:info_card.spokesperson',
    defaultMessage: 'Talsmaður',
    description: 'Notaður sem titill á "talsmanni" á upplýsingaspjaldi máls.',
  },
  defenders: {
    id: 'judicial.system.core:info_card.defenders',
    defaultMessage: 'Verjendur',
    description: 'Notaður sem titill á "verjendum" á upplýsingaspjaldi máls.',
  },
  noDefender: {
    id: 'judicial.system.core:info_card.no_defender',
    defaultMessage: 'Hefur ekki verið skráður',
    description: 'Notaður sem texti þegar enginn verjandi er skráður.',
  },
})
