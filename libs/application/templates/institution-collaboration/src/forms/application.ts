import { Comparators, Form, FormModes } from '@island.is/application/types'
import {
  buildCompanySearchField,
  buildCustomField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
} from '@island.is/application/core'

import { YES } from '../constants'
import { buildFormConclusionSection } from '@island.is/application/ui-forms'
import { institutionApplicationMessages as m } from '../lib/messages'

export const application: Form = buildForm({
  id: 'InstitutionCollaborationApplicationForm',
  title: m.applicant.formName,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'applicantSection',
      title: m.applicant.sectionLabel,
      children: [
        buildMultiField({
          id: 'applicantInformation',
          title: m.applicant.sectionTitle,
          description: m.applicant.sectionApplicantDescription,
          children: [
            buildCustomField(
              {
                id: 'applicant.institutionSubtitle',
                component: 'FieldDescription',
                title: '',
              },
              {
                subTitle: m.applicant.institutionSubtitle,
              },
            ),
            buildCompanySearchField({
              id: 'applicant.institution',
              title: m.applicant.institutionLabel,
              setLabelToDataSchema: true,
              required: true,
            }),

            buildTextField({
              id: 'applicant.institutionEmail',
              title: m.applicant.contactInstitutionEmailLabel,
              variant: 'email',
              backgroundColor: 'white',
              required: true,
              defaultValue: '',
            }),

            buildCustomField(
              {
                id: 'applicant.contactSubtitle',
                component: 'FieldDescription',
                title: '',
              },
              {
                subTitle: m.applicant.contactSubtitle,
              },
            ),
            buildTextField({
              id: 'contact.name',
              title: m.applicant.contactNameLabel,
              backgroundColor: 'white',
              required: true,
              defaultValue: '',
            }),

            buildTextField({
              id: 'contact.phoneNumber',
              title: m.applicant.contactPhoneLabel,
              variant: 'tel',
              format: '###-####',
              backgroundColor: 'white',
              required: true,
              defaultValue: '',
            }),
            buildTextField({
              id: 'contact.email',
              title: m.applicant.contactEmailLabel,
              variant: 'email',
              backgroundColor: 'white',
              required: true,
              defaultValue: '',
            }),
            buildCustomField({
              id: 'secondaryContact',
              title: m.applicant.secondaryContactSubtitle,
              component: 'SecondaryContact',
            }),
            buildTextField({
              id: 'secondaryContact.name',
              title: m.applicant.contactNameLabel,
              backgroundColor: 'white',
              defaultValue: '',
              condition: {
                questionId: 'hasSecondaryContact',
                comparator: Comparators.EQUALS,
                value: YES,
              },
            }),
            buildTextField({
              id: 'secondaryContact.phoneNumber',
              title: m.applicant.contactPhoneLabel,
              variant: 'tel',
              format: '###-####',
              backgroundColor: 'white',
              defaultValue: '',
              condition: {
                questionId: 'hasSecondaryContact',
                comparator: Comparators.EQUALS,
                value: YES,
              },
            }),
            buildTextField({
              id: 'secondaryContact.email',
              title: m.applicant.contactEmailLabel,
              variant: 'email',
              backgroundColor: 'white',
              defaultValue: '',
              condition: {
                questionId: 'hasSecondaryContact',
                comparator: Comparators.EQUALS,
                value: YES,
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'serviceSection',
      title: m.service.sectionLabel,
      children: [
        buildMultiField({
          id: 'constraints',
          title: m.service.sectionTitle,
          description: m.service.sectionDescription,
          children: [
            buildCustomField({
              id: 'constraints',
              title: '',
              component: 'Constraints',
            }),
          ],
        }),
      ],
    }),

    buildSection({
      id: 'applicationReviewSection',
      title: m.review.sectionLabel,
      children: [
        buildMultiField({
          id: 'applicationReviewSection.applicationReview',
          title: m.review.sectionReviewTitle,
          description: m.review.sectionReviewDescription,
          children: [
            buildCustomField({
              id: 'reviewScreen',
              title: '',
              component: 'ReviewScreen',
            }),
            buildSubmitField({
              id: 'submit',
              title: m.review.submitButtonLabel,
              placement: 'footer',
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta umsókn', type: 'primary' },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      alertTitle: m.confirmation.sectionTitle,
      expandableHeader: m.confirmation.sectionInfoHeader,
      expandableDescription: m.confirmation.sectionInfoBulletPoints,
    }),
  ],
})
