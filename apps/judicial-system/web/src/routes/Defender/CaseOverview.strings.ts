import { defineMessages } from 'react-intl'

// Strings on signed verdict overview screen
export const defenderCaseOverview = defineMessages({
  investigationCaseRejectedTitle: {
    id:
      'judicial.system.core:defender_case_overview.investigation_case_rejected_title',
    defaultMessage: 'Kröfu um rannsóknarheimild hafnað',
    description:
      'Notaður sem titil á yfirlitsskjá verjanda þegar kröfu um rannsóknarheimild hefur verið hafnað.',
  },
  restrictionCaseRejectedTitle: {
    id:
      'judicial.system.core:defender_case_overview.restriction_case_rejected_title',
    defaultMessage: 'Kröfu hafnað',
    description:
      'Notaður sem titil á yfirlitsskjá verjanda þegar kröfu um gæslu/vistun/farbann hefur verið hafnað.',
  },
  caseDismissedTitle: {
    id: 'judicial.system.core:defender_case_overview.case_dismissed_title',
    defaultMessage: 'Kröfu vísað frá',
    description:
      'Notaður sem titill á yfirlitsskjá verjanda þegar kröfu hefur verið vísað frá.',
  },
  investigationCaseAcceptedTitle: {
    id:
      'judicial.system.core:defender_case_overview.investigation_case_accepted_title',
    defaultMessage: 'Krafa um rannsóknarheimild samþykkt',
    description:
      'Notaður sem titil á yfirlitsskjá verjanda þegar krafa um rannsóknarheimild hefur verið samþykkt.',
  },
  restrictionCaseExpiredTitle: {
    id:
      'judicial.system.core:defender_case_overview.restriction_case_expired_title',
    defaultMessage:
      '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun} TRAVEL_BAN {Farbanni} other {Gæsluvarðhaldi}} lokið',
    description:
      'Notaður sem titil á yfirlitsskjá verjanda þegar gæslu/vistun/farbanni er lokið.',
  },
  restrictionCaseActiveTitle: {
    id:
      'judicial.system.core:defender_case_overview.restriction_case_active_title',
    defaultMessage:
      '{caseType, select, ADMISSION_TO_FACILITY {Vistun á viðeigandi stofnun virk} TRAVEL_BAN {Farbann virkt} other {Gæsluvarðhald virkt}}',
    description:
      'Notaður sem titil á yfirlitsskjá verjanda þegar gæsla/vistun/farbann er ekki lokið.',
  },
  restrictionCaseScheduledTitle: {
    id:
      'judicial.system.core:defender_case_overview.restriction_case_scheduled_title',
    defaultMessage:
      'Krafa um {caseType, select, ADMISSION_TO_FACILITY {{isExtended, select, true {framlengingu á } other {}}vistun á viðeigandi stofnun} TRAVEL_BAN {{isExtended, select, true {framlengingu á farbanni} other {farbann}}} other {{isExtended, select, true {framlengingu á gæsluvarðhaldi} other {gæsluvarðhald}}}}',
    description:
      'Notaður sem titill á yfirlitsskjá verjanda þegar kröfu um gæslu/vistun/farbann hefur verið úthlutað fyrirtökutíma.',
  },
  rulingDate: {
    id: 'judicial.system.core:defender_case_overview.ruling_date',
    defaultMessage: 'Úrskurðað {courtEndTime}',
    description: 'Notaður fyrir tíma úrskurðar á yfirlitsskjá verjanda.',
  },
  modifiedDatesHeading: {
    id: 'judicial.system.core:defender_case_overview.modified_dates_heading',
    defaultMessage:
      'Lengd {caseType, select, ADMISSION_TO_FACILITY {vistunar} other {gæslu}} uppfærð',
    description:
      'Notaður sem titill í upplýsingaboxi um uppfærða lengd gæslu á yfirlitsskjá verjanda.',
  },
  conclusionHeading: {
    id: 'judicial.system.core:defender_case_overview.conclusion_heading',
    defaultMessage: 'Úrskurðarorð',
    description:
      'Notaður sem titill fyrir úrskurðarorð á yfirlitsskjá verjanda.',
  },
  documentHeading: {
    id: 'judicial.system.core:defender_case_overview.document_heading',
    defaultMessage: 'Skjöl málsins',
    description:
      'Notaður sem titill fyrir skjöl málsins á yfirlitsskjá verjanda.',
  },
  unsignedRuling: {
    id: 'judicial.system.core:defender_case_overview.unsigned_ruling',
    defaultMessage: 'Úrskurður ekki undirritaður',
    description:
      'Texti sem birtist ef úrskurður er ekki undirritaður á yfirlitsskjá verjanda',
  },
  confirmAppealAfterDeadlineModalTitle: {
    id:
      'judicial.system.core:defender_case_overview.confirm_appeal_after_deadline_modal_title',
    defaultMessage: 'Kærufrestur er liðinn',
    description:
      'Notaður sem titill modal glugga þegar kært er eftir að kærufrestur rennur út.',
  },
  confirmAppealAfterDeadlineModalText: {
    id:
      'judicial.system.core:defender_case_overview.confirm_appeal_after_deadline_modal_text',
    defaultMessage: 'Viltu halda áfram og senda kæru?',
    description:
      'Notaður sem texti í modal glugga þegar kært er eftir að kærufrestur rennur út.',
  },
  confirmAppealAfterDeadlineModalPrimaryButtonText: {
    id:
      'judicial.system.core:defender_case_overview.confirm_appeal_after_deadline_modal_primary_button_text',
    defaultMessage: 'Já, senda kæru',
    description:
      'Notaður sem texti í staðfesta takka í modal glugga þegar kært er eftir að kærufrestur rennur út.',
  },
  confirmAppealAfterDeadlineModalSecondaryButtonText: {
    id:
      'judicial.system.core:defender_case_overview.confirm_appeal_after_deadline_modal_secondary_button_text',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti í Hætta við takka í modal glugga þegar kært er eftir að kærufrestur rennur út.',
  },
  confirmStatementAfterDeadlineModalTitle: {
    id:
      'judicial.system.core:case_overview.confirm_statement_after_deadline_modal_title',
    defaultMessage: 'Frestur til að skila greinargerð er liðinn',
    description:
      'Notaður sem titill í modal glugga hjá sækjanda þegar frestur til greinargerðar er liðinn.',
  },
  confirmStatementAfterDeadlineModalText: {
    id:
      'judicial.system.core:case_overview.confirm_statement_after_deadline_modal_text',
    defaultMessage: 'Viltu halda áfram og senda greinargerð?',
    description:
      'Notaður sem texti í modal glugga hjá sækjanda þegar frestur til greinargerðar er liðinn.',
  },
  confirmStatementAfterDeadlineModalPrimaryButtonText: {
    id:
      'judicial.system.core:case_overview.confirm_statement_after_deadline_modal_primary_button_text',
    defaultMessage: 'Já, senda greinargerð',
    description:
      'Notaður sem texti í staðfesta takka í modal glugga hjá verjanda þegar frestur til greinargerðar er liðinn.',
  },
  confirmStatementAfterDeadlineModalSecondaryButtonText: {
    id:
      'judicial.system.core:case_overview.confirm_statement_after_deadline_modal_secondary_button_text',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti í Hætta við takka í modal glugga hjá verjanda þegar frestur til greinargerðar er liðinn.',
  },
})
