import { defineMessage, defineMessages } from 'react-intl'

export const defendant = {
  heading: defineMessage({
    id: 'judicial.system.investigation_cases:defendant.heading',
    defaultMessage: 'Rannsóknarheimild',
    description:
      'Notaður sem titill á sakbornings skrefi í rannsóknarheimildum.',
  }),
  sections: {
    investigationType: {
      heading: defineMessage({
        id:
          'judicial.system.investigation_cases:defendant.investigation_type.heading',
        defaultMessage: 'Efni kröfu',
        description:
          'Notaður sem titill fyrir "efni kröfu" hlutanum á varnaraðila skrefi í rannsóknarheimildum.',
      }),
      type: defineMessages({
        label: {
          id:
            'judicial.system.investigation_cases:defendant.investigation_type.type.label',
          defaultMessage: 'Tegund kröfu',
          description:
            'Notaður sem titill í "tegund kröfu" listanum á varnaraðila skrefi í rannsóknarheimildum.',
        },
        placeholder: {
          id:
            'judicial.system.investigation_cases:defendant.investigation_type.type.placeholder',
          defaultMessage: 'Veldu tegund kröfu',
          description:
            'Notaður sem skýritexti í "tegund kröfu" listanum á varnaraðila skrefi í rannsóknarheimildum.',
        },
      }),
      description: defineMessages({
        label: {
          id:
            'judicial.system.investigation_cases:defendant.investigation_type.description.label',
          defaultMessage: 'Efni kröfu',
          description:
            'Notaður sem titill í "efni kröfu" textaboxi á varnaraðila skrefi í rannsóknarheimildum.',
        },
        placeholder: {
          id:
            'judicial.system.investigation_cases:defendant.investigation_type.description.placeholder',
          defaultMessage: 'Veldu tegund kröfu',
          description:
            'Notaður sem skýritexti í "efni kröfu" textaboxi á varnaraðila skrefi í rannsóknarheimildum.',
        },
      }),
    },
    defendantInfo: {
      heading: defineMessage({
        id:
          'judicial.system.investigation_cases:defendant.defendant_info.heading',
        defaultMessage: 'Varnaraðili',
        description:
          'Notaður sem titill fyrir "upplýsingar um varnaraðila" hlutann á varnaraðila skrefi í rannsóknarheimildum.',
      }),
      delete: defineMessage({
        id:
          'judicial.system.investigation_cases:defendant.defendant_info.delete',
        defaultMessage: 'Eyða varnaraðila',
        description:
          'Notaður sem texti á eyða varnaraðila hnappinn í "upplýsingar um varnaraðila" hlutanum á varnaraðila skrefi í rannsóknarheimildum',
      }),
      addDefendantButtonText: defineMessage({
        id:
          'judicial.system.investigation_cases:defendant.defendant_info.add_defendant_button_text',
        defaultMessage: 'Bæta við varnaraðila',
        description:
          'Notaður sem text í "bæta við varnaraðila" takkann á varnaraðila skrefi í rannsóknarheimildum.',
      }),
    },
    defenderInfo: {
      heading: defineMessage({
        id:
          'judicial.system.investigation_cases:defendant.defender_info.heading',
        defaultMessage: 'Verjandi varnaraðila',
        description:
          'Notaður sem titill fyrir "upplýsingar um verjanda varnaraðila" hlutann á varnaraðila skrefi í rannsóknarheimildum.',
      }),
      sendRequest: defineMessages({
        label: {
          id:
            'judicial.system.investigation_cases:defendant.defender_info.send_request.label',
          defaultMessage:
            'Senda kröfu sjálfvirkt í tölvupósti til verjanda við úthlutun fyrirtökutíma',
          description:
            'Notaður sem texti í "senda kröfu sjálfvirkt..." gátreit á varnaraðila skrefi í rannsóknarheimildum.',
        },
        tooltip: {
          id:
            'judicial.system.investigation_cases:defendant.defender_info.send_request.tooltip',
          defaultMessage:
            'Ef hakað er hér þá fær verjandi kröfuna senda þegar fyrirtökutíma hefur verið úthlutað',
          description:
            'Notaður sem upplýsingatexti í upplýsingasvæði við "senda kröfu sjálfvirkt..." gátreit á sakbornings skrefi í rannsóknarheimildum.',
        },
      }),
    },
  },
}
