import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { Text, Input, Box, RadioButton } from '@island.is/island-ui/core'
import { isNextDisabled } from '@island.is/judicial-system-web/src/utils/stepHelper'

import {
  FormFooter,
  BlueBox,
  PageLayout,
} from '@island.is/judicial-system-web/src/shared-components'
import { useParams } from 'react-router-dom'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  parseString,
  replaceTabsOnChange,
} from '@island.is/judicial-system-web/src/utils/formatters'
import {
  Case,
  UpdateCase,
  CaseState,
  CaseGender,
  CaseType,
} from '@island.is/judicial-system/types'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import InputMask from 'react-input-mask'
import {
  setAndSendToServer,
  validateAndSendToServer,
  removeTabsValidateAndSet,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { CreateCaseMutation } from '@island.is/judicial-system-web/src/utils/mutations'
import * as styles from './StepOne.treat'

interface CaseData {
  case?: Case
}

interface Props {
  type?: CaseType
}

export const StepOne: React.FC<Props> = ({ type }: Props) => {
  const history = useHistory()
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)

  const [
    policeCaseNumberErrorMessage,
    setPoliceCaseNumberErrorMessage,
  ] = useState<string>('')

  const [nationalIdErrorMessage, setNationalIdErrorMessage] = useState<string>(
    '',
  )

  const [accusedNameErrorMessage, setAccusedNameErrorMessage] = useState<
    string
  >('')

  const [accusedAddressErrorMessage, setAccusedAddressErrorMessage] = useState<
    string
  >('')

  const [defenderEmailErrorMessage, setDefenderEmailErrorMessage] = useState<
    string
  >('')

  const { id } = useParams<{ id: string }>()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const [createCaseMutation, { loading: createLoading }] = useMutation(
    CreateCaseMutation,
  )

  const createCase = async (): Promise<string | undefined> => {
    if (createLoading === false) {
      const { data } = await createCaseMutation({
        variables: {
          input: {
            type: workingCase?.type,
            policeCaseNumber: workingCase?.policeCaseNumber,
            accusedNationalId: workingCase?.accusedNationalId.replace('-', ''),
            accusedName: workingCase?.accusedName,
            accusedAddress: workingCase?.accusedAddress,
            accusedGender: workingCase?.accusedGender,
            defenderName: workingCase?.defenderName,
            defenderEmail: workingCase?.defenderEmail,
            court: 'Héraðsdómur Reykjavíkur',
          },
        },
      })

      const resCase: Case = data?.createCase

      return resCase.id
    }

    return undefined
  }

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)

  const updateCase = async (id: string, updateCase: UpdateCase) => {
    // Only update if id has been set
    if (!id) {
      return null
    }
    const { data } = await updateCaseMutation({
      variables: { input: { id, ...updateCase } },
    })

    const resCase = data?.updateCase

    if (resCase) {
      // Do smoething with the result. In particular, we want th modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }

    return resCase
  }

  const handleNextButtonClick = async () => {
    if (!workingCase) {
      return
    }

    const caseId = workingCase.id === '' ? await createCase() : workingCase.id

    history.push(`${Constants.STEP_TWO_ROUTE}/${caseId}`)
  }

  useEffect(() => {
    document.title = 'Sakborningur - Réttarvörslugátt'
  }, [])

  // Run this if id is in url, i.e. if user is opening an existing request.
  useEffect(() => {
    if (id && !workingCase && data?.case) {
      setWorkingCase(data?.case)
    } else if (!id && !workingCase && type !== undefined) {
      setWorkingCase({
        id: '',
        created: '',
        modified: '',
        type: type,
        state: CaseState.DRAFT,
        policeCaseNumber: '',
        accusedNationalId: '',
        accusedName: '',
        accusedAddress: '',
        defenderName: '',
        defenderEmail: '',
        accusedGender: undefined,
      })
    }
  }, [id, workingCase, setWorkingCase, data, type])

  // Validate step
  useEffect(() => {
    if (workingCase) {
      setIsStepIllegal(
        isNextDisabled([
          {
            value: workingCase.policeCaseNumber,
            validations: ['empty', 'police-casenumber-format'],
          },
          {
            value: workingCase.accusedNationalId || '',
            validations: ['empty', 'national-id'],
          },
          { value: workingCase.accusedName || '', validations: ['empty'] },
          { value: workingCase.accusedAddress || '', validations: ['empty'] },
          {
            value: workingCase.defenderEmail || '',
            validations: ['email-format'],
          },
          {
            value: workingCase.accusedGender || '',
            validations: ['empty'],
          },
        ]),
      )
    } else {
      setIsStepIllegal(true)
    }
  }, [workingCase, setIsStepIllegal])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CREATE_DETENTION_REQUEST_STEP_ONE}
      isLoading={loading}
      notFound={id !== undefined && data?.case === undefined}
      isExtension={workingCase?.parentCase && true}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
    >
      {workingCase ? (
        <>
          <Box marginBottom={7}>
            <Text as="h1" variant="h1">
              Sakborningur
            </Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                Málsnúmer lögreglu
              </Text>
            </Box>
            <InputMask
              // This is temporary until we start reading LÖKE case numbers from LÖKE
              mask="999-9999-9999999"
              maskPlaceholder={null}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'policeCaseNumber',
                  event,
                  ['empty', 'police-casenumber-format'],
                  workingCase,
                  setWorkingCase,
                  policeCaseNumberErrorMessage,
                  setPoliceCaseNumberErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'policeCaseNumber',
                  event.target.value,
                  ['empty', 'police-casenumber-format'],
                  workingCase,
                  updateCase,
                  setPoliceCaseNumberErrorMessage,
                )
              }
            >
              <Input
                data-testid="policeCaseNumber"
                name="policeCaseNumber"
                label="Slá inn LÖKE málsnúmer"
                placeholder="007-2020-X"
                defaultValue={workingCase.policeCaseNumber}
                errorMessage={policeCaseNumberErrorMessage}
                hasError={policeCaseNumberErrorMessage !== ''}
                required
              />
            </InputMask>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Sakborningur
              </Text>
            </Box>
            <BlueBox>
              <Box marginBottom={2}>
                <Text as="h4" variant="h4">
                  Kyn{' '}
                  <Text as="span" color="red600" fontWeight="semiBold">
                    *
                  </Text>
                </Text>
              </Box>
              <Box marginBottom={2} className={styles.genderContainer}>
                <Box className={styles.genderColumn}>
                  <RadioButton
                    name="accused-gender"
                    id="genderMale"
                    label="Karl"
                    checked={workingCase.accusedGender === CaseGender.MALE}
                    onChange={() =>
                      setAndSendToServer(
                        'accusedGender',
                        CaseGender.MALE,
                        workingCase,
                        setWorkingCase,
                        updateCase,
                      )
                    }
                    large
                    filled
                  />
                </Box>
                <Box className={styles.genderColumn}>
                  <RadioButton
                    name="accused-gender"
                    id="genderFemale"
                    label="Kona"
                    checked={workingCase.accusedGender === CaseGender.FEMALE}
                    onChange={() =>
                      setAndSendToServer(
                        'accusedGender',
                        CaseGender.FEMALE,
                        workingCase,
                        setWorkingCase,
                        updateCase,
                      )
                    }
                    large
                    filled
                  />
                </Box>
                <Box className={styles.genderColumn}>
                  <RadioButton
                    name="accused-gender"
                    id="genderOther"
                    label="Kynsegin/Annað"
                    checked={workingCase.accusedGender === CaseGender.OTHER}
                    onChange={() =>
                      setAndSendToServer(
                        'accusedGender',
                        CaseGender.OTHER,
                        workingCase,
                        setWorkingCase,
                        updateCase,
                      )
                    }
                    large
                    filled
                  />
                </Box>
              </Box>
              <Box marginBottom={2}>
                <InputMask
                  mask="999999-9999"
                  maskPlaceholder={null}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'accusedNationalId',
                      event,
                      ['empty', 'national-id'],
                      workingCase,
                      setWorkingCase,
                      nationalIdErrorMessage,
                      setNationalIdErrorMessage,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'accusedNationalId',
                      event.target.value,
                      ['empty', 'national-id'],
                      workingCase,
                      updateCase,
                      setNationalIdErrorMessage,
                    )
                  }
                >
                  <Input
                    data-testid="nationalId"
                    name="nationalId"
                    label="Kennitala"
                    placeholder="Kennitala"
                    defaultValue={workingCase.accusedNationalId}
                    errorMessage={nationalIdErrorMessage}
                    hasError={nationalIdErrorMessage !== ''}
                    required
                  />
                </InputMask>
              </Box>
              <Box marginBottom={2}>
                <Input
                  data-testid="accusedName"
                  name="accusedName"
                  label="Fullt nafn"
                  placeholder="Fullt nafn"
                  defaultValue={workingCase.accusedName}
                  errorMessage={accusedNameErrorMessage}
                  hasError={accusedNameErrorMessage !== ''}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'accusedName',
                      event,
                      ['empty'],
                      workingCase,
                      setWorkingCase,
                      accusedNameErrorMessage,
                      setAccusedNameErrorMessage,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'accusedName',
                      event.target.value,
                      ['empty'],
                      workingCase,
                      updateCase,
                      setAccusedNameErrorMessage,
                    )
                  }
                  required
                />
              </Box>
              <Input
                data-testid="accusedAddress"
                name="accusedAddress"
                label="Lögheimili/dvalarstaður"
                placeholder="Lögheimili eða dvalarstaður"
                defaultValue={workingCase.accusedAddress}
                errorMessage={accusedAddressErrorMessage}
                hasError={accusedAddressErrorMessage !== ''}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'accusedAddress',
                    event,
                    ['empty'],
                    workingCase,
                    setWorkingCase,
                    accusedAddressErrorMessage,
                    setAccusedAddressErrorMessage,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'accusedAddress',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setAccusedAddressErrorMessage,
                  )
                }
                required
              />
            </BlueBox>
          </Box>
          <Box component="section" marginBottom={7}>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="baseline"
              marginBottom={2}
            >
              <Text as="h3" variant="h3">
                Verjandi sakbornings
              </Text>
            </Box>
            <Box marginBottom={2}>
              <Input
                name="defenderName"
                label="Nafn verjanda"
                placeholder="Fullt nafn"
                defaultValue={workingCase.defenderName}
                onBlur={(evt) => {
                  if (workingCase.defenderName !== evt.target.value) {
                    setWorkingCase({
                      ...workingCase,
                      defenderName: evt.target.value,
                    })

                    updateCase(
                      workingCase.id,
                      parseString('defenderName', evt.target.value),
                    )
                  }
                }}
                onChange={replaceTabsOnChange}
              />
            </Box>
            <Input
              name="defenderEmail"
              label="Netfang verjanda"
              placeholder="Netfang"
              defaultValue={workingCase.defenderEmail}
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
            previousUrl={Constants.REQUEST_LIST_ROUTE}
            onNextButtonClick={async () => await handleNextButtonClick()}
            nextIsLoading={createLoading}
            nextIsDisabled={isStepIllegal || createLoading}
            nextButtonText={
              workingCase.id === '' ? 'Stofna kröfu' : 'Halda áfram'
            }
          />
        </>
      ) : null}
    </PageLayout>
  )
}

export default StepOne
