import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.title',
    defaultMessage: 'Yfirlesin mál',
    description: 'Notaður sem titill á yfirlesin mál málalista',
  },
  reviewTagAppealed: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.review_tag_appealed',
    defaultMessage: 'Áfrýjun',
    description:
      'Notað sem texti á tagg fyrir "Áfrýjun" tillögu í yfirlesin mál málalista',
  },
  reviewTagAccepted: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.review_tag_completed',
    defaultMessage: 'Unun',
    description:
      'Notað sem texti á tagg fyrir "Unun" tillögu í yfirlesin mál málalista',
  },
  infoContainerMessage: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.info_container_message',
    defaultMessage: 'Engin yfirlesin mál.',
    description:
      'Notaður sem skilaboð í upplýsingaglugga ef engin yfirlesin mál eru til.',
  },
  infoContainerTitle: {
    id: 'judicial.system.core:public_prosecutor.tables.cases_reviewed.info_container_title',
    defaultMessage: 'Engin mál',
    description:
      'Notaður sem titill á upplýsingaglugga ef engin yfirlesin mál eru til.',
  },
})
