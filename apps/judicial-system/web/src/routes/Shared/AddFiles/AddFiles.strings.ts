import { defineMessage } from 'react-intl'

export const strings = {
  heading: defineMessage({
    id: 'judicial.system.core:add_files.heading',
    defaultMessage: 'Gögn',
    description: 'Notaður sem titill á Bæta við gögnum síðu í ákærum.',
  }),
  uploadFilesHeading: {
    id: 'judicial.system.core:add_files.upload_files_heading',
    defaultMessage: 'Innsending gagna til dómsins',
    description:
      'Notaður sem titill í Innsending gagna til dómsins hluta á Gögn síðu í ákærum.',
  },
  uploadFilesDescription: {
    id: 'judicial.system.core:add_files.upload_files_description',
    defaultMessage: 'Gögnin verða að hafa lýsandi skráarheiti.',
    description:
      'Notaður sem texti í Innsending gagna til dómsins hluta á Gögn síðu í ákærum.',
  },
  nextButtonText: {
    id: 'judicial.system.core:add_files.next_button_text',
    defaultMessage: 'Senda gögn',
    description: 'Notaður sem texti í Senda gögn takka á Gögn síðu í ákærum',
  },
  filesSentModalTitle: {
    id: 'judicial.system.core:add_files.files_sent_modal_title',
    defaultMessage: 'Viltu senda gögn til héraðsdóms?',
    description:
      'Notaður sem titill í modal glugga þegar gögn eru send á Gögn síðu í ákærum',
  },
  filesSentModalText: {
    id: 'judicial.system.core:add_files.files_sent_modal_text',
    defaultMessage: 'Gögnin verða sýnileg dómstólnum og aðilum máls.',
    description:
      'Notaður sem texti í modal glugga þegar gögn eru send á Gögn síðu í ákærum',
  },
  filesSentModalPrimaryButtonText: {
    id: 'judicial.system.core:add_files.files_sent_modal_primary_button_text',
    defaultMessage: 'Já, senda gögn',
    description:
      'Notaður sem texti í takka í modal glugga þegar gögn eru send á Gögn síðu í ákærum',
  },
  filesSentModalSecondaryButtonText: {
    id: 'judicial.system.core:add_files.files_sent_modal_secondary_button_text',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti í takka í modal glugga þegar gögn eru send á Gögn síðu í ákærum',
  },
}
