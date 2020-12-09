import {
  buildForm,
  buildMultiField,
  buildSection,
  buildTextField,
  Form,
  ApplicationTypes,
  FormModes,
  buildSubmitField,
  buildCustomField,
  buildDividerField,
} from '@island.is/application/core'
import { m } from './messages'

export const DocumentProviderOnboarding: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: m.formName,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'termsOfAgreement',
      name: m.termsSection,
      children: [
        buildCustomField(
          {
            id: 'termsOfAgreement',
            name: m.termsTitle,
            description: m.termsSubTitle,
            component: 'TermsOfAgreement',
          },
          {},
        ),
      ],
    }),
    buildSection({
      id: 'applicant',
      name: m.applicantSection,
      children: [
        buildMultiField({
          id: 'applicant',
          name: m.applicantTitle,
          description: m.applicantSubTitle,
          children: [
            buildTextField({
              id: 'applicant.nationalId',
              name: m.applicantNationalId,
              format: '######-####',
              placeholder: '000000-0000',
            }),
            buildTextField({
              id: 'applicant.name',
              name: m.applicantName,
            }),
            buildTextField({
              id: 'applicant.address',
              name: m.applicantAddress,
            }),
            buildTextField({
              id: 'applicant.zipCode',
              name: m.applicantZipCode,
            }),
            buildTextField({
              id: 'applicant.email',
              name: m.applicantEmail,
              variant: 'email',
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              name: m.applicantPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: '000-0000',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'administrativeContact',
      name: m.administrativeContactSection,
      children: [
        buildMultiField({
          id: 'administrativeContact',
          name: m.administrativeContactTitle,
          description: m.administrativeContactSubTitle,
          children: [
            buildTextField({
              id: 'administrativeContact.name',
              name: m.administrativeContactName,
            }),
            buildTextField({
              id: 'administrativeContact.email',
              name: m.administrativeContactEmail,
              variant: 'email',
            }),
            buildTextField({
              id: 'administrativeContact.phoneNumber',
              name: m.administrativeContactPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: '000-0000',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'technicalContact',
      name: m.technicalContactSection,
      children: [
        buildMultiField({
          id: 'technicalContact',
          name: m.technicalContactTitle,
          description: m.technicalContactSubTitle,
          children: [
            buildTextField({
              id: 'technicalContact.name',
              name: m.technicalContactName,
            }),
            buildTextField({
              id: 'technicalContact.email',
              name: m.technicalContactEmail,
              variant: 'email',
            }),
            buildTextField({
              id: 'technicalContact.phoneNumber',
              name: m.technicalContactPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: '000-0000',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'helpDesk',
      name: m.helpDeskSection,
      children: [
        buildMultiField({
          id: 'helpDesk',
          name: m.helpDeskTitle,
          description: m.helpDeskSubTitle,
          children: [
            buildTextField({
              id: 'helpDesk.email',
              name: m.helpDeskEmail,
              variant: 'email',
            }),
            buildTextField({
              id: 'helpDesk.phoneNumber',
              name: m.helpDeskPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: '000-0000',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      name: m.confirmationSection,
      children: [
        buildMultiField({
          id: 'confirmation',
          name: m.confirmationTitle,
          description: m.confirmationSubTitle,
          children: [
            buildDividerField({
              name: m.applicantSection.defaultMessage,
              color: 'currentColor',
            }),
            buildTextField({
              id: 'applicant.nationalId',
              name: m.applicantNationalId,
              format: '######-####',
              placeholder: '000000-0000',
            }),
            buildTextField({
              id: 'applicant.name',
              name: m.applicantName,
            }),
            buildTextField({
              id: 'applicant.address',
              name: m.applicantAddress,
            }),
            buildTextField({
              id: 'applicant.zipCode',
              name: m.applicantZipCode,
            }),
            buildTextField({
              id: 'applicant.email',
              name: m.applicantEmail,
              variant: 'email',
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              name: m.applicantPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: '000-0000',
            }),
            buildDividerField({
              name: m.administrativeContactSection.defaultMessage,
              color: 'currentColor',
            }),
            buildTextField({
              id: 'administrativeContact.name',
              name: m.administrativeContactName,
            }),
            buildTextField({
              id: 'administrativeContact.email',
              name: m.administrativeContactEmail,
              variant: 'email',
            }),
            buildTextField({
              id: 'administrativeContact.phoneNumber',
              name: m.administrativeContactPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: '000-0000',
            }),
            buildDividerField({
              name: m.technicalContactSection.defaultMessage,
              color: 'currentColor',
            }),
            buildTextField({
              id: 'technicalContact.name',
              name: m.technicalContactName,
            }),
            buildTextField({
              id: 'technicalContact.email',
              name: m.technicalContactEmail,
              variant: 'email',
            }),
            buildTextField({
              id: 'technicalContact.phoneNumber',
              name: m.technicalContactPhoneNumber,
              variant: 'tel',
              format: '###-####',
              placeholder: '000-0000',
            }),
            buildDividerField({
              name: m.helpDeskSection.defaultMessage,
              color: 'currentColor',
            }),
            //CustomField is a workaround because of a bug in react-hook-form
            buildCustomField({
              id: 'helpDeskConfirmation',
              name: 'helpDeskConfirmation',
              component: 'Review',
            }),

            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              name: m.confirmationSubmitButton,

              actions: [
                {
                  event: 'SUBMIT',
                  name: m.confirmationSubmitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildCustomField(
          {
            id: 'thankYouScreen',
            name: m.thankYouScreenTitle,
            component: 'ThankYouScreen',
          },
          {},
        ),
      ],
    }),
  ],
})
