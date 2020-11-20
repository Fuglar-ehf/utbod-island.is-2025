import { ServicePortalNavigationItem } from '@island.is/service-portal/core'
import { ServicePortalPath } from './paths'
import { defineMessage } from 'react-intl'

export const servicePortalMasterNavigation: ServicePortalNavigationItem[] = [
  {
    name: defineMessage({
      id: 'service.portal:info',
      defaultMessage: 'Upplýsingar',
    }),
    children: [
      // Yfirlit
      {
        name: defineMessage({
          id: 'service.portal:overview',
          defaultMessage: 'Yfirlit',
        }),
        systemRoute: true,
        path: ServicePortalPath.MinarSidurRoot,
        icon: {
          type: 'outline',
          icon: 'home',
        },
      },

      // Min Sida
      {
        name: defineMessage({
          id: 'service.portal:my-info',
          defaultMessage: 'Mín gögn',
        }),
        path: ServicePortalPath.MyInfoRoot,
        icon: {
          type: 'outline',
          icon: 'person',
        },
        children: [
          {
            name: defineMessage({
              id: 'service.portal:user-info',
              defaultMessage: 'Mínar upplýsingar',
            }),
            path: ServicePortalPath.UserInfo,
          },
          {
            name: defineMessage({
              id: 'service.portal:family',
              defaultMessage: 'Fjölskyldan',
            }),
            path: ServicePortalPath.FamilyRoot,
          },
        ],
      },

      // Fjarmal
      {
        name: defineMessage({
          id: 'service.portal:finance',
          defaultMessage: 'Fjármál',
        }),
        path: ServicePortalPath.FinanceRoot,
        icon: {
          type: 'outline',
          icon: 'cellular',
        },
      },

      // Heilsa
      {
        name: defineMessage({
          id: 'service.portal:health',
          defaultMessage: 'Heilsa',
        }),
        path: ServicePortalPath.HealthRoot,
        icon: {
          type: 'outline',
          icon: 'heart',
        },
      },

      // Eignir
      {
        name: defineMessage({
          id: 'service.portal:assets',
          defaultMessage: 'Eignir',
        }),
        path: ServicePortalPath.AssetsRoot,
        icon: {
          type: 'outline',
          icon: 'wallet',
        },
      },

      // Menntun
      {
        name: defineMessage({
          id: 'service.portal:education',
          defaultMessage: 'Menntun',
        }),
        path: ServicePortalPath.EducationRoot,
        icon: {
          type: 'outline',
          icon: 'school',
        },
      },
    ],
  },
  {
    name: defineMessage({
      id: 'service.portal:actions',
      defaultMessage: 'Aðgerðir',
      description: 'Title of the actions category',
    }),
    children: [
      // Umsoknir
      {
        name: defineMessage({
          id: 'service.portal:applications',
          defaultMessage: 'Umsóknir',
        }),
        path: ServicePortalPath.ApplicationIntroduction,
        icon: {
          type: 'outline',
          icon: 'fileTrayFull',
        },
      },

      // Rafraen skjol
      {
        name: defineMessage({
          id: 'service.portal:documents',
          defaultMessage: 'Rafræn skjöl',
        }),
        path: ServicePortalPath.ElectronicDocumentsRoot,
        icon: {
          type: 'outline',
          icon: 'reader',
        },
      },

      // Mín réttindi
      {
        name: defineMessage({
          id: 'service.portal:delegation',
          defaultMessage: 'Mín réttindi',
        }),
        path: ServicePortalPath.MyLicensesRoot,
        icon: {
          type: 'outline',
          icon: 'receipt',
        },
      },

      // Stillingar
      {
        name: defineMessage({
          id: 'service.portal:settings',
          defaultMessage: 'Stillingar',
        }),
        path: ServicePortalPath.SettingsRoot,
        icon: {
          type: 'outline',
          icon: 'settings',
        },
        children: [
          {
            name: defineMessage({
              id: 'service.portal:profile-info',
              defaultMessage: 'Minn aðgangur',
            }),
            path: ServicePortalPath.UserProfileRoot,
          },
        ],
      },
    ],
  },
]
