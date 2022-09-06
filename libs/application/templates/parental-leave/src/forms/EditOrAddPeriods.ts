import {
  buildCustomField,
  buildDateField,
  buildForm,
  buildMultiField,
  buildRepeater,
  buildSection,
  buildSelectField,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import Logo from '../assets/Logo'
import { parentalLeaveFormMessages } from '../lib/messages'
import {
  getApplicationAnswers,
  getAllPeriodDates,
} from '../lib/parentalLeaveUtils'

export const EditOrAddPeriods: Form = buildForm({
  id: 'ParentalLeaveEditOrAddPeriods',
  title: 'Edit or add periods',
  logo: Logo,
  mode: FormModes.EDITING,
  children: [
    buildSection({
      id: 'editOrAddPeriods',
      title: parentalLeaveFormMessages.leavePlan.title,
      children: [
        buildRepeater({
          id: 'periods',
          title: parentalLeaveFormMessages.leavePlan.title,
          component: 'PeriodsRepeater',
          children: [
            buildDateField({
              id: 'startDate',
              title: parentalLeaveFormMessages.startDate.title,
              description: parentalLeaveFormMessages.startDate.description,
              placeholder: parentalLeaveFormMessages.startDate.placeholder,
              excludeDates: (application) => {
                const { periods } = getApplicationAnswers(application.answers)

                return getAllPeriodDates(periods)
              },
            }),
            buildMultiField({
              id: 'endDate',
              title: parentalLeaveFormMessages.endDate.title,
              description: parentalLeaveFormMessages.endDate.description,
              children: [
                buildDateField({
                  id: 'endDate',
                  title: parentalLeaveFormMessages.endDate.label,
                  placeholder: parentalLeaveFormMessages.endDate.placeholder,
                  excludeDates: (application) => {
                    const { periods } = getApplicationAnswers(
                      application.answers,
                    )

                    return getAllPeriodDates(periods)
                  },
                }),
              ],
            }),
            buildMultiField({
              id: 'ratio',
              title: parentalLeaveFormMessages.ratio.title,
              description: parentalLeaveFormMessages.ratio.description,
              children: [
                buildSelectField({
                  id: 'ratio',
                  width: 'half',
                  title: parentalLeaveFormMessages.ratio.label,
                  defaultValue: '100',
                  placeholder: parentalLeaveFormMessages.ratio.placeholder,
                  options: [
                    { label: '100%', value: '100' },
                    { label: '75%', value: '75' },
                    { label: '50%', value: '50' },
                    { label: '25%', value: '25' },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildMultiField({
          id: 'confirmation',
          title: parentalLeaveFormMessages.confirmation.title,
          description: parentalLeaveFormMessages.confirmation.description,
          children: [
            buildCustomField({
              id: 'confirmationScreen',
              title: parentalLeaveFormMessages.confirmation.title,
              component: 'EditPeriodsReview',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: parentalLeaveFormMessages.confirmation.title,
              actions: [
                { name: 'Cancel', type: 'reject', event: 'ABORT' },
                {
                  event: 'SUBMIT',
                  name: parentalLeaveFormMessages.confirmation.title,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildCustomField({
          id: 'thankYou',
          title: parentalLeaveFormMessages.finalScreen.title,
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
