import {
  buildCustomField,
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'

import * as m from '../lib/messages'
import { ApproveOptions } from '../lib/types'
import { Routes } from '../lib/constants'

export const Spouse: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'aboutSpouseForm',
      title: m.aboutSpouseForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'aboutSpouseForm',
          title: m.aboutSpouseForm.general.pageTitle,
          component: 'AboutSpouseForm',
        }),
      ],
    }),
    // TODO: check if reusing components will work for the summary page
    buildSection({
      id: 'incomeForm',
      title: m.incomeForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.SPOUSEINCOME,
          title: m.incomeForm.general.pageTitle,
          component: 'IncomeForm',
        }),
      ],
    }),
    buildSection({
      condition: (answers) => answers.spouseIncome === ApproveOptions.Yes,
      id: 'incomeFilesForm',
      title: m.incomeFilesForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.SPOUSEINCOMEFILES,
          title: m.incomeFilesForm.general.pageTitle,
          component: 'IncomeFilesForm',
        }),
      ],
    }),
    buildSection({
      id: 'taxReturnFilesForm',
      title: m.taxReturnForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.SPOUSETAXRETURNFILES,
          title: m.taxReturnForm.general.pageTitle,
          component: 'TaxReturnFilesForm',
        }),
      ],
    }),
    buildSection({
      id: 'contactInfoForm',
      title: m.contactInfo.general.sectionTitle,
      children: [
        buildCustomField({
          id: Routes.SPOUSECONTACTINFO,
          title: m.contactInfo.general.pageTitle,
          component: 'ContactInfo',
        }),
      ],
    }),
  ],
})
