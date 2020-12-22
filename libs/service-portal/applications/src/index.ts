import {
  ServicePortalModule,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import { lazy } from 'react'
import { defineMessage } from 'react-intl'

const rootName = defineMessage({
  id: 'service.portal:applications',
  defaultMessage: 'Umsóknir',
})

export const applicationsModule: ServicePortalModule = {
  name: rootName,
  widgets: () => [],
  routes: async () => {
    const applicationRoutes = [
      {
        name: rootName,
        path: ServicePortalPath.ApplicationRoot,
        render: () =>
          lazy(() => import('./screens/ApplicationList/ApplicationList')),
      },
      {
        name: rootName,
        path: ServicePortalPath.ApplicationIntroduction,
        render: () =>
          lazy(() => import('./screens/ApplicationListWip/ApplicationListWip')),
      },
    ]

    return applicationRoutes
  },
}
