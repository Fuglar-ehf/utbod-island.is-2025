import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  CourtCaseInfo,
  FormContentContainer,
  FormFooter,
  InfoCardActiveIndictment,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { titles, core } from '@island.is/judicial-system-web/messages'
import { Box } from '@island.is/island-ui/core'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'
import * as constants from '@island.is/judicial-system/consts'

import { overview as m } from './Overview.strings'

const Overview = () => {
  const router = useRouter()
  const id = router.query.id
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const { onOpen } = useFileList({ caseId: workingCase.id })
  const { formatMessage } = useIntl()

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.JUDGE}
      activeSubSection={IndictmentsCourtSubsections.JUDGE_OVERVIEW}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(titles.court.indictments.overview)} />
      <FormContentContainer>
        <PageTitle title={formatMessage(m.title)} />
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <InfoCardActiveIndictment />
        </Box>
        {workingCase.caseFiles && (
          <Box component="section" marginBottom={10}>
            <SectionHeading title={formatMessage(m.caseFilesTitle)} />
            {workingCase.caseFiles.map((file) => (
              <Box
                key={file.id}
                borderColor="blue200"
                borderBottomWidth={'large'}
              >
                <PdfButton
                  renderAs="row"
                  caseId={workingCase.id}
                  title={file.name}
                  handleClick={() => onOpen(file.id)}
                />
              </Box>
            ))}
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.CASES_ROUTE}`}
          nextIsLoading={isLoadingWorkingCase}
          nextUrl={`${constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE}/${id}`}
          nextButtonText={formatMessage(core.continue)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Overview
