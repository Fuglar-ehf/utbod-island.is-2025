import React, { useCallback, useMemo, useState } from 'react'
import { IntlShape, useIntl } from 'react-intl'
import { ValueType } from 'react-select'
import InputMask from 'react-input-mask'

import {
  Box,
  Input,
  Select,
  Button,
  Tag,
  Icon,
} from '@island.is/island-ui/core'
import {
  ReactSelectOption,
  TempCase as Case,
  TempIndictmentCount as TIndictmentCount,
} from '@island.is/judicial-system-web/src/types'
import {
  offenseSubstances,
  Substance,
  SubstanceMap,
} from '@island.is/judicial-system/types'
import {
  BlueBox,
  IndictmentInfo,
} from '@island.is/judicial-system-web/src/components'
import { UpdateIndictmentCount } from '@island.is/judicial-system-web/src/utils/hooks/useIndictmentCounts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { IndictmentCountOffense } from '@island.is/judicial-system-web/src/graphql/schema'

import { Substances as SubstanceChoices } from './Substances/Substances'
import { indictmentCount as strings } from './IndictmentCount.strings'
import { indictmentCountEnum as enumStrings } from './IndictmentCountEnum.strings'
import { indictmentCountSubstanceEnum as substanceStrings } from './IndictmentCountSubstanceEnum.strings'

interface Props {
  indictmentCount: TIndictmentCount
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  onChange: (
    indictmentCountId: string,
    updatedIndictmentCount: UpdateIndictmentCount,
  ) => void
  onDelete?: (indictmentCountId: string) => Promise<void>
  updateIndictmentCountState: (
    indictmentCountId: string,
    update: UpdateIndictmentCount,
    setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
  ) => void
}

function offensesCompare(
  offense1: IndictmentCountOffense,
  offense2: IndictmentCountOffense,
) {
  const offense1Index = Object.values(IndictmentCountOffense).indexOf(offense1)
  const offense2Index = Object.values(IndictmentCountOffense).indexOf(offense2)

  if (offense1Index < offense2Index) {
    return -1
  }
  if (offense1Index > offense2Index) {
    return 1
  }
  return 0
}

const offenseLawsMap: Record<
  IndictmentCountOffense | 'DRUNK_DRIVING_MINOR' | 'DRUNK_DRIVING_MAJOR',
  [number, number][]
> = {
  [IndictmentCountOffense.DrivingWithoutLicence]: [[58, 1]],
  [IndictmentCountOffense.DrunkDriving]: [[49, 1]],
  DRUNK_DRIVING_MINOR: [[49, 2]],
  DRUNK_DRIVING_MAJOR: [[49, 3]],
  [IndictmentCountOffense.IllegalDrugsDriving]: [
    [50, 1],
    [50, 2],
  ],
  [IndictmentCountOffense.PrescriptionDrugsDriving]: [
    [48, 1],
    [48, 2],
  ],
}
const generalLaws: [number, number][] = [[95, 1]]

function lawsCompare(law1: number[], law2: number[]) {
  if (law1[0] < law2[0]) {
    return -1
  }
  if (law1[0] > law2[0]) {
    return 1
  }
  if (law1[1] < law2[1]) {
    return -1
  }
  if (law1[1] > law2[1]) {
    return 1
  }
  return 0
}

const laws = Object.values(offenseLawsMap)
  .flat()
  .concat(generalLaws)
  .sort(lawsCompare)

function getLawsBroken(
  offenses: IndictmentCountOffense[],
  substances?: SubstanceMap,
) {
  if (offenses.length === 0) {
    return []
  }

  let lawsBroken: [number, number][] = []

  offenses.forEach((offence) => {
    lawsBroken = lawsBroken.concat(offenseLawsMap[offence])

    if (offence === IndictmentCountOffense.DrunkDriving) {
      lawsBroken = lawsBroken.concat(
        ((substances && substances.ALCOHOL) || '') >= '1,20'
          ? offenseLawsMap.DRUNK_DRIVING_MAJOR
          : offenseLawsMap.DRUNK_DRIVING_MINOR,
      )
    }
  })

  return lawsBroken.concat(generalLaws).sort(lawsCompare)
}

interface LawsBrokenOption {
  label: string
  value: string
  law: [number, number]
  disabled: boolean
}

export function getRelevantSubstances(
  offenses: IndictmentCountOffense[],
  substances: SubstanceMap,
) {
  const allowedSubstances = offenses.map(
    (offense) => offenseSubstances[offense],
  )

  const relevantSubstances = allowedSubstances
    .map((allowedSubstance) => {
      return Object.entries(substances).filter((substance) => {
        return allowedSubstance.includes(substance[0] as Substance)
      })
    })
    .flat()
  return relevantSubstances
}

function getIndictmentDescriptionReason(
  offenses: IndictmentCountOffense[],
  substances: SubstanceMap,
  formatMessage: IntlShape['formatMessage'],
) {
  let reason = offenses.reduce((acc, offense, index) => {
    if (
      offenses.length > 1 &&
      (index === offenses.length - 1 ||
        offense === IndictmentCountOffense.IllegalDrugsDriving)
    ) {
      acc += ' og '
    } else if (index > 0) {
      acc += ', '
    }
    switch (offense) {
      case IndictmentCountOffense.DrivingWithoutLicence:
        acc += formatMessage(
          strings.incidentDescriptionDrivingWithoutLicenceAutofill,
        )
        break
      case IndictmentCountOffense.DrunkDriving:
        acc += formatMessage(strings.incidentDescriptionDrunkDrivingAutofill)
        break
      case IndictmentCountOffense.IllegalDrugsDriving:
        acc += `${formatMessage(
          strings.incidentDescriptionDrugsDrivingPrefixAutofill,
        )} ${formatMessage(
          strings.incidentDescriptionIllegalDrugsDrivingAutofill,
        )}`
        break
      case IndictmentCountOffense.PrescriptionDrugsDriving:
        acc += offenses.includes(IndictmentCountOffense.IllegalDrugsDriving)
          ? ''
          : `${formatMessage(
              strings.incidentDescriptionDrugsDrivingPrefixAutofill,
            )} ${formatMessage(
              strings.incidentDescriptionPrescriptionDrugsDrivingAutofill,
            )}`
        break
    }
    return acc
  }, '')

  const relevantSubstances = getRelevantSubstances(offenses, substances)

  reason += relevantSubstances.reduce((acc, substance, index) => {
    if (index === 0) {
      acc += ` (${formatMessage(
        strings.incidentDescriptionSubstancesPrefixAutofill,
      )} `
    } else if (index === relevantSubstances.length - 1) {
      acc += ' og '
    } else {
      acc += ', '
    }
    acc += formatMessage(substanceStrings[substance[0] as Substance], {
      amount: substance[1],
    })
    if (index === relevantSubstances.length - 1) {
      acc += ')'
    }
    return acc
  }, '')

  return reason
}

export const IndictmentCount: React.FC<Props> = (props) => {
  const {
    indictmentCount,
    workingCase,
    onChange,
    onDelete,
    updateIndictmentCountState,
    setWorkingCase,
  } = props
  const { formatMessage } = useIntl()

  const [
    vehicleRegistrationNumberErrorMessage,
    setVehicleRegistrationNumberErrorMessage,
  ] = useState<string>('')
  const [
    incidentDescriptionErrorMessage,
    setIncidentDescriptionErrorMessage,
  ] = useState<string>('')
  const [
    bloodAlcoholContentErrorMessage,
    setBloodAlcoholContentErrorMessage,
  ] = useState<string>('')
  const [
    legalArgumentsErrorMessage,
    setLegalArgumentsErrorMessage,
  ] = useState<string>('')

  const lawTag = useCallback(
    (law: number[]) =>
      formatMessage(strings.lawsBrokenTag, {
        paragraph: law[1],
        article: law[0],
      }),
    [formatMessage],
  )

  const offensesOptions = useMemo(
    () =>
      Object.values(IndictmentCountOffense).map((offense) => ({
        value: offense,
        label: formatMessage(enumStrings[offense]),
        disabled: indictmentCount.offenses?.includes(offense),
      })),
    [formatMessage, indictmentCount.offenses],
  )

  const lawsBrokenOptions: LawsBrokenOption[] = useMemo(
    () =>
      laws.map((law, index) => ({
        label: lawTag(law),
        value: `${index}`,
        law,
        disabled: Boolean(
          indictmentCount.lawsBroken?.find(
            (brokenLaw) => brokenLaw[0] === law[0] && brokenLaw[1] === law[1],
          ),
        ),
      })),
    [lawTag, indictmentCount.lawsBroken],
  )

  const legalArguments = useCallback(
    (lawsBroken: number[][]) => {
      if (lawsBroken.length === 0) {
        return ''
      }

      let articles = `${lawsBroken[0][1]}.`

      for (let i = 1; i < lawsBroken.length; i++) {
        if (lawsBroken[i][0] !== lawsBroken[i - 1][0]) {
          articles = `${articles} mgr. ${lawsBroken[i - 1][0]}. gr.`
        }

        articles = `${articles}, sbr. ${lawsBroken[i][1]}.`
      }

      return formatMessage(strings.legalArgumentsAutofill, {
        articles: `${articles} mgr. ${
          lawsBroken[lawsBroken.length - 1][0]
        }. gr.`,
      })
    },
    [formatMessage],
  )

  const incidentDescription = useCallback(
    (indictmentCount: TIndictmentCount) => {
      const {
        offenses,
        substances,
        policeCaseNumber,
        vehicleRegistrationNumber,
      } = indictmentCount

      if (offenses?.length === 0) {
        return ''
      }

      let incidentLocation = ''
      let incidentDate = ''
      let incidentDescription = ''

      if (workingCase.crimeScenes && policeCaseNumber) {
        const crimeScenes = workingCase.crimeScenes
        const crimeDate = crimeScenes[policeCaseNumber].date

        incidentLocation = crimeScenes[policeCaseNumber].place ?? ''
        incidentDate =
          formatDate(crimeDate, 'PPPP')?.replace('dagur,', 'daginn') ?? ''
      }

      const reason = getIndictmentDescriptionReason(
        offenses ?? [],
        substances ?? {},
        formatMessage,
      )

      incidentDescription = formatMessage(strings.incidentDescriptionAutofill, {
        incidentDate: incidentDate ? incidentDate : '[Dagsetning]',
        vehicleRegistrationNumber: vehicleRegistrationNumber
          ? vehicleRegistrationNumber
          : '[Skráningarnúmer ökutækis]',
        reason,
        incidentLocation: incidentLocation ? incidentLocation : '[Vettvangur]',
      })

      setIncidentDescriptionErrorMessage('')

      return incidentDescription
    },
    [formatMessage, workingCase.crimeScenes],
  )

  const handleIndictmentCountChanges = (update: UpdateIndictmentCount) => {
    let lawsBroken

    if (update.substances || update.offenses) {
      lawsBroken = getLawsBroken(
        update.offenses || indictmentCount.offenses || [],
        update.substances || indictmentCount.substances,
      )
    }

    if (lawsBroken !== undefined) {
      update.lawsBroken = lawsBroken
      update.legalArguments = legalArguments(lawsBroken)
    }

    onChange(indictmentCount.id, {
      incidentDescription: incidentDescription({
        ...indictmentCount,
        ...update,
      }),
      ...update,
    })
  }

  return (
    <BlueBox>
      {onDelete && (
        <Box marginBottom={2} display="flex" justifyContent="flexEnd">
          <Button
            onClick={() => onDelete(indictmentCount.id)}
            colorScheme="destructive"
            variant="text"
            size="small"
          >
            {formatMessage(strings.delete)}
          </Button>
        </Box>
      )}
      <Box marginBottom={1}>
        <Select
          name="policeCaseNumber"
          options={workingCase.policeCaseNumbers.map((val) => ({
            value: val,
            label: val,
          }))}
          label={formatMessage(strings.policeCaseNumberLabel)}
          placeholder={formatMessage(strings.policeCaseNumberPlaceholder)}
          onChange={async (so: ValueType<ReactSelectOption>) => {
            const policeCaseNumber = (so as ReactSelectOption).value as string

            handleIndictmentCountChanges({ policeCaseNumber })
          }}
          value={
            workingCase.policeCaseNumbers
              .map((val) => ({
                value: val,
                label: val,
              }))
              .find(
                (val) =>
                  val?.value === indictmentCount.policeCaseNumber?.toString(),
              ) ?? null
          }
          required
        />
      </Box>
      <Box marginBottom={3}>
        <IndictmentInfo
          policeCaseNumber={indictmentCount.policeCaseNumber ?? ''}
          subtypes={workingCase.indictmentSubtypes}
          crimeScenes={workingCase.crimeScenes}
        />
      </Box>
      <Box marginBottom={2}>
        <InputMask
          mask={'**-*99'}
          maskPlaceholder={null}
          value={indictmentCount.vehicleRegistrationNumber ?? ''}
          beforeMaskedStateChange={({ nextState }) => {
            let { value } = nextState
            value = value.toUpperCase()

            return { ...nextState, value }
          }}
          onChange={(event) => {
            removeErrorMessageIfValid(
              ['empty', 'vehicle-registration-number'],
              event.target.value,
              vehicleRegistrationNumberErrorMessage,
              setVehicleRegistrationNumberErrorMessage,
            )

            updateIndictmentCountState(
              indictmentCount.id,
              {
                vehicleRegistrationNumber: event.target.value,
              },
              setWorkingCase,
            )
          }}
          onBlur={async (event) => {
            validateAndSetErrorMessage(
              ['empty', 'vehicle-registration-number'],
              event.target.value,
              setVehicleRegistrationNumberErrorMessage,
            )

            handleIndictmentCountChanges({
              vehicleRegistrationNumber: event.target.value,
            })
          }}
        >
          <Input
            name="vehicleRegistrationNumber"
            autoComplete="off"
            label={formatMessage(strings.vehicleRegistrationNumberLabel)}
            placeholder={formatMessage(
              strings.vehicleRegistrationNumberPlaceholder,
            )}
            errorMessage={vehicleRegistrationNumberErrorMessage}
            hasError={vehicleRegistrationNumberErrorMessage !== ''}
            required
          />
        </InputMask>
      </Box>
      <Box marginBottom={2}>
        <Select
          name="offenses"
          options={offensesOptions}
          label={formatMessage(strings.incidentLabel)}
          placeholder={formatMessage(strings.incidentPlaceholder)}
          onChange={(so: ValueType<ReactSelectOption>) => {
            const selectedOffense = (so as ReactSelectOption)
              .value as IndictmentCountOffense
            const offenses = [
              ...(indictmentCount.offenses ?? []),
              selectedOffense,
            ].sort(offensesCompare)

            handleIndictmentCountChanges({
              offenses,
            })
          }}
          value={null}
          required
        />
      </Box>
      {indictmentCount.offenses && indictmentCount.offenses.length > 0 && (
        <Box marginBottom={2}>
          {indictmentCount.offenses.map((offense) => (
            <Box
              display="inlineBlock"
              key={`${indictmentCount.id}-${offense}`}
              component="span"
              marginBottom={1}
              marginRight={1}
            >
              <Tag
                variant="darkerBlue"
                onClick={() => {
                  const offenses = (indictmentCount.offenses ?? []).filter(
                    (o) => o !== offense,
                  )

                  offenseSubstances[offense].forEach((e) => {
                    if (indictmentCount.substances) {
                      delete indictmentCount.substances[e]
                    }
                  })

                  handleIndictmentCountChanges({
                    offenses,
                    substances: indictmentCount.substances,
                  })
                }}
              >
                <Box display="flex" alignItems="center">
                  {formatMessage(enumStrings[offense])}
                  <Icon icon="close" size="small" />
                </Box>
              </Tag>
            </Box>
          ))}
        </Box>
      )}
      {indictmentCount.offenses?.includes(
        IndictmentCountOffense.DrunkDriving,
      ) && (
        <Box marginBottom={2}>
          <InputMask
            mask={'9,99'}
            maskPlaceholder={null}
            value={indictmentCount.substances?.ALCOHOL ?? ''}
            onChange={(event) => {
              removeErrorMessageIfValid(
                ['empty'],
                event.target.value,
                bloodAlcoholContentErrorMessage,
                setBloodAlcoholContentErrorMessage,
              )

              updateIndictmentCountState(
                indictmentCount.id,
                {
                  substances: {
                    ...indictmentCount.substances,
                    ALCOHOL: event.target.value,
                  },
                },
                setWorkingCase,
              )
            }}
            onBlur={(event) => {
              const value =
                event.target.value.length > 0
                  ? `${event.target.value}${'0,00'.slice(
                      event.target.value.length,
                    )}`
                  : event.target.value

              validateAndSetErrorMessage(
                ['empty'],
                value,
                setBloodAlcoholContentErrorMessage,
              )

              const substances = {
                ...indictmentCount.substances,
                ALCOHOL: value,
              }

              handleIndictmentCountChanges({
                substances,
              })
            }}
          >
            <Input
              name="alcohol"
              autoComplete="off"
              label={formatMessage(strings.bloodAlcoholContentLabel)}
              placeholder={formatMessage(
                strings.bloodAlcoholContentPlaceholder,
              )}
              errorMessage={bloodAlcoholContentErrorMessage}
              hasError={bloodAlcoholContentErrorMessage !== ''}
              required
            />
          </InputMask>
        </Box>
      )}
      {indictmentCount.offenses
        ?.filter(
          (offenseType) =>
            offenseType === IndictmentCountOffense.IllegalDrugsDriving ||
            offenseType === IndictmentCountOffense.PrescriptionDrugsDriving,
        )
        .map((offenseType) => (
          <Box key={`${indictmentCount.id}-${offenseType}-substances`}>
            <SubstanceChoices
              indictmentCount={indictmentCount}
              indictmentCountOffenseType={offenseType}
              onChange={handleIndictmentCountChanges}
            ></SubstanceChoices>
          </Box>
        ))}
      <Box marginBottom={2}>
        <Select
          name="lawsBroken"
          options={lawsBrokenOptions}
          label={formatMessage(strings.lawsBrokenLabel)}
          placeholder={formatMessage(strings.lawsBrokenPlaceholder)}
          value={null}
          onChange={(selectedOption: ValueType<ReactSelectOption>) => {
            const law = (selectedOption as LawsBrokenOption).law
            const lawsBroken = [
              ...(indictmentCount.lawsBroken ?? []),
              law,
            ].sort(lawsCompare)

            onChange(indictmentCount.id, {
              lawsBroken: lawsBroken,
              legalArguments: legalArguments(lawsBroken),
            })

            handleIndictmentCountChanges({
              lawsBroken,
            })
          }}
          required
        />
      </Box>
      {indictmentCount.lawsBroken && indictmentCount.lawsBroken.length > 0 && (
        <Box marginBottom={2}>
          {indictmentCount.lawsBroken.map((brokenLaw) => (
            <Box
              display="inlineBlock"
              key={`${indictmentCount.id}-${brokenLaw}`}
              component="span"
              marginBottom={1}
              marginRight={1}
            >
              <Tag
                variant="darkerBlue"
                onClick={() => {
                  const lawsBroken = (indictmentCount.lawsBroken ?? []).filter(
                    (b) => lawsCompare(b, brokenLaw) !== 0,
                  )

                  onChange(indictmentCount.id, {
                    lawsBroken: lawsBroken,
                    legalArguments: legalArguments(lawsBroken),
                  })
                }}
                aria-label={lawTag(brokenLaw)}
              >
                <Box display="flex" alignItems="center">
                  {lawTag(brokenLaw)}
                  <Icon icon="close" size="small" />
                </Box>
              </Tag>
            </Box>
          ))}
        </Box>
      )}
      <Box component="section" marginBottom={2}>
        <Box marginBottom={2}>
          <Input
            name="incidentDescription"
            autoComplete="off"
            label={formatMessage(strings.incidentDescriptionLabel)}
            placeholder={formatMessage(strings.incidentDescriptionPlaceholder)}
            errorMessage={incidentDescriptionErrorMessage}
            hasError={incidentDescriptionErrorMessage !== ''}
            value={indictmentCount.incidentDescription ?? ''}
            onChange={(event) => {
              removeErrorMessageIfValid(
                ['empty'],
                event.target.value,
                incidentDescriptionErrorMessage,
                setIncidentDescriptionErrorMessage,
              )

              updateIndictmentCountState(
                indictmentCount.id,
                { incidentDescription: event.target.value },
                setWorkingCase,
              )
            }}
            onBlur={(event) => {
              validateAndSetErrorMessage(
                ['empty'],
                event.target.value,
                setIncidentDescriptionErrorMessage,
              )

              onChange(indictmentCount.id, {
                incidentDescription: event.target.value.trim(),
              })
            }}
            required
            rows={7}
            autoExpand={{ on: true, maxHeight: 600 }}
            textarea
          />
        </Box>
      </Box>
      <Box component="section" marginBottom={2}>
        <Box marginBottom={2}>
          <Input
            name="legalArguments"
            autoComplete="off"
            label={formatMessage(strings.legalArgumentsLabel)}
            placeholder={formatMessage(strings.legalArgumentsPlaceholder)}
            errorMessage={legalArgumentsErrorMessage}
            hasError={legalArgumentsErrorMessage !== ''}
            value={indictmentCount.legalArguments ?? ''}
            onChange={(event) => {
              removeErrorMessageIfValid(
                ['empty'],
                event.target.value,
                legalArgumentsErrorMessage,
                setLegalArgumentsErrorMessage,
              )

              updateIndictmentCountState(
                indictmentCount.id,
                { legalArguments: event.target.value },
                setWorkingCase,
              )
            }}
            onBlur={(event) => {
              validateAndSetErrorMessage(
                ['empty'],
                event.target.value,
                setLegalArgumentsErrorMessage,
              )

              onChange(indictmentCount.id, {
                legalArguments: event.target.value.trim(),
              })
            }}
            required
            rows={7}
            autoExpand={{ on: true, maxHeight: 600 }}
            textarea
          />
        </Box>
      </Box>
    </BlueBox>
  )
}
