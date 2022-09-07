import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildMultiField,
  buildCustomField,
  buildTextField,
  buildSubmitField,
  buildDescriptionField,
  buildSubSection,
  buildRadioField,
  buildSelectField,
  getValueViaPath,
  buildDateField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  Application,
  DefaultEvents,
} from '@island.is/application/types'
import type { User } from '@island.is/api/domains/national-registry'
import { format as formatNationalId } from 'kennitala'
import { Individual, PersonalInfo } from '../types'
import { m } from '../lib/messages'
import {
  DistrictCommissionerAgencies,
  maritalStatuses,
  MarriageTermination,
  ReligiousLifeViewingSocieties,
} from '../lib/constants'
import { UserProfile } from '../types/schema'
import { removeCountryCode } from '../lib/utils'
import { fakeDataSection } from './fakeDataSection'

export const getApplication = ({ allowFakeData = false }): Form => {
  return buildForm({
    id: 'MarriageConditionsApplicationDraftForm',
    title: '',
    mode: FormModes.APPLYING,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      ...(allowFakeData ? [fakeDataSection] : []),
      buildSection({
        id: 'introSection',
        title: m.introTitle,
        children: [
          buildMultiField({
            id: 'intro',
            title: m.introSectionTitle,
            description: m.introSectionDescription,
            children: [
              buildDescriptionField({
                id: 'space',
                title: '',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'externalData',
        title: m.dataCollectionTitle,
        children: [
          buildExternalDataProvider({
            id: 'approveExternalData',
            title: m.dataCollectionTitle,
            subTitle: m.dataCollectionSubtitle,
            description: m.dataCollectionDescription,
            checkboxLabel: m.dataCollectionCheckboxLabel,
            dataProviders: [
              buildDataProviderItem({
                id: 'nationalRegistry',
                type: 'NationalRegistryProvider',
                title: m.dataCollectionNationalRegistryTitle,
                subTitle: m.dataCollectionNationalRegistrySubtitle,
              }),
              buildDataProviderItem({
                id: 'userProfile',
                type: 'UserProfileProvider',
                title: m.dataCollectionUserProfileTitle,
                subTitle: m.dataCollectionUserProfileSubtitle,
              }),
              buildDataProviderItem({
                id: 'birthCertificate',
                type: '',
                title: m.dataCollectionBirthCertificateTitle,
                subTitle: m.dataCollectionBirthCertificateDescription,
              }),
              buildDataProviderItem({
                id: 'maritalStatus',
                type: 'NationalRegistryMaritalStatusProvider',
                title: m.dataCollectionMaritalStatusTitle,
                subTitle: m.dataCollectionMaritalStatusDescription,
              }),
              buildDataProviderItem({
                id: 'districtCommissioners',
                type: 'DistrictsProvider',
                title: '',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'marriageSides',
        title: m.informationSectionTitle,
        children: [
          buildSubSection({
            id: 'sides',
            title: m.informationMaritalSides,
            children: [
              buildMultiField({
                id: 'sides',
                title: m.informationTitle,
                children: [
                  buildDescriptionField({
                    id: 'header1',
                    title: m.informationSpouse1,
                    titleVariant: 'h4',
                  }),
                  buildTextField({
                    id: 'applicant.person.nationalId',
                    title: m.nationalId,
                    width: 'half',
                    backgroundColor: 'white',
                    readOnly: true,
                    format: '######-####',
                    defaultValue: (application: Application) => {
                      return formatNationalId(application.applicant) ?? ''
                    },
                  }),
                  buildTextField({
                    id: 'applicant.person.name',
                    title: m.name,
                    width: 'half',
                    backgroundColor: 'white',
                    readOnly: true,
                    defaultValue: (application: Application) => {
                      const nationalRegistry = application.externalData
                        .nationalRegistry.data as User
                      return nationalRegistry.fullName ?? ''
                    },
                  }),
                  buildTextField({
                    id: 'applicant.phone',
                    title: m.phone,
                    width: 'half',
                    backgroundColor: 'blue',
                    format: '###-####',
                    defaultValue: (application: Application) => {
                      const data = application.externalData.userProfile
                        .data as UserProfile
                      return removeCountryCode(data?.mobilePhoneNumber ?? '')
                    },
                  }),
                  buildTextField({
                    id: 'applicant.email',
                    title: m.email,
                    variant: 'email',
                    width: 'half',
                    backgroundColor: 'blue',
                    defaultValue: (application: Application) => {
                      const data = application.externalData.userProfile
                        .data as UserProfile
                      return data.email ?? ''
                    },
                  }),
                  buildDescriptionField({
                    id: 'header2',
                    title: m.informationSpouse2,
                    titleVariant: 'h4',
                    space: 'gutter',
                  }),
                  buildCustomField({
                    id: 'alert',
                    title: '',
                    component: 'InfoAlert',
                  }),
                  buildCustomField({
                    id: 'spouse.person',
                    title: '',
                    component: 'NationalIdWithName',
                  }),
                  buildTextField({
                    id: 'spouse.phone',
                    title: m.phone,
                    width: 'half',
                    backgroundColor: 'blue',
                    format: '###-####',
                    defaultValue: (application: Application) => {
                      const info = application.answers.spouse as Individual
                      return removeCountryCode(info?.phone ?? '')
                    },
                  }),
                  buildTextField({
                    id: 'spouse.email',
                    title: m.email,
                    variant: 'email',
                    width: 'half',
                    backgroundColor: 'blue',
                    defaultValue: (application: Application) => {
                      const info = application.answers.spouse as Individual
                      return info?.email ?? ''
                    },
                  }),
                ],
              }),
            ],
          }),
          buildSubSection({
            id: 'info',
            title: m.personalInformationTitle,
            children: [
              buildMultiField({
                id: 'personalInfo',
                title: m.personalInformationTitle,
                description: m.personalInformationDescription,
                children: [
                  buildTextField({
                    id: 'personalInfo.address',
                    title: m.address,
                    backgroundColor: 'white',
                    readOnly: true,
                    defaultValue: (application: Application) => {
                      const nationalRegistry = application.externalData
                        .nationalRegistry.data as User
                      return nationalRegistry.address.streetAddress
                    },
                  }),
                  buildTextField({
                    id: 'personalInfo.citizenship',
                    title: m.citizenship,
                    backgroundColor: 'white',
                    width: 'half',
                    readOnly: true,
                    defaultValue: (application: Application) => {
                      const nationalRegistry = application.externalData
                        .nationalRegistry.data as User
                      return nationalRegistry.citizenship.code
                    },
                  }),
                  buildTextField({
                    id: 'personalInfo.maritalStatus',
                    title: m.maritalStatus,
                    backgroundColor: 'white',
                    width: 'half',
                    readOnly: true,
                    defaultValue: (application: Application) => {
                      const status = application.externalData.maritalStatus
                        .data as any
                      return status.maritalStatus
                    },
                  }),
                  buildDescriptionField({
                    id: 'space',
                    space: 'containerGutter',
                    title: '',
                  }),
                  buildRadioField({
                    id: 'personalInfo.previousMarriageTermination',
                    title: m.previousMarriageTermination,
                    options: [
                      {
                        value: MarriageTermination.divorce,
                        label: m.terminationByDivorce,
                      },
                      {
                        value: MarriageTermination.lostSpouse,
                        label: m.terminationByLosingSpouse,
                      },
                      {
                        value: MarriageTermination.annulment,
                        label: m.terminationByAnnulment,
                      },
                    ],
                    largeButtons: false,
                    condition: (answers) => {
                      return (
                        (answers.personalInfo as PersonalInfo)
                          ?.maritalStatus === maritalStatuses['6']
                      )
                    },
                  }),
                ],
              }),
            ],
          }),
          buildSubSection({
            id: 'info',
            title: m.ceremony,
            children: [
              buildMultiField({
                id: 'ceremonyInfo',
                title: m.ceremony,
                description: m.ceremonyDescription,
                children: [
                  buildDateField({
                    id: 'ceremony.date',
                    title: m.ceremonyDate,
                    placeholder: m.ceremonyDatePlaceholder,
                    width: 'half',
                  }),
                  buildDescriptionField({
                    id: 'space',
                    space: 'containerGutter',
                    title: '',
                  }),
                  buildRadioField({
                    id: 'ceremony.ceremonyPlace',
                    title: m.ceremonyPlace,
                    options: [
                      { value: 'office', label: m.ceremonyAtDistrictsOffice },
                      {
                        value: 'society',
                        label: m.ceremonyAtReligiousLifeViewingSociety,
                      },
                    ],
                    largeButtons: false,
                    width: 'half',
                  }),
                  buildSelectField({
                    id: 'ceremony.office',
                    title: m.ceremonyAtDistrictsOffice,
                    placeholder: m.ceremonyChooseDistrict,
                    options: ({
                      externalData: {
                        districtCommissioners: { data },
                      },
                    }) => {
                      return (data as DistrictCommissionerAgencies[])?.map(
                        ({ name, place, address }) => ({
                          value: `${name}, ${place}`,
                          label: `${name}, ${place}`,
                          tooltip: `${address}`,
                        }),
                      )
                    },
                    condition: (answers) =>
                      getValueViaPath(answers, 'ceremony.ceremonyPlace') ===
                      'office',
                  }),
                  buildSelectField({
                    id: 'ceremony.society',
                    title: m.ceremonyAtReligiousLifeViewingSociety,
                    placeholder: m.ceremonyChooseSociety,
                    options: () => {
                      return ReligiousLifeViewingSocieties.map((society) => ({
                        value: society,
                        label: society,
                      }))
                    },
                    condition: (answers) =>
                      getValueViaPath(answers, 'ceremony.ceremonyPlace') ===
                      'society',
                  }),
                ],
              }),
            ],
          }),
          buildSubSection({
            id: 'info2',
            title: m.informationWitnessTitle,
            children: [
              buildMultiField({
                id: 'witnesses',
                title: m.informationWitnessTitle,
                description: m.informationMaritalSidesDescription,
                children: [
                  buildDescriptionField({
                    id: 'header3',
                    title: m.informationWitness1,
                    titleVariant: 'h4',
                  }),
                  buildCustomField({
                    id: 'witness1.person',
                    title: '',
                    component: 'NationalIdWithName',
                  }),
                  buildTextField({
                    id: 'witness1.phone',
                    title: m.phone,
                    width: 'half',
                    backgroundColor: 'blue',
                    format: '###-####',
                  }),
                  buildTextField({
                    id: 'witness1.email',
                    title: m.email,
                    variant: 'email',
                    width: 'half',
                    backgroundColor: 'blue',
                  }),
                  buildDescriptionField({
                    id: 'header4',
                    title: m.informationWitness1,
                    titleVariant: 'h4',
                    space: 'gutter',
                  }),
                  buildCustomField({
                    id: 'witness2.person',
                    title: '',
                    component: 'NationalIdWithName',
                  }),
                  buildTextField({
                    id: 'witness2.phone',
                    title: m.phone,
                    width: 'half',
                    backgroundColor: 'blue',
                    format: '###-####',
                  }),
                  buildTextField({
                    id: 'witness2.email',
                    title: m.email,
                    variant: 'email',
                    width: 'half',
                    backgroundColor: 'blue',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'marriageOverview',
        title: m.overview,
        children: [
          buildMultiField({
            id: 'applicationOverview',
            title: m.applicationOverview,
            description: m.informationSubtitle,
            children: [
              buildCustomField({
                id: 'overview',
                title: '',
                component: 'ApplicationOverview',
              }),
            ],
          }),
        ],
      }),
      buildSection({
        id: 'paymentTotal',
        title: m.payment,
        children: [
          buildMultiField({
            id: 'payment',
            title: '',
            children: [
              buildCustomField({
                id: 'payment',
                title: '',
                component: 'PaymentInfo',
              }),
              buildSubmitField({
                id: 'submitPayment',
                title: '',
                placement: 'footer',
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: DefaultEvents.PAYMENT,
                    name: m.proceedToPayment,
                    type: 'primary',
                  },
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}
