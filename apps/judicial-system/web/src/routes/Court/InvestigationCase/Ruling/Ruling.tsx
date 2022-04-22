import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { isAcceptingCaseDecision } from '@island.is/judicial-system/types'
import { formatDate } from '@island.is/judicial-system/formatters'
import { icRuling as m } from '@island.is/judicial-system-web/messages'
import { autofillRuling } from '@island.is/judicial-system-web/src/components/RulingInput/RulingInput'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'

import RulingForm from './RulingForm'

const Ruling = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const [initialAutoFillDone, setInitialAutoFillDone] = useState(false)
  const { autofill } = useCase()
  const { formatMessage } = useIntl()

  useEffect(() => {
    if (isCaseUpToDate && !initialAutoFillDone) {
      autofill(
        'introduction',
        formatMessage(m.sections.introduction.autofill, {
          date: formatDate(workingCase.courtDate, 'PPP'),
        }),
        workingCase,
      )

      if (workingCase.demands) {
        autofill('prosecutorDemands', workingCase.demands, workingCase)
      }

      if (workingCase.caseFacts) {
        autofill('courtCaseFacts', workingCase.caseFacts, workingCase)
      }

      if (workingCase.legalArguments) {
        autofill('courtLegalArguments', workingCase.legalArguments, workingCase)
      }

      autofillRuling(workingCase, autofill, formatMessage)
    }

    if (isAcceptingCaseDecision(workingCase.decision) && workingCase.demands) {
      autofill('conclusion', workingCase.demands, workingCase)
    }

    setInitialAutoFillDone(true)
    setWorkingCase({ ...workingCase })
  }, [
    isCaseUpToDate,
    autofill,
    workingCase,
    formatMessage,
    setWorkingCase,
    initialAutoFillDone,
  ])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.RULING}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.investigationCases.ruling)}
      />
      <RulingForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isLoading={isLoadingWorkingCase}
      />
    </PageLayout>
  )
}

export default Ruling
