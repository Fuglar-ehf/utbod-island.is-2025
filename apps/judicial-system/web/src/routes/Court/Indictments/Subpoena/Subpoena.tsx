import { FC, useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Box, Button } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  CourtArrangements,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
  SectionHeading,
  useCourtArrangements,
} from '@island.is/judicial-system-web/src/components'
import { SubpoenaType } from '@island.is/judicial-system-web/src/routes/Court/components'
import type { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import { useDefendants } from '@island.is/judicial-system-web/src/utils/hooks'
import { isSubpoenaStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import { subpoena as strings } from './Subpoena.strings'

const Subpoena: FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [navigateTo, setNavigateTo] = useState<keyof stepValidationsType>()
  const [newSubpoenas, setNewSubpoenas] = useState<string[]>([])
  const { updateDefendantState, updateDefendant } = useDefendants()
  const { formatMessage } = useIntl()
  const {
    courtDate,
    handleCourtDateChange,
    handleCourtRoomChange,
    sendCourtDateToServer,
  } = useCourtArrangements(workingCase, setWorkingCase, 'arraignmentDate')

  const isArraignmentScheduled = Boolean(workingCase.arraignmentDate)
  const isSchedulingArraignmentDate =
    !isArraignmentScheduled || newSubpoenas.length > 0

  const isSchedulingArraignmentDateForDefendant = (defendantId: string) =>
    !isArraignmentScheduled ||
    (isArraignmentScheduled && newSubpoenas.includes(defendantId))

  const handleNavigationTo = useCallback(
    async (destination: keyof stepValidationsType) => {
      if (!isSchedulingArraignmentDate) {
        router.push(`${destination}/${workingCase.id}`)
        return
      }

      const promises: Promise<boolean>[] = []

      if (workingCase.defendants) {
        workingCase.defendants.forEach((defendant) => {
          promises.push(
            updateDefendant({
              caseId: workingCase.id,
              defendantId: defendant.id,
              subpoenaType: defendant.subpoenaType,
            }),
          )
        })
      }

      // Make sure defendants are updated before submitting the court date
      const allDefendantsUpdated = await Promise.all(promises)

      if (!allDefendantsUpdated.every((result) => result)) {
        return
      }

      const courtDateUpdated = await sendCourtDateToServer()

      if (!courtDateUpdated) {
        return
      }

      router.push(`${destination}/${workingCase.id}`)
    },
    [
      isSchedulingArraignmentDate,
      sendCourtDateToServer,
      workingCase.defendants,
      workingCase.id,
      updateDefendant,
    ],
  )

  const stepIsValid = isSubpoenaStepValid(workingCase, courtDate)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.subpoena)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        {workingCase.defendants && (
          <Box component="section" marginBottom={5}>
            {
              <SubpoenaType
                subpoenaItems={workingCase.defendants.map((defendant) => ({
                  defendant,
                  disabled:
                    isArraignmentScheduled &&
                    !newSubpoenas.includes(defendant.id),
                  children: isArraignmentScheduled && (
                    <Button
                      variant="text"
                      icon="reload"
                      disabled={newSubpoenas.includes(defendant.id)}
                      onClick={() =>
                        setNewSubpoenas((previous) => [
                          ...previous,
                          defendant.id,
                        ])
                      }
                    >
                      {formatMessage(strings.newSubpoenaButtonText)}
                    </Button>
                  ),
                }))}
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
                updateDefendantState={updateDefendantState}
              />
            }
          </Box>
        )}
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.courtArrangementsHeading)}
          />
          <CourtArrangements
            handleCourtDateChange={handleCourtDateChange}
            handleCourtRoomChange={handleCourtRoomChange}
            courtDate={workingCase.arraignmentDate}
            dateTimeDisabled={!isSchedulingArraignmentDate}
            courtRoomDisabled={!isSchedulingArraignmentDate}
            courtRoomRequired
          />
        </Box>
        <Box component="section" marginBottom={10}>
          {workingCase.defendants?.map((defendant, index) => (
            <Box
              key={defendant.id}
              marginBottom={
                index + 1 === workingCase.defendants?.length ? 0 : 2
              }
            >
              <PdfButton
                caseId={workingCase.id}
                title={`Fyrirkall - ${defendant.name} - PDF`}
                pdfType="subpoena"
                disabled={
                  isSchedulingArraignmentDateForDefendant(defendant.id) &&
                  (!courtDate?.date ||
                    !courtDate?.location ||
                    !defendant.subpoenaType)
                }
                elementId={defendant.id}
                queryParameters={
                  isSchedulingArraignmentDateForDefendant(defendant.id)
                    ? `arraignmentDate=${courtDate?.date}&location=${courtDate?.location}&subpoenaType=${defendant.subpoenaType}`
                    : undefined
                }
              />
            </Box>
          ))}
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase}
          onNextButtonClick={() => {
            if (!isSchedulingArraignmentDate) {
              router.push(
                `${constants.INDICTMENTS_DEFENDER_ROUTE}/${workingCase.id}`,
              )
            } else setNavigateTo(constants.INDICTMENTS_DEFENDER_ROUTE)
          }}
          nextButtonText={
            !isSchedulingArraignmentDate
              ? undefined
              : formatMessage(strings.nextButtonText)
          }
          nextIsDisabled={!stepIsValid}
        />
      </FormContentContainer>
      {navigateTo !== undefined && (
        <Modal
          title={formatMessage(strings.modalTitle)}
          text={formatMessage(strings.modalText)}
          onPrimaryButtonClick={() => {
            handleNavigationTo(constants.INDICTMENTS_DEFENDER_ROUTE)
          }}
          onSecondaryButtonClick={() => {
            setNavigateTo(undefined)
          }}
          primaryButtonText={formatMessage(strings.modalPrimaryButtonText)}
          secondaryButtonText={formatMessage(strings.modalSecondaryButtonText)}
          isPrimaryButtonLoading={false}
        />
      )}
    </PageLayout>
  )
}

export default Subpoena
