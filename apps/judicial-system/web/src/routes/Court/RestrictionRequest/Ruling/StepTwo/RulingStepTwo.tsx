import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import {
  FormFooter,
  PageLayout,
  BlueBox,
  CaseInfo,
  FormContentContainer,
  TimeInputField,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
  Gender,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  validateAndSetTime,
  validateAndSendTimeToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  capitalize,
  formatCustodyRestrictions,
  formatDate,
  formatNationalId,
  formatTravelBanRestrictions,
  TIME_FORMAT,
} from '@island.is/judicial-system/formatters'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isRulingStepTwoValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  core,
  rcRulingStepTwo as m,
} from '@island.is/judicial-system-web/messages'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

export const RulingStepTwo: React.FC = () => {
  const router = useRouter()
  const id = router.query.id
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)

  const [
    courtDocumentEndErrorMessage,
    setCourtDocumentEndErrorMessage,
  ] = useState<string>('')

  const { updateCase, autofill } = useCase()
  const { formatMessage } = useIntl()

  useEffect(() => {
    document.title = 'Úrskurðarorð - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (isCaseUpToDate) {
      const theCase = workingCase
      const isolationEndsBeforeValidToDate =
        theCase.validToDate &&
        theCase.isolationToDate &&
        new Date(theCase.validToDate) > new Date(theCase.isolationToDate)

      if (theCase.defendants && theCase.defendants.length > 0) {
        const accusedSuffix =
          theCase.defendants[0].gender === Gender.MALE ? 'i' : 'a'

        autofill(
          'conclusion',
          theCase.decision === CaseDecision.DISMISSING
            ? formatMessage(m.sections.conclusion.dismissingAutofill, {
                genderedAccused: formatMessage(core.accused, {
                  suffix: accusedSuffix,
                }),
                accusedName: theCase.defendants[0].name,
                extensionSuffix:
                  theCase.parentCase &&
                  isAcceptingCaseDecision(theCase.parentCase.decision)
                    ? ' áframhaldandi'
                    : '',
                caseType:
                  theCase.type === CaseType.CUSTODY
                    ? 'gæsluvarðhaldi'
                    : 'farbanni',
              })
            : theCase.decision === CaseDecision.REJECTING
            ? formatMessage(m.sections.conclusion.rejectingAutofill, {
                genderedAccused: formatMessage(core.accused, {
                  suffix: accusedSuffix,
                }),
                accusedName: theCase.defendants[0].name,
                accusedNationalId: formatNationalId(
                  theCase.defendants[0].nationalId ?? '',
                ),
                extensionSuffix:
                  theCase.parentCase &&
                  isAcceptingCaseDecision(theCase.parentCase.decision)
                    ? ' áframhaldandi'
                    : '',
                caseType:
                  theCase.type === CaseType.CUSTODY
                    ? 'gæsluvarðhaldi'
                    : 'farbanni',
              })
            : formatMessage(m.sections.conclusion.acceptingAutofill, {
                genderedAccused: capitalize(
                  formatMessage(core.accused, {
                    suffix: accusedSuffix,
                  }),
                ),
                accusedName: theCase.defendants[0].name,
                accusedNationalId: formatNationalId(
                  theCase.defendants[0].nationalId ?? '',
                ),
                caseTypeAndExtensionSuffix:
                  theCase.decision === CaseDecision.ACCEPTING ||
                  theCase.decision === CaseDecision.ACCEPTING_PARTIALLY
                    ? `${
                        theCase.parentCase &&
                        isAcceptingCaseDecision(theCase.parentCase.decision)
                          ? 'áframhaldandi '
                          : ''
                      }${
                        theCase.type === CaseType.CUSTODY
                          ? 'gæsluvarðhaldi'
                          : 'farbanni'
                      }`
                    : // decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                      'farbanni',
                validToDate: `${formatDate(theCase.validToDate, 'PPPPp')
                  ?.replace('dagur,', 'dagsins')
                  ?.replace(' kl.', ', kl.')}`,
                isolationSuffix:
                  isAcceptingCaseDecision(theCase.decision) &&
                  workingCase.isCustodyIsolation
                    ? ` ${capitalize(
                        formatMessage(core.accused, {
                          suffix: accusedSuffix,
                        }),
                      )} skal sæta einangrun ${
                        isolationEndsBeforeValidToDate
                          ? `ekki lengur en til ${formatDate(
                              theCase.isolationToDate,
                              'PPPPp',
                            )
                              ?.replace('dagur,', 'dagsins')
                              ?.replace(' kl.', ', kl.')}.`
                          : 'á meðan á gæsluvarðhaldinu stendur.'
                      }`
                    : '',
              }),
          theCase,
        )
      }

      if (
        theCase.type === CaseType.CUSTODY &&
        (isAcceptingCaseDecision(theCase.decision) ||
          theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN)
      ) {
        autofill(
          'endOfSessionBookings',
          `${
            isAcceptingCaseDecision(theCase.decision)
              ? formatCustodyRestrictions(
                  theCase.requestedCustodyRestrictions,
                  theCase.isCustodyIsolation,
                  true,
                )
              : formatTravelBanRestrictions(
                  theCase.defendants && theCase.defendants.length > 0
                    ? theCase.defendants[0].gender
                    : undefined,
                  [
                    CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
                    CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
                  ],
                )
          }\n\n${formatMessage(m.sections.custodyRestrictions.disclaimer, {
            caseType:
              theCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                ? 'farbannsins'
                : 'gæsluvarðhaldsins',
          })}`,
          theCase,
        )
      } else if (
        theCase.type === CaseType.TRAVEL_BAN &&
        isAcceptingCaseDecision(theCase.decision)
      ) {
        const travelBanRestrictions = formatTravelBanRestrictions(
          theCase.defendants && theCase.defendants.length > 0
            ? theCase.defendants[0].gender
            : undefined,
          theCase.requestedCustodyRestrictions,
          theCase.requestedOtherRestrictions,
        )

        autofill(
          'endOfSessionBookings',
          `${
            travelBanRestrictions && `${travelBanRestrictions}\n\n`
          }${formatMessage(m.sections.custodyRestrictions.disclaimer, {
            caseType: 'farbannsins',
          })}`,
          theCase,
        )
      }

      setWorkingCase(theCase)
    }
  }, [autofill, formatMessage, isCaseUpToDate, setWorkingCase, workingCase])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.RULING_STEP_TWO}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.title)}
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseInfo workingCase={workingCase} userRole={user?.role} />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={6}>
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
              required
              rows={7}
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.appealDecision.title)}
            </Text>
          </Box>
          <Box marginBottom={3}>
            <Text variant="h4" fontWeight="light">
              {formatMessage(m.sections.appealDecision.disclaimer)}
            </Text>
          </Box>
          {workingCase.defendants && workingCase.defendants.length > 0 && (
            <Box marginBottom={3}>
              <BlueBox>
                <Box marginBottom={2}>
                  <Text as="h4" variant="h4">
                    {formatMessage(m.sections.appealDecision.accusedTitle, {
                      accused: formatMessage(core.accused, {
                        suffix:
                          workingCase.defendants[0].gender === Gender.FEMALE
                            ? 'u'
                            : 'a',
                      }),
                    })}{' '}
                    <Text as="span" color="red600" fontWeight="semiBold">
                      *
                    </Text>
                  </Text>
                </Box>
                <Box marginBottom={2}>
                  <GridRow>
                    <GridColumn span="6/12">
                      <RadioButton
                        name="accused-appeal-decision"
                        id="accused-appeal"
                        label={formatMessage(
                          m.sections.appealDecision.accusedAppeal,
                          {
                            accused: capitalize(
                              formatMessage(core.accused, {
                                suffix:
                                  workingCase.defendants[0].gender ===
                                  Gender.MALE
                                    ? 'i'
                                    : 'a',
                              }),
                            ),
                          },
                        )}
                        value={CaseAppealDecision.APPEAL}
                        checked={
                          workingCase.accusedAppealDecision ===
                          CaseAppealDecision.APPEAL
                        }
                        onChange={() => {
                          setWorkingCase({
                            ...workingCase,
                            accusedAppealDecision: CaseAppealDecision.APPEAL,
                          })

                          updateCase(
                            workingCase.id,
                            parseString(
                              'accusedAppealDecision',
                              CaseAppealDecision.APPEAL,
                            ),
                          )
                        }}
                        large
                        backgroundColor="white"
                      />
                    </GridColumn>
                    <GridColumn span="6/12">
                      <RadioButton
                        name="accused-appeal-decision"
                        id="accused-accept"
                        label={formatMessage(
                          m.sections.appealDecision.accusedAccept,
                          {
                            accused: capitalize(
                              formatMessage(core.accused, {
                                suffix:
                                  workingCase.defendants[0].gender ===
                                  Gender.MALE
                                    ? 'i'
                                    : 'a',
                              }),
                            ),
                          },
                        )}
                        value={CaseAppealDecision.ACCEPT}
                        checked={
                          workingCase.accusedAppealDecision ===
                          CaseAppealDecision.ACCEPT
                        }
                        onChange={() => {
                          setWorkingCase({
                            ...workingCase,
                            accusedAppealDecision: CaseAppealDecision.ACCEPT,
                          })

                          updateCase(
                            workingCase.id,
                            parseString(
                              'accusedAppealDecision',
                              CaseAppealDecision.ACCEPT,
                            ),
                          )
                        }}
                        large
                        backgroundColor="white"
                      />
                    </GridColumn>
                  </GridRow>
                </Box>
                <Box marginBottom={2}>
                  <GridRow>
                    <GridColumn span="7/12">
                      <RadioButton
                        name="accused-appeal-decision"
                        id="accused-postpone"
                        label={formatMessage(
                          m.sections.appealDecision.accusedPostpone,
                          {
                            accused: capitalize(
                              formatMessage(core.accused, {
                                suffix:
                                  workingCase.defendants[0].gender ===
                                  Gender.MALE
                                    ? 'i'
                                    : 'a',
                              }),
                            ),
                          },
                        )}
                        value={CaseAppealDecision.POSTPONE}
                        checked={
                          workingCase.accusedAppealDecision ===
                          CaseAppealDecision.POSTPONE
                        }
                        onChange={() => {
                          setWorkingCase({
                            ...workingCase,
                            accusedAppealDecision: CaseAppealDecision.POSTPONE,
                          })

                          updateCase(
                            workingCase.id,
                            parseString(
                              'accusedAppealDecision',
                              CaseAppealDecision.POSTPONE,
                            ),
                          )
                        }}
                        large
                        backgroundColor="white"
                      />
                    </GridColumn>
                    <GridColumn span="5/12">
                      <RadioButton
                        name="accused-appeal-decision"
                        id="accused-not-applicable"
                        label={formatMessage(
                          m.sections.appealDecision.accusedNotApplicable,
                        )}
                        value={CaseAppealDecision.NOT_APPLICABLE}
                        checked={
                          workingCase.accusedAppealDecision ===
                          CaseAppealDecision.NOT_APPLICABLE
                        }
                        onChange={() => {
                          setWorkingCase({
                            ...workingCase,
                            accusedAppealDecision:
                              CaseAppealDecision.NOT_APPLICABLE,
                          })

                          updateCase(
                            workingCase.id,
                            parseString(
                              'accusedAppealDecision',
                              CaseAppealDecision.NOT_APPLICABLE,
                            ),
                          )
                        }}
                        large
                        backgroundColor="white"
                      />
                    </GridColumn>
                  </GridRow>
                </Box>
                <Input
                  name="accusedAppealAnnouncement"
                  data-testid="accusedAppealAnnouncement"
                  label={formatMessage(
                    m.sections.appealDecision.accusedAnnouncementLabel,
                    {
                      accused: formatMessage(core.accused, {
                        suffix:
                          workingCase.defendants[0].gender === Gender.FEMALE
                            ? 'u'
                            : 'a',
                      }),
                    },
                  )}
                  value={workingCase.accusedAppealAnnouncement || ''}
                  placeholder={formatMessage(
                    m.sections.appealDecision.accusedAnnouncementPlaceholder,
                    {
                      accused: formatMessage(core.accused, {
                        suffix:
                          workingCase.defendants[0].gender === Gender.MALE
                            ? 'i'
                            : 'a',
                      }),
                    },
                  )}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'accusedAppealAnnouncement',
                      event.target.value,
                      [],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'accusedAppealAnnouncement',
                      event.target.value,
                      [],
                      workingCase,
                      updateCase,
                    )
                  }
                  textarea
                  rows={7}
                />
              </BlueBox>
            </Box>
          )}
          <Box marginBottom={5}>
            <BlueBox>
              <Box marginBottom={2}>
                <Text as="h4" variant="h4">
                  {formatMessage(m.sections.appealDecision.prosecutorTitle)}{' '}
                  <Text as="span" color="red400" fontWeight="semiBold">
                    *
                  </Text>
                </Text>
              </Box>
              <Box marginBottom={2}>
                <GridRow>
                  <GridColumn span="6/12">
                    <RadioButton
                      name="prosecutor-appeal-decision"
                      id="prosecutor-appeal"
                      label={formatMessage(
                        m.sections.appealDecision.prosecutorAppeal,
                      )}
                      value={CaseAppealDecision.APPEAL}
                      checked={
                        workingCase.prosecutorAppealDecision ===
                        CaseAppealDecision.APPEAL
                      }
                      onChange={() => {
                        setWorkingCase({
                          ...workingCase,
                          prosecutorAppealDecision: CaseAppealDecision.APPEAL,
                        })

                        updateCase(
                          workingCase.id,
                          parseString(
                            'prosecutorAppealDecision',
                            CaseAppealDecision.APPEAL,
                          ),
                        )
                      }}
                      large
                      backgroundColor="white"
                    />
                  </GridColumn>
                  <GridColumn span="6/12">
                    <RadioButton
                      name="prosecutor-appeal-decision"
                      id="prosecutor-accept"
                      label={formatMessage(
                        m.sections.appealDecision.prosecutorAccept,
                      )}
                      value={CaseAppealDecision.ACCEPT}
                      checked={
                        workingCase.prosecutorAppealDecision ===
                        CaseAppealDecision.ACCEPT
                      }
                      onChange={() => {
                        setWorkingCase({
                          ...workingCase,
                          prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
                        })

                        updateCase(
                          workingCase.id,
                          parseString(
                            'prosecutorAppealDecision',
                            CaseAppealDecision.ACCEPT,
                          ),
                        )
                      }}
                      large
                      backgroundColor="white"
                    />
                  </GridColumn>
                </GridRow>
              </Box>
              <Box marginBottom={2}>
                <GridRow>
                  <GridColumn span="7/12">
                    <RadioButton
                      name="prosecutor-appeal-decision"
                      id="prosecutor-postpone"
                      label={formatMessage(
                        m.sections.appealDecision.prosecutorPostpone,
                      )}
                      value={CaseAppealDecision.POSTPONE}
                      checked={
                        workingCase.prosecutorAppealDecision ===
                        CaseAppealDecision.POSTPONE
                      }
                      onChange={() => {
                        setWorkingCase({
                          ...workingCase,
                          prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
                        })

                        updateCase(
                          workingCase.id,
                          parseString(
                            'prosecutorAppealDecision',
                            CaseAppealDecision.POSTPONE,
                          ),
                        )
                      }}
                      large
                      backgroundColor="white"
                    />
                  </GridColumn>
                  <GridColumn span="5/12">
                    <RadioButton
                      name="prosecutor-appeal-decision"
                      id="prosecutor-not-applicable"
                      label={formatMessage(
                        m.sections.appealDecision.prosecutorNotApplicable,
                      )}
                      value={CaseAppealDecision.NOT_APPLICABLE}
                      checked={
                        workingCase.prosecutorAppealDecision ===
                        CaseAppealDecision.NOT_APPLICABLE
                      }
                      onChange={() => {
                        setWorkingCase({
                          ...workingCase,
                          prosecutorAppealDecision:
                            CaseAppealDecision.NOT_APPLICABLE,
                        })

                        updateCase(
                          workingCase.id,
                          parseString(
                            'prosecutorAppealDecision',
                            CaseAppealDecision.NOT_APPLICABLE,
                          ),
                        )
                      }}
                      large
                      backgroundColor="white"
                    />
                  </GridColumn>
                </GridRow>
              </Box>
              <Box>
                <Input
                  name="prosecutorAppealAnnouncement"
                  data-testid="prosecutorAppealAnnouncement"
                  label={formatMessage(
                    m.sections.appealDecision.prosecutorAnnouncementLabel,
                  )}
                  value={workingCase.prosecutorAppealAnnouncement || ''}
                  placeholder={formatMessage(
                    m.sections.appealDecision.prosecutorAnnouncementPlaceholder,
                  )}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'prosecutorAppealAnnouncement',
                      event.target.value,
                      [],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'prosecutorAppealAnnouncement',
                      event.target.value,
                      [],
                      workingCase,
                      updateCase,
                    )
                  }
                  textarea
                  rows={7}
                />
              </Box>
            </BlueBox>
          </Box>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.endOfSessionBookings.title)}
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Input
              data-testid="endOfSessionBookings"
              name="endOfSessionBookings"
              label={formatMessage(m.sections.endOfSessionBookings.label)}
              value={workingCase.endOfSessionBookings || ''}
              placeholder={formatMessage(
                m.sections.endOfSessionBookings.placeholder,
              )}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'endOfSessionBookings',
                  event.target.value,
                  [],
                  workingCase,
                  setWorkingCase,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'endOfSessionBookings',
                  event.target.value,
                  [],
                  workingCase,
                  updateCase,
                )
              }
              rows={16}
              textarea
            />
          </Box>
        </Box>
        <Box marginBottom={10}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Þinghald
            </Text>
          </Box>
          <GridContainer>
            <GridRow>
              <GridColumn>
                <TimeInputField
                  onChange={(evt) =>
                    validateAndSetTime(
                      'courtEndTime',
                      workingCase.courtStartDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      setWorkingCase,
                      courtDocumentEndErrorMessage,
                      setCourtDocumentEndErrorMessage,
                    )
                  }
                  onBlur={(evt) =>
                    validateAndSendTimeToServer(
                      'courtEndTime',
                      workingCase.courtStartDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      updateCase,
                      setCourtDocumentEndErrorMessage,
                    )
                  }
                >
                  <Input
                    data-testid="courtEndTime"
                    name="courtEndTime"
                    label="Þinghaldi lauk (kk:mm)"
                    placeholder="Veldu tíma"
                    autoComplete="off"
                    defaultValue={formatDate(
                      workingCase.courtEndTime,
                      TIME_FORMAT,
                    )}
                    errorMessage={courtDocumentEndErrorMessage}
                    hasError={courtDocumentEndErrorMessage !== ''}
                    required
                  />
                </TimeInputField>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.RULING_STEP_ONE_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.CONFIRMATION_ROUTE}/${id}`}
          nextIsDisabled={!isRulingStepTwoValidRC(workingCase)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default RulingStepTwo
