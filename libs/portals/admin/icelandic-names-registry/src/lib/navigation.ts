import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { IcelandicNamesRegistryPaths } from './paths'

export const icelandicNamesRegistryNavigation: PortalNavigationItem = {
  name: m.icelandicNamesRegistry,
  path: IcelandicNamesRegistryPaths.IcelandicNamesRegistryRoot,
  icon: {
    icon: 'fileTrayFull',
  },
}
