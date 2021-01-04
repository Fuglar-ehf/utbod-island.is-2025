import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const ReviewApplication: Form = buildForm({
  id: 'HealthInsuranceDraft',
  title: m.formTitle,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'approveSection',
      title: 'Approve form',
      children: [
        buildMultiField({
          id: 'missingInfoFields',
          title: 'Approve application for mocking',
          description: '',
          children: [
            buildTextField({
              id: 'agentComments[0]',
              title: m.additionalRemarks,
              variant: 'textarea',
              placeholder: m.additionalRemarksPlaceholder,
            }),
            buildSubmitField({
              id: 'approval',
              placement: 'screen',
              title: 'Do you approve this application?',
              actions: [
                {
                  event: 'MISSING_INFO',
                  name: 'Missing information',
                  type: 'subtle',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'successfulSubmission',
          title: m.succesfulSubmissionTitle,
          description: m.succesfulSubmissionMessage,
        }),
      ],
    }),
  ],
})
