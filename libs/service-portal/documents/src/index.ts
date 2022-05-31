import { lazy } from 'react'
import { defineMessage } from 'react-intl'

import { DocumentsScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import differenceInYears from 'date-fns/differenceInYears'
import { User } from '@island.is/shared/types'

const rootName = defineMessage({
  id: 'sp.documents:title',
  defaultMessage: 'Pósthólf',
})

const enabled = (userInfo: User) => {
  const hasScope = userInfo.scopes?.includes(DocumentsScope.main)
  const dateOfBirth = userInfo.profile?.dateOfBirth
  const isLegalGuardian = userInfo.profile.delegationType?.includes(
    'LegalGuardian',
  )
  const isOver15 = dateOfBirth
    ? differenceInYears(new Date(), dateOfBirth) > 15
    : false
  if (isLegalGuardian && isOver15) {
    return false
  }
  if (hasScope) {
    return true
  } else {
    return false
  }
}
export const documentsModule: ServicePortalModule = {
  name: rootName,
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: rootName,
      path: ServicePortalPath.ElectronicDocumentsRoot,
      enabled: enabled(userInfo),
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
  ],
}
