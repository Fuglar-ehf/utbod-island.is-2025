import { defineMessages } from 'react-intl'

export const publishing = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:publishing.general.title',
      defaultMessage: 'Óskir um birtingu',
      description: 'Title of the publishing preferences form',
    },
    intro: {
      id: 'ojoi.application:publishing.general.intro',
      defaultMessage:
        'Mál sem sent er til birtingar birtist 10 virkum dögum eftir skrásetningardag, hægt er að biðja um að mál birtist fyrr gegn greiðslu álags. Til að fá mál birt samdægurs þarf mál að hafa borist Stjórnartíðindum fyrir hádegi þann dag. Senda skal skilaboð með máli um birtingu samdægurs.',
      description: 'Intro of the publishing preferences form',
    },
    section: {
      id: 'ojoi.application:publishing.general.section',
      defaultMessage: 'Óskir um birtingu',
      description: 'Title of the publishing preferences section',
    },
    communicationIntro: {
      id: 'ojoi.application:publishing.general.communicationIntro',
      defaultMessage:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet mattis erat, eget dignissim lacus. Cras id enim ac urna bibendum gravida.',
      description: 'Intro of the communication section',
    },
  }),
  headings: defineMessages({
    communications: {
      id: 'ojoi.application:publishing.headings.communications',
      defaultMessage: 'Samskiptaleiðir',
      description: 'Title of the communications section',
    },
    messages: {
      id: 'ojoi.application:publishing.headings.messages',
      defaultMessage: 'Skilaboð',
      description: 'Title of the messages section',
    },
    date: {
      id: 'ojoi.application:publishing.headings.date',
      defaultMessage: 'Hvenær viltu að auglýsing birtist?',
      description: 'Title of the date section',
    },
  }),
  inputs: {
    datepicker: defineMessages({
      label: {
        id: 'ojoi.application:publishing.inputs.datepicker.label',
        defaultMessage: 'Dagsetning',
        description: 'Label of the datepicker input',
      },
      placeholder: {
        id: 'ojoi.application:publishing.inputs.datepicker.placeholder',
        defaultMessage: '01.02.2024',
        description: 'Placeholder of the datepicker input',
      },
    }),
    fastTrack: defineMessages({
      label: {
        id: 'ojoi.application:publishing.inputs.fastTrack.label',
        defaultMessage: 'Ég óska eftir hraðbirtingu',
        description: 'Label of the fast track checkbox input',
      },
    }),
    contentCategories: defineMessages({
      label: {
        id: 'ojoi.application:publishing.inputs.contentCategories.label',
        defaultMessage: 'Efnisflokkar',
        description: 'Label of the content categories input',
      },
    }),
    messages: defineMessages({
      label: {
        id: 'ojoi.application:publishing.inputs.messages.label',
        defaultMessage: 'Skilaboð',
        description: 'Label of the messages textarea input',
      },
      placeholder: {
        id: 'ojoi.application:publishing.inputs.messages.placeholder',
        defaultMessage:
          'Hér er hægt að skrifa skilaboð til Stjórnartíðinda varðandi auglýsinguna.',
        description: 'Placeholder of the messages textarea input',
      },
    }),
  },
  buttons: {
    addCommunicationChannel: defineMessages({
      label: {
        id: 'ojoi.application:publishing.buttons.addCommunicationChannel.label',
        defaultMessage: 'Bæta við samskiptaleið',
        description: 'Label of the add communication channel button',
      },
    }),
  },
}
