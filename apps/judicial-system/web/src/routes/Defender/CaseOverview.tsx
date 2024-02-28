import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  capitalize,
  formatCaseType,
} from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  AlertBanner,
  AppealCaseFilesOverview,
  CaseDates,
  CaseResentExplanation,
  CaseTitleInfoAndTags,
  Conclusion,
  conclusion,
  FormContentContainer,
  FormContext,
  InfoCard,
  MarkdownWrapper,
  Modal,
  PageHeader,
  PageLayout,
  PdfButton,
  SignedDocument,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealDecision,
  CaseState,
  RequestSharedWithDefender,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { api } from '@island.is/judicial-system-web/src/services'
import { useAppealAlertBanner } from '@island.is/judicial-system-web/src/utils/hooks'
import { sortByIcelandicAlphabet } from '@island.is/judicial-system-web/src/utils/sortHelper'

import { NameAndEmail } from '../../components/InfoCard/InfoCard'
import { strings } from './CaseOverview.strings'
import * as styles from './CaseOverview.css'

type availableModals =
  | 'NoModal'
  | 'ConfirmAppealAfterDeadline'
  | 'ConfirmStatementAfterDeadline'

export const CaseOverview: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { formatMessage } = useIntl()
  const { title, description, child, isLoadingAppealBanner } =
    useAppealAlertBanner(
      workingCase,
      () => setModalVisible('ConfirmAppealAfterDeadline'),
      () => setModalVisible('ConfirmStatementAfterDeadline'),
    )
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState<availableModals>('NoModal')

  const shouldDisplayAlertBanner =
    isCompletedCase(workingCase.state) &&
    (workingCase.accusedAppealDecision === CaseAppealDecision.POSTPONE ||
      workingCase.hasBeenAppealed)

  return (
    <>
      {!isLoadingAppealBanner && shouldDisplayAlertBanner && (
        <AlertBanner variant="warning" title={title} description={description}>
          {child}
        </AlertBanner>
      )}
      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
      >
        <PageHeader title={formatMessage(titles.defender.caseOverview)} />
        <FormContentContainer>
          {!isCompletedCase(workingCase.state) &&
            workingCase.caseResentExplanation && (
              <Box marginBottom={5}>
                <CaseResentExplanation
                  explanation={workingCase.caseResentExplanation}
                />
              </Box>
            )}
          <Box marginBottom={5}>
            <CaseTitleInfoAndTags />
            {isCompletedCase(workingCase.state) &&
              isRestrictionCase(workingCase.type) &&
              workingCase.state === CaseState.ACCEPTED && (
                <CaseDates workingCase={workingCase} />
              )}
          </Box>
          {isCompletedCase(workingCase.state) &&
            workingCase.caseModifiedExplanation && (
              <Box marginBottom={5}>
                <AlertMessage
                  type="info"
                  title={formatMessage(strings.modifiedDatesHeading, {
                    caseType: workingCase.type,
                  })}
                  message={
                    <MarkdownWrapper
                      markdown={workingCase.caseModifiedExplanation}
                      textProps={{ variant: 'small' }}
                    />
                  }
                />
              </Box>
            )}
          {workingCase.appealRulingModifiedHistory && (
            <Box marginBottom={5}>
              <AlertMessage
                type="info"
                title={formatMessage(strings.rulingModifiedTitle)}
                message={
                  <MarkdownWrapper
                    markdown={workingCase.appealRulingModifiedHistory}
                    textProps={{ variant: 'small' }}
                  />
                }
              />
            </Box>
          )}
          <Box marginBottom={6}>
            <InfoCard
              data={[
                {
                  title: formatMessage(core.policeCaseNumber),
                  value: workingCase.policeCaseNumbers?.map((n) => (
                    <Text key={n}>{n}</Text>
                  )),
                },
                {
                  title: formatMessage(core.courtCaseNumber),
                  value:
                    workingCase.courtCaseNumber ??
                    formatMessage(strings.noCourtNumber),
                },
                {
                  title: formatMessage(core.prosecutor),
                  value: `${workingCase.prosecutorsOffice?.name}`,
                },
                {
                  title: formatMessage(core.court),
                  value: workingCase.court?.name,
                },
                {
                  title: formatMessage(core.prosecutorPerson),
                  value: NameAndEmail(
                    workingCase.prosecutor?.name,
                    workingCase.prosecutor?.email,
                  ),
                },
                ...(workingCase.judge
                  ? [
                      {
                        title: formatMessage(core.judge),
                        value: NameAndEmail(
                          workingCase.judge?.name,
                          workingCase.judge?.email,
                        ),
                      },
                    ]
                  : []),
                // Conditionally add this field based on case type
                ...(isInvestigationCase(workingCase.type)
                  ? [
                      {
                        title: formatMessage(core.caseType),
                        value: capitalize(formatCaseType(workingCase.type)),
                      },
                    ]
                  : []),
                ...(workingCase.registrar
                  ? [
                      {
                        title: formatMessage(core.registrar),
                        value: NameAndEmail(
                          workingCase.registrar?.name,
                          workingCase.registrar?.email,
                        ),
                      },
                    ]
                  : []),
              ]}
              defendants={
                workingCase.defendants
                  ? {
                      title: capitalize(
                        formatMessage(core.defendant, {
                          suffix:
                            workingCase.defendants.length > 1 ? 'ar' : 'i',
                        }),
                      ),
                      items: workingCase.defendants,
                    }
                  : undefined
              }
              defenders={[
                {
                  name: workingCase.defenderName ?? '',
                  defenderNationalId: workingCase.defenderNationalId,
                  sessionArrangement: workingCase.sessionArrangements,
                  email: workingCase.defenderEmail,
                  phoneNumber: workingCase.defenderPhoneNumber,
                },
              ]}
              courtOfAppealData={
                workingCase.appealCaseNumber
                  ? [
                      {
                        title: formatMessage(core.appealCaseNumberHeading),
                        value: workingCase.appealCaseNumber,
                      },
                      ...(workingCase.appealAssistant
                        ? [
                            {
                              title: formatMessage(core.appealAssistantHeading),
                              value: workingCase.appealAssistant.name,
                            },
                          ]
                        : []),
                      ...(workingCase.appealJudge1 &&
                      workingCase.appealJudge2 &&
                      workingCase.appealJudge3
                        ? [
                            {
                              title: formatMessage(core.appealJudgesHeading),
                              value: (
                                <>
                                  {sortByIcelandicAlphabet([
                                    workingCase.appealJudge1.name || '',
                                    workingCase.appealJudge2.name || '',
                                    workingCase.appealJudge3.name || '',
                                  ]).map((judge, index) => (
                                    <Text key={`${judge}_${index}`}>
                                      {judge}
                                    </Text>
                                  ))}
                                </>
                              ),
                            },
                          ]
                        : []),
                    ]
                  : undefined
              }
            />
          </Box>
          {isCompletedCase(workingCase.state) && (
            <Box marginBottom={6}>
              <Conclusion
                title={formatMessage(conclusion.title)}
                conclusionText={workingCase.conclusion}
                judgeName={workingCase.judge?.name}
              />
            </Box>
          )}
          {workingCase.appealConclusion && (
            <Box marginBottom={6}>
              <Conclusion
                title={formatMessage(conclusion.appealTitle)}
                conclusionText={workingCase.appealConclusion}
              />
            </Box>
          )}
          <AppealCaseFilesOverview />

          {(workingCase.requestSharedWithDefender ===
            RequestSharedWithDefender.READY_FOR_COURT ||
            workingCase.requestSharedWithDefender ===
              RequestSharedWithDefender.COURT_DATE ||
            isCompletedCase(workingCase.state)) && (
            <Box marginBottom={10}>
              <Text as="h3" variant="h3" marginBottom={1}>
                {formatMessage(strings.documentHeading)}
              </Text>
              <Box>
                <PdfButton
                  renderAs="row"
                  caseId={workingCase.id}
                  title={formatMessage(core.pdfButtonRequest)}
                  pdfType={'request'}
                />
                {isCompletedCase(workingCase.state) && (
                  <>
                    <PdfButton
                      renderAs="row"
                      caseId={workingCase.id}
                      title={formatMessage(core.pdfButtonRulingShortVersion)}
                      pdfType={'courtRecord'}
                    >
                      {workingCase.courtRecordSignatory ? (
                        <SignedDocument
                          signatory={workingCase.courtRecordSignatory.name}
                          signingDate={workingCase.courtRecordSignatureDate}
                        />
                      ) : null}
                    </PdfButton>
                    <PdfButton
                      renderAs="row"
                      caseId={workingCase.id}
                      title={formatMessage(core.pdfButtonRuling)}
                      pdfType={'ruling'}
                    >
                      {workingCase.rulingSignatureDate ? (
                        <SignedDocument
                          signatory={workingCase.judge?.name}
                          signingDate={workingCase.rulingSignatureDate}
                        />
                      ) : (
                        <Text>{formatMessage(strings.unsignedRuling)}</Text>
                      )}
                    </PdfButton>
                    <Box marginTop={7}>
                      <a
                        href={`${api.apiUrl}/api/case/${workingCase.id}/limitedAccess/allFiles`}
                        download={`mal_${workingCase.courtCaseNumber}`}
                        className={styles.downloadAllButton}
                      >
                        <Button
                          variant="ghost"
                          size="small"
                          icon="download"
                          iconType="outline"
                        >
                          {formatMessage(strings.getAllDocuments)}
                        </Button>
                      </a>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          )}
        </FormContentContainer>
        {modalVisible === 'ConfirmAppealAfterDeadline' && (
          <Modal
            title={formatMessage(strings.confirmAppealAfterDeadlineModalTitle)}
            text={formatMessage(strings.confirmAppealAfterDeadlineModalText)}
            primaryButtonText={formatMessage(
              strings.confirmAppealAfterDeadlineModalPrimaryButtonText,
            )}
            secondaryButtonText={formatMessage(
              strings.confirmAppealAfterDeadlineModalSecondaryButtonText,
            )}
            onPrimaryButtonClick={() => {
              router.push(`${constants.APPEAL_ROUTE}/${workingCase.id}`)
            }}
            onSecondaryButtonClick={() => {
              setModalVisible('NoModal')
            }}
          />
        )}
        {modalVisible === 'ConfirmStatementAfterDeadline' && (
          <Modal
            title={formatMessage(
              strings.confirmStatementAfterDeadlineModalTitle,
            )}
            text={formatMessage(strings.confirmStatementAfterDeadlineModalText)}
            primaryButtonText={formatMessage(
              strings.confirmStatementAfterDeadlineModalPrimaryButtonText,
            )}
            secondaryButtonText={formatMessage(
              strings.confirmStatementAfterDeadlineModalSecondaryButtonText,
            )}
            onPrimaryButtonClick={() => {
              router.push(
                `${constants.DEFENDER_STATEMENT_ROUTE}/${workingCase.id}`,
              )
            }}
            onSecondaryButtonClick={() => {
              setModalVisible('NoModal')
            }}
          />
        )}
      </PageLayout>
    </>
  )
}

export default CaseOverview
