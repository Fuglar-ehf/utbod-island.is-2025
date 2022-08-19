import {
  buildSection,
  buildMultiField,
  buildCustomField,
  buildRadioField,
  buildDescriptionField,
  buildFileUploadField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { HasQualityPhotoData } from '../../fields/QualityPhoto/hooks/useQualityPhoto'
import { UPLOAD_ACCEPT, YES, NO } from '../../lib/constants'
import { Photo } from '../../types'

export const sectionPhoto = buildSection({
  id: 'photo',
  title: m.qualityPhotoSectionTitle,
  children: [
    buildMultiField({
      id: 'userPhoto',
      title: m.qualityPhotoTitle,
      children: [
        buildDescriptionField({
          id: 'descriptionPhoto',
          title: '',
          description: m.qualityPhotoExistingPhotoText,
          condition: (_, externalData) => {
            return (
              (externalData.qualityPhoto as HasQualityPhotoData)?.data
                ?.hasQualityPhoto === true
            )
          },
        }),
        buildDescriptionField({
          id: 'descriptionNoPhoto',
          title: '',
          description: m.qualityPhotoNoPhotoDescription,
          condition: (_, externalData) => {
            return (
              (externalData.qualityPhoto as HasQualityPhotoData)?.data
                ?.hasQualityPhoto === false
            )
          },
        }),
        buildCustomField({
          id: 'qphoto',
          title: '',
          component: 'QualityPhoto',
          condition: (_, externalData) => {
            return (
              (externalData.qualityPhoto as HasQualityPhotoData)?.data
                ?.hasQualityPhoto === true
            )
          },
        }),
        buildRadioField({
          id: 'photo.qualityPhoto',
          title: '',
          width: 'half',
          disabled: false,
          options: [
            { value: YES, label: m.qualityPhotoUseExistingPhoto },
            { value: NO, label: m.qualityPhotoUploadNewPhoto },
          ],
          defaultValue: YES,
          condition: (_, externalData) => {
            return (
              (externalData.qualityPhoto as HasQualityPhotoData)?.data
                ?.hasQualityPhoto === true
            )
          },
        }),
        buildCustomField({
          id: 'bullets',
          title: '',
          component: 'Bullets',
          condition: (answers, externalData) => {
            return (
              (externalData.qualityPhoto as HasQualityPhotoData)?.data
                ?.hasQualityPhoto === false ||
              (answers.photo as Photo)?.qualityPhoto === NO
            )
          },
        }),
        buildFileUploadField({
          id: 'photo.attachments',
          title: '',
          uploadHeader: m.qualityPhotoFileUploadTitle,
          uploadDescription: m.qualityPhotoFileUploadDescription,
          uploadButtonLabel: m.qualityPhotoUploadButtonLabel,
          forImageUpload: true,
          uploadMultiple: false,
          uploadAccept: UPLOAD_ACCEPT,
          condition: (answers, externalData) => {
            return (
              (externalData.qualityPhoto as HasQualityPhotoData)?.data
                ?.hasQualityPhoto === false ||
              (answers.photo as Photo)?.qualityPhoto === NO
            )
          },
        }),
      ],
    }),
  ],
})
