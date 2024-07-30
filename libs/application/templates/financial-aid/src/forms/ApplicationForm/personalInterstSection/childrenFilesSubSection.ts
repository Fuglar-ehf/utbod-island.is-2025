import {
  buildFileUploadField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { FILE_SIZE_LIMIT, Routes, UPLOAD_ACCEPT } from '../../../lib/constants'
import * as m from '../../../lib/messages'
import { ApplicantChildCustodyInformation } from '@island.is/application/types'

export const childrenFilesSubSection = buildSubSection({
  condition: (_, externalData) => {
    const childWithInfo = getValueViaPath(
      externalData,
      'childrenCustodyInformation.data',
      [],
    ) as ApplicantChildCustodyInformation[]

    return Boolean(childWithInfo?.length)
  },
  id: Routes.CHILDRENFILES,
  title: m.childrenFilesForm.general.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.CHILDRENFILES,
      title: m.childrenFilesForm.general.pageTitle,
      description: m.childrenFilesForm.general.description,
      children: [
        buildFileUploadField({
          id: Routes.CHILDRENFILES,
          uploadMultiple: true,
          maxSize: FILE_SIZE_LIMIT,
          uploadAccept: UPLOAD_ACCEPT,
          title: '',
        }),
      ],
    }),
  ],
})
