import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import {
  capitalize,
  caseTypes,
  formatDate,
} from '@island.is/judicial-system/formatters'
import {
  CaseState,
  completedCaseStates,
  Feature,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import {
  CaseDates,
  FormContentContainer,
  FormContext,
  InfoCard,
  MarkdownWrapper,
  PageLayout,
  RestrictionTags,
  PageHeader,
  Modal,
  Conclusion,
  AppealCaseFilesOverview,
  CaseResentExplanation,
  FeatureContext,
  AppealConclusion,
  AlertBanner,
  OverviewHeader,
  PdfButton,
  SignedDocument,
} from '@island.is/judicial-system-web/src/components'
import { core, titles } from '@island.is/judicial-system-web/messages'
import { useAppealAlertBanner } from '@island.is/judicial-system-web/src/utils/hooks'
import { CaseAppealDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import * as constants from '@island.is/judicial-system/consts'

import { strings } from './CaseOverview.strings'

type availableModals =
  | 'NoModal'
  | 'ConfirmAppealAfterDeadline'
  | 'ConfirmStatementAfterDeadline'

export const CaseOverview: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { formatMessage } = useIntl()
  const { features } = useContext(FeatureContext)
  const { title, description, child } = useAppealAlertBanner(
    workingCase,
    () => setModalVisible('ConfirmAppealAfterDeadline'),
    () => setModalVisible('ConfirmStatementAfterDeadline'),
  )
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState<availableModals>('NoModal')

  const shouldDisplayAlertBanner =
    completedCaseStates.includes(workingCase.state) &&
    (workingCase.accusedAppealDecision === CaseAppealDecision.POSTPONE ||
      workingCase.hasBeenAppealed)

  return (
    <>
      {features.includes(Feature.APPEAL_TO_COURT_OF_APPEALS) &&
        shouldDisplayAlertBanner && (
          <AlertBanner
            variant="warning"
            title={title}
            description={description}
          >
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
          {!completedCaseStates.includes(workingCase.state) &&
            workingCase.caseResentExplanation && (
              <Box marginBottom={5}>
                <CaseResentExplanation
                  explanation={workingCase.caseResentExplanation}
                />
              </Box>
            )}
          <Box marginBottom={5}>
            <Box display="flex" justifyContent="spaceBetween" marginBottom={3}>
              <Box>
                <OverviewHeader dataTestid="caseTitle" />
                {completedCaseStates.includes(workingCase.state) && (
                  <Box>
                    <Text variant="h5">
                      {formatMessage(strings.rulingDate, {
                        rulingDate: `${formatDate(
                          workingCase.rulingDate,
                          'PPP',
                        )} kl. ${formatDate(
                          workingCase.rulingDate,
                          constants.TIME_FORMAT,
                        )}`,
                      })}
                    </Text>
                  </Box>
                )}
              </Box>
              {completedCaseStates.includes(workingCase.state) && (
                <Box display="flex" flexDirection="column">
                  <RestrictionTags workingCase={workingCase} />
                </Box>
              )}
            </Box>
            {completedCaseStates.includes(workingCase.state) &&
              isRestrictionCase(workingCase.type) &&
              workingCase.state === CaseState.ACCEPTED && (
                <CaseDates workingCase={workingCase} />
              )}
          </Box>
          {completedCaseStates.includes(workingCase.state) &&
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
          <Box marginBottom={6}>
            <InfoCard
              data={[
                {
                  title: formatMessage(core.policeCaseNumber),
                  value: workingCase.policeCaseNumbers.map((n) => (
                    <Text key={n}>{n}</Text>
                  )),
                },
                {
                  title: formatMessage(core.courtCaseNumber),
                  value: workingCase.courtCaseNumber,
                },
                {
                  title: formatMessage(core.prosecutor),
                  value: `${workingCase.creatingProsecutor?.institution?.name}`,
                },
                {
                  title: formatMessage(core.court),
                  value: workingCase.court?.name,
                },
                {
                  title: formatMessage(core.prosecutorPerson),
                  value: workingCase.prosecutor?.name,
                },
                {
                  title: formatMessage(core.judge),
                  value: workingCase.judge?.name,
                },
                // Conditionally add this field based on case type
                ...(isInvestigationCase(workingCase.type)
                  ? [
                      {
                        title: formatMessage(core.caseType),
                        value: capitalize(caseTypes[workingCase.type]),
                      },
                    ]
                  : []),
                ...(workingCase.registrar
                  ? [
                      {
                        title: formatMessage(core.registrar),
                        value: workingCase.registrar?.name,
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
                      {
                        title: formatMessage(core.appealAssistantHeading),
                        value: workingCase.appealAssistant?.name,
                      },
                      {
                        title: formatMessage(core.appealJudgesHeading),
                        value: (
                          <>
                            <Text>{workingCase.appealJudge1?.name}</Text>
                            <Text>{workingCase.appealJudge2?.name}</Text>
                            <Text>{workingCase.appealJudge3?.name}</Text>
                          </>
                        ),
                      },
                    ]
                  : undefined
              }
            />
          </Box>
          {completedCaseStates.includes(workingCase.state) && (
            <Box marginBottom={6}>
              <Conclusion
                conclusionText={workingCase.conclusion}
                judgeName={workingCase.judge?.name}
              />
            </Box>
          )}
          {workingCase.appealConclusion && (
            <Box marginBottom={6}>
              <AppealConclusion
                conclusionText={workingCase.appealConclusion}
                judgeName={workingCase.appealJudge1?.name}
              />
            </Box>
          )}

          <AppealCaseFilesOverview />

          {(workingCase.sendRequestToDefender ||
            completedCaseStates.includes(workingCase.state)) && (
            <Box marginBottom={10}>
              <Text as="h3" variant="h3" marginBottom={3}>
                {formatMessage(strings.documentHeading)}
              </Text>
              <Box>
                {(workingCase.sendRequestToDefender ||
                  completedCaseStates.includes(workingCase.state)) && (
                  <PdfButton
                    renderAs="row"
                    caseId={workingCase.id}
                    title={formatMessage(core.pdfButtonRequest)}
                    pdfType={'limitedAccess/request'}
                  />
                )}
                {completedCaseStates.includes(workingCase.state) && (
                  <>
                    <PdfButton
                      renderAs="row"
                      caseId={workingCase.id}
                      title={formatMessage(core.pdfButtonRulingShortVersion)}
                      pdfType={'limitedAccess/courtRecord'}
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
                      pdfType={'limitedAccess/ruling'}
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
              router.push(`${constants.APPEAL_ROUTE}/${workingCase.id}`)
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
