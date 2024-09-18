import { Op, Sequelize, WhereOptions } from 'sequelize'

import { ForbiddenException } from '@nestjs/common'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import type { User } from '@island.is/judicial-system/types'
import {
  CaseAppealState,
  CaseDecision,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  DateType,
  EventType,
  IndictmentCaseReviewDecision,
  indictmentCases,
  investigationCases,
  isCourtOfAppealsUser,
  isDefenceUser,
  isDistrictCourtUser,
  isPrisonAdminUser,
  isPrisonStaffUser,
  isProsecutionUser,
  isPublicProsecutorUser,
  RequestSharedWithDefender,
  restrictionCases,
  UserRole,
} from '@island.is/judicial-system/types'

const getProsecutionUserCasesQueryFilter = (user: User): WhereOptions => {
  const type =
    user.role === UserRole.PROSECUTOR
      ? [...restrictionCases, ...investigationCases, ...indictmentCases]
      : indictmentCases

  const options: WhereOptions = [
    { is_archived: false },
    { type },
    {
      state: [
        CaseState.NEW,
        CaseState.DRAFT,
        CaseState.WAITING_FOR_CONFIRMATION,
        CaseState.SUBMITTED,
        CaseState.WAITING_FOR_CANCELLATION,
        CaseState.RECEIVED,
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
        CaseState.COMPLETED,
      ],
    },
    {
      [Op.or]: [
        { prosecutors_office_id: user.institution?.id },
        { shared_with_prosecutors_office_id: user.institution?.id },
        { indictment_reviewer_id: user.id },
      ],
    },
    {
      [Op.or]: [
        { is_heightened_security_level: { [Op.is]: null } },
        { is_heightened_security_level: false },
        { creating_prosecutor_id: user.id },
        { prosecutor_id: user.id },
      ],
    },
  ]

  return {
    [Op.and]: options,
  }
}

const getPublicProsecutionUserCasesQueryFilter = (): WhereOptions => {
  return {
    [Op.and]: [
      { is_archived: false },
      { type: indictmentCases },
      { state: [CaseState.COMPLETED] },
      {
        indictment_ruling_decision: [
          CaseIndictmentRulingDecision.FINE,
          CaseIndictmentRulingDecision.RULING,
        ],
      },
      {
        // The following condition will filter out all event logs that are not of type INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR
        // but that should be ok the case list for the public prosecutor is not using other event logs
        '$eventLogs.event_type$':
          EventType.INDICTMENT_SENT_TO_PUBLIC_PROSECUTOR,
      },
    ],
  }
}

const getDistrictCourtUserCasesQueryFilter = (user: User): WhereOptions => {
  const options: WhereOptions = [
    { is_archived: false },
    {
      [Op.or]: [
        { court_id: { [Op.is]: null } },
        { court_id: user.institution?.id },
      ],
    },
  ]

  if (user.role === UserRole.DISTRICT_COURT_ASSISTANT) {
    options.push(
      { type: indictmentCases },
      {
        state: [
          CaseState.SUBMITTED,
          CaseState.WAITING_FOR_CANCELLATION,
          CaseState.RECEIVED,
          CaseState.COMPLETED,
        ],
      },
    )
  } else {
    options.push({
      [Op.or]: [
        {
          [Op.and]: [
            { type: [...restrictionCases, ...investigationCases] },
            {
              state: [
                CaseState.DRAFT,
                CaseState.SUBMITTED,
                CaseState.RECEIVED,
                CaseState.ACCEPTED,
                CaseState.REJECTED,
                CaseState.DISMISSED,
              ],
            },
          ],
        },
        {
          [Op.and]: [
            { type: indictmentCases },
            {
              state: [
                CaseState.SUBMITTED,
                CaseState.WAITING_FOR_CANCELLATION,
                CaseState.RECEIVED,
                CaseState.COMPLETED,
              ],
            },
          ],
        },
      ],
    })
  }

  return {
    [Op.and]: options,
  }
}

const getAppealsCourtUserCasesQueryFilter = (): WhereOptions => {
  return {
    [Op.and]: [
      { is_archived: false },
      { type: [...restrictionCases, ...investigationCases] },
      { state: [CaseState.ACCEPTED, CaseState.REJECTED, CaseState.DISMISSED] },
      {
        [Op.or]: [
          {
            appeal_state: [CaseAppealState.RECEIVED, CaseAppealState.COMPLETED],
          },
          {
            [Op.and]: [
              { appeal_state: [CaseAppealState.WITHDRAWN] },
              { appeal_received_by_court_date: { [Op.not]: null } },
            ],
          },
        ],
      },
    ],
  }
}

const getPrisonStaffUserCasesQueryFilter = (): WhereOptions => {
  return {
    [Op.and]: [
      { is_archived: false },
      { state: CaseState.ACCEPTED },
      {
        type: [
          CaseType.CUSTODY,
          CaseType.ADMISSION_TO_FACILITY,
          CaseType.PAROLE_REVOCATION,
        ],
      },
      { decision: [CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY] },
    ],
  }
}

const getPrisonAdminUserCasesQueryFilter = (): WhereOptions => {
  return {
    is_archived: false,
    [Op.or]: [
      {
        state: CaseState.ACCEPTED,
        type: [
          CaseType.CUSTODY,
          CaseType.ADMISSION_TO_FACILITY,
          CaseType.PAROLE_REVOCATION,
          CaseType.TRAVEL_BAN,
        ],
      },
      {
        type: CaseType.INDICTMENT,
        state: CaseState.COMPLETED,
        indictment_ruling_decision: CaseIndictmentRulingDecision.RULING,
        indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT,
        id: {
          [Op.notIn]: Sequelize.literal(`
            (SELECT case_id
              FROM defendant
              WHERE service_requirement <> 'NOT_REQUIRED'
              AND (verdict_view_date IS NULL OR verdict_view_date > NOW() - INTERVAL '28 days'))
          `),
        },
      },
    ],
  }
}

const getDefenceUserCasesQueryFilter = (user: User): WhereOptions => {
  const [normalizedNationalId, formattedNationalId] =
    normalizeAndFormatNationalId(user.nationalId)

  const options: WhereOptions = [
    { is_archived: false },
    {
      [Op.or]: [
        {
          [Op.and]: [
            { type: [...restrictionCases, ...investigationCases] },
            {
              [Op.or]: [
                {
                  [Op.and]: [
                    { state: [CaseState.SUBMITTED, CaseState.RECEIVED] },
                    {
                      request_shared_with_defender:
                        RequestSharedWithDefender.READY_FOR_COURT,
                    },
                  ],
                },
                {
                  [Op.and]: [
                    { state: CaseState.RECEIVED },
                    // The following condition will filter out all date logs that are not of type ARRAIGNMENT_DATE
                    // but that should be ok for request cases since they only have one date log
                    { '$dateLogs.date_type$': DateType.ARRAIGNMENT_DATE },
                  ],
                },
                {
                  state: [
                    CaseState.ACCEPTED,
                    CaseState.REJECTED,
                    CaseState.DISMISSED,
                  ],
                },
              ],
            },
            {
              defender_national_id: [normalizedNationalId, formattedNationalId],
            },
          ],
        },
        {
          [Op.and]: [
            { type: indictmentCases },
            {
              state: [
                CaseState.WAITING_FOR_CANCELLATION,
                CaseState.RECEIVED,
                CaseState.COMPLETED,
              ],
            },
            {
              id: {
                [Op.in]: Sequelize.literal(`
                (SELECT case_id
                  FROM defendant
                  WHERE defender_national_id in ('${normalizedNationalId}', '${formattedNationalId}'))
              `),
              },
            },
          ],
        },
      ],
    },
  ]

  return {
    [Op.and]: options,
  }
}

export const getCasesQueryFilter = (user: User): WhereOptions => {
  if (isProsecutionUser(user)) {
    return getProsecutionUserCasesQueryFilter(user)
  }

  if (isDistrictCourtUser(user)) {
    return getDistrictCourtUserCasesQueryFilter(user)
  }

  if (isCourtOfAppealsUser(user)) {
    return getAppealsCourtUserCasesQueryFilter()
  }

  if (isPrisonStaffUser(user)) {
    return getPrisonStaffUserCasesQueryFilter()
  }

  if (isPrisonAdminUser(user)) {
    return getPrisonAdminUserCasesQueryFilter()
  }

  if (isDefenceUser(user)) {
    return getDefenceUserCasesQueryFilter(user)
  }

  if (isPublicProsecutorUser(user)) {
    return getPublicProsecutionUserCasesQueryFilter()
  }

  throw new ForbiddenException(`User ${user.id} does not have access to cases`)
}
