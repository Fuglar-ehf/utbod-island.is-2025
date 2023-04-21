import { Box, Checkbox, Input, Stack } from '@island.is/island-ui/core'
import { Controller, useFormContext } from 'react-hook-form'
import { FC, useState } from 'react'

interface Props {
  id: string
  checkboxId: string
  label: string
  placeholder?: string
  defaultValue?: boolean
  extraText?: boolean
}
const TempController: FC<Props> = ({
  id,
  checkboxId,
  label,
  placeholder,
  defaultValue,
  extraText,
}) => {
  const { register, setValue } = useFormContext()
  const [isChecked, setIsChecked] = useState(defaultValue)

  function clearTextArea(value: boolean) {
    if (!value) {
      setValue(id as string, '')
    }
  }

  return (
    <Stack space={2}>
      <Box background="white">
        <Controller
          name={checkboxId}
          defaultValue={defaultValue}
          render={({ value, onChange }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(e.target.checked)
                  setValue(checkboxId as string, e.target.checked)
                  setIsChecked(e.target.checked)
                  clearTextArea(e.target.checked)
                }}
                checked={value}
                name={checkboxId}
                label={label}
                large
              />
            )
          }}
        />
      </Box>
      {isChecked && extraText && (
        <Input
          placeholder={placeholder}
          backgroundColor="blue"
          required={isChecked}
          type="text"
          name={id}
          id={id}
          label={label}
          textarea
          rows={5}
          maxLength={250}
          ref={register}
        />
      )}
    </Stack>
  )
}

export default TempController
