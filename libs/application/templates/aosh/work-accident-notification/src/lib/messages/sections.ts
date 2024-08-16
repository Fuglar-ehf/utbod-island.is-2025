import { defineMessages } from 'react-intl'

export const sections = {
  prerequisites: defineMessages({
    dataFetching: {
      id: 'aosh.wan.application:sections.prerequisites.dataFetching',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section (right side panel)',
    },
    information: {
      id: 'aosh.wan.application:sections.prerequisites.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: `Title of information section (right side panel)`,
    },
    accident: {
      id: 'aosh.wan.application:sections.prerequisites.accident',
      defaultMessage: 'Slysið',
      description: 'Title of the accident section (right side panel)',
    },
    employee: {
      id: 'aosh.wan.application:sections.prerequisites.employee',
      defaultMessage: 'Starfsmaður',
      description: 'Title of the employee setion (right side panel)',
    },
    overview: {
      id: 'aosh.wan.application:sections.prerequisites.overview',
      defaultMessage: 'Yfirlit',
      description: 'Title of the overview setion (right side panel)',
    },
    conclusion: {
      id: 'aosh.wan.application:sections.prerequisites.conclusion',
      defaultMessage: 'Staðfesting',
      description: 'Title of the conclusion setion (right side panel)',
    },
  }),
  draft: defineMessages({
    dataFetching: {
      id: 'aosh.wan.application:sections.draft.dataFetching',
      defaultMessage: 'Gagnaöflun',
      description: 'Title of external data section (right side panel)',
    },
    company: {
      id: 'aosh.wan.application:sections.draft.company',
      defaultMessage: 'Fyrirtækið',
      description: 'Title of company section (right side panel)',
    },
    accident: {
      id: 'aosh.wan.application:sections.draft.accident',
      defaultMessage: 'Slysið',
      description: 'Title of accident section (right side panel)',
    },
    about: {
      id: 'aosh.wan.application:sections.draft.about',
      defaultMessage: 'Um slysið',
      description: 'Title of about accident sub section (right side panel)',
    },
    causes: {
      id: 'aosh.wan.application:sections.draft.causes',
      defaultMessage: 'Orsakir/Afleiðingar',
      description:
        'Title of causes/consequences in accident sub section (right side panel)',
    },
    absence: {
      id: 'aosh.wan.application:sections.draft.absence',
      defaultMessage: 'Fjarvera',
      description:
        'Title of absence in the causes sub section (right side panel)',
    },
    causeOfInjury: {
      id: 'aosh.wan.application:sections.draft.causeOfInjury',
      defaultMessage: 'Orsök áverka',
      description:
        'Title of cause of injury in the causes sub section (right side panel)',
    },
    circumstances: {
      id: 'aosh.wan.application:sections.draft.circumstances',
      defaultMessage: 'Aðstæður slyss',
      description:
        'Title of circumstances in the causes sub section (right side panel)',
    },
    injuredBodyParts: {
      id: 'aosh.wan.application:sections.draft.injuredBodyParts',
      defaultMessage: 'Skaddaðir líkamshlutar',
      description:
        'Title of injured body parts in the causes sub section (right side panel)',
    },
    typeOfInjury: {
      id: 'aosh.wan.application:sections.draft.typeOfInjury',
      defaultMessage: 'Tegund áverka',
      description:
        'Title of type of injury in the causes sub section (right side panel)',
    },
    deviation: {
      id: 'aosh.wan.application:sections.draft.deviation',
      defaultMessage: 'Frávik í vinnuferli',
      description:
        'Title of deviation in the causes sub section (right side panel)',
    },
  }),
}
