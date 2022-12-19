import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'

import {
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCardActiveIndictment,
  Modal,
  PageLayout,
  ProsecutorCaseInfo,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { core, titles } from '@island.is/judicial-system-web/messages'
import { Box, Text } from '@island.is/island-ui/core'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { CaseState, CaseTransition } from '@island.is/judicial-system/types'
import IndictmentCaseFilesList from '@island.is/judicial-system-web/src/components/IndictmentCaseFilesList/IndictmentCaseFilesList'
import * as constants from '@island.is/judicial-system/consts'

import * as strings from './Overview.strings'

const Overview: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [modal, setModal] = useState<'noModal' | 'caseSubmittedModal'>(
    'noModal',
  )
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { transitionCase } = useCase()

  const isNewIndictment =
    workingCase.state === CaseState.NEW || workingCase.state === CaseState.DRAFT

  const caseHasBeenSentToCourt =
    workingCase.state !== CaseState.NEW && workingCase.state !== CaseState.DRAFT

  const handleNextButtonClick = async () => {
    if (isNewIndictment) {
      await transitionCase(workingCase, CaseTransition.SUBMIT, setWorkingCase)
    }

    setModal('caseSubmittedModal')
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.PROSECUTOR}
      activeSubSection={
        caseHasBeenSentToCourt
          ? undefined
          : IndictmentsProsecutorSubsections.OVERVIEW
      }
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.overview)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.overview.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <InfoCardActiveIndictment />
        </Box>
        <IndictmentCaseFilesList workingCase={workingCase} />
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={
            caseHasBeenSentToCourt
              ? constants.CASES_ROUTE
              : `${constants.INDICTMENTS_CASE_FILES_ROUTE}/${workingCase.id}`
          }
          nextButtonText={formatMessage(strings.overview.nextButtonText, {
            isNewIndictment,
          })}
          hideNextButton={caseHasBeenSentToCourt}
          infoBoxText={
            caseHasBeenSentToCourt
              ? formatMessage(strings.overview.caseSendToCourt)
              : undefined
          }
          onNextButtonClick={handleNextButtonClick}
        />
      </FormContentContainer>
      <AnimatePresence>
        {modal === 'caseSubmittedModal' && (
          <Modal
            title={formatMessage(strings.overview.modalHeading)}
            onClose={() => router.push(constants.CASES_ROUTE)}
            onPrimaryButtonClick={() => {
              router.push(constants.CASES_ROUTE)
            }}
            primaryButtonText={formatMessage(core.closeModal)}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  )
}

export default Overview
