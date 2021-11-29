import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'
import { lazy } from 'react'

export const wipModule: ServicePortalModule = {
  name: 'Í vinnslu',
  widgets: () => [],
  routes: () => [
    {
      name: 'Stillingar',
      path: ServicePortalPath.SettingsRoot,
      render: () => lazy(() => import('./screens/SettingsWIP/SettingsWIP')),
    },
    {
      name: m.vehicles,
      path: ServicePortalPath.AssetsVehicles,
      render: () =>
        lazy(() => import('./screens/AssetsVehicles/AssetsVehicles')),
    },
  ],
}
