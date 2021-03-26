import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildCustomField,
  buildSubSection,
  buildMultiField,
  buildSubmitField,
  DefaultEvents,
  buildRadioField,
  buildTextField,
  Application,
  Comparators,
} from '@island.is/application/core'
import { DataProviderTypes } from '@island.is/application/templates/children-residence-change'
import Logo from '../../assets/Logo'
import * as m from '../lib/messages'

export const ChildrenResidenceChangeForm: Form = buildForm({
  id: 'ChildrenResidenceChangeFormDraft',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'mockData',
      title: 'Mock data',
      children: [
        buildSubSection({
          id: 'useMocks',
          title: 'Nota gervigögn?',
          children: [
            buildRadioField({
              id: 'useMocks',
              title: 'Nota gervigögn',
              options: [
                {
                  value: 'yes',
                  label: 'Já',
                },
                {
                  value: 'no',
                  label: 'Nei',
                },
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'parentMock',
          title: 'Foreldrar',
          condition: (answers) => answers.useMocks === 'yes',
          children: [
            buildCustomField({
              id: 'mockData.parents',
              title: 'Mock Foreldrar',
              component: 'ParentMock',
            }),
          ],
        }),
        buildSubSection({
          id: 'childrenMock',
          title: 'Börn',
          condition: (answers) => answers.useMocks === 'yes',
          children: [
            buildCustomField({
              id: 'mockData.children',
              title: 'Mock Börn',
              component: 'ChildrenMock',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'backgroundInformation',
      title: m.section.backgroundInformation,
      children: [
        buildSubSection({
          id: 'externalData',
          title: m.externalData.general.sectionTitle,
          condition: {
            questionId: 'useMocks',
            value: 'no',
            comparator: Comparators.EQUALS,
          },
          children: [
            buildExternalDataProvider({
              title: m.externalData.general.pageTitle,
              id: 'approveExternalData',
              subTitle: m.externalData.general.subTitle,
              description: m.externalData.general.description,
              checkboxLabel: m.externalData.general.checkboxLabel,
              dataProviders: [
                buildDataProviderItem({
                  id: 'nationalRegistry',
                  type: DataProviderTypes.NationalRegistry,
                  title: m.externalData.applicant.title,
                  subTitle: m.externalData.applicant.subTitle,
                }),
                buildDataProviderItem({
                  id: 'userProfile',
                  type: DataProviderTypes.UserProfile,
                  title: 'User profile',
                  subTitle: '',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'externalData',
          title: m.externalData.general.sectionTitle,
          condition: {
            questionId: 'useMocks',
            value: 'yes',
            comparator: Comparators.EQUALS,
          },
          children: [
            buildExternalDataProvider({
              title: m.externalData.general.pageTitle,
              id: 'approveExternalData',
              subTitle: m.externalData.general.subTitle,
              description: m.externalData.general.description,
              checkboxLabel: m.externalData.general.checkboxLabel,
              dataProviders: [
                buildDataProviderItem({
                  id: 'nationalRegistry',
                  type: DataProviderTypes.MOCK_NationalRegistry,
                  title: m.externalData.applicant.title,
                  subTitle: m.externalData.applicant.subTitle,
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'selectChildInCustody',
          title: m.selectChildren.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'selectedChildren',
              title: m.selectChildren.general.pageTitle,
              component: 'SelectChildren',
            }),
          ],
        }),
        buildSubSection({
          id: 'contact',
          title: m.contactInfo.general.sectionTitle,
          children: [
            buildMultiField({
              id: 'contactInfo',
              title: m.contactInfo.general.pageTitle,
              description: m.contactInfo.general.description,
              children: [
                buildTextField({
                  id: 'parentA.email',
                  title: m.contactInfo.inputs.emailLabel,
                  variant: 'email',
                  backgroundColor: 'blue',
                  defaultValue: (application: Application) =>
                    (application.externalData.userProfile?.data as {
                      email?: string
                    })?.email,
                }),
                buildTextField({
                  id: 'parentA.phoneNumber',
                  title: m.contactInfo.inputs.phoneNumberLabel,
                  variant: 'tel',
                  format: '###-####',
                  backgroundColor: 'blue',
                  defaultValue: (application: Application) =>
                    (application.externalData.userProfile?.data as {
                      mobilePhoneNumber?: string
                    })?.mobilePhoneNumber,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'arrangement',
      title: m.section.arrangement,
      children: [
        buildSubSection({
          id: 'residenceChangeReason',
          title: m.reason.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'residenceChangeReason',
              title: m.reason.general.pageTitle,
              component: 'Reason',
            }),
          ],
        }),
        buildSubSection({
          id: 'confirmResidenceChangeInfo',
          title: m.newResidence.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'confirmResidenceChangeInfo',
              title: m.newResidence.general.pageTitle,
              component: 'ChangeInformation',
            }),
          ],
        }),
        buildSubSection({
          id: 'duration',
          title: m.duration.general.sectionTitle,
          children: [
            buildCustomField({
              id: 'selectDuration',
              title: m.duration.general.pageTitle,
              component: 'Duration',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'approveTerms',
      title: m.section.effect,
      children: [
        buildCustomField({
          id: 'approveTerms',
          title: m.terms.general.pageTitle,
          component: 'Terms',
        }),
      ],
    }),
    buildSection({
      id: 'interview',
      title: m.interview.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'interview',
          title: m.interview.general.pageTitle,
          component: 'Interview',
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.section.overview,
      children: [
        buildMultiField({
          id: 'residenceChangeOverview',
          title: m.contract.general.pageTitle,
          children: [
            buildCustomField({
              id: 'residenceChangeReview',
              title: m.contract.general.pageTitle,
              component: 'Overview',
            }),
            buildSubmitField({
              id: 'assign',
              title: '',
              actions: [
                {
                  event: DefaultEvents.ASSIGN,
                  name: m.application.signature,
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
      title: m.section.received,
      children: [
        buildCustomField({
          id: 'residenceChangeConfirmation',
          title: m.confirmation.general.pageTitle,
          component: 'Confirmation',
        }),
      ],
    }),
  ],
})
