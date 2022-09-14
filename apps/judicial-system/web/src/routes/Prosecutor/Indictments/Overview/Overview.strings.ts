import { defineMessage } from 'react-intl'

export const overview = {
  heading: defineMessage({
    id: 'judicial.system.indictments:overview.heading',
    defaultMessage: 'Yfirlit ákæru',
    description: 'Notaður sem titill á yfirlit ákæru skrefi í ákærum.',
  }),
  indictmentCreated: defineMessage({
    id: 'judicial.system.indictments:overview.indictment_created',
    defaultMessage: 'Dagsetning ákæru',
    description:
      'Notaður sem titill á "dagsetningu ákæru" hluta af yfirliti ákæru á Yfirlit ákæru skefi í ákærum.',
  }),
  prosecutor: defineMessage({
    id: 'judicial.system.indictments:overview.prosecutor',
    defaultMessage: 'Ákærandi',
    description:
      'Notaður sem titill á "ákærandi" hluta af yfirliti ákæru á Yfirlit ákæru skefi í ákærum.',
  }),
  caseType: defineMessage({
    id: 'judicial.system.indictments:overview.case_type',
    defaultMessage: 'Brot',
    description:
      'Notaður sem titill á "brot" hluta af yfirliti ákæru á Yfirlit ákæru skefi í ákærum.',
  }),
  nextButtonText: defineMessage({
    id: 'judicial.system.indictments:overview.next_button_text',
    defaultMessage:
      '{isNewIndictment, select, true {Senda} other {Endursenda}} ákæru á héraðsdóm',
    description: 'Texti í áfram takka á Yfirlit ákæru skefi í ákærum.',
  }),
  modalHeading: defineMessage({
    id: 'judicial.system.indictments:overview.modal_heading',
    defaultMessage: 'Ákæra hefur verið send á dómstól',
    description: 'Titill í modal glugga á Yfirlit ákæru skefi í ákærum.',
  }),
  modalButtonText: defineMessage({
    id: 'judicial.system.indictments:overview.modal_button_text',
    defaultMessage: 'Loka glugga',
    description: 'Texti í hnapp í modal glugga á Yfirlit ákæru skefi í ákærum.',
  }),
  caseFilesHeading: defineMessage({
    id: 'judicial.system.indictments:overview.case_files_heading',
    defaultMessage: 'Skjöl málsins',
    description: 'Titill á skjöl málsins hluta á Yfirlit ákæru skefi í ákærum.',
  }),
}
