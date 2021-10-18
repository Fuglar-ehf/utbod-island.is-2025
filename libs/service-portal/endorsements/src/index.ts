import { lazy } from 'react'
import {
  ServicePortalModule,
  ServicePortalPath,
  m,
} from '@island.is/service-portal/core'

export const endorsementsModule: ServicePortalModule = {
  name: 'Meðmæli',
  widgets: () => [],
  routes: () => [
    {
      name: m.endorsements,
      path: ServicePortalPath.Petitions,
      render: () => lazy(() => import('./screens/Endorsements')),
    },
  ],
}

export const petitionsModule: ServicePortalModule = {
  name: 'Almennir undirskriftalistar',
  widgets: () => [],
  routes: () => [
    {
      name: m.endorsements,
      path: ServicePortalPath.Petitions,
      render: () => lazy(() => import('./screens/Petitions')),
    },
    {
      name: m.endorsements,
      path: ServicePortalPath.PetitionList,
      render: () => lazy(() => import('./screens/ViewPetition')),
    },
    {
      name: m.endorsementsAdmin,
      path: ServicePortalPath.PetitionsAdminView,
      render: () => lazy(() => import('./screens/PetitionsAdmin')),
    },
    {
      name: m.endorsementsAdmin,
      path: ServicePortalPath.PetitionListAdmin,
      render: () => lazy(() => import('./screens/ViewPetitionAdmin')),
    },
  ],
}
