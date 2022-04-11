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
  CaseInfo,
  FormContentContainer,
  CaseFileList,
  Decision,
  RulingInput,
  PdfButton,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
  completedCaseStates,
  Gender,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import { isRulingValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  setAndSendDateToServer,
  removeTabsValidateAndSet,
  validateAndSendToServer,
  setAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { DateTime } from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { core, rcRuling as m } from '@island.is/judicial-system-web/messages'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  capitalize,
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import useDeb from '@island.is/judicial-system-web/src/utils/hooks/useDeb'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'
import { autofillRuling } from '@island.is/judicial-system-web/src/components/RulingInput/RulingInput'
import * as Constants from '@island.is/judicial-system/consts'

export const Ruling: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const [
    introductionErrorMessage,
    setIntroductionErrorMessage,
  ] = useState<string>('')
  const [
    courtCaseFactsErrorMessage,
    setCourtCaseFactsErrorMessage,
  ] = useState<string>('')
  const [
    courtLegalArgumentsErrorMessage,
    setCourtLegalArgumentsErrorMessage,
  ] = useState<string>('')
  const [
    prosecutorDemandsErrorMessage,
    setProsecutorDemandsMessage,
  ] = useState<string>('')

  const router = useRouter()
  const id = router.query.id

  const { user } = useContext(UserContext)
  const [initialAutoFillDone, setInitialAutoFillDone] = useState(false)
  const { updateCase, autofill, autofillBoolean } = useCase()
  const { formatMessage } = useIntl()

  useDeb(workingCase, 'prosecutorDemands')
  useDeb(workingCase, 'courtCaseFacts')
  useDeb(workingCase, 'courtLegalArguments')
  useDeb(workingCase, 'conclusion')

  useEffect(() => {
    const isolationEndsBeforeValidToDate =
      workingCase.validToDate &&
      workingCase.isolationToDate &&
      new Date(workingCase.validToDate) > new Date(workingCase.isolationToDate)

    if (isCaseUpToDate && !initialAutoFillDone) {
      autofill(
        'introduction',
        formatMessage(m.sections.introduction.autofill, {
          date: formatDate(workingCase.courtDate, 'PPP'),
        }),
        workingCase,
      )

      if (workingCase.demands) {
        autofill('prosecutorDemands', workingCase.demands, workingCase)
      }

      if (workingCase.requestedValidToDate) {
        autofill('validToDate', workingCase.requestedValidToDate, workingCase)
      }

      if (workingCase.type === CaseType.CUSTODY) {
        autofillBoolean(
          'isCustodyIsolation',
          workingCase.requestedCustodyRestrictions &&
            workingCase.requestedCustodyRestrictions.includes(
              CaseCustodyRestrictions.ISOLATION,
            )
            ? true
            : false,
          workingCase,
        )
      }

      if (workingCase.validToDate) {
        autofill('isolationToDate', workingCase.validToDate, workingCase)
      }

      if (workingCase.caseFacts) {
        autofill('courtCaseFacts', workingCase.caseFacts, workingCase)
      }

      if (workingCase.legalArguments) {
        autofill('courtLegalArguments', workingCase.legalArguments, workingCase)
      }

      autofillRuling(workingCase, autofill, formatMessage)

      setInitialAutoFillDone(true)
      setWorkingCase({ ...workingCase })
    }

    if (
      !workingCase.conclusion &&
      workingCase.decision &&
      workingCase.defendants &&
      workingCase.defendants.length > 0
    ) {
      const accusedSuffix =
        workingCase.defendants[0].gender === Gender.MALE ? 'i' : 'a'

      autofill(
        'conclusion',
        workingCase.decision === CaseDecision.DISMISSING
          ? formatMessage(m.sections.conclusion.dismissingAutofill, {
              genderedAccused: formatMessage(core.accused, {
                suffix: accusedSuffix,
              }),
              accusedName: workingCase.defendants[0].name,
              extensionSuffix:
                workingCase.parentCase &&
                isAcceptingCaseDecision(workingCase.parentCase.decision)
                  ? ' áframhaldandi'
                  : '',
              caseType:
                workingCase.type === CaseType.CUSTODY
                  ? 'gæsluvarðhaldi'
                  : 'farbanni',
            })
          : workingCase.decision === CaseDecision.REJECTING
          ? formatMessage(m.sections.conclusion.rejectingAutofill, {
              genderedAccused: formatMessage(core.accused, {
                suffix: accusedSuffix,
              }),
              accusedName: workingCase.defendants[0].name,
              accusedNationalId: workingCase.defendants[0].noNationalId
                ? ', '
                : `, kt. ${formatNationalId(
                    workingCase.defendants[0].nationalId ?? '',
                  )}, `,
              extensionSuffix:
                workingCase.parentCase &&
                isAcceptingCaseDecision(workingCase.parentCase.decision)
                  ? ' áframhaldandi'
                  : '',
              caseType:
                workingCase.type === CaseType.CUSTODY
                  ? 'gæsluvarðhaldi'
                  : 'farbanni',
            })
          : formatMessage(m.sections.conclusion.acceptingAutofill, {
              genderedAccused: capitalize(
                formatMessage(core.accused, {
                  suffix: accusedSuffix,
                }),
              ),
              accusedName: workingCase.defendants[0].name,
              accusedNationalId: workingCase.defendants[0].noNationalId
                ? ', '
                : `, kt. ${formatNationalId(
                    workingCase.defendants[0].nationalId ?? '',
                  )}, `,
              caseTypeAndExtensionSuffix:
                workingCase.decision === CaseDecision.ACCEPTING ||
                workingCase.decision === CaseDecision.ACCEPTING_PARTIALLY
                  ? `${
                      workingCase.parentCase &&
                      isAcceptingCaseDecision(workingCase.parentCase.decision)
                        ? 'áframhaldandi '
                        : ''
                    }${
                      workingCase.type === CaseType.CUSTODY
                        ? 'gæsluvarðhaldi'
                        : 'farbanni'
                    }`
                  : // decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                    'farbanni',
              validToDate: `${formatDate(workingCase.validToDate, 'PPPPp')
                ?.replace('dagur,', 'dagsins')
                ?.replace(' kl.', ', kl.')}`,
              isolationSuffix:
                isAcceptingCaseDecision(workingCase.decision) &&
                workingCase.isCustodyIsolation
                  ? ` ${capitalize(
                      formatMessage(core.accused, {
                        suffix: accusedSuffix,
                      }),
                    )} skal sæta einangrun ${
                      isolationEndsBeforeValidToDate
                        ? `ekki lengur en til ${formatDate(
                            workingCase.isolationToDate,
                            'PPPPp',
                          )
                            ?.replace('dagur,', 'dagsins')
                            ?.replace(' kl.', ', kl.')}.`
                        : 'á meðan á gæsluvarðhaldinu stendur.'
                    }`
                  : '',
            }),
        workingCase,
      )

      setWorkingCase({ ...workingCase })
    }
  }, [
    autofill,
    autofillBoolean,
    formatMessage,
    initialAutoFillDone,
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
      activeSubSection={CourtSubsections.RULING}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(titles.court.restrictionCases.ruling)} />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.title)}
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseInfo workingCase={workingCase} userRole={user?.role} />
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
                isCaseCompleted={completedCaseStates.includes(
                  workingCase.state,
                )}
              />
            </AccordionItem>
          </Accordion>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.introduction.title)}
            </Text>
          </Box>
          <Input
            data-testid="introduction"
            name="introduction"
            label={formatMessage(m.sections.introduction.label)}
            value={workingCase.introduction || ''}
            placeholder={formatMessage(m.sections.introduction.placeholder)}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'introduction',
                event.target.value,
                ['empty'],
                workingCase,
                setWorkingCase,
                introductionErrorMessage,
                setIntroductionErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'introduction',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setIntroductionErrorMessage,
              )
            }
            errorMessage={introductionErrorMessage}
            hasError={introductionErrorMessage !== ''}
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
            required
          />
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
                event.target.value,
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
            autoExpand={{ on: true, maxHeight: 300 }}
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
                  event.target.value,
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
              autoExpand={{ on: true, maxHeight: 600 }}
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
                  event.target.value,
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
              autoExpand={{ on: true, maxHeight: 600 }}
              required
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.ruling.title)}
            </Text>
          </Box>
          <RulingInput
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            isRequired
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.decision.title)}
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
                  setAndSendDateToServer(
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
            <Box component="section" marginBottom={5}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  {formatMessage(m.sections.custodyRestrictions.title)}
                </Text>
              </Box>
              <BlueBox>
                <Box marginBottom={3}>
                  <Checkbox
                    name="isCustodyIsolation"
                    label={capitalize(
                      formatMessage(m.sections.custodyRestrictions.isolation, {
                        genderedAccused: formatMessage(core.accused, {
                          suffix:
                            workingCase.defendants &&
                            workingCase.defendants.length > 0 &&
                            workingCase.defendants[0].gender === Gender.MALE
                              ? 'i'
                              : 'a',
                        }),
                      }),
                    )}
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
                    setAndSendDateToServer(
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
        <Box component="section" marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.conclusion.title)}
            </Text>
          </Box>
          <Input
            name="conclusion"
            data-testid="conclusion"
            label={formatMessage(m.sections.conclusion.label)}
            value={workingCase.conclusion || ''}
            placeholder={formatMessage(m.sections.conclusion.placeholder)}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'conclusion',
                event.target.value,
                [],
                workingCase,
                setWorkingCase,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'conclusion',
                event.target.value,
                [],
                workingCase,
                updateCase,
              )
            }
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
        <Box marginBottom={10}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRuling)}
            pdfType="ruling"
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.COURT_RECORD_ROUTE}/${id}`}
          nextIsDisabled={!isRulingValidRC(workingCase)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Ruling
