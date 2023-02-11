import { PortalNavigationItem } from '@island.is/portals/core'
import { DelegationPaths } from './paths'
import { m } from './messages'

export const delegationsNavigationChildren: PortalNavigationItem[] = [
  {
    name: m.accessControlDelegations,
    path: DelegationPaths.Delegations,
    navHide: false,
    children: [
      {
        name: m.accessControlGrant,
        path: DelegationPaths.DelegationsGrant,
        navHide: true,
      },
    ],
  },
  {
    name: m.accessControlDelegationsIncoming,
    path: DelegationPaths.DelegationsIncoming,
    navHide: true,
    breadcrumbHide: true,
  },
  {
    name: m.accessControlAccess,
    path: DelegationPaths.DelegationAccess,
    navHide: true,
  },
]

export const delegationsNavigation: PortalNavigationItem = {
  name: m.accessControl,
  path: DelegationPaths.Delegations,
  icon: {
    icon: 'people',
  },
  description: m.accessControlDescription,
  children: delegationsNavigationChildren,
}
