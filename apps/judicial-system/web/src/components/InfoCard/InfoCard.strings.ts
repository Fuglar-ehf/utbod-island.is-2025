import { defineMessages } from 'react-intl'

export const infoCardActiveIndictment = defineMessages({
  indictmentCreated: {
    id: 'judicial.system.core:info_card_active_indictment.indictment_created',
    defaultMessage: 'Dagsetning ákæru',
    description:
      'Notaður sem titill á "dagsetningu ákæru" hluta af yfirliti ákæru.',
  },
  prosecutor: {
    id: 'judicial.system.core:info_card_active_indictment.prosecutor',
    defaultMessage: 'Ákærandi',
    description: 'Notaður sem titill á "ákærandi" hluta af yfirliti ákæru.',
  },
  offence: {
    id: 'judicial.system.core:info_card_active_indictment.offence',
    defaultMessage: 'Brot',
    description: 'Notaður sem titill á "brot" hluta af yfirliti ákæru.',
  },
})

export const infoCardCaseScheduled = defineMessages({
  scheduled: {
    id: 'judicial.system.core:info_card_case_scheduled.scheduled',
    defaultMessage: 'Á dagskrá',
    description: 'Notaður sem texti sem tilgreinir að málið sé á dagskrá',
  },
  postponed: {
    id: 'judicial.system.core:info_card_case_scheduled.postponed',
    defaultMessage: 'Frestað',
    description:
      'Notaður sem texti sem tilgreinir að málinu hafi verið sé frestað',
  },
  courtRoom: {
    id: 'judicial.system.core:info_card_case_scheduled.court_room',
    defaultMessage:
      '{courtRoom, select, NONE {Dómsalur hefur ekki verið skráður} other {Dómsalur {courtRoom}}}',
    description: 'Notaður sem texti sem tilgreinir hvaða dómsalur er skráður',
  },
})
