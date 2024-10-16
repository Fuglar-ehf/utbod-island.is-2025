import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { Logo } from '../../components/Logo'
import { m } from '../../lib/utils/messages'
import { clientInfoSection } from './clientInfoSection'
import { electionInfoSection } from './electionInfoSection'
import { individualKeyNumbersSection } from './individualKeyNumbersSection'
import { documentsSection } from './documentsSection'
import { overviewSection } from './overviewSection'

export const FinancialStatementIndividualElectionForm: Form = buildForm({
  id: 'FinancialStatementIndividualelectionForm',
  title: m.applicationTitle,
  mode: FormModes.DRAFT,
  renderLastScreenButton: false,
  logo: Logo,
  children: [
    clientInfoSection,
    electionInfoSection,
    individualKeyNumbersSection,
    documentsSection,
    overviewSection,
  ],
})
