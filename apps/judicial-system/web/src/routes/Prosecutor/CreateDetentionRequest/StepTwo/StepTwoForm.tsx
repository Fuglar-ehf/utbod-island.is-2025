import React, { useState } from 'react'
import { Case, Institution } from '@island.is/judicial-system/types'
import { Box, Select, Text, Tooltip } from '@island.is/island-ui/core'
import {
  newSetAndSendDateToServer,
  setAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { ValueType } from 'react-select'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import {
  DateTime,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { Option } from '@island.is/island-ui/core'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  prosecutors: ReactSelectOption[]
  courts: Institution[]
  handleNextButtonClick: () => Promise<void>
  transitionLoading: boolean
}

const StepTwoForm: React.FC<Props> = (props) => {
  const {
    workingCase,
    setWorkingCase,
    prosecutors,
    courts,
    handleNextButtonClick,
    transitionLoading,
  } = props
  const [arrestDateIsValid, setArrestDateIsValid] = useState(true)
  const [requestedCourtDateIsValid, setRequestedCourtDateIsValid] = useState(
    workingCase.requestedCourtDate !== null,
  )

  const { updateCase } = useCase()

  const selectCourts = courts.map((court) => ({
    label: court.name,
    value: court.id,
  }))

  const defaultProsecutor = prosecutors.find(
    (prosecutor: Option) => prosecutor.value === workingCase.prosecutor?.id,
  )

  const defaultCourt = selectCourts.find(
    (court) => court.label === workingCase.court?.name,
  )

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Óskir um fyrirtöku
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Ákærandi{' '}
              <Box component="span" data-testid="prosecutor-tooltip">
                <Tooltip text="Sá saksóknari sem valinn er hér er skráður fyrir kröfunni í öllum upplýsingaskeytum og skjölum sem tengjast kröfunni, og flytur málið fyrir dómstólum fyrir hönd síns embættis." />
              </Box>
            </Text>
          </Box>
          <Select
            name="prosecutor"
            label="Veldu saksóknara"
            defaultValue={defaultProsecutor}
            options={prosecutors}
            onChange={(selectedOption: ValueType<ReactSelectOption>) =>
              setAndSendToServer(
                'prosecutorId',
                (selectedOption as ReactSelectOption).value.toString(),
                workingCase,
                setWorkingCase,
                updateCase,
              )
            }
            required
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Dómstóll
            </Text>
          </Box>
          <Select
            name="court"
            label="Veldu dómstól"
            defaultValue={defaultCourt}
            options={selectCourts}
            onChange={(selectedOption: ValueType<ReactSelectOption>) =>
              setAndSendToServer(
                'courtId',
                (selectedOption as ReactSelectOption).value as string,
                workingCase,
                setWorkingCase,
                updateCase,
              )
            }
          />
        </Box>
        {!workingCase.parentCase && (
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                Tími handtöku
              </Text>
            </Box>
            <DateTime
              name="arrestDate"
              maxDate={new Date()}
              selectedDate={
                workingCase.arrestDate
                  ? new Date(workingCase.arrestDate)
                  : undefined
              }
              onChange={(date: Date | undefined, valid: boolean) => {
                newSetAndSendDateToServer(
                  'arrestDate',
                  date,
                  valid,
                  workingCase,
                  setWorkingCase,
                  setArrestDateIsValid,
                  updateCase,
                )
              }}
            />
          </Box>
        )}
        <Box component="section" marginBottom={10}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Ósk um fyrirtökudag og tíma{' '}
              <Box data-testid="requested-court-date-tooltip" component="span">
                <Tooltip text="Dómstóll hefur þennan tíma til hliðsjónar þegar fyrirtökutíma er úthlutað og mun leitast við að taka málið fyrir í tæka tíð en ekki fyrir þennan tíma." />
              </Box>
            </Text>
          </Box>
          <DateTime
            name="reqCourtDate"
            selectedDate={
              workingCase.requestedCourtDate
                ? new Date(workingCase.requestedCourtDate)
                : undefined
            }
            onChange={(date: Date | undefined, valid: boolean) =>
              newSetAndSendDateToServer(
                'requestedCourtDate',
                date,
                valid,
                workingCase,
                setWorkingCase,
                setRequestedCourtDateIsValid,
                updateCase,
              )
            }
            timeLabel="Ósk um tíma (kk:mm)"
            locked={workingCase.courtDate !== null}
            minDate={new Date()}
            required
          />
          {workingCase.courtDate && (
            <Box marginTop={1}>
              <Text variant="eyebrow">
                Fyrirtökudegi og tíma hefur verið úthlutað
              </Text>
            </Box>
          )}
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.STEP_ONE_ROUTE}/${workingCase.id}`}
          onNextButtonClick={async () => await handleNextButtonClick()}
          nextIsDisabled={
            transitionLoading ||
            !arrestDateIsValid ||
            !requestedCourtDateIsValid
          }
          nextIsLoading={transitionLoading}
        />
      </FormContentContainer>
    </>
  )
}

export default StepTwoForm
