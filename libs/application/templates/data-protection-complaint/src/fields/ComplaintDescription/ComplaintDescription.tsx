import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import React, { ChangeEvent, FC, useState } from 'react'
import { complaint, sharedFields } from '../../lib/messages'

const calcWordCount = (value: string) => value.split(' ').length

export const ComplaintDescription: FC<FieldBaseProps> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const value = getValueViaPath(application.answers, field.id) as
    | string
    | undefined
  const [wordCount, setWordCount] = useState(calcWordCount(value || ''))

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setWordCount(calcWordCount(e.target.value))

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        marginBottom={2}
      >
        <Text>{formatMessage(complaint.labels.complaintDescriptionLabel)}</Text>
        <Text variant="small" color="dark300">
          {wordCount} / 500 {formatMessage(sharedFields.word)}
        </Text>
      </Box>
      <InputController
        id={field.id}
        name={field.id}
        placeholder={formatMessage(
          complaint.labels.complaintDescriptionPlaceholder,
        )}
        onChange={handleOnChange}
        defaultValue={field.defaultValue as string}
        textarea
        rows={7}
        error={errors && (errors[`${field.id}`] as string)}
        backgroundColor="blue"
      />
    </Box>
  )
}
