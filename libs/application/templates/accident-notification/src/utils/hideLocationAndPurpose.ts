import { FormValue } from '@island.is/application/core'
import {
  GeneralWorkplaceAccidentLocationEnum,
  ProfessionalAthleteAccidentLocationEnum,
  StudiesAccidentLocationEnum,
} from '../types'
import { isHomeActivitiesAccident } from './isHomeActivitiesAccident'

// Location and purpose of accident only relevant in work and studies and never in home
// activities
export const hideLocationAndPurpose = (formValue: FormValue) => {
  const answer = (formValue as {
    accidentLocation: {
      answer: GeneralWorkplaceAccidentLocationEnum & StudiesAccidentLocationEnum
    }
  })?.accidentLocation?.answer
  if (isHomeActivitiesAccident(formValue)) {
    return true
  }
  return (
    answer === GeneralWorkplaceAccidentLocationEnum.ATTHEWORKPLACE ||
    answer === StudiesAccidentLocationEnum.ATTHESCHOOL ||
    answer === ProfessionalAthleteAccidentLocationEnum.SPORTCLUBSFACILITES
  )
}
