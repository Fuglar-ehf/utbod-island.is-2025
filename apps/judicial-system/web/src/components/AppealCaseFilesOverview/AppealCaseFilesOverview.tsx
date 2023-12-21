import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'
import router from 'next/router'

import { Box, Button, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseFileCategory,
  completedCaseStates,
  isCourtOfAppealsUser,
  isDefenceUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  FileNotFoundModal,
  FormContext,
  PdfButton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealState,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './AppealCaseFilesOverview.strings'

const AppealCaseFilesOverview: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { workingCase } = useContext(FormContext)

  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
  })

  const { formatMessage } = useIntl()
  const { user, limitedAccess } = useContext(UserContext)

  const fileDate = (category: CaseFileCategory) => {
    switch (category) {
      case CaseFileCategory.PROSECUTOR_APPEAL_BRIEF:
      case CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE:
        return workingCase.prosecutorPostponedAppealDate
      case CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT:
      case CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE:
        return workingCase.prosecutorStatementDate
      case CaseFileCategory.DEFENDANT_APPEAL_BRIEF:
      case CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE:
        return workingCase.accusedPostponedAppealDate
      case CaseFileCategory.DEFENDANT_APPEAL_STATEMENT:
      case CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE:
        return workingCase.defendantStatementDate
    }
  }

  const appealCaseFiles = workingCase.caseFiles?.filter(
    (caseFile) =>
      caseFile.category &&
      ((workingCase.prosecutorPostponedAppealDate &&
        [
          CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
          CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
        ].includes(caseFile.category)) ||
        (workingCase.prosecutorStatementDate &&
          [
            CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
            CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
          ].includes(caseFile.category)) ||
        (workingCase.accusedPostponedAppealDate &&
          [
            CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
            CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
          ].includes(caseFile.category)) ||
        (workingCase.defendantStatementDate &&
          [
            CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
            CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
          ].includes(caseFile.category)) ||
        [
          CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
          CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
        ].includes(caseFile.category)),
  )

  const appealRulingFiles = workingCase.caseFiles?.filter(
    (caseFile) =>
      (workingCase.appealState === CaseAppealState.COMPLETED ||
        isCourtOfAppealsUser(user)) &&
      caseFile.category &&
      [CaseFileCategory.APPEAL_RULING].includes(caseFile.category),
  )

  const allFiles =
    user?.role === UserRole.PRISON_SYSTEM_STAFF
      ? appealRulingFiles
      : appealCaseFiles?.concat(appealRulingFiles ?? [])

  return completedCaseStates.includes(workingCase.state) &&
    allFiles &&
    allFiles.length > 0 ? (
    <>
      <Box marginBottom={2}>
        <Text as="h3" variant="h3" marginBottom={3}>
          {formatMessage(strings.title)}
        </Text>
        {allFiles.map((file) => (
          <PdfButton
            key={file.id}
            renderAs="row"
            caseId={workingCase.id}
            title={file.name}
            disabled={!file.key}
            handleClick={() => onOpen(file.id)}
          >
            {file.category && file.category !== CaseFileCategory.APPEAL_RULING && (
              <Box display="flex" flexDirection="column">
                <Text>
                  {`${formatDate(
                    fileDate(file.category) ?? file.created,
                    'dd.MM.y',
                  )} kl. ${formatDate(
                    fileDate(file.category) ?? file.created,
                    constants.TIME_FORMAT,
                  )}`}
                </Text>
                <Text variant="small">
                  {formatMessage(strings.submittedBy, {
                    filesCategory: file.category?.includes('PROSECUTOR'),
                  })}
                </Text>
              </Box>
            )}
          </PdfButton>
        ))}
      </Box>
      {(isProsecutionUser(user) || isDefenceUser(user)) &&
        workingCase.appealState &&
        workingCase.appealState !== CaseAppealState.COMPLETED && (
          <Box display="flex" justifyContent="flexEnd" marginTop={3}>
            <Button
              icon="add"
              onClick={() => {
                router.push(
                  limitedAccess
                    ? `${constants.DEFENDER_APPEAL_FILES_ROUTE}/${workingCase.id}`
                    : `${constants.APPEAL_FILES_ROUTE}/${workingCase.id}`,
                )
              }}
            >
              {formatMessage(strings.addFiles)}
            </Button>
          </Box>
        )}

      <AnimatePresence>
        {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
      </AnimatePresence>
    </>
  ) : null
}

export default AppealCaseFilesOverview
