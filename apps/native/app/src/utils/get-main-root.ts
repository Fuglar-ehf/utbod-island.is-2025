import { Layout, OptionsTopBarButton } from 'react-native-navigation'
import { notificationsStore } from '../stores/notifications-store'
import { preferencesStore } from '../stores/preferences-store'
import {
  ButtonRegistry,
  ComponentRegistry,
  MainBottomTabs,
  StackRegistry,
} from './component-registry'
import { getThemeWithPreferences } from './get-theme-with-preferences'
import { testIDs } from './test-ids'

export const getRightButtons = ({
  unseenCount = notificationsStore.getState().unseenCount,
  theme = getThemeWithPreferences(preferencesStore.getState()),
} = {}): OptionsTopBarButton[] => {
  const iconBackground = {
    color: 'transparent',
    cornerRadius: 8,
    width: theme.spacing[4],
    height: theme.spacing[4],
  }
  console.log('unseenCount', unseenCount)
  return [
    {
      accessibilityLabel: 'Settings',
      id: ButtonRegistry.SettingsButton,
      testID: testIDs.TOPBAR_SETTINGS_BUTTON,
      icon: require('../assets/icons/settings.png'),
      iconBackground,
    },
    {
      accessibilityLabel: 'Notifications',
      id: ButtonRegistry.NotificationsButton,
      testID: testIDs.TOPBAR_NOTIFICATIONS_BUTTON,
      icon:
        unseenCount > 0
          ? require('../assets/icons/topbar-notifications-bell.png')
          : require('../assets/icons/topbar-notifications.png'),
      iconBackground,
    },
  ]
}

/**
 * Main root layout, with tabbar
 * @returns Layout
 */
export function getMainRoot(): Layout {
  const rightButtons = getRightButtons()

  return {
    bottomTabs: {
      id: MainBottomTabs,
      options: {
        bottomTabs: {
          testID: testIDs.TABBAR_MAIN,
          currentTabIndex: 2,
          tabsAttachMode: 'together',
        },
      },
      children: [
        {
          stack: {
            id: StackRegistry.InboxStack,
            children: [
              {
                component: {
                  id: ComponentRegistry.InboxScreen,
                  name: ComponentRegistry.InboxScreen,
                  options: {
                    topBar: {
                      rightButtons,
                    },
                  },
                },
              },
            ],
          },
        },
        {
          stack: {
            id: StackRegistry.WalletStack,
            children: [
              {
                component: {
                  id: ComponentRegistry.WalletScreen,
                  name: ComponentRegistry.WalletScreen,
                  options: {
                    topBar: {
                      rightButtons,
                    },
                  },
                },
              },
            ],
          },
        },
        {
          stack: {
            id: StackRegistry.HomeStack,
            children: [
              {
                component: {
                  id: ComponentRegistry.HomeScreen,
                  name: ComponentRegistry.HomeScreen,
                  options: {
                    topBar: {
                      rightButtons,
                    },
                  },
                },
              },
            ],
          },
        },
        {
          stack: {
            id: StackRegistry.ApplicationsStack,
            children: [
              {
                component: {
                  id: ComponentRegistry.ApplicationsScreen,
                  name: ComponentRegistry.ApplicationsScreen,
                  options: {
                    topBar: {
                      rightButtons,
                    },
                  },
                },
              },
            ],
          },
        },
        {
          stack: {
            id: StackRegistry.MoreStack,
            children: [
              {
                component: {
                  id: ComponentRegistry.MoreScreen,
                  name: ComponentRegistry.MoreScreen,
                  options: {
                    topBar: {
                      rightButtons,
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
  }
}
