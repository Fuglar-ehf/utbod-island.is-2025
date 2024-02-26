import { defineMessages } from 'react-intl'

export const preview = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:preview.general.title',
      defaultMessage: 'Forskoðun',
      description: 'Title of the preview form',
    },
    intro: {
      id: 'ojoi.application:preview.general.intro',
      defaultMessage:
        'Auglýsandi ber ábyrgð á efni auglýsingar sem send er til birtingar í Stjórnartíðindum og hefur sú birting réttaráhrif. Í þessu skrefi er mikilvægt að forskoða vefbirtinguna og yfirfara og tryggja að innihald og uppsetning séu rétt. Ef þörf er á lagfæringum er hægt að fara aftur í skráningu máls og lagfæra. Leiðbeiningar um uppsetningu mála má finna hér - Linkur á leiðbeiningar. {br} ATH! Á þessu stigi liggja ekki fyrir upplýsingar um númer máls og útgáfudag í Stjórnartíðindum. Þær upplýsingar bætast sjálfkrafa við þegar auglýsingin birtist á stjornartidindi.is.',
      description: 'Intro of the preview form',
    },
    section: {
      id: 'ojoi.application:preview.general.section',
      defaultMessage: 'Forskoðun',
      description: 'Title of the preview section',
    },
  }),
  buttons: defineMessages({
    fetchPdf: {
      id: 'ojoi.application:preview.buttons.fetchPdf',
      defaultMessage: 'Sækja pdf',
      description: 'Label of the fetch pdf button',
    },
    copyPreviewLink: {
      id: 'ojoi.application:preview.buttons.copyPreviewLink',
      defaultMessage: 'Afrita hlekk á forskoðunarskjal',
      description: 'Label of the copy link button',
    },
  }),
}
