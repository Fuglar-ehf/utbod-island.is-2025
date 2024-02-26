import { defineMessages } from 'react-intl'

export const original = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:original.general.title',
      defaultMessage: 'Frumgögn',
      description: 'Title of the original data form',
    },
    intro: {
      id: 'ojoi.application:original.general.intro',
      defaultMessage:
        'Hér skal setja inn skjal sem er skannað afrit af frumtexta auglýsingarinnar þar sem koma fram undirritanir þeirra sem við á. Undirritun máls er staðfesting á innihaldi og réttmæti auglýsingar sem send hefur verið til birtingar í Stjórnartíðindum og er lagalega bindandi. Þetta skjal verður ekki birt á vef Stjórnartíðinda en er vistað í innri kerfum. ',
      description: 'Intro of the original data form',
    },
    section: {
      id: 'ojoi.application:original.general.section',
      defaultMessage: 'Frumgögn',
      description: 'Title of the original data section',
    },
  }),
  fileUpload: defineMessages({
    header: {
      id: 'ojoi.application:original.fileUpload.header',
      defaultMessage: 'Dragðu undirritað PDF skjal hingað',
      description: 'Header of the file upload',
    },
    description: {
      id: 'ojoi.application:original.fileUpload.description',
      defaultMessage: 'Leyfileg skráarsnið: PDF',
      description: 'Description of the file upload',
    },
    buttonLabel: {
      id: 'ojoi.application:original.fileUpload.buttonLabel',
      defaultMessage: 'Hlaða upp undirrituðu eintaki',
      description: 'Label of the file upload button',
    },
  }),
}
