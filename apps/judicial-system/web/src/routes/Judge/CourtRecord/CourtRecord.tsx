import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import {
  FormFooter,
  CourtDocuments,
  PageLayout,
  TimeInputField,
  CaseNumbers,
  BlueBox,
} from '@island.is/judicial-system-web/src/shared-components'
import { isNextDisabled } from '@island.is/judicial-system-web/src/utils/stepHelper'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  capitalize,
  formatAccusedByGender,
  formatProsecutorDemands,
  NounCases,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { formatDate } from '@island.is/judicial-system/formatters'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import { useParams } from 'react-router-dom'
import {
  AccusedPleaDecision,
  Case,
  CaseCustodyRestrictions,
  CaseGender,
  UpdateCase,
} from '@island.is/judicial-system/types'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendTimeToServer,
  validateAndSendToServer,
  removeTabsValidateAndSet,
  validateAndSetTime,
  setAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import * as styles from './CourtRecord.treat'

interface CaseData {
  case?: Case
}

export const CourtRecord: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [
    courtDocumentStartErrorMessage,
    setCourtDocumentStartErrorMessage,
  ] = useState('')
  const [courtAttendeesErrorMessage, setCourtAttendeesMessage] = useState('')
  const [policeDemandsErrorMessage, setPoliceDemandsMessage] = useState('')
  const [
    accusedPleaAnnouncementErrorMessage,
    setAccusedPleaAnnouncementMessage,
  ] = useState('')
  const [
    litigationPresentationsErrorMessage,
    setLitigationPresentationsMessage,
  ] = useState('')
  const { id } = useParams<{ id: string }>()
  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

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

  useEffect(() => {
    document.title = 'Þingbók - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const defaultCourtAttendees = (wc: Case): string => {
      let attendees = ''

      if (wc.judge) {
        attendees += `${wc.judge.name} ${wc.judge.title}\n`
      }

      if (wc.registrar) {
        attendees += `${wc.registrar.name} ${wc.registrar.title}\n`
      }

      if (wc.prosecutor && wc.accusedName) {
        attendees += `${wc.prosecutor.name} ${wc.prosecutor.title}\n${
          wc.accusedName
        } ${formatAccusedByGender(wc?.accusedGender || CaseGender.OTHER)}`
      }

      if (wc.defenderName) {
        attendees += `\n${
          wc.defenderName
        } skipaður verjandi ${formatAccusedByGender(
          wc?.accusedGender || CaseGender.OTHER,
          NounCases.GENITIVE,
        )}`
      }

      return attendees
    }
    if (!workingCase && data?.case) {
      let theCase = data.case

      if (!theCase.courtAttendees) {
        theCase = { ...theCase, courtAttendees: defaultCourtAttendees(theCase) }

        if (theCase.courtAttendees) {
          updateCase(
            theCase.id,
            parseString('courtAttendees', theCase.courtAttendees),
          )
        }
      }
      if (
        !theCase.policeDemands &&
        theCase.accusedName &&
        theCase.court &&
        theCase.requestedCustodyEndDate
        // Note that theCase.requestedCustodyRestrictions can be undefined
      ) {
        theCase = {
          ...theCase,
          policeDemands: formatProsecutorDemands(
            theCase.type,
            theCase.accusedNationalId,
            theCase.accusedName,
            theCase.court,
            theCase.requestedCustodyEndDate,
            theCase.requestedCustodyRestrictions?.includes(
              CaseCustodyRestrictions.ISOLATION,
            ) || false,
            theCase.parentCase !== undefined,
            theCase.parentCase?.decision,
          ),
        }
      }

      setWorkingCase(theCase)
    }
  }, [workingCase, updateCase, setWorkingCase, data])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.COURT_RECORD}
      isLoading={loading}
      notFound={data?.case === undefined}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
    >
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Þingbók
            </Text>
          </Box>
          <Box component="section" marginBottom={7}>
            <Text variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
            <CaseNumbers workingCase={workingCase} />
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={3}>
              <GridContainer>
                <GridRow>
                  <GridColumn span="5/12">
                    <TimeInputField
                      onChange={(evt) =>
                        validateAndSetTime(
                          'courtStartTime',
                          new Date().toString(),
                          evt.target.value,
                          ['empty', 'time-format'],
                          workingCase,
                          setWorkingCase,
                          courtDocumentStartErrorMessage,
                          setCourtDocumentStartErrorMessage,
                        )
                      }
                      onBlur={(evt) =>
                        validateAndSendTimeToServer(
                          'courtStartTime',
                          new Date().toString(),
                          evt.target.value,
                          ['empty', 'time-format'],
                          workingCase,
                          updateCase,
                          setCourtDocumentStartErrorMessage,
                        )
                      }
                    >
                      <Input
                        data-testid="courtStartTime"
                        name="courtStartTime"
                        label="Þinghald hófst"
                        placeholder="Veldu tíma"
                        defaultValue={formatDate(
                          workingCase.courtStartTime,
                          TIME_FORMAT,
                        )}
                        errorMessage={courtDocumentStartErrorMessage}
                        hasError={courtDocumentStartErrorMessage !== ''}
                        required
                      />
                    </TimeInputField>
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </Box>
            <Box marginBottom={3}>
              <Input
                data-testid="courtAttendees"
                name="courtAttendees"
                label="Viðstaddir og hlutverk þeirra"
                defaultValue={workingCase.courtAttendees}
                placeholder="Skrifa hér..."
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'courtAttendees',
                    event,
                    ['empty'],
                    workingCase,
                    setWorkingCase,
                    courtAttendeesErrorMessage,
                    setCourtAttendeesMessage,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'courtAttendees',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setCourtAttendeesMessage,
                  )
                }
                errorMessage={courtAttendeesErrorMessage}
                hasError={courtAttendeesErrorMessage !== ''}
                textarea
                rows={7}
                required
              />
            </Box>
            <Input
              data-testid="policeDemands"
              name="policeDemands"
              label="Krafa lögreglu"
              defaultValue={workingCase.policeDemands}
              placeholder="Hvað hafði ákæruvaldið að segja?"
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'policeDemands',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  policeDemandsErrorMessage,
                  setPoliceDemandsMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'policeDemands',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setPoliceDemandsMessage,
                )
              }
              errorMessage={policeDemandsErrorMessage}
              hasError={policeDemandsErrorMessage !== ''}
              textarea
              rows={7}
              required
            />
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Dómskjöl
              </Text>
            </Box>
            <CourtDocuments
              title="Krafa lögreglu"
              tagText="Þingmerkt nr. 1"
              tagVariant="darkerBlue"
              text="Rannsóknargögn málsins liggja frammi."
              caseId={workingCase.id}
              selectedCourtDocuments={workingCase.courtDocuments || []}
              onUpdateCase={updateCase}
              setWorkingCase={setWorkingCase}
              workingCase={workingCase}
            />
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={1}>
              <Text as="h3" variant="h3">
                {`Réttindi ${formatAccusedByGender(
                  workingCase.accusedGender || CaseGender.OTHER,
                  NounCases.GENITIVE,
                )}`}{' '}
                <Text as="span" fontWeight="semiBold" color="red600">
                  *
                </Text>
              </Text>
            </Box>
            <Box marginBottom={2}>
              <Text>
                Sakborningi er bent á að honum sé óskylt að svara spurningum er
                varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr.
                laga nr. 88/2008. Sakborningur er enn fremur áminntur um
                sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114.
                gr. sömu laga
              </Text>
            </Box>
            <BlueBox>
              <div className={styles.accusedPleaDecision}>
                <RadioButton
                  name="accusedPleaDecision"
                  id="accused-plea-decision-accepting"
                  label={`${capitalize(
                    formatAccusedByGender(workingCase.accusedGender),
                  )} hafnar kröfunni`}
                  checked={
                    workingCase.accusedPleaDecision ===
                    AccusedPleaDecision.REJECT
                  }
                  onChange={() => {
                    setAndSendToServer(
                      'accusedPleaDecision',
                      AccusedPleaDecision.REJECT,
                      workingCase,
                      setWorkingCase,
                      updateCase,
                    )
                  }}
                  large
                  filled
                />
                <RadioButton
                  name="accusedPleaDecision"
                  id="accused-plea-decision-rejecting"
                  label={`${capitalize(
                    formatAccusedByGender(workingCase.accusedGender),
                  )} samþykkir kröfuna`}
                  checked={
                    workingCase.accusedPleaDecision ===
                    AccusedPleaDecision.ACCEPT
                  }
                  onChange={() => {
                    setAndSendToServer(
                      'accusedPleaDecision',
                      AccusedPleaDecision.ACCEPT,
                      workingCase,
                      setWorkingCase,
                      updateCase,
                    )
                  }}
                  large
                  filled
                />
              </div>
              <Input
                name="accusedPleaAnnouncement"
                label={`Afstaða ${formatAccusedByGender(
                  workingCase.accusedGender || CaseGender.OTHER,
                  NounCases.GENITIVE,
                )}`}
                defaultValue={workingCase.accusedPleaAnnouncement}
                placeholder={`Hvað hafði ${formatAccusedByGender(
                  workingCase.accusedGender || CaseGender.OTHER,
                )} að segja um kröfuna? Mótmælti eða samþykkti?`}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'accusedPleaAnnouncement',
                    event,
                    [],
                    workingCase,
                    setWorkingCase,
                    accusedPleaAnnouncementErrorMessage,
                    setAccusedPleaAnnouncementMessage,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'accusedPleaAnnouncement',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                    setAccusedPleaAnnouncementMessage,
                  )
                }
                errorMessage={accusedPleaAnnouncementErrorMessage}
                hasError={accusedPleaAnnouncementErrorMessage !== ''}
                textarea
                rows={7}
              />
            </BlueBox>
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Málflutningur
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Input
                data-testid="litigationPresentations"
                name="litigationPresentations"
                label="Málflutningur og aðrar bókanir"
                defaultValue={workingCase.litigationPresentations}
                placeholder="Málflutningsræður og annað sem fram kom í þinghaldi er skráð hér..."
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'litigationPresentations',
                    event,
                    ['empty'],
                    workingCase,
                    setWorkingCase,
                    litigationPresentationsErrorMessage,
                    setLitigationPresentationsMessage,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'litigationPresentations',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setLitigationPresentationsMessage,
                  )
                }
                errorMessage={litigationPresentationsErrorMessage}
                hasError={litigationPresentationsErrorMessage !== ''}
                textarea
                rows={7}
                required
              />
            </Box>
          </Box>
          <FormFooter
            previousUrl={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
            nextUrl={`${Constants.RULING_STEP_ONE_ROUTE}/${id}`}
            nextIsDisabled={
              isNextDisabled([
                {
                  value:
                    formatDate(workingCase.courtStartTime, TIME_FORMAT) || '',
                  validations: ['empty', 'time-format'],
                },
                {
                  value: workingCase.courtAttendees || '',
                  validations: ['empty'],
                },
                {
                  value: workingCase.policeDemands || '',
                  validations: ['empty'],
                },
                {
                  value: workingCase.litigationPresentations || '',
                  validations: ['empty'],
                },
              ]) || workingCase.accusedPleaDecision === null
            }
          />
        </>
      ) : null}
    </PageLayout>
  )
}

export default CourtRecord
