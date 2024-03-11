import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'

import { Box, RadioButton, Text, toast } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { core, errors, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  IndictmentsLawsBrokenAccordionItem,
  InfoCardActiveIndictment,
  Modal,
  PageHeader,
  PageLayout,
  ProsecutorCaseInfo,
  SectionHeading,
  useIndictmentsLawsBroken,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { overview as strings } from './Overview.strings'
import * as styles from './Overview.css'

const Overview: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { user } = useContext(UserContext)
  const [modal, setModal] = useState<
    'noModal' | 'caseSubmitModal' | 'caseSentForConfirmationModal'
  >('noModal')
  const [indictmentConfirmationDecision, setIndictmentConfirmationDecision] =
    useState<'confirm' | 'deny'>()
  const router = useRouter()
  const { formatMessage } = useIntl()
  const { transitionCase, isTransitioningCase } = useCase()
  const lawsBroken = useIndictmentsLawsBroken(workingCase)

  const isNewIndictment =
    workingCase.state === CaseState.NEW || workingCase.state === CaseState.DRAFT

  const caseHasBeenReceivedByCourt = workingCase.state === CaseState.RECEIVED
  const userCanSendCaseToCourt =
    user?.canConfirmAppeal &&
    workingCase.state === CaseState.WAITING_FOR_CONFIRMATION

  const handleTransition = async (transitionType: CaseTransition) => {
    const caseTransitioned = await transitionCase(
      workingCase.id,
      transitionType,
      setWorkingCase,
    )

    if (!caseTransitioned) {
      toast.error(formatMessage(errors.transitionCase))
      return false
    }

    return true
  }

  const handleNextButtonClick = async () => {
    let transitionType
    let modalType: typeof modal = 'noModal'

    if (userCanSendCaseToCourt) {
      modalType = 'caseSubmitModal'
    } else if (isNewIndictment) {
      transitionType = CaseTransition.ASK_FOR_CONFIRMATION
      modalType = 'caseSentForConfirmationModal'
    } else if (workingCase.state === CaseState.WAITING_FOR_CONFIRMATION) {
      modalType = 'caseSentForConfirmationModal'
    }

    if (transitionType) {
      const transitionSuccess = await handleTransition(transitionType)

      if (!transitionSuccess) {
        return
      }
    }

    if (modalType !== 'noModal') {
      setModal(modalType)
    }
  }

  const handleConfirmIndictment = async () => {
    const transitionSuccess = await handleTransition(CaseTransition.SUBMIT)

    if (!transitionSuccess) {
      return
    }

    router.push(constants.CASES_ROUTE)
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.overview)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <InfoCardActiveIndictment />
        </Box>
        {lawsBroken.size > 0 && (
          <Box marginBottom={5}>
            <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
          </Box>
        )}
        <Box marginBottom={userCanSendCaseToCourt ? 5 : 10}>
          <IndictmentCaseFilesList workingCase={workingCase} />
        </Box>
        {userCanSendCaseToCourt && (
          <Box marginBottom={10}>
            <SectionHeading
              title={formatMessage(strings.indictmentConfirmationTitle)}
              required
            />
            <BlueBox>
              <div className={styles.gridRowEqual}>
                <RadioButton
                  large
                  name="appealConfirmationDecision"
                  id="confirmAppeal"
                  backgroundColor="white"
                  label={formatMessage(strings.confirmIndictment)}
                  checked={indictmentConfirmationDecision === 'confirm'}
                  onChange={() => setIndictmentConfirmationDecision('confirm')}
                />
                <RadioButton
                  large
                  name="appealConfirmationDecision"
                  id="denyAppeal"
                  backgroundColor="white"
                  label={formatMessage(strings.denyIndictment)}
                  checked={indictmentConfirmationDecision === 'deny'}
                  onChange={() => setIndictmentConfirmationDecision('deny')}
                />
              </div>
            </BlueBox>
          </Box>
        )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={
            caseHasBeenReceivedByCourt
              ? constants.CASES_ROUTE
              : `${constants.INDICTMENTS_CASE_FILES_ROUTE}/${workingCase.id}`
          }
          nextButtonText={
            user?.canConfirmAppeal &&
            workingCase.state === CaseState.WAITING_FOR_CONFIRMATION
              ? undefined
              : formatMessage(strings.nextButtonText, {
                  isNewIndictment,
                })
          }
          hideNextButton={caseHasBeenReceivedByCourt}
          infoBoxText={
            caseHasBeenReceivedByCourt
              ? formatMessage(strings.caseSendToCourt)
              : undefined
          }
          onNextButtonClick={handleNextButtonClick}
          nextIsDisabled={
            userCanSendCaseToCourt &&
            workingCase.state === CaseState.WAITING_FOR_CONFIRMATION &&
            !indictmentConfirmationDecision
          }
        />
      </FormContentContainer>
      <AnimatePresence>
        {modal === 'caseSubmitModal' ? (
          <Modal
            title={formatMessage(strings.caseSubmitModalTitle)}
            text={formatMessage(strings.caseSubmitModalText)}
            onClose={() => setModal('noModal')}
            secondaryButtonText={formatMessage(
              strings.caseSubmitSecondaryButtonText,
            )}
            onSecondaryButtonClick={() => setModal('noModal')}
            onPrimaryButtonClick={handleConfirmIndictment}
            primaryButtonText={formatMessage(
              strings.caseSubmitPrimaryButtonText,
            )}
            isPrimaryButtonLoading={isTransitioningCase}
          />
        ) : modal === 'caseSentForConfirmationModal' ? (
          <Modal
            title={formatMessage(strings.caseSentForConfirmationTitle)}
            text={formatMessage(strings.caseSentForConfirmationText)}
            onClose={() => router.push(constants.CASES_ROUTE)}
            onPrimaryButtonClick={() => {
              router.push(constants.CASES_ROUTE)
            }}
            primaryButtonText={formatMessage(core.closeModal)}
          />
        ) : null}
      </AnimatePresence>
    </PageLayout>
  )
}

export default Overview
