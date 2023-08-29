import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { OccupationalLicensesPaths } from './paths'
import { olMessage as om } from './messages'

export const occupationalLicensesNavigation: PortalNavigationItem = {
  name: om.occupationalLicense,
  path: OccupationalLicensesPaths.OccupationalLicensesRoot,
  icon: {
    icon: 'receipt',
  },
  description: m.occupationalLicensesDescription,
  children: [
    {
      name: 'type',
      navHide: true,
      path: OccupationalLicensesPaths.OccupationalLicensesHealthDirectorateDetail,
    },
    {
      name: 'type',
      navHide: true,
      path: OccupationalLicensesPaths.OccupationalLicensesEducationDetail,
    },
  ],
}
