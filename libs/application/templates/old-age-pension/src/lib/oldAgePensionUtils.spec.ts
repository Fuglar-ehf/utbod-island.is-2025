import addYears from 'date-fns/addYears'
import addMonths from 'date-fns/addMonths'
import {
  ApplicationWithAttachments as Application,
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  FormValue,
} from '@island.is/application/types'

import {
  getStartDateAndEndDate,
  getAvailableYears,
  getApplicationAnswers,
} from './oldAgePensionUtils'

function buildApplication(data?: {
  answers?: FormValue
  externalData?: ExternalData
  state?: string
}): Application {
  const { answers = {}, externalData = {}, state = 'draft' } = data ?? {}

  return {
    id: '12345',
    assignees: [],
    applicant: '0101307789',
    typeId: ApplicationTypes.OLD_AGE_PENSION,
    created: new Date(),
    modified: new Date(),
    attachments: {},
    applicantActors: [],
    answers,
    state,
    externalData: {
      nationalRegistry: {
        data: {
          nationalId: '0101307789',
        },
        date: new Date(),
        status: 'success',
      },
    },
    status: ApplicationStatus.IN_PROGRESS,
  }
}

describe('getStartDateAndEndDate', () => {
  it('should return 2 years ago for startDate and 6 months ahead for endDate', () => {
    const application = buildApplication()
    const { isFishermen } = getApplicationAnswers(application.answers)
    const today = new Date()
    const startDate = addYears(today, -2).toDateString()
    const endDate = addMonths(today, 6).toDateString()
    const res = getStartDateAndEndDate(application.applicant, isFishermen)

    expect({
      startDate: res.startDate?.toDateString(),
      endDate: res.endDate?.toDateString(),
    }).toEqual({ startDate, endDate })
  })
})

describe('getAvailableYears', () => {
  it('should return available years', () => {
    const application = buildApplication()
    const startDateYear = addYears(new Date(), -2).getFullYear()

    const res = getAvailableYears(application)
    const expected = Array.from(Array(3).keys()).map((x) => {
      const theYear = x + startDateYear
      return { value: theYear.toString(), label: theYear.toString() }
    })

    expect(res).toEqual(expected)
  })
})
