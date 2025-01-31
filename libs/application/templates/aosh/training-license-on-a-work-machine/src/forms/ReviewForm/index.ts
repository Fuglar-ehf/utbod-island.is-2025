import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { conclusion } from '../../lib/messages'
// import { overviewSection } from './../TrainingLicenseOnAWorkMachineForm/OverviewSection'
import { Logo } from '../../assets/Logo'
import { applicationStatusSection } from './ApplicationStatusSection'
import { reviewOverviewSection } from './ReviewOverviewSection'

export const ReviewForm: Form = buildForm({
  id: 'ReviewForm',
  title: '',
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    applicationStatusSection,
    reviewOverviewSection,
    buildFormConclusionSection({
      sectionTitle: conclusion.general.sectionTitle,
      multiFieldTitle: conclusion.general.title,
      alertTitle: conclusion.default.accordionTitle,
      expandableHeader: conclusion.default.expandableHeader,
      expandableDescription: conclusion.default.expandableDescription,
    }),
  ],
})
