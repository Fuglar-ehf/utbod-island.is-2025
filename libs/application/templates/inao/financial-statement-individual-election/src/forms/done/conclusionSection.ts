import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../lib/utils/messages'
import { FSIUSERTYPE } from '../../types/types'
import { Application } from '@island.is/application/types'
import { getCurrentUserType } from '../../lib/utils/helpers'

export const conclusionSection = buildSection({
  id: 'conclusionSection',
  children: [
    buildMultiField({
      id: 'conclusion',
      title: (application: Application) => {
        const answers = application.answers
        const externalData = application.externalData
        const userType = getCurrentUserType(answers, externalData)
        return userType === FSIUSERTYPE.INDIVIDUAL ? m.infoReceived : m.received
      },
      children: [
        buildCustomField({
          id: 'overview',
          component: 'Success',
          title: m.applicationAccept,
        }),
      ],
    }),
  ],
})
