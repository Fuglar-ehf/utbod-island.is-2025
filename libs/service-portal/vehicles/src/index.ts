import { lazy } from 'react'

import { ApiScope } from '@island.is/auth/scopes'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const vehiclesModule: ServicePortalModule = {
  name: 'Ökutæki',
  widgets: () => [],
  routes: ({ userInfo }) => [
    {
      name: m.yourVehicles,
      path: ServicePortalPath.AssetsVehicles,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
    {
      name: m.yourVehicles,
      path: ServicePortalPath.AssetsMyVehicles,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () => lazy(() => import('./screens/Overview/Overview')),
    },
    {
      name: m.vehicles,
      path: ServicePortalPath.AssetsVehiclesDetail,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () => lazy(() => import('./screens/VehicleDetail/VehicleDetail')),
    },
    {
      name: m.vehiclesHistory,
      path: ServicePortalPath.AssetsVehiclesHistory,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      render: () =>
        lazy(() => import('./screens/VehicleHistory/VehicleHistory')),
    },
    {
      name: m.vehiclesDrivingLessons,
      path: ServicePortalPath.AssetsVehiclesDrivingLessons,
      enabled: userInfo.scopes.includes(ApiScope.vehicles),
      dynamic: true,
      render: () =>
        lazy(() => import('./screens/DrivingLessonsBook/DrivingLessonsBook')),
    },
    {
      name: m.vehiclesLookup,
      path: ServicePortalPath.AssetsVehiclesLookup,
      enabled:
        userInfo.scopes.includes(ApiScope.internal) ||
        userInfo.scopes.includes(ApiScope.internalProcuring),
      key: 'VehicleLookup',
      render: () => lazy(() => import('./screens/Lookup/Lookup')),
    },
  ],
}
