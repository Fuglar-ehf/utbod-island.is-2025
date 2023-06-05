import { Op, WhereOptions } from 'sequelize'

import {
  CaseDecision,
  CaseState,
  CaseType,
  indictmentCases,
  InstitutionType,
  investigationCases,
  restrictionCases,
  UserRole,
  isProsecutionUser,
  CaseAppealState,
  isDistrictCourtUser,
  isAppealsCourtUser,
  isPrisonSystemUser,
  isDefenceUser,
  completedCaseStates,
} from '@island.is/judicial-system/types'
import type { User } from '@island.is/judicial-system/types'

import { ForbiddenException } from '@nestjs/common'

function getProsecutionUserCasesQueryFilter(user: User): WhereOptions {
  const options: WhereOptions = [
    { isArchived: false },
    {
      state: [
        CaseState.NEW,
        CaseState.DRAFT,
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
        CaseState.ACCEPTED,
        CaseState.REJECTED,
        CaseState.DISMISSED,
      ],
    },
    {
      [Op.or]: [
        { creating_prosecutor_id: { [Op.is]: null } },
        { '$creatingProsecutor.institution_id$': user.institution?.id },
        { shared_with_prosecutors_office_id: user.institution?.id },
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

  if (user.role === UserRole.PROSECUTOR) {
    options.push({
      type: [...restrictionCases, ...investigationCases, ...indictmentCases],
    })
  } else {
    options.push({ type: indictmentCases })
  }

  return {
    [Op.and]: options,
  }
}

function getDistrictCourtUserCasesQueryFilter(user: User): WhereOptions {
  const options: WhereOptions = [
    { isArchived: false },
    {
      [Op.or]: [
        { court_id: { [Op.is]: null } },
        { court_id: user.institution?.id },
      ],
    },
  ]

  if (user.role === UserRole.ASSISTANT) {
    options.push(
      { type: indictmentCases },
      {
        state: [
          CaseState.SUBMITTED,
          CaseState.RECEIVED,
          CaseState.ACCEPTED,
          CaseState.REJECTED,
          CaseState.DISMISSED,
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
                CaseState.RECEIVED,
                CaseState.ACCEPTED,
                CaseState.REJECTED,
                CaseState.DISMISSED,
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

function getAppealsCourtUserCasesQueryFilter(): WhereOptions {
  return {
    [Op.and]: [
      { isArchived: false },
      { type: [...restrictionCases, ...investigationCases] },
      { state: [CaseState.ACCEPTED, CaseState.REJECTED, CaseState.DISMISSED] },
      {
        appeal_state: [CaseAppealState.RECEIVED, CaseAppealState.COMPLETED],
      },
    ],
  }
}

function getStaffUserCasesQueryFilter(user: User): WhereOptions {
  const options: WhereOptions = [
    { isArchived: false },
    { state: CaseState.ACCEPTED },
  ]

  if (user.institution?.type === InstitutionType.PRISON_ADMIN) {
    options.push({
      type: [
        CaseType.ADMISSION_TO_FACILITY,
        CaseType.CUSTODY,
        CaseType.TRAVEL_BAN,
      ],
    })
  } else {
    options.push(
      { type: [CaseType.CUSTODY, CaseType.ADMISSION_TO_FACILITY] },
      {
        decision: [CaseDecision.ACCEPTING, CaseDecision.ACCEPTING_PARTIALLY],
      },
    )
  }

  return { [Op.and]: options }
}

function getDefenceUserCasesQueryFilter(user: User): WhereOptions {
  const options: WhereOptions = [
    { isArchived: false },
    { type: [...restrictionCases, ...investigationCases, ...indictmentCases] },
    {
      [Op.or]: [
        {
          [Op.and]: [
            { state: CaseState.RECEIVED },
            { court_date: { [Op.not]: null } },
          ],
        },
        { state: completedCaseStates },
      ],
      [Op.or]: [
        { defender_national_id: user.nationalId },
        {
          '$defendants.defender_national_id$': user.nationalId,
        },
      ],
    },
  ]

  return {
    [Op.and]: options,
  }
}

export function getCasesQueryFilter(user: User): WhereOptions {
  // TODO: Convert to switch
  if (isProsecutionUser(user)) {
    return getProsecutionUserCasesQueryFilter(user)
  }

  if (isDistrictCourtUser(user)) {
    return getDistrictCourtUserCasesQueryFilter(user)
  }

  if (isAppealsCourtUser(user)) {
    return getAppealsCourtUserCasesQueryFilter()
  }

  if (isPrisonSystemUser(user)) {
    return getStaffUserCasesQueryFilter(user)
  }

  if (isDefenceUser(user)) {
    return getDefenceUserCasesQueryFilter(user)
  }

  throw new ForbiddenException(`User ${user.id} does not have access to cases`)
}
