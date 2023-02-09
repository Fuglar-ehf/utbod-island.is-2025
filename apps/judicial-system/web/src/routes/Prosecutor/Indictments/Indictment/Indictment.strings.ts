import { defineMessages } from 'react-intl'

export const indictment = defineMessages({
  heading: {
    id: 'judicial.system.core:indictments_indictment.heading',
    defaultMessage: 'Ákæra',
    description: 'Notaður sem titill á ákæra skrefi í ákærum.',
  },
  introductionLabel: {
    id: 'judicial.system.core:indictments_indictment.introduction_label',
    defaultMessage: 'Inngangur',
    description:
      'Notaður sem titill á Inngangur textasvæði á ákæra skrefi í ákærum.',
  },
  introductionPlaceholder: {
    id: 'judicial.system.core:indictments_indictment.introduction_placeholder',
    defaultMessage: 'Hver höfðar sakamál á hendur hverjum?',
    description:
      'Notaður sem skýritexti á Inngangur textasvæði á ákæra skrefi í ákærum.',
  },
  indictmentIntroductionAutofillAnnounces: {
    id:
      'judicial.system.core:indictments_indictment.indictment_introduction_autofill_announces',
    defaultMessage: 'gjörir kunnugt:',
    description:
      'Notaður sem sjálfgefinn texti í Inngangur textasvæði á ákæra skrefi í ákærum.',
  },
  indictmentIntroductionAutofillCourt: {
    id:
      'judicial.system.core:indictments_indictment.indictment_introduction_court',
    defaultMessage: 'Að höfða ber sakamál fyrir {court} á hendur',
    description:
      'Notaður sem sjálfgefinn texti í Inngangur textasvæði á ákæra skrefi í ákærum.',
  },
  indictmentIntroductionAutofillDefendant: {
    id:
      'judicial.system.core:indictments_indictment.indictment_introduction_defendant_name',
    defaultMessage: '{defendantName}, kt. {defendantNationalId}',
    description:
      'Notaður sem sjálfgefinn texti í Inngangur textasvæði á ákæra skrefi í ákærum.',
  },
  indictmentCountHeading: {
    id: 'judicial.system.core:indictments_indictment.indictment_count_heading',
    defaultMessage: 'Ákæruliður {count}',
    description: 'Notaður sem titill á ákærulið.',
  },
  addIndictmentCount: {
    id: 'judicial.system.core:indictments_indictment.add_indictment_count',
    defaultMessage: 'Bæta við ákærulið',
    description: 'Notaður sem texti á "Bæta við ákærulið" hnappi.',
  },
})
