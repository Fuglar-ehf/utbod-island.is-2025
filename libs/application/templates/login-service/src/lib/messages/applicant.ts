import { defineMessages } from 'react-intl'

export const applicant = {
  general: defineMessages({
    pageTitle: {
      id: `ls.application:section.applicant.pageTitle`,
      defaultMessage: 'Upplýsingar um umsækjanda',
      description: 'Applicant page title',
    },
    pageDescription: {
      id: `ls.application:section.applicant.pageDescription`,
      defaultMessage:
        'Upplýsingar um þann lögaðila sem óskar eftir að nota innskráningarþjónustu Ísland.is',
      description: 'Applicant page description',
    },
  }),
  labels: defineMessages({
    name: {
      id: `ls.application:section.applicant.name`,
      defaultMessage: 'Nafn á lögaðila',
      description: 'Applicant name label',
    },
    nameDescription: {
      id: `ls.application:section.applicant.nameDescription`,
      defaultMessage: 'Lögaðili sem sækir um innskráningarþjónustu',
      description: 'Applicant name label description',
    },
    nationalId: {
      id: `ls.application:section.applicant.nationalId`,
      defaultMessage: 'Kennitala lögaðila',
      description: 'Applicant national id label',
    },
    typeOfOperation: {
      id: `ls.application:section.applicant.typeOfOperation`,
      defaultMessage: 'Rekstrartegund',
      description: 'Applicant type of operation label',
    },
    responsiblePartyTitle: {
      id: `ls.application:section.applicant.responsiblePartyTitle`,
      defaultMessage: 'Ábyrgðaraðili',
      description: 'Applicant responsiblePartyTitle label',
    },
    responsiblePartyDescription: {
      id: `ls.application:section.applicant.responsiblePartyDescription`,
      defaultMessage: 'Stuttur texti um hvað ábyrgðaraðili er',
      description: 'Applicant responsiblePartyDescription label',
    },
    responsiblePartyName: {
      id: `ls.application:section.applicant.responsiblePartyName`,
      defaultMessage: 'Nafn á ábyrgðaraðila',
      description: 'Applicant responsiblePartyName label',
    },
    responsiblePartyEmail: {
      id: `ls.application:section.applicant.responsiblePartyEmail`,
      defaultMessage: 'Netfang ábyrgðaraðila',
      description: 'Applicant responsiblePartyEmail label',
    },
    responsiblePartyTel: {
      id: `ls.application:section.applicant.responsiblePartyTel`,
      defaultMessage: 'Símanúmer ábyrgðaraðila',
      description: 'Applicant responsiblePartyTel label',
    },
  }),
}
