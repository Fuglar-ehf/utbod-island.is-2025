import { Locale } from 'locale'

import {
  LiveChatIncChatPanelProps,
  WatsonChatPanelProps,
} from '@island.is/web/components'
import { setupOneScreenWatsonChatBot } from '@island.is/web/utils/webChat'

export const liveChatIncConfig: Record<
  Locale,
  Record<string, LiveChatIncChatPanelProps>
> = {
  is: {},
  en: {},
}

export const defaultWatsonConfig: Record<Locale, WatsonChatPanelProps> = {
  is: {
    integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
  },
  en: {
    integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
    region: 'eu-gb',
    serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
    showLauncher: false,
    carbonTheme: 'g10',
    namespaceKey: 'default',
  },
}

export const watsonConfig: Record<
  Locale,
  Record<string, WatsonChatPanelProps>
> = {
  en: {
    // Name giving
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/lGjmpafx2P4yiA6Re3Nxd
    lGjmpafx2P4yiA6Re3Nxd: {
      integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'namegiving',
          '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
        ),
    },
    // Ice Key
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3zrd5HMiS59A9UVEoCsAi7
    '3zrd5HMiS59A9UVEoCsAi7': {
      integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'icekey',
          '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
        ),
    },
    // Digital Drivers license
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/fZxwXvRXLTUgfeiQmoR3l
    fZxwXvRXLTUgfeiQmoR3l: {
      integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'digitaldriverslicense',
          '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
        ),
    },
    // Housing benefits
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/6V0J72C464gk9SMjiCbfXy
    '6V0J72C464gk9SMjiCbfXy': {
      integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'housingbenefits',
          '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
        ),
    },
    // Electronic id
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4lkmXszsB5q5kJkXqhW5Ex
    '4lkmXszsB5q5kJkXqhW5Ex': {
      integrationID: '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'electronicID',
          '2e32cba8-7379-44e9-b03e-af1ccdbe5982',
        ),
    },
    // Tax on wages and pensions
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/6e3SWIyt0ayXwSuqB4HiiE
    '6e3SWIyt0ayXwSuqB4HiiE': {
      integrationID: '98ba51da-1677-4881-a133-7ea019ae7b87',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
      },
    },
    // Child benefit
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/42poXejFLO31vxj67UW5J3
    '42poXejFLO31vxj67UW5J3': {
      integrationID: '98ba51da-1677-4881-a133-7ea019ae7b87',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
      },
    },

    // Taxes on goods and services
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4BECjoXzpyecbbp8rY1u7t
    '4BECjoXzpyecbbp8rY1u7t': {
      integrationID: '98ba51da-1677-4881-a133-7ea019ae7b87',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
      },
    },

    // Skatturinn - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4yJlHgCMTqpgRSj4p6LuBQ
    '4yJlHgCMTqpgRSj4p6LuBQ': {
      integrationID: '98ba51da-1677-4881-a133-7ea019ae7b87',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
      },
    },

    // Útlendingastofnun - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/77rXck3sISbMsUv7BO1PG2
    '77rXck3sISbMsUv7BO1PG2': {
      integrationID: '53c6e788-8178-448d-94c3-f5d71ec3b80e',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Sjúkratryggingar - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3pZwAagW0UY26giHaxHthe
    '3pZwAagW0UY26giHaxHthe': {
      integrationID: 'cba41fa0-12fb-4cb5-bd98-66a57cee42e0',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // European health insurance card
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1AKWfq2dh9YnEyiG1yNeR8
    '1AKWfq2dh9YnEyiG1yNeR8': {
      integrationID: 'cba41fa0-12fb-4cb5-bd98-66a57cee42e0',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'eucard',
          'cba41fa0-12fb-4cb5-bd98-66a57cee42e0',
        ),
    },

    // Kílómetragjald
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4ydMzxTVny5W9nTn6abfZm
    '4ydMzxTVny5W9nTn6abfZm': {
      ...defaultWatsonConfig.en,
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'kilometragjald',
          defaultWatsonConfig.en.integrationID,
        )
      },
    },

    // Samgöngustofa - Organization
    '6IZT17s7stKJAmtPutjpD7': {
      integrationID: '1e649a3f-9476-4995-ba24-0e72040b0cc0',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },
  },
  is: {
    // Samgöngustofa - Organization
    '6IZT17s7stKJAmtPutjpD7': {
      integrationID: 'fe12e960-329c-46d5-9ae1-8bd8b8219f43',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Kílómetragjald
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4ydMzxTVny5W9nTn6abfZm
    '4ydMzxTVny5W9nTn6abfZm': {
      ...defaultWatsonConfig.is,
      onLoad(instance) {
        setupOneScreenWatsonChatBot(
          instance,
          'kilometragjald',
          defaultWatsonConfig.is.integrationID,
        )
      },
    },

    // Rafræn skilríki
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4lkmXszsB5q5kJkXqhW5Ex
    '4lkmXszsB5q5kJkXqhW5Ex': {
      integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'rafraenskilriki',
          'b1a80e76-da12-4333-8872-936b08246eaa',
        ),
    },

    // Loftbrú
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/5xLPMSyKQNkP5sG4OelzKc
    '5xLPMSyKQNkP5sG4OelzKc': {
      integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'loftbru',
          'b1a80e76-da12-4333-8872-936b08246eaa',
        ),
    },

    // Ökuskírteini
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/fZxwXvRXLTUgfeiQmoR3l
    fZxwXvRXLTUgfeiQmoR3l: {
      integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'stafraentokuskirteini',
          'b1a80e76-da12-4333-8872-936b08246eaa',
        ),
    },

    // Íslykill
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3zrd5HMiS59A9UVEoCsAi7
    '3zrd5HMiS59A9UVEoCsAi7': {
      integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'islykill',
          'b1a80e76-da12-4333-8872-936b08246eaa',
        ),
    },

    // Fæðingarorlof
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/59HH2C3hOLYYhFVY4fiX0G
    '59HH2C3hOLYYhFVY4fiX0G': {
      integrationID: 'b1a80e76-da12-4333-8872-936b08246eaa',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'faedingarorlof',
          'b1a80e76-da12-4333-8872-936b08246eaa',
        ),
    },

    // Um hjónaband
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1ABPqOQMsYrqBu7zyP7itc
    '1ABPqOQMsYrqBu7zyP7itc': {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'hjonaband',
          '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
        ),
    },
    // Skilnaður
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/73z3JiTrAuOQgPlsVfqD1V
    '73z3JiTrAuOQgPlsVfqD1V': {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'skilnadur',
          '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
        ),
    },
    // Endurnýjun ökuskírteina
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1vYhvJKy4TqxkAtPDIhaPx
    '1vYhvJKy4TqxkAtPDIhaPx': {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'endokuskirteini',
          '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
        ),
    },
    // Þinglýsing skjala
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/2evftN0gIe78zSEYLMB0aX
    '2evftN0gIe78zSEYLMB0aX': {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'thinglysing',
          '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
        ),
    },
    // Vegabréf, almennar upplýsingar
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/7Egh4yMfC48dDgceeBrWSB
    '7Egh4yMfC48dDgceeBrWSB': {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'vegabref',
          '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
        ),
    },
    // Sakavottorð til einstaklinga
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/gzKeBtRl57SzRmgUzHR3u
    gzKeBtRl57SzRmgUzHR3u: {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'sakavottord',
          '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
        ),
    },
    // Erfðamál, upplýsingar um réttindi og skyldur erfingja
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/2YsIiF44ECgUUlPkr9SqOh
    '2YsIiF44ECgUUlPkr9SqOh': {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'erfdamal',
          '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
        ),
    },

    // Skattur af launum og lífeyri
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/6e3SWIyt0ayXwSuqB4HiiE
    '6e3SWIyt0ayXwSuqB4HiiE': {
      integrationID: '84f62b21-aa50-4d49-b413-597b6a959910',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
        setupOneScreenWatsonChatBot(
          instance,
          'almenntskattar',
          '84f62b21-aa50-4d49-b413-597b6a959910',
        )
      },
    },

    // Barnabætur
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/42poXejFLO31vxj67UW5J3
    '42poXejFLO31vxj67UW5J3': {
      integrationID: '84f62b21-aa50-4d49-b413-597b6a959910',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
        setupOneScreenWatsonChatBot(
          instance,
          'barnabaetur',
          '84f62b21-aa50-4d49-b413-597b6a959910',
        )
      },
    },

    // Virðisaukaskattur og vörugjöld á vöru og þjónustu – almennar upplýsingar
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4BECjoXzpyecbbp8rY1u7t
    '4BECjoXzpyecbbp8rY1u7t': {
      integrationID: '84f62b21-aa50-4d49-b413-597b6a959910',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
        setupOneScreenWatsonChatBot(
          instance,
          'virdisaukaskattur',
          '84f62b21-aa50-4d49-b413-597b6a959910',
        )
      },
    },

    // Skatturinn - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/4yJlHgCMTqpgRSj4p6LuBQ
    '4yJlHgCMTqpgRSj4p6LuBQ': {
      integrationID: '84f62b21-aa50-4d49-b413-597b6a959910',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'skatturinn',
      onLoad(instance) {
        instance.updateHomeScreenConfig({
          bot_avatar_url:
            'https://images.ctfassets.net/8k0h54kbe6bj/5m9muELNRJMRgsPHP1t28a/caa4d23d14738400f262373e5a9cb066/islandissseoakgf2.PNG?h=250',
        })
      },
    },

    // Sýslumenn - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/kENblMMMvZ3DlyXw1dwxQ
    kENblMMMvZ3DlyXw1dwxQ: {
      integrationID: '0c96e8fb-d4dc-420e-97db-18b0f8bb4e3f',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Útlendingastofnun - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/77rXck3sISbMsUv7BO1PG2
    '77rXck3sISbMsUv7BO1PG2': {
      integrationID: '89a03e83-5c73-4642-b5ba-cd3771ceca54',
      region: 'eu-gb',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Sjúkratryggingar - Organization
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3pZwAagW0UY26giHaxHthe
    '3pZwAagW0UY26giHaxHthe': {
      integrationID: 'e625e707-c9ce-4048-802c-c12b905c28be',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
    },

    // Evrópska sjúkratryggingakortið
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1AKWfq2dh9YnEyiG1yNeR8
    '1AKWfq2dh9YnEyiG1yNeR8': {
      integrationID: 'e625e707-c9ce-4048-802c-c12b905c28be',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'eukort',
          'e625e707-c9ce-4048-802c-c12b905c28be',
        ),
    },

    // Tannlækningar
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/qS7y3WKsqEnWCbiISVU3Q
    qS7y3WKsqEnWCbiISVU3Q: {
      integrationID: 'e625e707-c9ce-4048-802c-c12b905c28be',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'tannlaekningar',
          'e625e707-c9ce-4048-802c-c12b905c28be',
        ),
    },

    // Sjúkradagpeningar
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/7ela1JGeFHHxFgWPj6cGp7
    '7ela1JGeFHHxFgWPj6cGp7': {
      integrationID: 'e625e707-c9ce-4048-802c-c12b905c28be',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'sjukradagpeningar',
          'e625e707-c9ce-4048-802c-c12b905c28be',
        ),
    },

    // Greiðsluþáttökukerfi lyfja
    // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/1P80AT2eqbQKT3eEpW79u7
    '1P80AT2eqbQKT3eEpW79u7': {
      integrationID: 'e625e707-c9ce-4048-802c-c12b905c28be',
      serviceInstanceID: 'bc3d8312-d862-4750-b8bf-529db282050a',
      region: 'eu-gb',
      showLauncher: false,
      carbonTheme: 'g10',
      namespaceKey: 'default',
      onLoad: (instance) =>
        setupOneScreenWatsonChatBot(
          instance,
          'greidsluthatttakalyfja',
          'e625e707-c9ce-4048-802c-c12b905c28be',
        ),
    },
  },
}

// If these organizations are not connected to an article then we show the default watson config
export const excludedOrganizationWatsonConfig: string[] = [
  // Sjúkratryggingar Íslands
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/3pZwAagW0UY26giHaxHthe
  '3pZwAagW0UY26giHaxHthe',

  // Heilbrigðisstofnun Norðurlands
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/EM4Y0gF4OoGhH9ZY0Dxl6
  'EM4Y0gF4OoGhH9ZY0Dxl6',

  // Fiskistofa
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/6rXUdfbMD515Z7guowj08E
  '6rXUdfbMD515Z7guowj08E',

  // Landlæknir
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/7qgJZc8vO7ZHWmfSrZp9Kn
  '7qgJZc8vO7ZHWmfSrZp9Kn',

  // Útlendingastofnun
  // https://app.contentful.com/spaces/8k0h54kbe6bj/entries/77rXck3sISbMsUv7BO1PG2
  '77rXck3sISbMsUv7BO1PG2',
]
