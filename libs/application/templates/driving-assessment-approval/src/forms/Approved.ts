import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  title: 'Samþykkt',
  mode: FormModes.APPLYING,
  children: [
    buildDescriptionField({
      id: 'approved',
      title: 'Móttekið',
      description: 'Akstursmat móttekið',
    }),
  ],
})
