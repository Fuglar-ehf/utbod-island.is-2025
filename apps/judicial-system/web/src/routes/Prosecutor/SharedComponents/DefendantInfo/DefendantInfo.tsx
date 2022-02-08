import React, { useState } from 'react'
import InputMask from 'react-input-mask'
import { useIntl } from 'react-intl'

import {
  Defendant,
  Gender,
  UpdateDefendant,
} from '@island.is/judicial-system/types'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import { Box, Icon, Input, RadioButton, Text } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'

import { Validation } from '@island.is/judicial-system-web/src/utils/validate'
import {
  removeErrorMessageIfValid,
  validateAndSetErrorMessage,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import useNationalRegistry from '@island.is/judicial-system-web/src/utils/hooks/useNationalRegistry'

import * as styles from './DefendantInfo.css'

interface Props {
  defendant: Defendant
  onChange: (
    defendantId: string,
    updatedDefendant: UpdateDefendant,
  ) => Promise<void>
  updateDefendantState: (defendantId: string, update: UpdateDefendant) => void
  onDelete?: (defendant: Defendant) => Promise<void>
}

const DefendantInfo: React.FC<Props> = (props) => {
  const { defendant, onDelete, onChange, updateDefendantState } = props
  const { formatMessage } = useIntl()
  const { person, error } = useNationalRegistry(defendant.nationalId)

  const [nationalIdErrorMessage, setNationalIdErrorMessage] = useState<string>(
    '',
  )
  const [nationalIdNotFound, setNationalIdNotFound] = useState<boolean>(false)

  const [
    accusedNameErrorMessage,
    setAccusedNameErrorMessage,
  ] = useState<string>('')

  const [
    accusedAddressErrorMessage,
    setAccusedAddressErrorMessage,
  ] = useState<string>('')

  const mapNationalRegistryGenderToGender = (gender: string) => {
    return gender === 'male'
      ? Gender.MALE
      : gender === 'female'
      ? Gender.FEMALE
      : Gender.OTHER
  }

  return (
    <BlueBox>
      <Box marginBottom={2} display="flex" justifyContent="spaceBetween">
        <Text as="h4" variant="h4">
          {formatMessage(core.gender)}{' '}
          <Text as="span" color="red600" fontWeight="semiBold">
            *
          </Text>
        </Text>
        {onDelete && (
          <button
            onClick={() => onDelete(defendant)}
            aria-label="Remove defendant"
          >
            <Icon icon="close" color="blue400" />
          </button>
        )}
      </Box>
      <Box marginBottom={2} className={styles.genderContainer}>
        <Box className={styles.genderColumn}>
          <RadioButton
            name={`accusedGender${defendant.id}`}
            id={`genderMale${defendant.id}`}
            label={formatMessage(core.male)}
            value={Gender.MALE}
            checked={defendant.gender === Gender.MALE}
            onChange={() => {
              onChange(defendant.id, {
                gender: Gender.MALE,
              })
            }}
            large
            backgroundColor="white"
          />
        </Box>
        <Box className={styles.genderColumn}>
          <RadioButton
            name={`accusedGender${defendant.id}`}
            id={`genderFemale${defendant.id}`}
            label={formatMessage(core.female)}
            value={Gender.FEMALE}
            checked={defendant.gender === Gender.FEMALE}
            onChange={() => {
              onChange(defendant.id, {
                gender: Gender.FEMALE,
              })
            }}
            large
            backgroundColor="white"
          />
        </Box>
        <Box className={styles.genderColumn}>
          <RadioButton
            name={`accusedGender${defendant.id}`}
            id={`genderOther${defendant.id}`}
            label={formatMessage(core.otherGender)}
            value={Gender.OTHER}
            checked={defendant.gender === Gender.OTHER}
            onChange={() => {
              onChange(defendant.id, {
                gender: Gender.OTHER,
              })
            }}
            large
            backgroundColor="white"
          />
        </Box>
      </Box>
      <Box marginBottom={2}>
        <InputMask
          mask="999999-9999"
          maskPlaceholder={null}
          value={defendant.nationalId ?? ''}
          onChange={(evt) => {
            setNationalIdNotFound(false)
            removeErrorMessageIfValid(
              ['empty', 'national-id'] as Validation[],
              evt.target.value,
              nationalIdErrorMessage,
              setNationalIdErrorMessage,
            )

            updateDefendantState(defendant.id, {
              nationalId: evt.target.value,
            })
          }}
          onBlur={async (evt) => {
            if (person && person.items.length === 1 && !error) {
              onChange(defendant.id, {
                nationalId: evt.target.value,
                name: person.items[0].name,
                gender: mapNationalRegistryGenderToGender(
                  person.items[0].gender,
                ),
                address: person.items[0].permanent_address.street.nominative,
              })

              setAccusedNameErrorMessage('')
              setAccusedAddressErrorMessage('')
              setNationalIdErrorMessage('')
            } else {
              setNationalIdNotFound(true)

              validateAndSetErrorMessage(
                ['empty', 'national-id'],
                evt.target.value,
                setNationalIdErrorMessage,
              )

              onChange(defendant.id, { nationalId: evt.target.value })
            }
          }}
        >
          <Input
            data-testid="nationalId"
            name="accusedNationalId"
            autoComplete="off"
            label={formatMessage(core.nationalId)}
            placeholder={formatMessage(core.nationalId)}
            errorMessage={nationalIdErrorMessage}
            hasError={nationalIdErrorMessage !== ''}
            required
          />
        </InputMask>
        {nationalIdNotFound && (
          <Text color="red600" variant="eyebrow" marginTop={1}>
            {formatMessage(core.nationalIdNotFoundInNationalRegistry)}
          </Text>
        )}
      </Box>
      <Box marginBottom={2}>
        <Input
          data-testid="accusedName"
          name="accusedName"
          autoComplete="off"
          label={formatMessage(core.fullName)}
          placeholder={formatMessage(core.fullName)}
          value={defendant.name ?? ''}
          errorMessage={accusedNameErrorMessage}
          hasError={accusedNameErrorMessage !== ''}
          onChange={(evt) => {
            removeErrorMessageIfValid(
              ['empty'] as Validation[],
              evt.target.value,
              accusedNameErrorMessage,
              setAccusedNameErrorMessage,
            )

            updateDefendantState(defendant.id, {
              name: evt.target.value,
            })
          }}
          onBlur={(evt) => {
            validateAndSetErrorMessage(
              ['empty'] as Validation[],
              evt.target.value,
              setAccusedNameErrorMessage,
            )

            onChange(defendant.id, { name: evt.target.value })
          }}
          required
        />
      </Box>
      <Input
        data-testid="accusedAddress"
        name="accusedAddress"
        autoComplete="off"
        label={formatMessage(core.addressOrResidence)}
        placeholder={formatMessage(core.addressOrResidence)}
        value={defendant.address ?? ''}
        errorMessage={accusedAddressErrorMessage}
        hasError={
          Boolean(accusedAddressErrorMessage) &&
          accusedAddressErrorMessage !== ''
        }
        onChange={(evt) => {
          removeErrorMessageIfValid(
            ['empty'] as Validation[],
            evt.target.value,
            accusedAddressErrorMessage,
            setAccusedAddressErrorMessage,
          )

          updateDefendantState(defendant.id, {
            address: evt.target.value,
          })
        }}
        onBlur={(evt) => {
          validateAndSetErrorMessage(
            ['empty'] as Validation[],
            evt.target.value,
            setAccusedAddressErrorMessage,
          )

          onChange(defendant.id, { address: evt.target.value })
        }}
        required
      />
    </BlueBox>
  )
}

export default DefendantInfo
