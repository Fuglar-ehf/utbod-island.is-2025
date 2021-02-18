import {
  AlertMessage,
  Box,
  DatePicker,
  GridColumn,
  GridRow,
  Input,
  Select,
  Text,
  Option,
  Tooltip,
} from '@island.is/island-ui/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  FormFooter,
  PageLayout,
  Modal,
  TimeInputField,
  CaseNumbers,
} from '@island.is/judicial-system-web/src/shared-components'
import { isNextDisabled } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { Validation } from '@island.is/judicial-system-web/src/utils/validate'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { formatDate } from '@island.is/judicial-system/formatters'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import { useHistory, useParams } from 'react-router-dom'
import {
  Case,
  CaseState,
  NotificationType,
  UpdateCase,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  SendNotificationMutation,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import parseISO from 'date-fns/parseISO'
import {
  JudgeSubsections,
  ReactSelectOption,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  setAndSendDateToServer,
  validateAndSendTimeToServer,
  validateAndSendToServer,
  removeTabsValidateAndSet,
  validateAndSetTime,
  setAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { ValueType } from 'react-select/src/types'

interface CaseData {
  case?: Case
}

interface UserData {
  users: User[]
}

export const HearingArrangements: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)
  const [courtDateErrorMessage, setCourtDateErrorMessage] = useState('')
  const [courtTimeErrorMessage, setCourtTimeErrorMessage] = useState('')
  const [courtroomErrorMessage, setCourtroomErrorMessage] = useState('')
  const [defenderEmailErrorMessage, setDefenderEmailErrorMessage] = useState('')

  const courtTimeRef = useRef<HTMLInputElement>(null)

  const { id } = useParams<{ id: string }>()
  const history = useHistory()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const { data: userData, loading: userLoading } = useQuery<UserData>(
    UsersQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)

  const updateCase = useCallback(
    async (id: string, updateCase: UpdateCase) => {
      const { data } = await updateCaseMutation({
        variables: { input: { id, ...updateCase } },
      })
      const resCase = data?.updateCase
      if (resCase) {
        // Do something with the result. In particular, we want th modified timestamp passed between
        // the client and the backend so that we can handle multiple simultanious updates.
      }
      return resCase
    },
    [updateCaseMutation],
  )

  const [
    sendNotificationMutation,
    { loading: isSendingNotification },
  ] = useMutation(SendNotificationMutation)

  const sendNotification = async (id: string) => {
    const { data } = await sendNotificationMutation({
      variables: {
        input: {
          caseId: id,
          type: NotificationType.COURT_DATE,
        },
      },
    })

    return data?.sendNotification?.notificationSent
  }

  const judges = (userData?.users || [])
    .filter((user: User) => user.role === UserRole.JUDGE)
    .map((judge: User) => {
      return { label: judge.name, value: judge.id }
    })

  const registrars = (userData?.users || [])
    .filter((user: User) => user.role === UserRole.REGISTRAR)
    .map((registrar: User) => {
      return { label: registrar.name, value: registrar.id }
    })

  const defaultJudge = judges?.find(
    (judge: Option) => judge.value === workingCase?.judge?.id,
  )

  const defaultRegistrar = registrars?.find(
    (registrar: Option) => registrar.value === workingCase?.registrar?.id,
  )

  useEffect(() => {
    document.title = 'Fyrirtaka - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      let theCase = data.case

      if (!theCase.courtDate && theCase.requestedCourtDate) {
        updateCase(
          theCase.id,
          parseString('courtDate', theCase.requestedCourtDate),
        )

        theCase = { ...theCase, courtDate: theCase.requestedCourtDate }
      }

      setWorkingCase(theCase)
    }
  }, [setWorkingCase, workingCase, updateCase, data])

  useEffect(() => {
    const requiredFields: { value: string; validations: Validation[] }[] = [
      {
        value: workingCase?.courtDate || '',
        validations: ['empty'],
      },
      {
        value: courtTimeRef.current?.value || '',
        validations: ['empty', 'time-format'],
      },
      {
        value: workingCase?.courtRoom || '',
        validations: ['empty'],
      },
      {
        value: workingCase?.defenderEmail || '',
        validations: ['email-format'],
      },
    ]

    if (workingCase) {
      setIsStepIllegal(
        isNextDisabled(requiredFields) ||
          !workingCase.judge ||
          !workingCase.registrar,
      )
    }
  }, [workingCase, isStepIllegal])

  const setJudge = (id: string) => {
    if (workingCase) {
      setAndSendToServer('judgeId', id, workingCase, setWorkingCase, updateCase)

      const judge = userData?.users.find((j) => j.id === id)

      setWorkingCase({ ...workingCase, judge: judge })
    }
  }

  const setRegistrar = (id: string) => {
    if (workingCase) {
      setAndSendToServer(
        'registrarId',
        id,
        workingCase,
        setWorkingCase,
        updateCase,
      )

      const registrar = userData?.users.find((r) => r.id === id)

      setWorkingCase({ ...workingCase, registrar: registrar })
    }
  }

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.HEARING_ARRANGEMENTS}
      isLoading={loading || userLoading}
      notFound={data?.case === undefined}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
    >
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Fyrirtaka
            </Text>
          </Box>
          {workingCase.state === CaseState.DRAFT && (
            <Box marginBottom={8}>
              <AlertMessage
                type="info"
                title="Krafa hefur ekki verið staðfest af ákæranda"
                message="Þú getur úthlutað fyrirtökutíma, dómsal og verjanda en ekki er hægt að halda áfram fyrr en ákærandi hefur staðfest kröfuna."
              />
            </Box>
          )}
          <Box component="section" marginBottom={7}>
            <Text variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
            <CaseNumbers workingCase={workingCase} />
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                Dómari{' '}
                <Tooltip text="Dómarinn sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupóst. Eingöngu skráður dómari getur svo undirritað úrskurð." />
              </Text>
            </Box>
            <Select
              name="judge"
              label="Veldu dómara"
              placeholder="Velja héraðsdómara"
              defaultValue={defaultJudge}
              options={judges}
              onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                setJudge((selectedOption as ReactSelectOption).value.toString())
              }
              required
            />
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                Dómritari{' '}
                <Tooltip text="Dómritari sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupósti." />
              </Text>
            </Box>
            <Select
              name="registrar"
              label="Veldu dómritara"
              placeholder="Velja dómritara"
              defaultValue={defaultRegistrar}
              options={registrars}
              onChange={(selectedOption: ValueType<ReactSelectOption>) =>
                setRegistrar(
                  (selectedOption as ReactSelectOption).value.toString(),
                )
              }
              required
            />
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Skrá fyrirtökutíma
              </Text>
            </Box>
            <Box marginBottom={3}>
              <GridRow>
                <GridColumn span="7/12">
                  <DatePicker
                    id="courtDate"
                    label="Veldu dagsetningu"
                    placeholderText="Veldu dagsetningu"
                    locale="is"
                    errorMessage={courtDateErrorMessage}
                    hasError={courtDateErrorMessage !== ''}
                    minDate={new Date()}
                    selected={
                      workingCase.courtDate
                        ? parseISO(workingCase.courtDate.toString())
                        : null
                    }
                    handleCloseCalendar={(date: Date | null) => {
                      setAndSendDateToServer(
                        'courtDate',
                        workingCase.courtDate,
                        date,
                        workingCase,
                        true,
                        setWorkingCase,
                        updateCase,
                        setCourtDateErrorMessage,
                      )
                    }}
                    required
                  />
                </GridColumn>
                <GridColumn span="5/12">
                  <TimeInputField
                    disabled={!workingCase.courtDate}
                    onChange={(evt) =>
                      validateAndSetTime(
                        'courtDate',
                        workingCase.courtDate,
                        evt.target.value,
                        ['empty', 'time-format'],
                        workingCase,
                        setWorkingCase,
                        courtTimeErrorMessage,
                        setCourtTimeErrorMessage,
                      )
                    }
                    onBlur={(evt) =>
                      validateAndSendTimeToServer(
                        'courtDate',
                        workingCase.courtDate,
                        evt.target.value,
                        ['empty', 'time-format'],
                        workingCase,
                        updateCase,
                        setCourtTimeErrorMessage,
                      )
                    }
                  >
                    <Input
                      name="courtTime"
                      label="Tímasetning"
                      placeholder="Settu inn tíma"
                      errorMessage={courtTimeErrorMessage}
                      hasError={courtTimeErrorMessage !== ''}
                      defaultValue={
                        workingCase.courtDate?.includes('T')
                          ? formatDate(workingCase.courtDate, TIME_FORMAT)
                          : undefined
                      }
                      ref={courtTimeRef}
                      required
                    />
                  </TimeInputField>
                </GridColumn>
              </GridRow>
            </Box>
            <Input
              name="courtroom"
              label="Dómsalur"
              defaultValue={workingCase.courtRoom}
              placeholder="Skráðu inn dómsal"
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtRoom',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  courtroomErrorMessage,
                  setCourtroomErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtRoom',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtroomErrorMessage,
                )
              }
              errorMessage={courtroomErrorMessage}
              hasError={courtroomErrorMessage !== ''}
              required
            />
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Skipaður verjandi
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Input
                name="defenderName"
                label="Nafn verjanda"
                defaultValue={workingCase.defenderName}
                placeholder="Fullt nafn"
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'defenderName',
                    event,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'defenderName',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
              />
            </Box>
            <Input
              name="defenderEmail"
              label="Netfang verjanda"
              defaultValue={workingCase.defenderEmail}
              placeholder="Netfang"
              errorMessage={defenderEmailErrorMessage}
              hasError={defenderEmailErrorMessage !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'defenderEmail',
                  event,
                  ['email-format'],
                  workingCase,
                  setWorkingCase,
                  defenderEmailErrorMessage,
                  setDefenderEmailErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'defenderEmail',
                  event.target.value,
                  ['email-format'],
                  workingCase,
                  updateCase,
                  setDefenderEmailErrorMessage,
                )
              }
            />
          </Box>
          <FormFooter
            previousUrl={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/${workingCase.id}`}
            nextIsDisabled={
              workingCase.state === CaseState.DRAFT || isStepIllegal
            }
            nextIsLoading={isSendingNotification}
            onNextButtonClick={async () => {
              const notificationSent = await sendNotification(workingCase.id)

              if (notificationSent) {
                setModalVisible(true)
              } else {
                history.push(`${Constants.COURT_RECORD_ROUTE}/${id}`)
              }
            }}
          />

          {modalVisible && (
            <Modal
              title="Tilkynning um fyrirtökutíma hefur verið send"
              text="Tilkynning um fyrirtökutíma hefur verið send á ákæranda, fangelsi og verjanda hafi verjandi verið skráður."
              handlePrimaryButtonClick={() => {
                history.push(`${Constants.COURT_RECORD_ROUTE}/${id}`)
              }}
              primaryButtonText="Loka glugga"
            />
          )}
        </>
      ) : null}
    </PageLayout>
  )
}

export default HearingArrangements
