import React from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'
import { Box } from '@island.is/island-ui/core'

import SharedPageLayout from '@island.is/judicial-system-web/src/components/SharedPageLayout/SharedPageLayout'
import {
  Logo,
  PageHeader,
  SectionHeading,
  AppealCasesTable,
} from '@island.is/judicial-system-web/src/components'
import { titles, tables } from '@island.is/judicial-system-web/messages'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  CaseAppealState,
  CaseListEntry,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { AppealedCasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'

import { logoContainer } from '../../Shared/Cases/Cases.css'
import { courtOfAppealCases as strings } from './Cases.strings'

const CourtOfAppealCases = () => {
  const { formatMessage } = useIntl()
  const { getCaseToOpen } = useCase()

  const input = { appealState: ['RECEIVED', 'COMPLETED'] }

  const { data: appealedCases, loading } = useQuery<{
    cases: CaseListEntry[]
  }>(AppealedCasesQuery, {
    variables: { input },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const appealedCasesData = appealedCases?.cases || []

  return (
    <SharedPageLayout>
      <PageHeader title={formatMessage(titles.shared.cases)} />
      <div className={logoContainer}>
        <Logo />
      </div>
      <SectionHeading title={formatMessage(strings.appealedCasesTitle)} />
      <Box marginBottom={7}>
        <AppealCasesTable
          loading={loading}
          onRowClick={(id) => {
            getCaseToOpen({
              variables: { input: { id } },
            })
          }}
          cases={
            appealedCasesData?.filter(
              (a) => a.appealState !== CaseAppealState.COMPLETED,
            ) || []
          }
        />
      </Box>
      <SectionHeading title={formatMessage(tables.completedCasesTitle)} />
      <AppealCasesTable
        loading={loading}
        onRowClick={(id) => {
          getCaseToOpen({
            variables: { input: { id } },
          })
        }}
        cases={
          appealedCasesData?.filter(
            (a) => a.appealState === CaseAppealState.COMPLETED,
          ) || []
        }
        showingCompletedCases={true}
      />
    </SharedPageLayout>
  )
}

export default CourtOfAppealCases
