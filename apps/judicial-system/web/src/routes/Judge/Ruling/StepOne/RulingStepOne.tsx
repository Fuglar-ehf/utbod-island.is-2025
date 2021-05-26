import React, { useEffect, useState } from 'react'
import { Accordion, AccordionItem, Box, Text } from '@island.is/island-ui/core'
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
} from '@island.is/judicial-system-web/src/shared-components'
import {
  Case,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  parseArray,
  parseString,
} from '@island.is/judicial-system-web/src/utils/formatters'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  setCheckboxAndSendToServer,
  newSetAndSendDateToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { isolation } from '@island.is/judicial-system-web/src/utils/Restrictions'
import CheckboxList from '@island.is/judicial-system-web/src/shared-components/CheckboxList/CheckboxList'
import { useRouter } from 'next/router'
import DateTime from '@island.is/judicial-system-web/src/shared-components/DateTime/DateTime'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'

export const RulingStepOne: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [custodyEndDateIsValid, setCustodyEndDateIsValid] = useState(true)
  const [isolationToIsValid, setIsolationToIsValid] = useState(true)

  const router = useRouter()
  const id = router.query.id

  const { updateCase } = useCase()
  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    document.title = 'Úrskurður - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      let theCase = data.case

      if (!theCase.custodyRestrictions) {
        theCase = {
          ...theCase,
          custodyRestrictions: theCase.requestedCustodyRestrictions,
        }

        updateCase(
          theCase.id,
          parseArray(
            'custodyRestrictions',
            theCase.requestedCustodyRestrictions || [],
          ),
        )
      }

      if (!theCase.custodyEndDate) {
        theCase = {
          ...theCase,
          custodyEndDate: theCase.requestedCustodyEndDate,
        }

        updateCase(
          theCase.id,
          parseString('custodyEndDate', theCase.requestedCustodyEndDate || ''),
        )
      }

      if (!theCase.isolationTo) {
        theCase = {
          ...theCase,
          isolationTo: theCase.custodyEndDate,
        }

        updateCase(
          theCase.id,
          parseString('isolationTo', theCase.custodyEndDate || ''),
        )
      }

      setWorkingCase(theCase)
    }
  }, [workingCase, setWorkingCase, data, updateCase])

  /**
   * Prefills the ruling of extension cases with the parent case ruling
   * if this case descition is ACCEPTING.
   */
  useEffect(() => {
    if (
      workingCase?.parentCase &&
      workingCase?.decision === CaseDecision.ACCEPTING &&
      !workingCase.ruling
    ) {
      updateCase(
        workingCase.id,
        parseString('ruling', workingCase.parentCase.ruling || ''),
      )
      setWorkingCase({
        ...workingCase,
        ruling: workingCase.parentCase.ruling,
      })
    }
  }, [workingCase, updateCase, setWorkingCase])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.RULING_STEP_ONE}
      isLoading={loading}
      notFound={data?.case === undefined}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={7}>
              <Text as="h1" variant="h1">
                Úrskurður
              </Text>
            </Box>
            <Box component="section" marginBottom={5}>
              <Text variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
              <CaseNumbers workingCase={workingCase} />
            </Box>
            <Box component="section" marginBottom={5}>
              <Accordion>
                <PoliceRequestAccordionItem workingCase={workingCase} />
                <AccordionItem
                  id="caseFileList"
                  label={`Rannsóknargögn (${workingCase.files?.length || 0})`}
                  labelVariant="h3"
                >
                  <CaseFileList
                    caseId={workingCase.id}
                    files={workingCase.files || []}
                  />
                </AccordionItem>
              </Accordion>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  Úrskurður{' '}
                  <Text as="span" fontWeight="semiBold" color="red600">
                    *
                  </Text>
                </Text>
              </Box>
              <Box marginBottom={5}>
                <Decision
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                />
              </Box>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  Niðurstaða
                </Text>
              </Box>
              <RulingInput
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
                isRequired
              />
            </Box>
            {workingCase.decision !== CaseDecision.REJECTING && (
              <Box
                component="section"
                marginBottom={7}
                data-testid="caseDecisionSection"
              >
                <Box marginBottom={2}>
                  <Text as="h3" variant="h3">
                    {workingCase.type === CaseType.CUSTODY &&
                    workingCase.decision === CaseDecision.ACCEPTING
                      ? 'Gæsluvarðhald'
                      : 'Farbann'}
                  </Text>
                </Box>
                <DateTime
                  name="custodyEndDate"
                  datepickerLabel={
                    workingCase.type === CaseType.CUSTODY &&
                    workingCase.decision === CaseDecision.ACCEPTING
                      ? 'Gæsluvarðhald til'
                      : 'Farbann til'
                  }
                  selectedDate={
                    workingCase.custodyEndDate
                      ? new Date(workingCase.custodyEndDate)
                      : undefined
                  }
                  minDate={new Date()}
                  onChange={(date: Date | undefined, valid: boolean) => {
                    newSetAndSendDateToServer(
                      'custodyEndDate',
                      date,
                      valid,
                      workingCase,
                      setWorkingCase,
                      setCustodyEndDateIsValid,
                      updateCase,
                    )
                  }}
                  required
                />
              </Box>
            )}
            {workingCase.type === CaseType.CUSTODY &&
              workingCase.decision === CaseDecision.ACCEPTING && (
                <Box component="section" marginBottom={8}>
                  <Box marginBottom={2}>
                    <Text as="h3" variant="h3">
                      Takmarkanir á gæslu
                    </Text>
                  </Box>
                  <BlueBox>
                    <Box marginBottom={3}>
                      <CheckboxList
                        checkboxes={isolation}
                        selected={workingCase.custodyRestrictions}
                        onChange={(id) =>
                          setCheckboxAndSendToServer(
                            'custodyRestrictions',
                            id,
                            workingCase,
                            setWorkingCase,
                            updateCase,
                          )
                        }
                        fullWidth
                      />
                    </Box>
                    <DateTime
                      name="isolationTo"
                      datepickerLabel="Einangrun til"
                      selectedDate={
                        workingCase.isolationTo
                          ? new Date(workingCase.isolationTo)
                          : workingCase.custodyEndDate
                          ? new Date(workingCase.custodyEndDate)
                          : undefined
                      }
                      // Isolation can never be set in the past.
                      minDate={new Date()}
                      maxDate={
                        workingCase.custodyEndDate
                          ? new Date(workingCase.custodyEndDate)
                          : undefined
                      }
                      onChange={(date: Date | undefined, valid: boolean) => {
                        newSetAndSendDateToServer(
                          'isolationTo',
                          date,
                          valid,
                          workingCase,
                          setWorkingCase,
                          setIsolationToIsValid,
                          updateCase,
                        )
                      }}
                      blueBox={false}
                      backgroundColor={
                        workingCase.custodyRestrictions?.includes(
                          CaseCustodyRestrictions.ISOLATION,
                        )
                          ? 'white'
                          : 'blue'
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
              nextIsDisabled={
                !workingCase.decision ||
                !validate(workingCase.ruling || '', 'empty').isValid ||
                (workingCase.decision !== CaseDecision.REJECTING &&
                  (!custodyEndDateIsValid || !isolationToIsValid))
              }
            />
          </FormContentContainer>
        </>
      ) : null}
    </PageLayout>
  )
}

export default RulingStepOne
