import React, { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Box, InputFileUpload, Text } from '@island.is/island-ui/core'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import * as constants from '@island.is/judicial-system/consts'
import { isTrafficViolationCase } from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PdfButton,
  ProsecutorCaseInfo,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import * as strings from './CaseFiles.strings'

const CaseFiles = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const {
    uploadFiles,
    allFilesDoneOrError,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRetry, handleRemove } = useS3Upload(
    workingCase.id,
  )

  const isTrafficViolationCaseCheck = isTrafficViolationCase(workingCase)

  const stepIsValid =
    (isTrafficViolationCaseCheck ||
      uploadFiles.some(
        (file) =>
          file.category === CaseFileCategory.INDICTMENT &&
          file.status === 'done',
      )) &&
    uploadFiles.some(
      (file) =>
        file.category === CaseFileCategory.CRIMINAL_RECORD &&
        file.status === 'done',
    ) &&
    allFilesDoneOrError
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.caseFiles)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.caseFiles.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        {!isTrafficViolationCaseCheck && (
          <Box component="section" marginBottom={5}>
            <SectionHeading
              title={formatMessage(strings.caseFiles.indictmentSection)}
              required
            />
            <InputFileUpload
              fileList={uploadFiles.filter(
                (file) => file.category === CaseFileCategory.INDICTMENT,
              )}
              accept={Object.values(fileExtensionWhitelist)}
              header={formatMessage(strings.caseFiles.inputFieldLabel)}
              buttonLabel={formatMessage(strings.caseFiles.buttonLabel)}
              onChange={(files) =>
                handleUpload(
                  addUploadFiles(files, CaseFileCategory.INDICTMENT),
                  updateUploadFile,
                )
              }
              onRemove={(file) => handleRemove(file, removeUploadFile)}
              onRetry={(file) => handleRetry(file, updateUploadFile)}
            />
          </Box>
        )}
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.criminalRecordSection)}
            required
          />
          <InputFileUpload
            fileList={uploadFiles.filter(
              (file) => file.category === CaseFileCategory.CRIMINAL_RECORD,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(strings.caseFiles.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.buttonLabel)}
            onChange={(files) =>
              handleUpload(
                addUploadFiles(files, CaseFileCategory.CRIMINAL_RECORD),
                updateUploadFile,
              )
            }
            onRemove={(file) => handleRemove(file, removeUploadFile)}
            onRetry={(file) => handleRetry(file, updateUploadFile)}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.costBreakdownSection)}
          />
          <InputFileUpload
            fileList={uploadFiles.filter(
              (file) => file.category === CaseFileCategory.COST_BREAKDOWN,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(strings.caseFiles.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.buttonLabel)}
            onChange={(files) =>
              handleUpload(
                addUploadFiles(files, CaseFileCategory.COST_BREAKDOWN),
                updateUploadFile,
              )
            }
            onRemove={(file) => handleRemove(file, removeUploadFile)}
            onRetry={(file) => handleRetry(file, updateUploadFile)}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SectionHeading
            title={formatMessage(strings.caseFiles.otherDocumentsSection)}
          />
          <InputFileUpload
            fileList={uploadFiles.filter(
              (file) =>
                file.category === CaseFileCategory.CASE_FILE &&
                !file.policeCaseNumber,
            )}
            accept={Object.values(fileExtensionWhitelist)}
            header={formatMessage(strings.caseFiles.inputFieldLabel)}
            buttonLabel={formatMessage(strings.caseFiles.buttonLabel)}
            onChange={(files) =>
              handleUpload(
                addUploadFiles(files, CaseFileCategory.CASE_FILE),
                updateUploadFile,
              )
            }
            onRemove={(file) => handleRemove(file, removeUploadFile)}
            onRetry={(file) => handleRetry(file, updateUploadFile)}
          />
        </Box>
        {isTrafficViolationCaseCheck && (
          <Box marginBottom={10}>
            <PdfButton
              caseId={workingCase.id}
              title={formatMessage(strings.caseFiles.pdfButtonIndictment)}
              pdfType="indictment"
            />
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${
            isTrafficViolationCaseCheck
              ? constants.INDICTMENTS_TRAFFIC_VIOLATION_ROUTE
              : constants.INDICTMENTS_PROCESSING_ROUTE
          }/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INDICTMENTS_OVERVIEW_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseFiles
