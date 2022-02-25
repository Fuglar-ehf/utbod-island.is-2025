import { useIntl } from 'react-intl'

import {
  Case,
  CaseType,
  isRestrictionCase,
  User,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import { caseResult } from '@island.is/judicial-system-web/src/components/PageLayout/utils'
import { sections } from '@island.is/judicial-system-web/messages/Core/sections'
import { signedVerdictOverview } from '@island.is/judicial-system-web/messages/Core/signedVerdictOverview'
import { capitalize } from '@island.is/judicial-system/formatters'
import * as Constants from '@island.is/judicial-system/consts'
import {
  isAccusedStepValidRC,
  isCourtHearingArrangemenstStepValidRC,
  isCourtHearingArrangementsStepValidIC,
  isCourtRecordStepValidIC,
  isCourtRecordStepValidRC,
  isDefendantStepValidIC,
  isHearingArrangementsStepValidIC,
  isHearingArrangementsStepValidRC,
  isReceptionAndAssignmentStepValidRC,
  isReceptionAndAssignmentStepValidIC,
  isPoliceDemandsStepValidIC,
  isPoliceDemandsStepValidRC,
  isPoliceReportStepValidIC,
  isPoliceReportStepValidRC,
  isRulingStepOneValidIC,
  isRulingStepOneValidRC,
  isRulingStepTwoValidIC,
  isRulingStepTwoValidRC,
} from '../../validate'

interface Section {
  name: string
  children: {
    type: string
    name: string
    href: string | undefined
  }[]
}

const useSections = () => {
  const { formatMessage } = useIntl()

  const findLastValidStep = (section: Section) => {
    const filterValidSteps = section.children.filter((c) => c.href)
    return filterValidSteps[filterValidSteps.length - 1]
  }

  const hasCourtPermission = (workingCase: Case, user?: User) => {
    return (
      user?.id === workingCase.judge?.id ||
      user?.id === workingCase.registrar?.id
    )
  }

  const getCustodyAndTravelBanProsecutorSection = (
    workingCase: Case,
    activeSubSection?: number,
  ): Section => {
    const { type, id } = workingCase

    return {
      name: formatMessage(
        type === CaseType.CUSTODY
          ? sections.custodyAndTravelBanProsecutorSection.custodyTitle
          : sections.custodyAndTravelBanProsecutorSection.travelBanTitle,
      ),
      children: [
        {
          type: 'SUB_SECTION',
          name: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
          href: `${Constants.STEP_ONE_ROUTE}/${id}`,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.custodyAndTravelBanProsecutorSection.hearingArrangements,
          ),
          href:
            (activeSubSection && activeSubSection > 1) ||
            isAccusedStepValidRC(workingCase)
              ? `${Constants.STEP_TWO_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.custodyAndTravelBanProsecutorSection.policeDemands,
          ),
          href:
            (activeSubSection && activeSubSection > 2) ||
            (isAccusedStepValidRC(workingCase) &&
              isHearingArrangementsStepValidRC(workingCase))
              ? `${Constants.STEP_THREE_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.custodyAndTravelBanProsecutorSection.policeReport,
          ),
          href:
            (activeSubSection && activeSubSection > 3) ||
            (isAccusedStepValidRC(workingCase) &&
              isHearingArrangementsStepValidRC(workingCase) &&
              isPoliceDemandsStepValidRC(workingCase))
              ? `${Constants.STEP_FOUR_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.custodyAndTravelBanProsecutorSection.caseFiles,
          ),
          href:
            (activeSubSection && activeSubSection > 4) ||
            (isAccusedStepValidRC(workingCase) &&
              isHearingArrangementsStepValidRC(workingCase) &&
              isPoliceDemandsStepValidRC(workingCase) &&
              isPoliceReportStepValidRC(workingCase))
              ? `${Constants.STEP_FIVE_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.custodyAndTravelBanProsecutorSection.overview,
          ),
          href:
            isAccusedStepValidRC(workingCase) &&
            isHearingArrangementsStepValidRC(workingCase) &&
            isPoliceDemandsStepValidRC(workingCase) &&
            isPoliceReportStepValidRC(workingCase)
              ? `${Constants.STEP_SIX_ROUTE}/${id}`
              : undefined,
        },
      ],
    }
  }

  const getInvestigationCaseProsecutorSection = (
    workingCase: Case,
    activeSubSection?: number,
  ): Section => {
    const { id } = workingCase

    return {
      name: formatMessage(sections.investigationCaseProsecutorSection.title),
      children: [
        {
          type: 'SUB_SECTION',
          name: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
          href: `${Constants.IC_DEFENDANT_ROUTE}/${id}`,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseProsecutorSection.hearingArrangements,
          ),
          href:
            (activeSubSection && activeSubSection > 1) ||
            isDefendantStepValidIC(workingCase)
              ? `${Constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseProsecutorSection.policeDemands,
          ),
          href:
            (activeSubSection && activeSubSection > 2) ||
            (isDefendantStepValidIC(workingCase) &&
              isHearingArrangementsStepValidIC(workingCase))
              ? `${Constants.IC_POLICE_DEMANDS_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseProsecutorSection.policeReport,
          ),
          href:
            (activeSubSection && activeSubSection > 3) ||
            (isDefendantStepValidIC(workingCase) &&
              isHearingArrangementsStepValidIC(workingCase) &&
              isPoliceDemandsStepValidIC(workingCase))
              ? `${Constants.IC_POLICE_REPORT_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseProsecutorSection.caseFiles,
          ),
          href:
            (activeSubSection && activeSubSection > 4) ||
            (isDefendantStepValidIC(workingCase) &&
              isHearingArrangementsStepValidIC(workingCase) &&
              isPoliceDemandsStepValidIC(workingCase))
              ? `${Constants.IC_CASE_FILES_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseProsecutorSection.overview,
          ),
          href:
            isDefendantStepValidIC(workingCase) &&
            isHearingArrangementsStepValidIC(workingCase) &&
            isPoliceDemandsStepValidIC(workingCase)
              ? `${Constants.IC_POLICE_CONFIRMATION_ROUTE}/${id}`
              : undefined,
        },
      ],
    }
  }

  const getInvestigationCaseCourtSections = (
    workingCase: Case,
    user?: User,
    activeSubSection?: number,
  ): Section => {
    const { id } = workingCase

    return {
      name: formatMessage(sections.investigationCaseCourtSection.title),
      children: [
        {
          type: 'SUB_SECTION',
          name: formatMessage(sections.courtSection.receptionAndAssignment),
          href: `${Constants.IC_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(sections.investigationCaseCourtSection.overview),
          href:
            (activeSubSection && activeSubSection > 1) ||
            isReceptionAndAssignmentStepValidIC(workingCase)
              ? `${Constants.IC_OVERVIEW_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseCourtSection.hearingArrangements,
          ),
          href:
            (activeSubSection && activeSubSection > 2) ||
            isReceptionAndAssignmentStepValidIC(workingCase)
              ? `${Constants.IC_COURT_HEARING_ARRANGEMENTS_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseCourtSection.courtRecord,
          ),
          href:
            (activeSubSection && activeSubSection > 3) ||
            (hasCourtPermission(workingCase, user) &&
              isReceptionAndAssignmentStepValidIC(workingCase) &&
              isCourtHearingArrangementsStepValidIC(workingCase))
              ? `${Constants.IC_COURT_RECORD_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseCourtSection.rulingStepOne,
          ),
          href:
            (activeSubSection && activeSubSection > 4) ||
            (hasCourtPermission(workingCase, user) &&
              isReceptionAndAssignmentStepValidIC(workingCase) &&
              isCourtHearingArrangementsStepValidIC(workingCase) &&
              isCourtRecordStepValidIC(workingCase))
              ? `${Constants.IC_RULING_STEP_ONE_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseCourtSection.rulingStepTwo,
          ),
          href:
            (activeSubSection && activeSubSection > 5) ||
            (hasCourtPermission(workingCase, user) &&
              isReceptionAndAssignmentStepValidIC(workingCase) &&
              isCourtHearingArrangementsStepValidIC(workingCase) &&
              isCourtRecordStepValidIC(workingCase) &&
              isRulingStepOneValidIC(workingCase))
              ? `${Constants.IC_RULING_STEP_TWO_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseCourtSection.conclusion,
          ),
          href:
            hasCourtPermission(workingCase, user) &&
            isReceptionAndAssignmentStepValidIC(workingCase) &&
            isCourtHearingArrangementsStepValidIC(workingCase) &&
            isCourtRecordStepValidIC(workingCase) &&
            isRulingStepOneValidIC(workingCase) &&
            isRulingStepTwoValidIC(workingCase)
              ? `${Constants.IC_CONFIRMATION_ROUTE}/${id}`
              : undefined,
        },
      ],
    }
  }

  const getCourtSections = (
    workingCase: Case,
    user?: User,
    activeSubSection?: number,
  ): Section => {
    const { id } = workingCase

    return {
      name: formatMessage(sections.courtSection.title),
      children: [
        {
          type: 'SUB_SECTION',
          name: formatMessage(sections.courtSection.receptionAndAssignment),
          href: `${Constants.RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(sections.courtSection.overview),
          href:
            (activeSubSection && activeSubSection > 1) ||
            isReceptionAndAssignmentStepValidRC(workingCase)
              ? `${Constants.OVERVIEW_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(sections.courtSection.hearingArrangements),
          href:
            (activeSubSection && activeSubSection > 2) ||
            isReceptionAndAssignmentStepValidRC(workingCase)
              ? `${Constants.HEARING_ARRANGEMENTS_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(sections.courtSection.courtRecord),
          href:
            (activeSubSection && activeSubSection > 3) ||
            (hasCourtPermission(workingCase, user) &&
              isReceptionAndAssignmentStepValidRC(workingCase) &&
              isCourtHearingArrangemenstStepValidRC(workingCase))
              ? `${Constants.COURT_RECORD_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(sections.courtSection.rulingStepOne),
          href:
            (activeSubSection && activeSubSection > 4) ||
            (hasCourtPermission(workingCase, user) &&
              isReceptionAndAssignmentStepValidRC(workingCase) &&
              isCourtHearingArrangemenstStepValidRC(workingCase) &&
              isCourtRecordStepValidRC(workingCase))
              ? `${Constants.RULING_STEP_ONE_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(sections.courtSection.rulingStepTwo),
          href:
            (activeSubSection && activeSubSection > 5) ||
            (hasCourtPermission(workingCase, user) &&
              isReceptionAndAssignmentStepValidRC(workingCase) &&
              isCourtHearingArrangemenstStepValidRC(workingCase) &&
              isCourtRecordStepValidRC(workingCase) &&
              isRulingStepOneValidRC(workingCase))
              ? `${Constants.RULING_STEP_TWO_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(sections.courtSection.conclusion),
          href:
            hasCourtPermission(workingCase, user) &&
            isReceptionAndAssignmentStepValidRC(workingCase) &&
            isCourtHearingArrangemenstStepValidRC(workingCase) &&
            isCourtRecordStepValidRC(workingCase) &&
            isRulingStepOneValidRC(workingCase) &&
            isRulingStepTwoValidRC(workingCase)
              ? `${Constants.CONFIRMATION_ROUTE}/${id}`
              : undefined,
        },
      ],
    }
  }

  const getExtenstionSections = (
    workingCase: Case,
    activeSubSection?: number,
  ): Section => {
    const { id } = workingCase

    return {
      name: formatMessage(sections.extensionSection.title),
      children: [
        {
          type: 'SUB_SECTION',
          name: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
          href: `${Constants.STEP_ONE_ROUTE}/${id}`,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(sections.extensionSection.hearingArrangements),
          href:
            (activeSubSection && activeSubSection > 1) ||
            isAccusedStepValidRC(workingCase)
              ? `${Constants.STEP_TWO_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(sections.extensionSection.policeDemands),
          href:
            (activeSubSection && activeSubSection > 2) ||
            (isAccusedStepValidRC(workingCase) &&
              isHearingArrangementsStepValidRC(workingCase))
              ? `${Constants.STEP_THREE_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(sections.extensionSection.policeReport),
          href:
            (activeSubSection && activeSubSection > 3) ||
            (isAccusedStepValidRC(workingCase) &&
              isHearingArrangementsStepValidRC(workingCase) &&
              isPoliceDemandsStepValidRC(workingCase))
              ? `${Constants.STEP_FOUR_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(sections.extensionSection.caseFiles),
          href:
            (activeSubSection && activeSubSection > 4) ||
            (isAccusedStepValidRC(workingCase) &&
              isHearingArrangementsStepValidRC(workingCase) &&
              isPoliceDemandsStepValidRC(workingCase) &&
              isPoliceReportStepValidRC(workingCase))
              ? `${Constants.STEP_FIVE_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(sections.extensionSection.overview),
          href:
            isAccusedStepValidRC(workingCase) &&
            isHearingArrangementsStepValidRC(workingCase) &&
            isPoliceDemandsStepValidRC(workingCase) &&
            isPoliceReportStepValidRC(workingCase)
              ? `${Constants.STEP_SIX_ROUTE}/${id}`
              : undefined,
        },
      ],
    }
  }

  const getInvestigationCaseExtenstionSections = (
    workingCase: Case,
    activeSubSection?: number,
  ): Section => {
    const { id } = workingCase

    return {
      name: formatMessage(sections.investigationCaseExtensionSection.title),
      children: [
        {
          type: 'SUB_SECTION',
          name: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
          href: `${Constants.IC_DEFENDANT_ROUTE}/${id}`,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseExtensionSection.hearingArrangements,
          ),
          href:
            (activeSubSection && activeSubSection > 1) ||
            isDefendantStepValidIC(workingCase)
              ? `${Constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseExtensionSection.policeDemands,
          ),
          href:
            (activeSubSection && activeSubSection > 2) ||
            (isDefendantStepValidIC(workingCase) &&
              isHearingArrangementsStepValidIC(workingCase))
              ? `${Constants.IC_POLICE_DEMANDS_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseExtensionSection.policeReport,
          ),
          href:
            (activeSubSection && activeSubSection > 3) ||
            (isDefendantStepValidIC(workingCase) &&
              isHearingArrangementsStepValidIC(workingCase) &&
              isPoliceDemandsStepValidIC(workingCase))
              ? `${Constants.IC_POLICE_REPORT_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseExtensionSection.caseFiles,
          ),
          href:
            (activeSubSection && activeSubSection > 4) ||
            (isDefendantStepValidIC(workingCase) &&
              isHearingArrangementsStepValidIC(workingCase) &&
              isPoliceDemandsStepValidIC(workingCase) &&
              isPoliceReportStepValidIC(workingCase))
              ? `${Constants.IC_CASE_FILES_ROUTE}/${id}`
              : undefined,
        },
        {
          type: 'SUB_SECTION',
          name: formatMessage(
            sections.investigationCaseExtensionSection.overview,
          ),
          href:
            isDefendantStepValidIC(workingCase) &&
            isHearingArrangementsStepValidIC(workingCase) &&
            isPoliceDemandsStepValidIC(workingCase) &&
            isPoliceReportStepValidIC(workingCase)
              ? `${Constants.IC_POLICE_CONFIRMATION_ROUTE}/${id}`
              : undefined,
        },
      ],
    }
  }

  const getSections = (
    workingCase?: Case,
    activeSubSection?: number,
    user?: User,
  ) => {
    return [
      isRestrictionCase(workingCase?.type)
        ? getCustodyAndTravelBanProsecutorSection(
            workingCase || ({} as Case),
            activeSubSection,
          )
        : getInvestigationCaseProsecutorSection(
            workingCase || ({} as Case),
            activeSubSection,
          ),
      isRestrictionCase(workingCase?.type)
        ? getCourtSections(workingCase || ({} as Case), user, activeSubSection)
        : getInvestigationCaseCourtSections(
            workingCase || ({} as Case),
            user,
            activeSubSection,
          ),
      {
        name: caseResult(
          {
            dismissedTitle: formatMessage(signedVerdictOverview.dismissedTitle),
          },
          workingCase,
        ),
      },
      isRestrictionCase(workingCase?.type)
        ? getExtenstionSections(workingCase || ({} as Case), activeSubSection)
        : getInvestigationCaseExtenstionSections(
            workingCase || ({} as Case),
            activeSubSection,
          ),
      isRestrictionCase(workingCase?.type)
        ? getCourtSections(workingCase || ({} as Case), user, activeSubSection)
        : getInvestigationCaseCourtSections(
            workingCase || ({} as Case),
            user,
            activeSubSection,
          ),
    ]
  }

  return {
    getCustodyAndTravelBanProsecutorSection,
    getInvestigationCaseProsecutorSection,
    getInvestigationCaseCourtSections,
    getCourtSections,
    getExtenstionSections,
    getInvestigationCaseExtenstionSections,
    getSections,
    findLastValidStep,
  }
}

export default useSections
