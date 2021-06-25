import { CaseType } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

export const getCustodyAndTravelBanProsecutorSection = (
  caseId?: string,
  caseType?: CaseType,
  activeSubSection?: number,
) => {
  return {
    name:
      caseType === CaseType.CUSTODY
        ? 'Krafa um gæsluvarðhald'
        : 'Krafa um farbann',
    children: [
      {
        type: 'SUB_SECTION',
        name: 'Sakborningur',
        href: `${Constants.STEP_ONE_ROUTE}/${caseId}`,
      },
      {
        type: 'SUB_SECTION',
        name: 'Óskir um fyrirtöku',
        href:
          activeSubSection && activeSubSection > 1
            ? `${Constants.STEP_TWO_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Dómkröfur og lagagrundvöllur',
        href:
          activeSubSection && activeSubSection > 2
            ? `${Constants.STEP_THREE_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Greinargerð',
        href:
          activeSubSection && activeSubSection > 3
            ? `${Constants.STEP_FOUR_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Rannsóknargögn',
        href:
          activeSubSection && activeSubSection > 4
            ? `${Constants.STEP_FIVE_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit kröfu',
      },
    ],
  }
}

export const getInvestigationCaseProsecutorSection = (
  caseId?: string,
  activeSubSection?: number,
) => {
  return {
    name: 'Krafa um rannsóknarheimild',
    children: [
      {
        type: 'SUB_SECTION',
        name: 'Varnaraðili',
        href: `${Constants.IC_DEFENDANT_ROUTE}/${caseId}`,
      },
      {
        type: 'SUB_SECTION',
        name: 'Óskir um fyrirtöku',
        href:
          activeSubSection && activeSubSection > 1
            ? `${Constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Dómkröfur og lagagrundvöllur',
        href:
          activeSubSection && activeSubSection > 2
            ? `${Constants.IC_POLICE_DEMANDS_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Greinargerð',
        href:
          activeSubSection && activeSubSection > 3
            ? `${Constants.IC_POLICE_REPORT_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Rannsóknargögn',
        href:
          activeSubSection && activeSubSection > 4
            ? `${Constants.STEP_FIVE_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit kröfu',
      },
    ],
  }
}

export const getInvestigationCaseCourtSections = (
  caseId?: string,
  activeSubSection?: number,
) => {
  return {
    name: 'Úrskurður Héraðsdóms',
    children: [
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit kröfu',
        href: `${Constants.IC_OVERVIEW_ROUTE}/${caseId}`,
      },
      {
        type: 'SUB_SECTION',
        name: 'Fyrirtökutími',
        href:
          activeSubSection && activeSubSection > 1
            ? `${Constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Þingbók',
        href:
          activeSubSection && activeSubSection > 2
            ? `${Constants.IC_COURT_RECORD_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Úrskurður',
        href:
          activeSubSection && activeSubSection > 3
            ? `${Constants.IC_RULING_STEP_ONE_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Úrskurðarorð',
        href:
          activeSubSection && activeSubSection > 4
            ? `${Constants.IC_RULING_STEP_TWO_ROUTE}/${caseId}`
            : undefined,
      },
      { type: 'SUB_SECTION', name: 'Yfirlit úrskurðar' },
    ],
  }
}

export const getCourtSections = (
  caseId?: string,
  activeSubSection?: number,
) => {
  return {
    name: 'Úrskurður Héraðsdóms',
    children: [
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit kröfu',
        href: `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/${caseId}`,
      },
      {
        type: 'SUB_SECTION',
        name: 'Fyrirtökutími',
        href:
          activeSubSection && activeSubSection > 1
            ? `${Constants.HEARING_ARRANGEMENTS_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Þingbók',
        href:
          activeSubSection && activeSubSection > 2
            ? `${Constants.COURT_RECORD_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Úrskurður',
        href:
          activeSubSection && activeSubSection > 3
            ? `${Constants.RULING_STEP_ONE_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Úrskurðarorð',
        href:
          activeSubSection && activeSubSection > 4
            ? `${Constants.RULING_STEP_TWO_ROUTE}/${caseId}`
            : undefined,
      },
      { type: 'SUB_SECTION', name: 'Yfirlit úrskurðar' },
    ],
  }
}

export const getExtenstionSections = (
  caseId?: string,
  activeSubSection?: number,
) => {
  return {
    name: 'Krafa um framlengingu',
    children: [
      {
        type: 'SUB_SECTION',
        name: 'Sakborningur',
        href: `${Constants.STEP_ONE_ROUTE}/${caseId}`,
      },
      {
        type: 'SUB_SECTION',
        name: 'Óskir um fyrirtöku',
        href:
          activeSubSection && activeSubSection > 1
            ? `${Constants.STEP_TWO_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Dómkröfur og lagagrundvöllur',
        href:
          activeSubSection && activeSubSection > 2
            ? `${Constants.STEP_THREE_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Greinargerð',
        href:
          activeSubSection && activeSubSection > 3
            ? `${Constants.STEP_FOUR_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Rannsóknargögn',
        href:
          activeSubSection && activeSubSection > 4
            ? `${Constants.STEP_FIVE_ROUTE}/${caseId}`
            : undefined,
      },
      {
        type: 'SUB_SECTION',
        name: 'Yfirlit kröfu',
      },
    ],
  }
}
