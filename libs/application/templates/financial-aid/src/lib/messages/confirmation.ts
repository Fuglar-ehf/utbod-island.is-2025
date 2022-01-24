import { defineMessages } from 'react-intl'

export const confirmation = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.confirmation.general.sectionTitle',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation section title',
    },
    pageTitle: {
      id: 'fa.application:section.confirmation.general.pageTitle',
      defaultMessage: 'Staðfesting',
      description: 'Confirmation page title',
    },
  }),
  nextSteps: defineMessages({
    title: {
      id: 'fa.application:section.confirmation.nextSteps.title',
      defaultMessage: 'Hér eru næstu skref',
      description: 'Confirmation next step title',
    },
    content: {
      id: 'fa.application:section.confirmation.nextSteps.content#markup',
      defaultMessage:
        '* Vinnsluaðili sveitarfélagsins vinnur úr umsókninni. Umsóknin verður afgreidd eins fljótt og auðið er. \n* Ef umsóknin er samþykkt getur þú reiknað með útgreiðslu í byrjun október. \n* Ef þörf er á frekari upplýsingum eða gögnum til að vinna úr umsókninni mun vinnsluaðili sveitarfélagsins hafa samband.',
      description: 'Confirmation next steps',
    },
    contentWithSpouse: {
      id: 'fa.application:section.confirmation.nextSteps.content#markup',
      defaultMessage:
        '* Þú og maki þinn hlaðið upp nauðsynlegum gögnum sem þarf til úrvinnslu umsóknar. \n* Vinnsluaðili sveitarfélagsins vinnur úr umsókninni. Umsóknin verður afgreidd eins fljótt og auðið er. \n* Ef umsóknin er samþykkt getur þú reiknað með útgreiðslu í byrjun október. \n* Ef þörf er á frekari upplýsingum eða gögnum til að vinna úr umsókninni mun vinnsluaðili sveitarfélagsins hafa samband.',
      description: 'Confirmation next steps',
    },
  }),
  links: defineMessages({
    title: {
      id: 'fa.application:section.confirmation.links.title',
      defaultMessage: 'Frekari aðgerðir í boði',
      description: 'Confirmation links title',
    },
    content: {
      id: 'fa.application:section.confirmation.links.content#markup',
      defaultMessage:
        '[Sjá stöðu umsóknar]({statusPage}) \n \n [Upplýsingar um fjárhagsaðstoð hjá sveitarfélaginu]({homePage})',
      description: 'Confirmation links',
    },
  }),
  alertMessages: defineMessages({
    success: {
      id: 'fa.application:section.confirmation.alertMessages.success',
      defaultMessage: 'Umsókn þín um fjárhagsaðstoð er móttekin',
      description: 'Alert message when application has successfully been sent',
    },
    dataNeeded: {
      id: 'fa.application:section.confirmation.alertMessages.dataNeeded',
      defaultMessage: 'Tekjugögn vantar',
      description: 'Alert message when files are needed for the application',
    },
    dataNeededText: {
      id: 'fa.application:section.confirmation.alertMessages.dataNeededText',
      defaultMessage:
        'Á stöðusíðu umsóknar getur þú hlaðið upp þeim gögnum sem vantar',
      description: 'Alert message when files are needed for the application',
    },
  }),
  alertMessagesInRelationship: defineMessages({
    success: {
      id:
        'fa.application:section.confirmation.alertMessagesInRelationship.success',
      defaultMessage: 'Þinn hluti umsóknar um fjárhagsaðstoð er móttekinn',
      description:
        'Alert message when application has successfully sent his side of application',
    },
    dataNeeded: {
      id:
        'fa.application:section.confirmation.alertMessagesInRelationship.dataNeeded',
      defaultMessage: 'Gögn maka vantar',
      description: 'Alert message when files are needed from spouse',
    },
    dataNeededText: {
      id:
        'fa.application:section.confirmation.alertMessagesInRelationship.dataNeededText',
      defaultMessage:
        'Maki fær sendan hlekk á umsókn til að hlaða upp gögnum svo hægt sé að vinna umsóknina',
      description: 'Alert message when files are needed for the application',
    },
  }),
  sharedLink: defineMessages({
    title: {
      id: 'fa.application:section.confirmation.sharedLink.title',
      defaultMessage: 'Deila hlekk handa maka',
      description: 'Sharing link with spouse title',
    },
  }),
}
