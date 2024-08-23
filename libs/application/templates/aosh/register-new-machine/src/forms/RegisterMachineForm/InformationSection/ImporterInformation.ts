import {
  buildMultiField,
  buildTextField,
  buildSubSection,
  buildPhoneField,
  buildRadioField,
  buildDescriptionField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'
import { FormValue, NO, YES } from '@island.is/application/types'
import { isOwnerOtherThanImporter } from '../../../utils/isOwnerOtherThanImporter'

export const ImporterInformationSubSection = buildSubSection({
  id: 'importerInformation',
  title: information.labels.importer.sectionTitle,
  children: [
    buildMultiField({
      id: 'importerInformationMultiField',
      title: information.labels.importer.title,
      description: information.labels.importer.description,
      children: [
        buildTextField({
          id: 'importerInformation.importer.name',
          title: information.labels.importer.name,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'identity.data.name',
              '',
            ) as string,
        }),
        buildTextField({
          id: 'importerInformation.importer.nationalId',
          title: information.labels.importer.nationalId,
          backgroundColor: 'white',
          width: 'half',
          readOnly: true,
          format: '######-####',
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'identity.data.nationalId',
              '',
            ) as string,
        }),
        buildTextField({
          id: 'importerInformation.importer.address',
          title: information.labels.importer.address,
          width: 'half',
          required: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'identity.data.address.streetAddress',
              '',
            ) as string,
        }),
        buildTextField({
          id: 'importerInformation.importer.postCode',
          title: information.labels.importer.postCode,
          width: 'half',
          required: true,
          variant: 'number',
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'identity.data.address.postalCode',
              '',
            ) as string,
        }),
        buildPhoneField({
          id: 'importerInformation.importer.phone',
          title: information.labels.importer.phone,
          width: 'half',
          required: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'userProfile.data.mobilePhoneNumber',
              '',
            ) as string,
        }),
        buildTextField({
          id: 'importerInformation.importer.email',
          title: information.labels.importer.email,
          width: 'half',
          variant: 'email',
          required: true,
          defaultValue: (application: Application) =>
            getValueViaPath(
              application.externalData,
              'userProfile.data.email',
              '',
            ) as string,
        }),
        buildDescriptionField({
          id: 'importerInformation.description',
          title: information.labels.importer.isOwnerOtherThenImporter,
          marginTop: 4,
          titleVariant: 'h5',
        }),
        buildRadioField({
          id: 'importerInformation.isOwnerOtherThanImporter',
          title: '',
          width: 'half',
          defaultValue: NO,
          options: [
            {
              value: NO,
              label: information.labels.radioButtons.radioOptionNo,
            },
            {
              value: YES,
              label: information.labels.radioButtons.radioOptionYes,
            },
          ],
        }),
        buildTextField({
          id: 'importerInformation.owner.name',
          title: information.labels.owner.name,
          width: 'half',
          required: true,
          condition: (answer: FormValue) => isOwnerOtherThanImporter(answer),
        }),
        buildTextField({
          id: 'importerInformation.owner.nationalId',
          title: information.labels.owner.nationalId,
          width: 'half',
          required: true,
          condition: (answer: FormValue) => isOwnerOtherThanImporter(answer),
        }),
        buildTextField({
          id: 'importerInformation.owner.address',
          title: information.labels.owner.address,
          width: 'half',
          required: true,
          condition: (answer: FormValue) => isOwnerOtherThanImporter(answer),
        }),
        buildTextField({
          id: 'importerInformation.owner.postCode',
          title: information.labels.owner.postCode,
          variant: 'number',
          width: 'half',
          required: true,
          condition: (answer: FormValue) => isOwnerOtherThanImporter(answer),
        }),
        buildPhoneField({
          id: 'importerInformation.owner.phone',
          title: information.labels.owner.phone,
          width: 'half',
          required: true,
          condition: (answer: FormValue) => isOwnerOtherThanImporter(answer),
        }),
        buildTextField({
          id: 'importerInformation.owner.email',
          title: information.labels.owner.email,
          width: 'half',
          variant: 'email',
          required: true,
          condition: (answer: FormValue) => isOwnerOtherThanImporter(answer),
        }),
      ],
    }),
  ],
})
