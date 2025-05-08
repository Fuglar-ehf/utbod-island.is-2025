import { buildForm } from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'

export const completedForm = buildForm({
  id: 'completedForm',
  mode: FormModes.COMPLETED,
  children: [
    buildFormConclusionSection({
      alertTitle: 'Skattframtal sent til Skattsins',
      alertMessage: 'Þú færð staðfestingu senda með tölvupósti.',
    }),
  ],
})
