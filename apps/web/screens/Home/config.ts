import { WatsonChatPanelProps } from '@island.is/web/components'
import { Locale } from 'locale'

export const watsonConfig: Record<Locale, WatsonChatPanelProps | null> = {
  is: {
    integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
  },
  en: null,
}
