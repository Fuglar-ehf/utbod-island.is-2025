import { theme } from '@island.is/island-ui/theme'
import { ChatPanelConfig } from './types'

export const endpoints = {
  'covid-island': {
    id: '246covid-island',
    conversationKey: '246covid-island-conversationId',
    url: 'https://246covid-island.boost.ai/chatPanel/chatPanel.js',
  },
  syslumenn: {
    id: 'syslumenn',
    conversationKey: 'syslumenn',
    url: 'https://syslumenn.boost.ai/chatPanel/chatPanel.js',
  },
}

export const config = {
  chatPanel: {
    styling: {
      primaryColor: theme.color.blue400,
      fontFamily: 'IBM Plex Sans',
    },
  },
} as ChatPanelConfig
