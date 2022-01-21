import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { ApproveOptions, FAFieldBaseProps } from '../../lib/types'
import { useIntl } from 'react-intl'
import { unknownRelationship } from '../../lib/messages'
import DescriptionText from '../DescriptionText/DescriptionText'
import { useFormContext } from 'react-hook-form'
import {
  RadioController,
  InputController,
  CheckboxController,
} from '@island.is/shared/form-fields'

import * as styles from '../Shared.css'
import cn from 'classnames'

const UnknownRelationshipForm = ({ errors, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application
  const { clearErrors, getValues } = useFormContext()

  const typeInput = {
    id: 'relationshipStatus.unregisteredCohabitation',
    error: errors?.relationshipStatus?.unregisteredCohabitation,
  }

  const spouseEmail = {
    id: 'relationshipStatus.spouseEmail',
    error: errors?.relationshipStatus?.spouseEmail,
  }
  const spouseNationlId = {
    id: 'relationshipStatus.spouseNationalId',
    error: errors?.relationshipStatus?.spouseNationalId,
  }
  const spouseApproveTerms = {
    id: 'relationshipStatus.spouseApproveTerms',
    error: errors?.relationshipStatus?.spouseApproveTerms,
  }

  console.log(errors.relationshipStatus)

  return (
    <>
      <Text variant="intro" marginBottom={[2, 2, 3]} marginTop={2}>
        {formatMessage(unknownRelationship.general.intro)}
      </Text>
      <Box marginBottom={[3, 3, 4]}>
        <DescriptionText text={unknownRelationship.general.description} />
      </Box>
      <Text as="h3" variant="h3" marginBottom={[3, 3, 4]}>
        {formatMessage(unknownRelationship.form.title)}
      </Text>
      <Box marginBottom={1}>
        <RadioController
          id={typeInput.id}
          defaultValue={answers?.relationshipStatus?.unregisteredCohabitation}
          options={[
            {
              value: ApproveOptions.No,
              label: formatMessage(unknownRelationship.form.radioButtonNo),
            },
            {
              value: ApproveOptions.Yes,
              label: formatMessage(unknownRelationship.form.radioButtonYes),
            },
          ]}
          largeButtons
          backgroundColor="white"
          error={typeInput.error}
        />
      </Box>

      <Box
        className={cn({
          [`${styles.inputContainer}`]: true,
          [`${styles.formAppear}`]:
            getValues(typeInput.id) === ApproveOptions.Yes,
        })}
      >
        <Box marginBottom={[2, 2, 3]}>
          <InputController
            id={spouseNationlId.id}
            name={spouseNationlId.id}
            backgroundColor="blue"
            placeholder={formatMessage(
              unknownRelationship.inputs.spouseNationlIdPlaceholder,
            )}
            label={formatMessage(unknownRelationship.inputs.spouseNationlId)}
            error={spouseNationlId.error}
            defaultValue={''}
            onChange={() => {
              clearErrors(spouseNationlId.id)
            }}
          />
        </Box>
        <Box marginBottom={[2, 2, 3]}>
          <InputController
            id={spouseEmail.id}
            name={spouseEmail.id}
            backgroundColor="blue"
            type="email"
            placeholder={formatMessage(
              unknownRelationship.inputs.spouseEmailPlaceholder,
            )}
            label={formatMessage(unknownRelationship.inputs.spouseEmail)}
            error={spouseEmail.error}
            defaultValue={''}
            onChange={() => {
              clearErrors(spouseEmail.id)
            }}
          />
        </Box>
        <CheckboxController
          id={spouseApproveTerms.id}
          name={spouseApproveTerms.id}
          backgroundColor="blue"
          large={true}
          defaultValue={[]}
          error={spouseApproveTerms.error}
          options={[
            {
              value: 'yes',
              label: formatMessage(unknownRelationship.inputs.checkboxLabel),
            },
          ]}
        />
      </Box>
    </>
  )
}

export default UnknownRelationshipForm
