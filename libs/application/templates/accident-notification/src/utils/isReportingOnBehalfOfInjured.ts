import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { WhoIsTheNotificationForEnum } from '../types'

export const isReportingOnBehalfOfInjured = (formValue: FormValue) => {
  const whoIsTheNotificationFor = getValueViaPath(
    formValue,
    'whoIsTheNotificationFor.answer',
  ) as WhoIsTheNotificationForEnum
  return (
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.JURIDICALPERSON ||
    whoIsTheNotificationFor === WhoIsTheNotificationForEnum.POWEROFATTORNEY
  )
}
