import React, { useCallback, useContext, useEffect, useState } from 'react'
import { MessageDescriptor, useIntl } from 'react-intl'
import router from 'next/router'

import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageLayout,
  ProsecutorCaseInfo,
} from '@island.is/judicial-system-web/src/components'
import {
  RestrictionCaseProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  core,
  icDemands,
  titles,
} from '@island.is/judicial-system-web/messages'
import { Box, Input, Text } from '@island.is/island-ui/core'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase, useDeb } from '@island.is/judicial-system-web/src/utils/hooks'
import { CaseType } from '@island.is/judicial-system/types'
import { enumerate, formatDOB } from '@island.is/judicial-system/formatters'
import { isPoliceDemandsStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'

import * as constants from '@island.is/judicial-system/consts'

export const formatInstitutionName = (name: string | undefined) => {
  if (!name) return ''

  if (name.startsWith('Lögreglustjórinn')) {
    return name.replace('Lögreglustjórinn', 'lögreglustjóranum')
  }
  if (name.endsWith('saksóknari')) {
    return name.toLocaleLowerCase().replace('saksóknari', 'saksóknara')
  }

  return ''
}

const PoliceDemands: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { updateCase, setAndSendCaseToServer } = useCase()
  const [demandsEM, setDemandsEM] = useState<string>('')
  const [lawsBrokenEM, setLawsBrokenEM] = useState<string>('')
  const [legalBasisEM, setLegalBasisEM] = useState<string>('')
  const [initialAutoFillDone, setInitialAutoFillDone] = useState(false)

  useDeb(workingCase, ['demands', 'lawsBroken', 'legalBasis'])

  useEffect(() => {
    const courtClaimPrefill: Partial<
      Record<
        CaseType,
        {
          text: MessageDescriptor
          format?: {
            court?: boolean
            accused?: boolean
            address?: boolean
            institution?: boolean
            year?: boolean
            live?: boolean
          }
        }
      >
    > = {
      [CaseType.SEARCH_WARRANT]: {
        text: icDemands.sections.demands.prefill.searchWarrant2,
        format: {
          court: true,
          accused: true,
          address: true,
          institution: true,
          live: true,
        },
      },
      [CaseType.BANKING_SECRECY_WAIVER]: {
        text: icDemands.sections.demands.prefill.bankingSecrecyWaiver2,
        format: { court: true, accused: true },
      },
      [CaseType.PHONE_TAPPING]: {
        text: icDemands.sections.demands.prefill.phoneTapping2,
        format: { court: true, institution: true, accused: true },
      },
      [CaseType.TELECOMMUNICATIONS]: {
        text: icDemands.sections.demands.prefill.teleCommunications2,
        format: { court: true, institution: true, accused: true },
      },
      [CaseType.TRACKING_EQUIPMENT]: {
        text: icDemands.sections.demands.prefill.trackingEquipment2,
        format: { court: true, institution: true, accused: true },
      },
      [CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION]: {
        text:
          icDemands.sections.demands.prefill
            .electronicDataDiscoveryInvestigation,
        format: {
          court: true,
          institution: true,
          accused: true,
          address: true,
          year: true,
        },
      },
    }

    if (isCaseUpToDate && !initialAutoFillDone) {
      if (workingCase.defendants && workingCase.defendants.length > 0) {
        const courtClaim = courtClaimPrefill[workingCase.type]
        const courtClaimText = courtClaim
          ? formatMessage(courtClaim.text, {
              ...(courtClaim.format?.accused && {
                accused: enumerate(
                  workingCase.defendants.map(
                    (defendant) =>
                      `${defendant.name} ${`${formatDOB(
                        defendant.nationalId,
                        defendant.noNationalId,
                        '',
                      )}`.trim()}`,
                  ),
                  formatMessage(core.and),
                ),
              }),
              ...(courtClaim.format?.address && {
                address: workingCase.defendants.find((x) => x.address)?.address,
              }),
              ...(courtClaim.format?.court && {
                court: workingCase.court?.name,
              }),
              ...(courtClaim.format?.institution && {
                institution: formatInstitutionName(
                  workingCase.creatingProsecutor?.institution?.name,
                ),
              }),
              ...(courtClaim.format?.live && {
                live: workingCase.defendants.length,
              }),
              ...(courtClaim.format?.year && {
                year: new Date().getFullYear(),
              }),
            })
          : undefined

        setAndSendCaseToServer(
          [{ demands: courtClaimText }],
          workingCase,
          setWorkingCase,
        )
      }

      setInitialAutoFillDone(true)
    }
  }, [
    setAndSendCaseToServer,
    formatMessage,
    initialAutoFillDone,
    isCaseUpToDate,
    setWorkingCase,
    workingCase,
  ])

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  const stepIsValid = isPoliceDemandsStepValidIC(workingCase)

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={RestrictionCaseProsecutorSubsections.POLICE_DEMANDS}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={workingCase?.parentCase && true}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(
          titles.prosecutor.investigationCases.policeDemands,
        )}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(icDemands.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(icDemands.sections.demands.heading)}
            </Text>
          </Box>
          <Input
            data-testid="demands"
            name="demands"
            label={formatMessage(icDemands.sections.demands.label)}
            placeholder={formatMessage(icDemands.sections.demands.placeholder)}
            value={workingCase.demands || ''}
            errorMessage={demandsEM}
            hasError={demandsEM !== ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'demands',
                event.target.value,
                ['empty'],
                workingCase,
                setWorkingCase,
                demandsEM,
                setDemandsEM,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'demands',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setDemandsEM,
              )
            }
            required
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(icDemands.sections.lawsBroken.heading)}
            </Text>
          </Box>
          <Input
            data-testid="lawsBroken"
            name="lawsBroken"
            label={formatMessage(icDemands.sections.lawsBroken.label, {
              defendant: 'varnaraðila',
            })}
            placeholder={formatMessage(
              icDemands.sections.lawsBroken.placeholder,
            )}
            value={workingCase.lawsBroken || ''}
            errorMessage={lawsBrokenEM}
            hasError={lawsBrokenEM !== ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'lawsBroken',
                event.target.value,
                ['empty'],
                workingCase,
                setWorkingCase,
                lawsBrokenEM,
                setLawsBrokenEM,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'lawsBroken',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setLawsBrokenEM,
              )
            }
            required
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(icDemands.sections.legalBasis.heading)}
            </Text>
          </Box>
          <Input
            data-testid="legalBasis"
            name="legalBasis"
            label={formatMessage(icDemands.sections.legalBasis.label)}
            placeholder={formatMessage(
              icDemands.sections.legalBasis.placeholder,
            )}
            value={workingCase.legalBasis || ''}
            errorMessage={legalBasisEM}
            hasError={legalBasisEM !== ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'legalBasis',
                event.target.value,
                ['empty'],
                workingCase,
                setWorkingCase,
                legalBasisEM,
                setLegalBasisEM,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'legalBasis',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setLegalBasisEM,
              )
            }
            required
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INVESTIGATION_CASE_POLICE_REPORT_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default PoliceDemands
