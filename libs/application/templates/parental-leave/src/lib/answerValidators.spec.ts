import {
  Application,
  ApplicationStatus,
  ApplicationTypes,
  coreErrorMessages,
} from '@island.is/application/core'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'

import { minimumPeriodStartBeforeExpectedDateOfBirth } from '../config'
import { ParentalRelations } from '../constants'
import { answerValidators, VALIDATE_LATEST_PERIOD } from './answerValidators'
import { errorMessages } from './messages'
import { NO, StartDateOptions } from '../constants'

const dateFormat = 'yyyy-MM-dd'
const DEFAULT_DOB = '2021-01-15'
const DEFAULT_DOB_DATE = new Date(DEFAULT_DOB)

const formatDate = (date: Date) => format(date, dateFormat)

const createBaseApplication = (): Application => ({
  answers: { someAnswer: 'someValue', selectedChild: '0' },
  assignees: [],
  applicant: '',
  attachments: {},
  created: new Date(),
  externalData: {
    children: {
      date: new Date(),
      status: 'success',
      data: {
        children: [
          {
            expectedDateOfBirth: DEFAULT_DOB,
            parentalRelation: ParentalRelations.primary,
          },
        ],
      },
    },
  },
  id: '',
  modified: new Date(),
  state: '',
  typeId: ApplicationTypes.EXAMPLE,
  status: ApplicationStatus.IN_PROGRESS,
})

describe('answerValidators', () => {
  let application: Application

  beforeEach(() => {
    application = createBaseApplication()
  })

  it('should return an error if startDate is more than 1 month before DOB', () => {
    const newAnswers = [
      {
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: '2020-12-01',
      },
    ]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: errorMessages.periodsStartDate,
      path: 'periods[0].startDate',
      values: {},
    })
  })

  it(`shouldn't return an error if startDate is less than 1 month before DOB`, () => {
    const newAnswers = [
      {
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: '2021-01-12',
      },
    ]

    expect(answerValidators['periods'](newAnswers, application)).toBeUndefined()
  })

  it('should return error for startDate after maximum months period', () => {
    const newAnswers = [
      {
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: '2025-01-29',
      },
    ]

    expect(answerValidators['periods'](newAnswers, application)).toStrictEqual({
      message: errorMessages.periodsPeriodRange,
      path: 'periods[0].startDate',
      values: { usageMaxMonths: 23.5 },
    })
  })

  describe('union', () => {
    it('shoulde create error when union is empty', () => {
      const newAnswers = {
        bank: '123456789012',
        pensionFund: 'id-frjalsi',
        union: '',
      }

      expect(
        answerValidators['payments'](newAnswers, application),
      ).toStrictEqual({
        message: coreErrorMessages.defaultError,
        path: 'payments.union',
        values: undefined,
      })
    })
  })

  describe('privatePensionFund', () => {
    it('should create error when privatePensionFund is empty', () => {
      const newAnswers = {
        bank: '123456789012',
        pensionFund: 'id-frjalsi',
        privatePensionFund: '',
        privatePensionFundPercentage: '',
      }

      expect(
        answerValidators['payments'](newAnswers, application),
      ).toStrictEqual({
        message: coreErrorMessages.defaultError,
        path: 'payments.privatePensionFund',
        values: undefined,
      })
    })

    it('should create error when privatePensionFundPercentage is empty', () => {
      const newAnswers = {
        bank: '123456789012',
        pensionFund: 'id-frjalsi',
        privatePensionFund: 'id-frjalsi',
        privatePensionFundPercentage: '',
      }

      expect(
        answerValidators['payments'](newAnswers, application),
      ).toStrictEqual({
        message: coreErrorMessages.defaultError,
        path: 'payments.privatePensionFundPercentage',
        values: undefined,
      })
    })

    it('should only accept 2 or 4 as values for privatePensionFundPercentage', () => {
      const newAnswers = {
        bank: '123456789012',
        pensionFund: 'id-frjalsi',
        privatePensionFund: 'id-frjalsi',
        privatePensionFundPercentage: 'test input',
      }

      expect(
        answerValidators['payments'](newAnswers, application),
      ).toStrictEqual({
        message: coreErrorMessages.defaultError,
        path: 'payments.privatePensionFundPercentage',
        values: undefined,
      })
    })

    it('should accept 2 as a value for privatePensionFundPercentage', () => {
      const newAnswers = {
        bank: '123456789012',
        pensionFund: 'id-frjalsi',
        privatePensionFund: 'id-frjalsi',
        privatePensionFundPercentage: '2',
      }

      expect(
        answerValidators['payments'](newAnswers, application),
      ).toStrictEqual(undefined)
    })

    it('should accept 4 as a value for privatePensionFundPercentage', () => {
      const newAnswers = {
        bank: '123456789012',
        pensionFund: 'id-frjalsi',
        privatePensionFund: 'id-frjalsi',
        privatePensionFundPercentage: '4',
      }

      expect(
        answerValidators['payments'](newAnswers, application),
      ).toStrictEqual(undefined)
    })
  })
})

describe('when constructing a new period', () => {
  let application: Application

  beforeEach(() => {
    application = createBaseApplication()
  })

  const createValidationResultForPeriod = (period: Record<string, unknown>) =>
    answerValidators[VALIDATE_LATEST_PERIOD]([period], application)

  it('should be required that the answer is an array', () => {
    expect(answerValidators[VALIDATE_LATEST_PERIOD]([], application)).toEqual(
      undefined,
    )

    expect(answerValidators[VALIDATE_LATEST_PERIOD](null, application)).toEqual(
      {
        path: 'periods',
        message: errorMessages.periodsNotAList,
      },
    )
  })

  it('should be allowed to pass an empty array', () => {
    expect(answerValidators[VALIDATE_LATEST_PERIOD]([], application)).toEqual(
      undefined,
    )
  })

  it('should not be allowed to pass in a start date before dob but not further back than minimum', () => {
    const minimumDate = addDays(
      DEFAULT_DOB_DATE,
      -minimumPeriodStartBeforeExpectedDateOfBirth,
    )

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: formatDate(addDays(minimumDate, 1)),
      }),
    ).toStrictEqual(undefined)

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: formatDate(addDays(minimumDate, -1)),
      }),
    ).toStrictEqual({
      message: errorMessages.periodsStartDate,
      path: 'periods[0].startDate',
      values: {},
    })
  })

  it('should not be able to pass in endDate before noting if want to use length or not', () => {
    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
      }),
    ).toStrictEqual({
      message: errorMessages.periodsEndDateDefinitionMissing,
      path: 'periods[0].endDate',
      values: {},
    })

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
      }),
    ).toEqual(undefined)
  })

  it('should not be able to pass in endDate before startDate + minimumPeriodLength', () => {
    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, -1)),
      }),
    ).toStrictEqual({
      message: errorMessages.periodsEndDateBeforeStartDate,
      path: 'periods',
      values: {},
    })

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 5)),
      }),
    ).toStrictEqual({
      message: errorMessages.periodsEndDateMinimumPeriod,
      path: 'periods[0].endDate',
      values: {
        minPeriodDays: 13,
      },
    })

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
      }),
    ).toEqual(undefined)
  })

  it('should not be able to pass in endDate more than 2 years from expected date of birth', () => {
    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
      }),
    ).toEqual(undefined)
  })

  it('should not be able to pass in ratio before start and end dates', () => {
    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
        ratio: '100',
      }),
    ).toStrictEqual({
      message: errorMessages.periodsStartMissing,
      path: 'periods[0].startDate',
      values: {},
    })

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: formatDate(addDays(DEFAULT_DOB_DATE, 10)),
        useLength: NO,
        ratio: '100',
      }),
    ).toStrictEqual({
      message: errorMessages.periodsEndDateRequired,
      path: 'periods[0].ratio',
      values: {},
    })

    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
        days: '30',
        percentage: '100',
        ratio: '100',
      }),
    ).toEqual(undefined)
  })

  it('should not be able to have a lower ratio than 1%', () => {
    expect(
      createValidationResultForPeriod({
        firstPeriodStart: StartDateOptions.SPECIFIC_DATE,
        startDate: DEFAULT_DOB,
        useLength: NO,
        endDate: formatDate(addDays(DEFAULT_DOB_DATE, 30)),
        days: '30',
        percentage: '50',
        ratio: '0',
      }),
    ).toStrictEqual({
      message: errorMessages.periodsRatioBelowMinimum,
      path: 'periods[0].ratio',
      values: {},
    })
  })
})
