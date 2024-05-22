import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import {
  accidentType,
  attachments,
  injuredPersonInformation,
} from '../../../lib/messages'
import {
  isAgricultureAccident,
  isReportingOnBehalfSelf,
  isWorkAccident,
} from '../../../utils'
import { WorkAccidentTypeEnum } from '../../../types'

export const workAccidentSubSection = buildSubSection({
  id: 'workAccident.subSection',
  title: accidentType.workAccidentType.subSectionTitle,
  condition: (formValue) => isWorkAccident(formValue),
  children: [
    buildMultiField({
      id: 'workAccident.section',
      title: accidentType.workAccidentType.heading,
      description: accidentType.workAccidentType.description,
      children: [
        buildRadioField({
          id: 'workAccident.type',
          width: 'half',
          title: '',
          options: [
            {
              value: WorkAccidentTypeEnum.GENERAL,
              label: accidentType.workAccidentType.generalWorkAccident,
            },
            {
              value: WorkAccidentTypeEnum.FISHERMAN,
              label: accidentType.workAccidentType.fishermanAccident,
            },
            {
              value: WorkAccidentTypeEnum.PROFESSIONALATHLETE,
              label: accidentType.workAccidentType.professionalAthlete,
            },
            {
              value: WorkAccidentTypeEnum.AGRICULTURE,
              label: accidentType.workAccidentType.agricultureAccident,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'attachments.injuryCertificate.alert2',
          title: attachments.labels.alertMessage,
          description: accidentType.warning.agricultureAccidentWarning,
          doesNotRequireAnswer: true,
          message: accidentType.warning.agricultureAccidentWarning,
          alertType: 'warning',
          condition: (formValue) => isAgricultureAccident(formValue),
          marginBottom: 5,
        }),
        buildDescriptionField({
          id: 'workAccident.descriptionField',
          space: 'containerGutter',
          title: injuredPersonInformation.general.jobTitle,
          description: injuredPersonInformation.general.jobTitleDescription,
          width: 'full',
          marginBottom: 2,
          condition: (formValue) => isReportingOnBehalfSelf(formValue),
        }),
        buildTextField({
          id: 'workAccident.jobTitle',
          title: injuredPersonInformation.labels.jobTitle,
          backgroundColor: 'white',
          width: 'full',
          maxLength: 100,
          condition: (formValue) => isReportingOnBehalfSelf(formValue),
        }),
      ],
    }),
  ],
})
