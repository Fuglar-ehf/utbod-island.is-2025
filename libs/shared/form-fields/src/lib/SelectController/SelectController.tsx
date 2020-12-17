import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Select, Option } from '@island.is/island-ui/core'

interface Props {
  error?: string
  id: string
  defaultValue?: unknown
  disabled?: boolean
  name?: string
  label: string
  options?: Option[]
  placeholder?: string
  onSelect?: (s: Option, onChange: (t: unknown) => void) => void
}
export const SelectController: FC<Props> = ({
  error,
  defaultValue,
  disabled = false,
  id,
  name = id,
  label,
  options = [],
  placeholder,
  onSelect,
}) => {
  const { clearErrors } = useFormContext()
  return (
    <Controller
      {...(defaultValue !== undefined && { defaultValue })}
      name={name}
      render={({ onChange, value }) => (
        <Select
          hasError={error !== undefined}
          disabled={disabled}
          id={id}
          errorMessage={error}
          name={name}
          options={options}
          label={label}
          placeholder={placeholder}
          value={options.find((option) => option.value === value)}
          onChange={(newVal) => {
            clearErrors(id)
            onChange((newVal as Option).value)
            if (onSelect) {
              onSelect(newVal as Option, onChange)
            }
          }}
        />
      )}
    />
  )
}

export default SelectController
