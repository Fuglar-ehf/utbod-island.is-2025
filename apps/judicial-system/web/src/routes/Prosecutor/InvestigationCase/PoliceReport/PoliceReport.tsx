import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  BlueBox,
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
import { icReportForm, titles } from '@island.is/judicial-system-web/messages'
import { isPoliceReportStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import { Box, Checkbox, Input, Tooltip, Text } from '@island.is/island-ui/core'
import CommentsInput from '@island.is/judicial-system-web/src/components/CommentsInput/CommentsInput'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase, useDeb } from '@island.is/judicial-system-web/src/utils/hooks'
import * as constants from '@island.is/judicial-system/consts'

const PoliceReport = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const [caseFactsEM, setCaseFactsEM] = useState<string>('')
  const [legalArgumentsEM, setLegalArgumentsEM] = useState<string>('')
  const { updateCase, setAndSendCaseToServer } = useCase()

  useDeb(workingCase, [
    'caseFacts',
    'legalArguments',
    'prosecutorOnlySessionRequest',
  ])

  useEffect(() => {
    if (
      !workingCase.prosecutorOnlySessionRequest &&
      workingCase.requestProsecutorOnlySession
    ) {
      setAndSendCaseToServer(
        [
          {
            prosecutorOnlySessionRequest: formatMessage(
              icReportForm.prosecutorOnly.input.defaultValue,
            ),
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }, [formatMessage, setAndSendCaseToServer, setWorkingCase, workingCase])

  const stepIsValid = isPoliceReportStepValidIC(workingCase)
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={RestrictionCaseProsecutorSubsections.POLICE_REPORT}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      onNavigationTo={handleNavigationTo}
      isValid={stepIsValid}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.investigationCases.policeReport)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(icReportForm.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <Box marginBottom={5}>
          <BlueBox>
            <Text>{workingCase.demands}</Text>
          </BlueBox>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(icReportForm.caseFacts.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(icReportForm.caseFacts.tooltip)}
              />
            </Text>
          </Box>
          <Input
            data-testid="caseFacts"
            name="caseFacts"
            label={formatMessage(icReportForm.caseFacts.label)}
            placeholder={formatMessage(icReportForm.caseFacts.placeholder)}
            errorMessage={caseFactsEM}
            hasError={caseFactsEM !== ''}
            value={workingCase.caseFacts || ''}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'caseFacts',
                event.target.value,
                ['empty'],
                workingCase,
                setWorkingCase,
                caseFactsEM,
                setCaseFactsEM,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'caseFacts',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setCaseFactsEM,
              )
            }
            required
            rows={14}
            autoExpand={{ on: true, maxHeight: 600 }}
            textarea
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(icReportForm.legalArguments.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(icReportForm.legalArguments.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Input
              data-testid="legalArguments"
              name="legalArguments"
              label={formatMessage(icReportForm.legalArguments.label)}
              placeholder={formatMessage(
                icReportForm.legalArguments.placeholder,
              )}
              value={workingCase.legalArguments || ''}
              errorMessage={legalArgumentsEM}
              hasError={legalArgumentsEM !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'legalArguments',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  legalArgumentsEM,
                  setLegalArgumentsEM,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'legalArguments',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setLegalArgumentsEM,
                )
              }
              required
              textarea
              rows={14}
              autoExpand={{ on: true, maxHeight: 600 }}
            />
          </Box>
          <Box component="section" marginBottom={5}>
            <BlueBox>
              <Box marginBottom={2}>
                <Checkbox
                  name="request-prosecutor-only-session"
                  label={formatMessage(
                    icReportForm.prosecutorOnly.checkbox.label,
                  )}
                  tooltip={formatMessage(
                    icReportForm.prosecutorOnly.checkbox.tooltip,
                  )}
                  checked={workingCase.requestProsecutorOnlySession}
                  onChange={(evt) => {
                    setWorkingCase({
                      ...workingCase,
                      requestProsecutorOnlySession: evt.target.checked,
                    })
                    updateCase(workingCase.id, {
                      requestProsecutorOnlySession: evt.target.checked,
                    })
                  }}
                  filled
                  large
                />
              </Box>
              <Input
                name="prosecutor-only-session-request"
                label={formatMessage(icReportForm.prosecutorOnly.input.label)}
                placeholder={formatMessage(
                  icReportForm.prosecutorOnly.input.placeholder,
                )}
                disabled={workingCase.requestProsecutorOnlySession === false}
                value={workingCase.prosecutorOnlySessionRequest || ''}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'prosecutorOnlySessionRequest',
                    event.target.value,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'prosecutorOnlySessionRequest',
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
            </BlueBox>
          </Box>
          <Box component="section" marginBottom={10}>
            <CommentsInput
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
            />
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INVESTIGATION_CASE_CASE_FILES_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default PoliceReport
