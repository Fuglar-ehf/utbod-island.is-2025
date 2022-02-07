import React from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { Box, AccordionItem, Button } from '@island.is/island-ui/core'
import { UploadState } from '@island.is/judicial-system-web/src/utils/hooks/useCourtUpload'
import { UploadStateMessage } from '@island.is/judicial-system-web/src/routes/Shared/SignedVerdictOverview/Components/UploadStateMessage'
import { useCourtUpload } from '@island.is/judicial-system-web/src/utils/hooks/useCourtUpload'
import {
  Case,
  completedCaseStates,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import { caseFilesAccordion as m } from '@island.is/judicial-system-web/messages/Core/caseFilesAccordion'

import { CaseFileList, InfoBox } from '../..'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  user: User
}

const CaseFilesAccordionItem: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, user } = props

  const { formatMessage } = useIntl()
  const { uploadFilesToCourt, uploadState } = useCourtUpload(
    workingCase,
    setWorkingCase,
  )

  const canCaseFilesBeOpened = () => {
    const isAppealGracePeriodExpired = workingCase.isAppealGracePeriodExpired

    const isProsecutorWithAccess =
      user.role === UserRole.PROSECUTOR &&
      user.institution?.id === workingCase.creatingProsecutor?.institution?.id

    const isCourtRoleWithAccess = completedCaseStates.includes(
      workingCase.state,
    )
      ? user.role === UserRole.JUDGE || user.role === UserRole.REGISTRAR
      : (user.role === UserRole.JUDGE && workingCase.judge?.id === user.id) ||
        (user.role === UserRole.REGISTRAR &&
          workingCase.registrar?.id === user.id)

    if (
      !isAppealGracePeriodExpired &&
      (isProsecutorWithAccess || isCourtRoleWithAccess)
    ) {
      return true
    } else {
      return false
    }
  }

  return (
    <AccordionItem
      id="caseFilesAccordionItem"
      label={
        <Box display="flex" alignItems="center" overflow="hidden">
          {`Rannsóknargögn (${
            workingCase.caseFiles ? workingCase.caseFiles.length : 0
          })`}

          {user && [UserRole.JUDGE, UserRole.REGISTRAR].includes(user.role) && (
            <AnimatePresence>
              {uploadState === UploadState.UPLOAD_ERROR && (
                <UploadStateMessage
                  icon="warning"
                  iconColor="red600"
                  message={formatMessage(m.someFilesUploadedToCourtText)}
                />
              )}
              {uploadState === UploadState.ALL_UPLOADED && (
                <UploadStateMessage
                  icon="checkmark"
                  iconColor="blue400"
                  message={formatMessage(m.allFilesUploadedToCourtText)}
                />
              )}
            </AnimatePresence>
          )}
        </Box>
      }
      labelVariant="h3"
      labelUse="h2"
    >
      <CaseFileList
        caseId={workingCase.id}
        files={workingCase.caseFiles ?? []}
        canOpenFiles={canCaseFilesBeOpened()}
        hideIcons={user?.role === UserRole.PROSECUTOR}
        handleRetryClick={(id: string) =>
          workingCase.caseFiles &&
          uploadFilesToCourt([
            workingCase.caseFiles[
              workingCase.caseFiles.findIndex((file) => file.id === id)
            ],
          ])
        }
      />
      {user && [UserRole.JUDGE, UserRole.REGISTRAR].includes(user?.role) && (
        <Box display="flex" justifyContent="flexEnd">
          {(workingCase.caseFiles || []).length === 0 ? null : uploadState ===
            UploadState.NONE_CAN_BE_UPLOADED ? (
            <InfoBox text={formatMessage(m.uploadToCourtAllBrokenText)} />
          ) : (
            <Button
              size="small"
              onClick={() => uploadFilesToCourt(workingCase.caseFiles)}
              loading={uploadState === UploadState.UPLOADING}
              disabled={
                uploadState === UploadState.UPLOADING ||
                uploadState === UploadState.ALL_UPLOADED
              }
            >
              {formatMessage(
                uploadState === UploadState.UPLOAD_ERROR
                  ? m.retryUploadToCourtButtonText
                  : m.uploadToCourtButtonText,
              )}
            </Button>
          )}
        </Box>
      )}
    </AccordionItem>
  )
}

export default CaseFilesAccordionItem
