import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  CourtCaseInfo,
  FormContentContainer,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsCourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { core, errors, titles } from '@island.is/judicial-system-web/messages'
import {
  AlertMessage,
  Box,
  InputFileUpload,
  toast,
} from '@island.is/island-ui/core'
import {
  useCase,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  CaseFileCategory,
  CaseTransition,
} from '@island.is/judicial-system/types'
import { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import * as constants from '@island.is/judicial-system/consts'

import { courtRecord as m } from './CourtRecord.strings'

const CourtRecord: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()

  const { formatMessage } = useIntl()
  const { transitionCase } = useCase()

  const {
    files,
    handleS3Upload,
    handleRemoveFromS3,
    handleRetry,
    allFilesUploaded,
  } = useS3Upload(workingCase)

  const handleNavigationTo = useCallback(
    async (destination: keyof stepValidationsType) => {
      const transitionSuccessful = await transitionCase(
        workingCase,
        CaseTransition.ACCEPT,
      )

      if (transitionSuccessful) {
        setNavigateTo(destination)
      } else {
        toast.error(formatMessage(errors.transitionCase))
      }
    },
    [transitionCase, workingCase, formatMessage],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.JUDGE}
      activeSubSection={IndictmentsCourtSubsections.COURT_RECORD}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={allFilesUploaded}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.courtRecord)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(m.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <AlertMessage
            message={formatMessage(m.alertBannerText)}
            type="info"
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading title={formatMessage(m.courtRecordTitle)} />
          <InputFileUpload
            fileList={files.filter(
              (file) => file.category === CaseFileCategory.COURT_RECORD,
            )}
            header={formatMessage(m.inputFieldLabel)}
            buttonLabel={formatMessage(m.uploadButtonText)}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileCategory.COURT_RECORD)
            }
            onRemove={handleRemoveFromS3}
            onRetry={handleRetry}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading title={formatMessage(m.rulingTitle)} />
          <InputFileUpload
            fileList={files.filter(
              (file) => file.category === CaseFileCategory.RULING,
            )}
            header={formatMessage(m.inputFieldLabel)}
            buttonLabel={formatMessage(m.uploadButtonText)}
            onChange={(files) =>
              handleS3Upload(files, false, CaseFileCategory.RULING)
            }
            onRemove={handleRemoveFromS3}
            onRetry={handleRetry}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_PROSECUTOR_AND_DEFENDER_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.CLOSED_INDICTMENT_OVERVIEW_ROUTE)
          }
          nextIsDisabled={!allFilesUploaded}
          nextIsLoading={isLoadingWorkingCase}
          nextButtonText={formatMessage(m.nextButtonText)}
        />
      </FormContentContainer>
      {navigateTo !== undefined && (
        <Modal
          title={formatMessage(m.modalTitle)}
          text={formatMessage(m.modalText)}
          onPrimaryButtonClick={() => {
            router.push(`${navigateTo}/${workingCase.id}`)
          }}
          primaryButtonText={formatMessage(core.closeModal)}
        />
      )}
    </PageLayout>
  )
}

export default CourtRecord
