import {
  buildMultiField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildSubmitField,
  buildSection,
  buildCustomField,
  buildTextField,
} from '@island.is/application/core'
import { Application, DefaultEvents, Field } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import format from 'date-fns/format'
import { Asset, Answers as AODAnswers, OtherPropertiesEnum } from '../../types'
import { FormatMessage } from '@island.is/localization'
import { getFileRecipientName } from '../../lib/utils'
import { EstateRegistrant } from '@island.is/clients/syslumenn'

const theDeceased: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'theDeceased',
    title: m.overviewTheDeceased,
    titleVariant: 'h3',
  }),
  buildKeyValueField({
    label: m.deceasedName,
    width: 'half',
    value: ({
      externalData: {
        syslumennOnEntry: { data },
      },
    }) =>
      ((data as { estate: EstateRegistrant }).estate
        .nameOfDeceased as string) || '',
  }),
  buildKeyValueField({
    label: m.deceasedNationalId,
    width: 'half',
    value: ({
      externalData: {
        syslumennOnEntry: { data },
      },
    }) =>
      formatNationalId(
        (data as { estate: EstateRegistrant }).estate
          .nationalIdOfDeceased as string,
      ) || '',
  }),
  buildKeyValueField({
    label: m.deceasedDate,
    width: 'half',
    value: ({
      externalData: {
        syslumennOnEntry: { data },
      },
    }) =>
      format(
        new Date(
          ((data as { estate: EstateRegistrant }).estate
            .dateOfDeath as unknown) as string,
        ),
        'dd.MM.yy',
      ) || '',
  }),
]

const theAnnouncer: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'theAnnouncer',
    title: m.announcementTitle,
    titleVariant: 'h3',
  }),
  buildKeyValueField({
    label: m.applicantsName,
    width: 'half',
    value: ({ answers }) => (answers.applicantName as string) || '',
  }),
  buildKeyValueField({
    label: m.applicantsPhoneNumber,
    width: 'half',
    value: ({ answers }) =>
      formatPhoneNumber(answers.applicantPhone as string) || '',
  }),
  buildKeyValueField({
    label: m.applicantsEmail,
    width: 'half',
    value: ({ answers }) => (answers.applicantEmail as string) || '',
  }),
  buildKeyValueField({
    label: m.applicantsRelation,
    width: 'half',
    value: ({ answers }) => (answers.applicantRelation as string) || '',
  }),
]

const testament: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'testament',
    title: m.testamentTitle,
    titleVariant: 'h3',
  }),
  buildKeyValueField({
    label: m.testamentKnowledgeOfOtherTestament,
    width: 'half',
    value: ({ answers }) =>
      answers.knowledgeOfOtherWills === 'yes'
        ? m.testamentKnowledgeOfOtherTestamentYes
        : m.testamentKnowledgeOfOtherTestamentNo,
  }),
]

const extraInfo: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'otherProperties',
    title: m.otherPropertiesTitle,
    marginBottom: 2,
    titleVariant: 'h3',
  }),
  buildKeyValueField({
    label: m.otherPropertiesAccounts,
    width: 'half',
    value: ({ answers }) =>
      answers?.otherProperties
        ? (answers.otherProperties as string[]).includes(
            OtherPropertiesEnum.ACCOUNTS,
          )
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo,
  }),
  buildKeyValueField({
    label: m.otherPropertiesOwnBusiness,
    width: 'half',
    value: ({ answers }) =>
      answers?.otherProperties
        ? (answers.otherProperties as string[]).includes(
            OtherPropertiesEnum.OWN_BUSINESS,
          )
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo,
  }),
  buildKeyValueField({
    label: m.otherPropertiesResidence,
    width: 'half',
    value: ({ answers }) =>
      answers?.otherProperties
        ? (answers.otherProperties as string[]).includes(
            OtherPropertiesEnum.RESIDENCE,
          )
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo,
  }),
  buildKeyValueField({
    label: m.otherPropertiesAssetsAbroad,
    width: 'half',
    value: ({ answers }) =>
      answers?.otherProperties
        ? (answers.otherProperties as string[]).includes(
            OtherPropertiesEnum.ASSETS_ABROAD,
          )
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo,
  }),
]

const inheritance: Field[] = [
  buildDividerField({
    condition: (application) =>
      (application?.estateMembers as any)?.members?.length > 0,
  }),
  buildDescriptionField({
    id: 'inheritance',
    title: m.inheritanceTitle,
    titleVariant: 'h3',
    condition: (answers) =>
      (answers?.estateMembers as any)?.members?.length > 0,
  }),
  buildCustomField(
    {
      title: '',
      id: 'electPerson',
      component: 'InfoCard',
      width: 'full',
      condition: (application) =>
        (application?.estateMembers as any)?.members?.length > 0,
    },
    {
      cards: (application: Application) =>
        ((application?.answers?.estateMembers as any).members as {
          name: string
          nationalId: string
          relation: string
          dummy?: boolean
        }[])
          .filter((member) => !member?.dummy)
          .map((member) => ({
            title: member.name,
            description: [formatNationalId(member.nationalId), member.relation],
          })),
    },
  ),
]
const properties: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'realEstatesTitle',
    title: m.realEstatesTitle,
    titleVariant: 'h3',
    description: m.realEstatesDescription,
  }),
  buildCustomField(
    {
      title: '',
      id: 'assets',
      component: 'InfoCard',
      width: 'full',
      condition: (application) =>
        (application?.assets as { assets: Asset[] })?.assets?.length > 0,
    },
    {
      cards: ({ answers }: Application) =>
        (answers?.assets as { assets: Asset[] }).assets
          .filter((asset) => !asset?.dummy)
          .map((property) => ({
            title: property.description,
            description: (formatMessage: FormatMessage) => [
              `${formatMessage(m.propertyNumber)}: ${property.assetNumber}`,
              property.share
                ? `${formatMessage(m.propertyShare)}: ${property.share * 100}%`
                : '',
            ],
          })),
    },
  ),
  buildDescriptionField({
    id: 'vehiclesTitle',
    title: m.vehiclesTitle,
    description: m.vehiclesDescription,
    space: 5,
    titleVariant: 'h3',
  }),
  buildCustomField(
    {
      title: '',
      id: 'vehicles',
      component: 'InfoCard',
      width: 'full',
      condition: (application) =>
        (application?.vehicles as { vehicles: Asset[] })?.vehicles?.length > 0,
    },
    {
      cards: ({ answers }: Application) =>
        (answers?.vehicles as { vehicles: Asset[] })?.vehicles
          .filter((vehicle) => !vehicle?.dummy)
          .map((vehicle) => ({
            title: vehicle.assetNumber,
            description: [vehicle.description],
          })),
    },
  ),
]
const files: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'selectMainRecipient',
    title: m.filesSelectMainRecipient,
    titleVariant: 'h3',
    marginBottom: 2,
  }),
  buildCustomField(
    {
      title: m.certificateOfDeathAnnouncementTitle,
      description: m.certificateOfDeathAnnouncementDescription,
      id: 'certificateOfDeathAnnouncement',
      component: 'FilesRecipientCard',
    },
    {
      noOptions: true,
      tag: ({ answers }: Application) =>
        getFileRecipientName(
          answers as AODAnswers,
          answers.certificateOfDeathAnnouncement as string,
        ),
    },
  ),
  buildCustomField(
    {
      title: m.financesDataCollectionPermissionTitle,
      description: m.financesDataCollectionPermissionDescription,
      id: 'financesDataCollectionPermission',
      component: 'FilesRecipientCard',
    },
    {
      noOptions: true,
      tag: ({ answers }: Application) =>
        getFileRecipientName(
          answers as AODAnswers,
          answers.financesDataCollectionPermission as string,
        ),
    },
  ),
  buildCustomField(
    {
      title: m.authorizationForFuneralExpensesTitle,
      description: m.authorizationForFuneralExpensesDescription,
      id: 'authorizationForFuneralExpenses',
      component: 'FilesRecipientCard',
    },
    {
      noOptions: true,
      tag: ({ answers }: Application) =>
        getFileRecipientName(
          answers as AODAnswers,
          answers.authorizationForFuneralExpenses as string,
        ),
    },
  ),
]

const additionalInfo: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'additionalInfoTitle',
    title: m.additionalInfoTitle,
    description: m.additionalInfoDescription,
    titleVariant: 'h3',
  }),
  buildTextField({
    id: 'additionalInfo',
    title: m.additionalInfoLabel,
    placeholder: m.additionalInfoPlaceholder,
    variant: 'textarea',
    rows: 4,
    defaultValue: '',
  }),
]

export const sectionOverview = buildSection({
  id: 'overview',
  title: m.overviewSectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.overviewSectionTitle,
      space: 2,
      description: m.overviewSectionDescription,
      children: [
        ...theDeceased,
        ...theAnnouncer,
        ...testament,
        ...inheritance,
        ...properties,
        ...files,
        ...extraInfo,
        ...additionalInfo,
        buildSubmitField({
          id: 'submit',
          title: '',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
