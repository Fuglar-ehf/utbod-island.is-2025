import { lazy } from 'react'
import { m } from '@island.is/service-portal/core'
import { PortalModule, PortalRoute } from '@island.is/portals/core'
import { SignatureCollectionPaths } from './lib/paths'
import { Features } from '@island.is/feature-flags'

const SignatureLists = lazy(() => import('./screens'))
const ViewList = lazy(() => import('./screens/CandidateView/ViewList'))

export const signatureCollectionModule: PortalModule = {
  name: m.signatureCollectionLists,
  featureFlag: Features.servicePortalSignatureCollection,
  routes: () => {
    const applicationRoutes: PortalRoute[] = [
      {
        name: m.signatureCollectionLists,
        path: SignatureCollectionPaths.Lists,
        element: <SignatureLists />,
      },
      {
        name: m.signatureCollectionLists,
        path: SignatureCollectionPaths.ViewList,
        element: <ViewList />,
      },
    ]

    return applicationRoutes
  },
}
