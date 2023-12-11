import {
  buildFileUploadField,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import {
  inReviewFormMessages,
  householdSupplementFormMessage,
} from '../lib/messages'
import { FILE_SIZE_LIMIT } from '@island.is/application/templates/social-insurance-administration-core/constants'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'

export const AdditionalDocumentsRequired: Form = buildForm({
  id: 'HouseholdSupplementInReviewUpload',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenBackButton: true,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'reviewUpload',
      title:
        householdSupplementFormMessage.fileUpload
          .additionalDocumentRequiredTitle,
      children: [
        buildMultiField({
          id: 'additionalDocumentsScreen',
          title:
            householdSupplementFormMessage.fileUpload
              .additionalDocumentRequiredTitle,
          description:
            householdSupplementFormMessage.fileUpload
              .additionalDocumentRequiredDescription,
          children: [
            buildFileUploadField({
              id: 'fileUploadAdditionalFilesRequired.additionalDocumentsRequired',
              title: '',
              maxSize: FILE_SIZE_LIMIT,
              maxSizeErrorText:
                householdSupplementFormMessage.fileUpload
                  .attachmentMaxSizeError,
              uploadAccept: '.pdf',
              uploadHeader:
                householdSupplementFormMessage.fileUpload.attachmentHeader,
              uploadDescription:
                householdSupplementFormMessage.fileUpload.attachmentDescription,
              uploadButtonLabel:
                householdSupplementFormMessage.fileUpload.attachmentButton,
              uploadMultiple: true,
            }),
            buildSubmitField({
              id: 'additionalDocumentsSubmit',
              title:
                householdSupplementFormMessage.fileUpload
                  .additionalDocumentsEditSubmit,
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  name: householdSupplementFormMessage.fileUpload
                    .additionalDocumentsEditSubmit,
                  type: 'primary',
                  event: DefaultEvents.SUBMIT,
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
