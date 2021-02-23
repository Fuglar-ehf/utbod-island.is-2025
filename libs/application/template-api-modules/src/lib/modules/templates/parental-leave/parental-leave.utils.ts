import get from 'lodash/get'

import {
  ParentalLeave,
  Period,
  Employer,
  Union,
  PensionFund,
} from '@island.is/vmst-client'
import { Application } from '@island.is/application/core'

// 'yes' will not be hard coded once the state machine has been moved into the api module
const BOOLEAN_TRUE = 'yes'

// Id used when applicant does not wish to pay into a private pension fund
const NO_PRIVATE_PENSION_FUND_ID = 'X000'

const extractAnswer = <T>(
  object: unknown,
  path: string,
  defaultValue: unknown | undefined = undefined,
): T => {
  const value = get(object, path, undefined)

  if (defaultValue === undefined && typeof value === 'undefined') {
    throw new Error(
      `transformApplicationToParentalLeaveDTO.extractAnswer: missing value for ${path}`,
    )
  }

  return value
}

const getPersonalAllowance = (
  application: Application,
  fromSpouse = false,
): number => {
  const usePersonalAllowanceGetter = fromSpouse
    ? 'usePersonalAllowanceFromSpouse'
    : 'usePersonalAllowance'
  const useMaxGetter = fromSpouse
    ? 'personalAllowanceFromSpouse.useAsMuchAsPossible'
    : 'personalAllowance.useAsMuchAsPossible'
  const usageGetter = fromSpouse
    ? 'personalAllowanceFromSpouse.usage'
    : 'personalAllowance.usage'

  const willUsePersonalAllowance =
    extractAnswer(application.answers, usePersonalAllowanceGetter) ===
    BOOLEAN_TRUE

  if (!willUsePersonalAllowance) {
    return 0
  }

  const willUseMax =
    extractAnswer(application.answers, useMaxGetter) === BOOLEAN_TRUE

  if (willUseMax) {
    return 100
  }

  const usage = Number(extractAnswer(application.answers, usageGetter))

  return usage
}

const getEmployer = (
  application: Application,
  isSelfEmployed: boolean,
): Employer => ({
  email: isSelfEmployed
    ? extractAnswer(application.answers, 'applicant.email')
    : extractAnswer(application.answers, 'employer.email'),
  nationalRegistryId: isSelfEmployed
    ? application.applicant
    : extractAnswer(application.answers, 'employer.nationalRegistryId'),
})

export const transformApplicationToParentalLeaveDTO = (
  application: Application,
): ParentalLeave => {
  const periodsAnswer = extractAnswer<
    {
      startDate: string
      endDate: string
      ratio: string
    }[]
  >(application.answers, 'periods')
  let periods: Period[] = []

  if (periodsAnswer) {
    periods = periodsAnswer.map((period) => ({
      from: period.startDate,
      // TODO: refactor period.endDate to not include time
      to: period.endDate.split('T')[0],
      ratio: Number(period.ratio),
      approved: true,
      paid: false,
    }))
  }

  const isSelfEmployed =
    extractAnswer(application.answers, 'employer.isSelfEmployed') ===
    BOOLEAN_TRUE

  const employer = getEmployer(application, isSelfEmployed)

  const union: Union = {
    id: extractAnswer(application.answers, 'payments.union'),
    name: '',
  }

  const pensionFund: PensionFund = {
    id: extractAnswer(application.answers, 'payments.pensionFund'),
    name: '',
  }

  const rawPrivatePensionFund: string | null = extractAnswer(
    application.answers,
    'payments.privatePensionFund',
    null,
  )
  const privatePensionFund: PensionFund = rawPrivatePensionFund
    ? {
        id: rawPrivatePensionFund,
        name: '',
      }
    : {
        id: NO_PRIVATE_PENSION_FUND_ID,
        name: '',
      }

  const rawPrivatePensionFundRatio: string | undefined = extractAnswer(
    application.answers,
    'payments.privatePensionFundPercentage',
    '0',
  )
  const privatePensionFundRatio: number =
    Number(rawPrivatePensionFundRatio) || 0

  return {
    applicationId: application.id,
    applicant: application.applicant,
    otherParentId: extractAnswer(application.answers, 'otherParentId'),
    expectedDateOfBirth: extractAnswer(
      application.externalData,
      'pregnancyStatus.data.pregnancyDueDate',
    ),
    // TODO: get true date of birth, not expected
    dateOfBirth: extractAnswer(
      application.externalData,
      'pregnancyStatus.data.pregnancyDueDate',
    ),
    email: extractAnswer(application.answers, 'applicant.email'),
    phoneNumber: extractAnswer(application.answers, 'applicant.phoneNumber'),
    paymentInfo: {
      bankAccount: extractAnswer(application.answers, 'payments.bank'),
      personalAllowance: getPersonalAllowance(application),
      personalAllowanceFromSpouse: getPersonalAllowance(application, true),
      union,
      pensionFund,
      privatePensionFund,
      privatePensionFundRatio,
    },
    periods,
    employers: [employer],
    status: 'In Progress',
    // TODO: extract correct rights code from application and connected applications
    // Needs to know if primary/secondary parent, has custody and if self employed and/or employee
    // https://islandis.slack.com/archives/G016P6FSDCK/p1608557387042300
    rightsCode: 'M-L-GR',
  }
}
