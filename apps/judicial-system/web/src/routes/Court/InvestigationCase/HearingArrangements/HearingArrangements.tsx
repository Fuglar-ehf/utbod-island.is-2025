import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  BlueBox,
  CaseInfo,
  FormContentContainer,
  FormFooter,
  Modal,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import {
  NotificationType,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  titles,
  icHearingArrangements as m,
} from '@island.is/judicial-system-web/messages'
import {
  AlertMessage,
  RadioButton,
  Box,
  Tooltip,
  Text,
} from '@island.is/island-ui/core'
import DefenderInfo from '@island.is/judicial-system-web/src/components/DefenderInfo/DefenderInfo'
import { setAndSendToServer } from '@island.is/judicial-system-web/src/utils/formHelper'
import { isCourtHearingArrangementsStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import CourtArrangements, {
  useCourtArrangements,
} from '@island.is/judicial-system-web/src/components/CourtArrangements'
import * as constants from '@island.is/judicial-system/consts'

const HearingArrangements = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const {
    autofill,
    updateCase,
    sendNotification,
    isSendingNotification,
  } = useCase()
  const {
    courtDate,
    setCourtDate,
    courtDateHasChanged,
    handleCourtDateChange,
  } = useCourtArrangements(workingCase)

  const [initialAutoFillDone, setInitialAutoFillDone] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    if (isCaseUpToDate && !initialAutoFillDone) {
      if (!workingCase.courtDate) {
        setCourtDate(workingCase.requestedCourtDate)

        setInitialAutoFillDone(true)
      }

      autofill(
        [
          {
            key: 'sessionArrangements',
            value: workingCase.defenderName
              ? SessionArrangements.ALL_PRESENT
              : undefined,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      setInitialAutoFillDone(true)
    }
  }, [
    autofill,
    initialAutoFillDone,
    isCaseUpToDate,
    setCourtDate,
    setWorkingCase,
    workingCase,
  ])

  const handleNextButtonClick = useCallback(() => {
    const hasSentNotification = workingCase?.notifications?.find(
      (notification) => notification.type === NotificationType.COURT_DATE,
    )

    autofill(
      [{ key: 'courtDate', value: courtDate, force: true }],
      workingCase,
      setWorkingCase,
    )

    if (hasSentNotification && !courtDateHasChanged) {
      router.push(`${constants.RULING_ROUTE}/${workingCase.id}`)
    } else {
      setModalVisible(true)
    }
  }, [workingCase, autofill, courtDate, setWorkingCase, courtDateHasChanged])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.HEARING_ARRANGEMENTS}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(
          titles.court.investigationCases.hearingArrangements,
        )}
      />
      {user && (
        <>
          <FormContentContainer>
            {workingCase.requestProsecutorOnlySession &&
              workingCase.prosecutorOnlySessionRequest && (
                <Box marginBottom={workingCase.comments ? 2 : 5}>
                  <AlertMessage
                    type="warning"
                    title={formatMessage(m.requestProsecutorOnlySession)}
                    message={workingCase.prosecutorOnlySessionRequest}
                  />
                </Box>
              )}
            {workingCase.comments && (
              <Box marginBottom={5}>
                <AlertMessage
                  type="warning"
                  title={formatMessage(m.comments.title)}
                  message={workingCase.comments}
                />
              </Box>
            )}
            <Box marginBottom={7}>
              <Text as="h1" variant="h1">
                {formatMessage(m.title)}
              </Text>
            </Box>
            <Box component="section" marginBottom={7}>
              <CaseInfo workingCase={workingCase} userRole={user.role} />
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  {`${formatMessage(m.sections.sessionArrangements.heading)} `}
                  <Text as="span" color="red600" fontWeight="semiBold">
                    *
                  </Text>
                  <Tooltip
                    text={formatMessage(m.sections.sessionArrangements.tooltip)}
                  />
                </Text>
              </Box>
              <BlueBox>
                <Box marginBottom={2}>
                  <RadioButton
                    name="session-arrangements-all-present"
                    id="session-arrangements-all-present"
                    label={formatMessage(
                      m.sections.sessionArrangements.options.allPresent,
                    )}
                    checked={
                      workingCase.sessionArrangements ===
                      SessionArrangements.ALL_PRESENT
                    }
                    onChange={() => {
                      autofill(
                        [
                          {
                            key: 'sessionArrangements',
                            value: SessionArrangements.ALL_PRESENT,
                            force: true,
                          },
                        ],
                        workingCase,
                        setWorkingCase,
                      )
                    }}
                    large
                    backgroundColor="white"
                  />
                </Box>
                <Box marginBottom={2}>
                  <RadioButton
                    name="session-arrangements-all-present_spokesperson"
                    id="session-arrangements-all-present_spokesperson"
                    label={formatMessage(
                      m.sections.sessionArrangements.options
                        .allPresentSpokesperson,
                    )}
                    checked={
                      workingCase.sessionArrangements ===
                      SessionArrangements.ALL_PRESENT_SPOKESPERSON
                    }
                    onChange={() => {
                      autofill(
                        [
                          {
                            key: 'sessionArrangements',
                            value: SessionArrangements.ALL_PRESENT_SPOKESPERSON,
                            force: true,
                          },
                        ],
                        workingCase,
                        setWorkingCase,
                      )
                    }}
                    large
                    backgroundColor="white"
                  />
                </Box>
                <RadioButton
                  name="session-arrangements-prosecutor-present"
                  id="session-arrangements-prosecutor-present"
                  label={formatMessage(
                    m.sections.sessionArrangements.options.prosecutorPresent,
                  )}
                  checked={
                    workingCase.sessionArrangements ===
                    SessionArrangements.PROSECUTOR_PRESENT
                  }
                  onChange={() => {
                    autofill(
                      [
                        {
                          key: 'sessionArrangements',
                          value: SessionArrangements.PROSECUTOR_PRESENT,
                          force: true,
                        },
                      ],
                      workingCase,
                      setWorkingCase,
                    )
                  }}
                  large
                  backgroundColor="white"
                />
              </BlueBox>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  {formatMessage(m.sections.requestedCourtDate.title)}
                </Text>
              </Box>
              <Box marginBottom={2}>
                <CourtArrangements
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                  handleCourtDateChange={handleCourtDateChange}
                  selectedCourtDate={courtDate}
                />
              </Box>
            </Box>
            {(workingCase.sessionArrangements ===
              SessionArrangements.ALL_PRESENT ||
              workingCase.sessionArrangements ===
                SessionArrangements.ALL_PRESENT_SPOKESPERSON) && (
              <Box component="section" marginBottom={8}>
                <DefenderInfo
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                />
              </Box>
            )}
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={`${constants.IC_OVERVIEW_ROUTE}/${workingCase.id}`}
              onNextButtonClick={handleNextButtonClick}
              nextIsDisabled={
                !isCourtHearingArrangementsStepValidIC(workingCase, courtDate)
              }
              nextButtonText={formatMessage(m.continueButton.label)}
            />
          </FormContentContainer>
          {modalVisible && (
            <Modal
              title={formatMessage(m.modal.heading)}
              text={formatMessage(
                workingCase.sessionArrangements ===
                  SessionArrangements.ALL_PRESENT
                  ? m.modal.allPresentText
                  : workingCase.sessionArrangements ===
                    SessionArrangements.ALL_PRESENT_SPOKESPERSON
                  ? m.modal.allPresentSpokespersonText
                  : m.modal.prosecutorPresentText,
                { courtDateHasChanged },
              )}
              handlePrimaryButtonClick={async () => {
                const notificationSent = await sendNotification(
                  workingCase.id,
                  NotificationType.COURT_DATE,
                )

                if (notificationSent) {
                  router.push(`${constants.IC_RULING_ROUTE}/${workingCase.id}`)
                }
              }}
              handleSecondaryButtonClick={() => {
                sendNotification(
                  workingCase.id,
                  NotificationType.COURT_DATE,
                  true,
                )

                router.push(`${constants.IC_RULING_ROUTE}/${workingCase.id}`)
              }}
              primaryButtonText={formatMessage(m.modal.primaryButtonText)}
              secondaryButtonText={formatMessage(m.modal.secondaryButtonText)}
              isPrimaryButtonLoading={isSendingNotification}
            />
          )}
        </>
      )}
    </PageLayout>
  )
}

export default HearingArrangements
