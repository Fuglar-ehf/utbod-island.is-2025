import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import { HealthPaths } from './lib/paths'
import { PortalModule } from '@island.is/portals/core'

const HealthOverview = lazy(() =>
  import('./screens/HealthOverview/HealthOverview'),
)

const Therapies = lazy(() => import('./screens/Therapies/Therapies'))
const SupportProducts = lazy(() =>
  import('./screens/SupportProducts/SupportProducts'),
)

export const healthModule: PortalModule = {
  name: 'Heilsa',
  routes: ({ userInfo }) => [
    {
      name: 'Heilsa',
      path: HealthPaths.HealthRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      element: <HealthOverview />,
    },
    {
      name: 'Þjálfun',
      path: HealthPaths.HealthTherapies,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      element: <Therapies />,
    },
    {
      name: 'Stuðningsvörur',
      path: HealthPaths.HealthSupportProducts,
      enabled: userInfo.scopes.includes(ApiScope.internal),
      element: <SupportProducts />,
    },
  ],
}
