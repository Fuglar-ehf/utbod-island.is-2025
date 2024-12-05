import { defineMessages } from 'react-intl'

export const shared = {
  application: defineMessages({
    name: {
      id: 'aosh.pe.application:shared.application.name',
      defaultMessage: 'Skráning í verkleg próf',
      description: `Application's name`,
    },
    institutionName: {
      id: 'aosh.pe.application:shared.application.institutionName',
      defaultMessage: 'Vinnueftirlitið',
      description: `Institution's name`,
    },
    actionCardPrerequisites: {
      id: 'aosh.pe.application:shared.application.actionCardPrerequisites',
      defaultMessage: 'Gagnaöflun',
      description:
        'Description of application state/status when the application is in prerequisites',
    },
    actionCardDone: {
      id: 'aosh.pe.application:shared.application.actionCardDone',
      defaultMessage: 'Afgreidd',
      description:
        'Description of application state/status when application is done',
    },
    actionCardDraft: {
      id: 'aosh.pe.application:shared.application.actionCardDraft',
      defaultMessage: 'Í vinnslu',
      description:
        'Description of application state/status when the application is in progress',
    },
  }),
  labels: defineMessages({
    ssn: {
      id: 'aosh.pe.application:shared.labels.ssn',
      defaultMessage: 'Kennitala',
      description: `Label for the applicant's social security number`,
    },
    name: {
      id: 'aosh.pe.application:shared.labels.name',
      defaultMessage: 'Nafn',
      description: `Label for the applicant's name`,
    },
    email: {
      id: 'aosh.pe.application:shared.labels.email',
      defaultMessage: 'Nafn',
      description: `Label for the applicant's email`,
    },
    phone: {
      id: 'aosh.pe.application:shared.labels.phone',
      defaultMessage: 'Símanúmer',
      description: `Label for the applicant's mobile phone number`,
    },
  }),
}
