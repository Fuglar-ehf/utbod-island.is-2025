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
  returnIndictmentButtonText: {
    id: 'judicial.system.core:indictment_overview.return_indictment_button_text',
    defaultMessage: 'Endursenda',
    description: 'Notaður sem texti á takka til að endursenda ákæru.',
  },
  serviceRequirementRequired: {
    id: 'judicial.system.core:indictment_overview.service_requirement_required',
    defaultMessage: 'Birta skal dómfellda dóminn',
    description:
      'Notaður sem texti í valmöguleika fyrir það þegar birta skal dómdfellda dóminn.',
  },
  serviceRequirementNotRequired: {
    id: 'judicial.system.core:indictment_overview.service_requirement_not_required',
    defaultMessage: 'Birting dóms ekki þörf',
    description:
      'Notaður sem texti í valmöguleika fyrir það þegar ekki skal birta dómdfellda dóminn.',
  },
  serviceRequirementNotApplicable: {
    id: 'judicial.system.core:indictment_overview.service_requirement_not_applicable',
    defaultMessage: 'Dómfelldi var viðstaddur dómsuppkvaðningu',
    description:
      'Notaður sem texti í valmöguleika fyrir það þegar birting dóms á ekki við.',
  },
  sendToPublicProsecutorModalTitle: {
    id: 'judicial.system.core:indictment_overview.send_to_public_prosecutor_modal_title',
    defaultMessage: 'Mál hefur verið sent til Ríkissaksóknara',
    description:
      'Notaður sem titill á staðfestingarglugga um að mál hafi verið sent til Ríkissaksóknara.',
  },
  sendToPublicProsecutorModalText: {
    id: 'judicial.system.core:indictment_overview.send_to_public_prosecutor_modal_text',
    defaultMessage: 'Gögn hafa verið send til Ríkissaksóknara til yfirlesturs',
    description:
      'Notaður sem texti í staðfestingarglugga um að mál hafi verið sent til Ríkissaksóknara.',
  },
  sendToPublicProsecutorModalNextButtonText: {
    id: 'judicial.system.core:indictment_overview.send_to_public_prosecutor_modal_next_button_text',
    defaultMessage: 'Senda til ákæruvalds',
    description:
      'Notaður sem texti á takka í staðfestingarglugga um að mál hafi verið sent til Ríkissaksóknara.',
  },
})
