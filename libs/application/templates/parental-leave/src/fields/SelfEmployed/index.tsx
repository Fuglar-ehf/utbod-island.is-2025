import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'

import { Box, Text } from '@island.is/island-ui/core'
import { formatText } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { RadioFormField } from '@island.is/application/ui-fields'

import { NO, YES } from '../../constants'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export const SelfEmployed: FC<FieldBaseProps> = ({
  application,
  field,
  error,
}) => {
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const { id, title, description } = field

  return (
    <Box>
      <Text variant="h2" as="h2">
        {formatText(title, application, formatMessage)}
      </Text>
      <RadioFormField
        error={error}
        application={application}
        field={{
          id: id,
          title: '',
          description,
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          children: undefined,
          width: 'half',
          options: [
            {
              label: parentalLeaveFormMessages.shared.yesOptionLabel,
              value: YES,
            },
            {
              label: parentalLeaveFormMessages.shared.noOptionLabel,
              value: NO,
            },
          ],
          onSelect: (s: string) => {
            if (s === YES) {
              setValue('employer.email', '')
              setValue('isRecivingUnemploymentBenefits', NO)
            }
            if (s !== YES) {
              setValue('employer.selfEmployed.file', null)
              setValue('fileUpload.selfEmployedFile', null)
              setValue('isRecivingUnemploymentBenefits', '')
            }
          },
        }}
      />
    </Box>
  )
}
