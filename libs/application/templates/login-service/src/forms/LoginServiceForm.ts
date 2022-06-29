import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
  buildMultiField,
  buildTextField,
  buildSubmitField,
  DefaultEvents,
  buildCheckboxField,
  buildCompanySearchField,
  Application,
  getValueViaPath,
} from '@island.is/application/core'
import {
  section,
  application,
  terms,
  applicant,
  technicalAnnouncements,
  overview,
  submitted,
  selectCompany,
} from '../lib/messages'
import { YES } from '../shared/constants'
import { selectCompanySearchField } from '@island.is/application/ui-components'

export const LoginServiceForm: Form = buildForm({
  id: 'LoginServiceForm',
  title: application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'terms',
      title: section.terms,
      children: [
        buildMultiField({
          id: 'termsOfAgreementMultiField',
          title: terms.general.pageTitle,
          description: terms.general.pageDescription,
          children: [
            buildCustomField({
              id: 'termsAgreement',
              title: terms.general.pageTitle,
              doesNotRequireAnswer: true,
              component: 'TermsOfAgreement',
            }),
            buildCheckboxField({
              id: 'termsOfAgreement',
              title: '',
              backgroundColor: 'white',
              options: [
                {
                  value: YES,
                  label: terms.labels.termsAgreementApproval,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'selectCompany',
      title: section.selectCompany,
      children: [
        buildMultiField({
          id: 'selectCompanyMultiField',
          title: selectCompany.general.pageTitle,
          description: selectCompany.general.pageDescription,
          children: [
            buildCustomField({
              id: 'selectCompany.nameFieldTitle',
              title: selectCompany.labels.nameDescription,
              doesNotRequireAnswer: true,
              component: 'FieldTitle',
            }),
            buildCompanySearchField({
              id: 'selectCompany.searchField',
              title: selectCompany.labels.nameAndNationalId,
              shouldIncludeIsatNumber: true,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'applicantSection',
      title: section.applicant,
      children: [
        buildMultiField({
          id: 'applicantMultiField',
          title: applicant.general.pageTitle,
          description: applicant.general.pageDescription,
          children: [
            buildCustomField({
              id: 'applicant.nameFieldTitle',
              title: applicant.labels.nameDescription,
              doesNotRequireAnswer: true,
              component: 'FieldTitle',
            }),
            buildTextField({
              id: 'applicant.name',
              title: applicant.labels.name,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
              disabled: true,
              defaultValue: (application: Application) => {
                return getValueViaPath(
                  application.answers,
                  'selectCompany.searchField.label',
                  '',
                )
              },
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: applicant.labels.nationalId,
              backgroundColor: 'blue',
              width: 'half',
              format: '######-####',
              required: true,
              disabled: true,
              defaultValue: (application: Application) => {
                return getValueViaPath(
                  application.answers,
                  'selectCompany.searchField.nationalId',
                  '',
                )
              },
            }),
            buildTextField({
              id: 'applicant.typeOfOperation',
              title: applicant.labels.typeOfOperation,
              backgroundColor: 'blue',
              required: true,
              disabled: true,
              defaultValue: (application: Application) => {
                return getValueViaPath(
                  application.answers,
                  'selectCompany.searchField.isat',
                  '',
                )
              },
            }),
            buildCustomField({
              id: 'applicant.invalidIsat',
              title: applicant.labels.invalidIsat,
              doesNotRequireAnswer: true,
              component: 'IsatInvalid',
              condition: (formValue) => {
                const isatNr = getValueViaPath(
                  formValue,
                  'selectCompany.searchField.isat',
                  '',
                )
                if (isatNr !== undefined) {
                  return isatNr.slice(0, 2) !== '84'
                }
                return false
              },
            }),
            buildCustomField(
              {
                id: 'applicant.responsibleParty',
                title: applicant.labels.responsiblePartyTitle,
                description: applicant.labels.responsiblePartyDescription,
                doesNotRequireAnswer: true,
                component: 'FieldTitle',
              },
              {
                marginTop: [3, 5],
              },
            ),
            buildTextField({
              id: 'applicant.responsiblePartyName',
              title: applicant.labels.responsiblePartyName,
              backgroundColor: 'blue',
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'applicant.responsiblePartyEmail',
              title: applicant.labels.responsiblePartyEmail,
              backgroundColor: 'blue',
              variant: 'email',
              width: 'half',
              required: true,
            }),
            buildTextField({
              id: 'applicant.responsiblePartyTel',
              title: applicant.labels.responsiblePartyTel,
              backgroundColor: 'blue',
              format: '###-####',
              required: true,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'technicalContact',
      title: section.technicalContact,
      children: [
        buildMultiField({
          id: 'technicalContactMultiField',
          title: technicalAnnouncements.general.pageTitle,
          description: technicalAnnouncements.general.pageDescription,
          children: [
            buildTextField({
              id: 'technicalAnnouncements.email',
              title: technicalAnnouncements.labels.email,
              variant: 'email',
              backgroundColor: 'blue',
              required: true,
            }),
            buildTextField({
              id: 'technicalAnnouncements.phoneNumber',
              title: technicalAnnouncements.labels.tel,
              variant: 'tel',
              backgroundColor: 'blue',
              format: '###-####',
              required: true,
            }),
            buildTextField({
              id: 'technicalAnnouncements.type',
              title: technicalAnnouncements.labels.type,
              placeholder: technicalAnnouncements.labels.typePlaceholder,
              backgroundColor: 'blue',
              required: true,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: section.overview,
      children: [
        buildMultiField({
          id: 'overviewMultifield',
          title: overview.general.pageTitle,
          description: overview.general.pageDescription,
          children: [
            buildCustomField({
              id: 'overviewCustomField',
              title: overview.general.pageTitle,
              description: overview.general.pageDescription,
              component: 'Overview',
            }),
            buildSubmitField({
              id: 'overview.submitField',
              title: '',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overview.labels.submit,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'submitted',
      title: section.submitted,
      children: [
        buildCustomField({
          id: 'submittedCustomField',
          title: submitted.general.pageTitle,
          component: 'Submitted',
        }),
      ],
    }),
  ],
})
