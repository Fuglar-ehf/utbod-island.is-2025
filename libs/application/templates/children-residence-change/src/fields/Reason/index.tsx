import React from 'react'
import { Box, Input } from '@island.is/island-ui/core'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Controller, useFormContext } from 'react-hook-form'

const Reason = ({ error, application, field }: FieldBaseProps) => {
  const { id, disabled } = field
  const getValue = (id: string) => {
    return getValueViaPath(application.answers, id) as string
  }

  const { setValue } = useFormContext()

  return (
    <Controller
      name="reason"
      defaultValue={getValue('reason')}
      render={({ value, onChange }) => {
        return (
          <Box marginTop={4}>
            <Input
              id={id}
              name={`${id}`}
              label="Tilefni"
              required={true}
              value={value}
              placeholder="Skrifaðu hér í stuttu máli ástæðu þess að lögheimili barnsins er að færast á milli foreldra"
              hasError={!!error}
              errorMessage="Required"
              textarea={true}
              rows={6}
              onChange={(e) => {
                onChange(e.target.value)
                setValue(id as string, e.target.value)
              }}
            />
          </Box>
        )
      }}
    />
  )
}

export default Reason
