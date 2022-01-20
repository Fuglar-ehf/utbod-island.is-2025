import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Accordion,
  AccordionItem,
  Box,
  Checkbox,
  Input,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import {
  FormFooter,
  PageLayout,
  PoliceRequestAccordionItem,
  BlueBox,
  CaseNumbers,
  FormContentContainer,
  CaseFileList,
  Decision,
  RulingInput,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { isRulingStepOneValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  newSetAndSendDateToServer,
  removeTabsValidateAndSet,
  validateAndSendToServer,
  setAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { isolation } from '@island.is/judicial-system-web/src/utils/Restrictions'
import { DateTime } from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { rcRulingStepOne as m } from '@island.is/judicial-system-web/messages'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

export const RulingStepOne: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const [
    courtCaseFactsErrorMessage,
    setCourtCaseFactsErrorMessage,
  ] = useState<string>('')
  const [
    courtLegalArgumentsErrorMessage,
    setCourtLegalArgumentsErrorMessage,
  ] = useState<string>('')
  const [prosecutorDemandsErrorMessage, setProsecutorDemandsMessage] = useState(
    '',
  )

  const router = useRouter()
  const id = router.query.id

  const { user } = useContext(UserContext)
  const { updateCase, autofill, autofillBoolean } = useCase()
  const { formatMessage } = useIntl()

  useEffect(() => {
    document.title = 'Úrskurður - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (isCaseUpToDate) {
      const theCase = workingCase

      if (theCase.demands) {
        autofill('prosecutorDemands', theCase.demands, theCase)
      }

      if (theCase.requestedValidToDate) {
        autofill('validToDate', theCase.requestedValidToDate, theCase)
      }

      if (theCase.type === CaseType.CUSTODY) {
        autofillBoolean(
          'isCustodyIsolation',
          theCase.requestedCustodyRestrictions &&
            theCase.requestedCustodyRestrictions.includes(
              CaseCustodyRestrictions.ISOLATION,
            )
            ? true
            : false,
          theCase,
        )
      }

      if (theCase.validToDate) {
        autofill('isolationToDate', theCase.validToDate, theCase)
      }

      if (theCase.caseFacts) {
        autofill('courtCaseFacts', theCase.caseFacts, theCase)
      }

      if (theCase.legalArguments) {
        autofill('courtLegalArguments', theCase.legalArguments, theCase)
      }

      setWorkingCase(theCase)
    }
  }, [
    autofill,
    autofillBoolean,
    isCaseUpToDate,
    setWorkingCase,
    updateCase,
    workingCase,
  ])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.RULING_STEP_ONE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.title)}
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <CaseNumbers workingCase={workingCase} />
        </Box>
        <Box component="section" marginBottom={5}>
          <Accordion>
            <PoliceRequestAccordionItem workingCase={workingCase} />
            <AccordionItem
              id="caseFileList"
              label={`Rannsóknargögn (${workingCase.caseFiles?.length ?? 0})`}
              labelVariant="h3"
            >
              <CaseFileList
                caseId={workingCase.id}
                files={workingCase.caseFiles ?? []}
                canOpenFiles={
                  (workingCase.judge !== null &&
                    workingCase.judge?.id === user?.id) ||
                  (workingCase.registrar !== null &&
                    workingCase.registrar?.id === user?.id)
                }
              />
            </AccordionItem>
          </Accordion>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.prosecutorDemands.title)}
            </Text>
          </Box>
          <Input
            data-testid="prosecutorDemands"
            name="prosecutorDemands"
            label={formatMessage(m.sections.prosecutorDemands.label)}
            value={workingCase.prosecutorDemands || ''}
            placeholder={formatMessage(
              m.sections.prosecutorDemands.placeholder,
            )}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'prosecutorDemands',
                event,
                ['empty'],
                workingCase,
                setWorkingCase,
                prosecutorDemandsErrorMessage,
                setProsecutorDemandsMessage,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'prosecutorDemands',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setProsecutorDemandsMessage,
              )
            }
            errorMessage={prosecutorDemandsErrorMessage}
            hasError={prosecutorDemandsErrorMessage !== ''}
            textarea
            rows={7}
            required
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.courtCaseFacts.title)} `}
              <Tooltip
                text={formatMessage(m.sections.courtCaseFacts.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Input
              data-testid="courtCaseFacts"
              name="courtCaseFacts"
              label={formatMessage(m.sections.courtCaseFacts.label)}
              value={workingCase.courtCaseFacts || ''}
              placeholder={formatMessage(m.sections.courtCaseFacts.placeholder)}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtCaseFacts',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  courtCaseFactsErrorMessage,
                  setCourtCaseFactsErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtCaseFacts',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtCaseFactsErrorMessage,
                )
              }
              errorMessage={courtCaseFactsErrorMessage}
              hasError={courtCaseFactsErrorMessage !== ''}
              textarea
              rows={16}
              required
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.courtLegalArguments.title)} `}
              <Tooltip
                text={formatMessage(m.sections.courtLegalArguments.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Input
              data-testid="courtLegalArguments"
              name="courtLegalArguments"
              label={formatMessage(m.sections.courtLegalArguments.label)}
              value={workingCase.courtLegalArguments || ''}
              placeholder={formatMessage(
                m.sections.courtLegalArguments.placeholder,
              )}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtLegalArguments',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  courtLegalArgumentsErrorMessage,
                  setCourtLegalArgumentsErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtLegalArguments',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtLegalArgumentsErrorMessage,
                )
              }
              errorMessage={courtLegalArgumentsErrorMessage}
              hasError={courtLegalArgumentsErrorMessage !== ''}
              textarea
              rows={16}
              required
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.decision.title)} `}
              <Text as="span" fontWeight="semiBold" color="red600">
                *
              </Text>
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Decision
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
              acceptedLabelText={formatMessage(
                m.sections.decision.acceptLabel,
                {
                  caseType:
                    workingCase.type === CaseType.CUSTODY
                      ? 'gæsluvarðhald'
                      : 'farbann',
                },
              )}
              rejectedLabelText={formatMessage(
                m.sections.decision.rejectLabel,
                {
                  caseType:
                    workingCase.type === CaseType.CUSTODY
                      ? 'gæsluvarðhald'
                      : 'farbann',
                },
              )}
              partiallyAcceptedLabelText={formatMessage(
                m.sections.decision.partiallyAcceptLabel,
              )}
              dismissLabelText={formatMessage(
                m.sections.decision.dismissLabel,
                {
                  caseType:
                    workingCase.type === CaseType.CUSTODY
                      ? 'gæsluvarðhald'
                      : 'farbann',
                },
              )}
              acceptingAlternativeTravelBanLabelText={formatMessage(
                m.sections.decision.acceptingAlternativeTravelBanLabel,
              )}
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.ruling.title)}
            </Text>
          </Box>
          <RulingInput
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            isCaseUpToDate={isCaseUpToDate}
            isRequired
          />
        </Box>
        {workingCase.decision &&
          workingCase.decision !== CaseDecision.REJECTING &&
          workingCase.decision !== CaseDecision.DISMISSING && (
            <Box
              component="section"
              marginBottom={7}
              data-testid="caseDecisionSection"
            >
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  {workingCase.type === CaseType.CUSTODY &&
                  isAcceptingCaseDecision(workingCase.decision)
                    ? 'Gæsluvarðhald'
                    : 'Farbann'}
                </Text>
              </Box>
              <DateTime
                name="validToDate"
                datepickerLabel={
                  workingCase.type === CaseType.CUSTODY &&
                  isAcceptingCaseDecision(workingCase.decision)
                    ? 'Gæsluvarðhald til'
                    : 'Farbann til'
                }
                selectedDate={workingCase.validToDate}
                minDate={new Date()}
                onChange={(date: Date | undefined, valid: boolean) => {
                  newSetAndSendDateToServer(
                    'validToDate',
                    date,
                    valid,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }}
                required
              />
            </Box>
          )}
        {workingCase.type === CaseType.CUSTODY &&
          isAcceptingCaseDecision(workingCase.decision) && (
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  {formatMessage(m.sections.custodyRestrictions.title)}
                </Text>
              </Box>
              <BlueBox>
                <Box marginBottom={3}>
                  <Checkbox
                    name="isCustodyIsolation"
                    label={isolation(workingCase.accusedGender)[0].title}
                    checked={workingCase.isCustodyIsolation}
                    onChange={() => {
                      setAndSendToServer(
                        'isCustodyIsolation',
                        !workingCase.isCustodyIsolation,
                        workingCase,
                        setWorkingCase,
                        updateCase,
                      )
                    }}
                    filled
                    large
                  />
                </Box>
                <DateTime
                  name="isolationToDate"
                  datepickerLabel="Einangrun til"
                  disabled={!workingCase.isCustodyIsolation}
                  selectedDate={
                    workingCase.isolationToDate
                      ? workingCase.isolationToDate
                      : workingCase.validToDate
                      ? workingCase.validToDate
                      : undefined
                  }
                  // Isolation can never be set in the past.
                  minDate={new Date()}
                  maxDate={
                    workingCase.validToDate
                      ? new Date(workingCase.validToDate)
                      : undefined
                  }
                  onChange={(date: Date | undefined, valid: boolean) => {
                    newSetAndSendDateToServer(
                      'isolationToDate',
                      date,
                      valid,
                      workingCase,
                      setWorkingCase,
                      updateCase,
                    )
                  }}
                  blueBox={false}
                  backgroundColor={
                    workingCase.isCustodyIsolation ? 'white' : 'blue'
                  }
                />
              </BlueBox>
            </Box>
          )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.COURT_RECORD_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.RULING_STEP_TWO_ROUTE}/${id}`}
          nextIsDisabled={!isRulingStepOneValidRC(workingCase)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default RulingStepOne
