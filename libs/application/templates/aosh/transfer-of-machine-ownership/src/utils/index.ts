import { ChargeItemCode } from '@island.is/shared/constants'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { Application, FormValue } from '@island.is/application/types'
import { TransferOfMachineOwnershipAnswers } from '..'

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}
export { getSelectedMachine } from './getSelectedMachine'
export { getReviewSteps } from './getReviewSteps'
export { hasReviewerApproved } from './hasReviewerApproved'
export { getApproveAnswers } from './getApproveAnswers'
export { getRejecter } from './getRejecter'

export const getChargeItemCodes = (
  application: Application<FormValue>,
): Array<string> => {
  const answers = application.answers as TransferOfMachineOwnershipAnswers
  if (answers.machine?.paymentRequiredForOwnerChange === false) {
    return []
  }

  return [ChargeItemCode.AOSH_TRANSFER_OF_MACHINE_OWNERSHIP.toString()]
}
