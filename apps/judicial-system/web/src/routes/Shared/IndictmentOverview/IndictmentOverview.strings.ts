import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  inProgressTitle: {
    id: 'judicial.system.core:indictment_overview.in_progress_title',
    defaultMessage: 'Yfirlit ákæru',
    description:
      'Notaður sem titill á yfirliti ákæru þegar máli er ekki lokið.',
  },
  completedTitle: {
    id: 'judicial.system.core:indictment_overview.completed_title',
    defaultMessage: 'Máli lokið',
    description: 'Notaður sem titill á yfirliti ákæru þegar máli er lokið.',
  },
  completeReview: {
    id: 'judicial.system.core:indictment_overview.complete_review',
    defaultMessage: 'Ljúka yfirlestri',
    description: 'Notaður sem texti á takka til að loka yfirliti ákæru.',
  },
})
