import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { uuid } from 'uuidv4'

import {
  Box,
  ContentBlock,
  Input,
  InputFileUpload,
  Text,
  Tooltip,
  UploadFile,
} from '@island.is/island-ui/core'
import { fileExtensionWhitelist } from '@island.is/island-ui/core/types'
import * as constants from '@island.is/judicial-system/consts'
import {
  CaseFileState,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { errors } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  MarkdownWrapper,
  PageLayout,
  ParentCaseFiles,
  ProsecutorCaseInfo,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { CaseOrigin } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mapCaseFileToUploadFile,
  removeTabsValidateAndSet,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useDeb,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'

import {
  mapPoliceCaseFileToPoliceCaseFileCheck,
  PoliceCaseFileCheck,
  PoliceCaseFiles,
  PoliceCaseFilesData,
} from '../../components'
import { useGetPoliceCaseFilesQuery } from './getPoliceCaseFiles.generated'
import { caseFiles as strings } from './CaseFiles.strings'

export const CaseFiles: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const {
    data: policeData,
    loading: policeDataLoading,
    error: policeDataError,
  } = useGetPoliceCaseFilesQuery({
    variables: { input: { caseId: workingCase.id } },
    skip: workingCase.origin !== CaseOrigin.LOKE,
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })
  const router = useRouter()
  const { formatMessage } = useIntl()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [policeCaseFileList, setPoliceCaseFileList] = useState<
    PoliceCaseFileCheck[]
  >([])
  const [filesInRVG, setFilesInRVG] = useState<UploadFile[]>(
    workingCase.caseFiles?.map(mapCaseFileToUploadFile) || [],
  )
  const [policeCaseFiles, setPoliceCaseFiles] = useState<PoliceCaseFilesData>()

  const {
    upload,
    uploadFromPolice,
    handleRemove,
    handleRetry,
    generateSingleFileUpdate,
  } = useS3Upload(workingCase.id)
  const { updateCase } = useCase()

  useDeb(workingCase, 'caseFilesComments')

  useEffect(() => {
    if (workingCase.origin !== CaseOrigin.LOKE) {
      setPoliceCaseFiles({
        files: [],
        isLoading: false,
        hasError: false,
      })
    } else if (policeData && policeData.policeCaseFiles) {
      setPoliceCaseFiles({
        files: policeData.policeCaseFiles,
        isLoading: false,
        hasError: false,
      })
    } else if (policeDataLoading) {
      setPoliceCaseFiles({
        files:
          policeData && policeData.policeCaseFiles
            ? policeData.policeCaseFiles
            : [],
        isLoading: true,
        hasError: false,
      })
    } else {
      setPoliceCaseFiles({
        files:
          policeData && policeData.policeCaseFiles
            ? policeData.policeCaseFiles
            : [],
        isLoading: false,
        hasError: true,
        errorCode: policeDataError?.graphQLErrors[0]?.extensions
          ?.code as string,
      })
    }
  }, [policeData, policeDataError, policeDataLoading, workingCase.origin])

  useEffect(() => {
    setPoliceCaseFileList(
      policeCaseFiles?.files
        .filter(
          (policeFile) =>
            !workingCase.caseFiles?.some(
              (file) => !file.category && file.policeFileId === policeFile.id,
            ),
        )
        .map(mapPoliceCaseFileToPoliceCaseFileCheck) || [],
    )

    setFilesInRVG(
      workingCase.caseFiles
        ?.filter((file) => !file.category)
        .map(mapCaseFileToUploadFile) || [],
    )
  }, [policeCaseFiles, workingCase.caseFiles])

  const uploadErrorMessage = useMemo(() => {
    if (filesInRVG.some((file) => file.status === 'error')) {
      return formatMessage(errors.general)
    } else {
      return undefined
    }
  }, [filesInRVG, formatMessage])

  const stepIsValid = !isUploading
  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

  const handleUIUpdate = useCallback(
    (displayFile: UploadFile, newId?: string) => {
      setFilesInRVG((previous) =>
        generateSingleFileUpdate(previous, displayFile, newId),
      )
    },
    [generateSingleFileUpdate],
  )

  const uploadPoliceCaseFileCallback = useCallback(
    (file: UploadFile, id?: string) => {
      setFilesInRVG((previous) => [...previous, { ...file, id: id ?? file.id }])
    },
    [],
  )

  const handleUpload = useCallback(
    async (files: File[]) => {
      const filesWithId: Array<[File, string]> = files.map((file) => [
        file,
        uuid(),
      ])

      setIsUploading(true)

      setFilesInRVG((previous) => [
        ...filesWithId.map(
          ([file, id]): UploadFile => ({
            status: 'uploading',
            percent: 1,
            name: file.name,
            id,
            type: file.type,
          }),
        ),
        ...(previous || []),
      ])

      await upload(filesWithId, handleUIUpdate)

      setIsUploading(false)
    },
    [handleUIUpdate, upload],
  )

  const handlePoliceCaseFileUpload = useCallback(async () => {
    const filesToUpload = policeCaseFileList.filter((p) => p.checked)

    setIsUploading(true)

    filesToUpload.forEach(async (f, index) => {
      const fileToUpload = {
        id: f.id,
        type: 'application/pdf',
        name: f.name,
        status: 'done',
        state: CaseFileState.STORED_IN_RVG,
      } as UploadFile

      await uploadFromPolice(fileToUpload, uploadPoliceCaseFileCallback)

      setPoliceCaseFileList((previous) => previous.filter((p) => p.id !== f.id))

      if (index === filesToUpload.length - 1) {
        setIsUploading(false)
      }
    })
  }, [policeCaseFileList, uploadFromPolice, uploadPoliceCaseFileCallback])

  const removeFileCB = useCallback(
    (file: UploadFile) => {
      const policeCaseFile = policeCaseFiles?.files.find(
        (f) => f.name === file.name,
      )

      if (policeCaseFile) {
        setPoliceCaseFileList((previous) => [
          mapPoliceCaseFileToPoliceCaseFileCheck(policeCaseFile),
          ...previous,
        ])
      }

      setFilesInRVG((previous) => previous.filter((f) => f.id !== file.id))
    },
    [policeCaseFiles?.files],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(strings.title)} />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <ParentCaseFiles files={workingCase.parentCase?.caseFiles} />
        <Box marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(strings.descriptionHeading)}
            </Text>
          </Box>
          <MarkdownWrapper
            markdown={formatMessage(strings.descriptionList)}
            textProps={{ marginBottom: 0 }}
          />
        </Box>
        <SectionHeading
          title={formatMessage(strings.policeCaseFilesHeading)}
          description={formatMessage(strings.policeCaseFilesIntroduction)}
        />
        <PoliceCaseFiles
          onUpload={handlePoliceCaseFileUpload}
          isUploading={isUploading}
          policeCaseFileList={policeCaseFileList}
          setPoliceCaseFileList={setPoliceCaseFileList}
          policeCaseFiles={policeCaseFiles}
        />
        <Box marginBottom={3}>
          <Text variant="h3" as="h3">
            {formatMessage(strings.filesHeading)}
          </Text>
          <Text marginTop={1}>{formatMessage(strings.filesIntroduction)}</Text>
        </Box>
        <Box marginBottom={5}>
          <ContentBlock>
            <InputFileUpload
              name="fileUpload"
              accept={Object.values(fileExtensionWhitelist)}
              fileList={filesInRVG}
              header={formatMessage(strings.filesLabel)}
              buttonLabel={formatMessage(strings.filesButtonLabel)}
              onChange={handleUpload}
              onRemove={(file) => handleRemove(file, removeFileCB)}
              onRetry={(file) => handleRetry(file, handleUIUpdate)}
              errorMessage={uploadErrorMessage}
              disabled={isUploading}
              showFileSize
            />
          </ContentBlock>
        </Box>
        <Box>
          <Box marginBottom={3}>
            <Text variant="h3" as="h3">
              {formatMessage(strings.commentsHeading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(strings.commentsTooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={10}>
            <Input
              name="caseFilesComments"
              label={formatMessage(strings.commentsLabel)}
              placeholder={formatMessage(strings.commentsPlaceholder)}
              value={workingCase.caseFilesComments || ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'caseFilesComments',
                  event.target.value,
                  [],
                  workingCase,
                  setWorkingCase,
                )
              }
              onBlur={(evt) =>
                updateCase(workingCase.id, {
                  caseFilesComments: evt.target.value,
                })
              }
              textarea
              rows={7}
              autoExpand={{ on: true, maxHeight: 300 }}
            />
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${
            isRestrictionCase(workingCase.type)
              ? constants.RESTRICTION_CASE_POLICE_REPORT_ROUTE
              : constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE
          }/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(
              isRestrictionCase(workingCase.type)
                ? constants.RESTRICTION_CASE_OVERVIEW_ROUTE
                : constants.INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
            )
          }
          nextIsDisabled={!stepIsValid}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default CaseFiles
