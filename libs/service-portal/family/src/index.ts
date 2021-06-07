import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'
import { defineMessage } from 'react-intl'

export const familyModule: ServicePortalModule = {
  name: 'Fjölskyldan',
  widgets: () => [],
  routes: () => [
    {
      name: 'Mínar upplýsingar',
      path: ServicePortalPath.MyInfoRoot,
      render: () =>
        lazy(() => import('./screens/UserInfoOverview/UserInfoOverview')),
    },
    {
      name: defineMessage({
        id: 'service.portal:user-info',
        defaultMessage: 'Nánari upplýsingar',
      }),
      path: ServicePortalPath.UserInfo,
      render: () => lazy(() => import('./screens/UserInfo/UserInfo')),
    },
    {
      name: defineMessage({
        id: 'service.portal:family',
        defaultMessage: 'Fjölskyldan',
      }),
      path: ServicePortalPath.FamilyRoot,
      render: () =>
        lazy(() => import('./screens/FamilyOverview/FamilyOverview')),
    },
    {
      name: 'Family Member',
      path: ServicePortalPath.FamilyMember,
      render: () => lazy(() => import('./screens/FamilyMember/FamilyMember')),
    },
  ],
}

export * from './components/FamilyMemberCard/FamilyMemberCard'
