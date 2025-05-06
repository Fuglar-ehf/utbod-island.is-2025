import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'

export const firstSection = buildSection({
  id: 'section4',
  title: 'Tekjur ársins 2024',
  children: [
    buildMultiField({
      id: 'firstSection',
      title: 'Launagreiðslur',
      children: [
        buildDescriptionField({
          id: 'description',
          title: 'Description',
          description: 'This is a description, should come from messages.ts',
        }),
        buildTextField({
          id: 'input',
          title: 'Input',
          description: 'This is an input, should come from messages.ts',
        }),
      ],
    }),
  ],
})
