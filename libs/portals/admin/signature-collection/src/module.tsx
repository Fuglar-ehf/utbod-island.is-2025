import { PortalModule } from '@island.is/portals/core'
import { lazy } from 'react'
import { m } from './lib/messages'
import { SignatureCollectionPaths } from './lib/paths'
import { listsLoader } from './loaders/AllLists.loader'
import { listLoader } from './loaders/List.loader'
import { allowedScopes } from './lib/utils'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Navigate } from 'react-router-dom'

/* parliamentary */
const ParliamentaryRoot = lazy(() =>
  import('./screens-parliamentary/Constituency'),
)
const ParliamentaryConstituency = lazy(() =>
  import('./screens-parliamentary/Constituency'),
)
const ParliamentaryList = lazy(() => import('./screens-parliamentary/List'))

/* presidential */
const AllLists = lazy(() => import('./screens-presidential/AllLists'))
const List = lazy(() => import('./screens-presidential/List'))

/* municipal */
const LandAreas = lazy(() => import('./screens-municipal/LandAreas'))
const Municipality = lazy(() => import('./screens-municipal/MunicipalityView'))

export const signatureCollectionModule: PortalModule = {
  name: m.signatureCollection,
  layout: 'full',
  enabled: ({ userInfo }) =>
    userInfo.scopes.some((scope) => allowedScopes.includes(scope)),
  routes: (props) => [
    /* ------ Parliamentary ------ */
    {
      name: m.signatureListsTitle,
      path: SignatureCollectionPaths.ParliamentaryRoot,
      element: (
        <ParliamentaryRoot
          allowedToProcess={props.userInfo.scopes.some(
            (scope) => scope === AdminPortalScope.signatureCollectionProcess,
          )}
        />
      ),
      loader: listsLoader(props),
    },
    {
      name: m.signatureListsConstituencyTitle,
      path: SignatureCollectionPaths.ParliamentaryConstituency,
      element: (
        <ParliamentaryConstituency
          allowedToProcess={props.userInfo.scopes.some(
            (scope) => scope === AdminPortalScope.signatureCollectionProcess,
          )}
        />
      ),
      loader: listsLoader(props),
    },
    {
      name: m.singleList,
      path: SignatureCollectionPaths.ParliamentaryConstituencyList,
      element: (
        <ParliamentaryList
          allowedToProcess={props.userInfo.scopes.some(
            (scope) => scope === AdminPortalScope.signatureCollectionProcess,
          )}
        />
      ),
      loader: listLoader(props),
    },

    /* ------ Presidential ------ */
    {
      name: m.signatureListsTitle,
      path: SignatureCollectionPaths.PresidentialLists,
      element: (
        <AllLists
          allowedToProcess={props.userInfo.scopes.some(
            (scope) => scope === AdminPortalScope.signatureCollectionProcess,
          )}
        />
      ),
      loader: listsLoader(props),
    },
    {
      name: m.singleList,
      path: SignatureCollectionPaths.PresidentialList,
      element: (
        <List
          allowedToProcess={props.userInfo.scopes.some(
            (scope) => scope === AdminPortalScope.signatureCollectionProcess,
          )}
        />
      ),
      loader: listLoader(props),
    },

    /* ------ Municipal ------ */
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.MunicipalRoot,
      element: (
        <Navigate to={SignatureCollectionPaths.LandAreaHofudborgarsvaedi} />
      ),
      loader: listsLoader(props),
    },
    // side bar navigation (land areas)
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.LandAreaHofudborgarsvaedi,
      element: <LandAreas />,
      loader: listsLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.LandAreaSudurnes,
      element: <LandAreas />,
      loader: listsLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.LandAreaVesturland,
      element: <LandAreas />,
      loader: listsLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.LandAreaNordurlandVestra,
      element: <LandAreas />,
      loader: listsLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.LandAreaNordurlandEystra,
      element: <LandAreas />,
      loader: listsLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.LandAreaAusturland,
      element: <LandAreas />,
      loader: listsLoader(props),
    },
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.LandAreaSudurland,
      element: <LandAreas />,
      loader: listsLoader(props),
    },
    // ----------------------------------------------------- //
    {
      name: m.municipalCollectionTitle,
      path: SignatureCollectionPaths.LandAreaSingleMunicipality,
      element: <Municipality />,
      loader: listsLoader(props),
    },
  ],
}
