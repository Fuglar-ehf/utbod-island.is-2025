import React from 'react'
import { FieldBaseProps, CustomField } from '@island.is/application/types'
import { formatText } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'

interface EditableTableFieldProps extends FieldBaseProps {
  field: CustomField
}

export const TotalIncomeField = ({
  field,
  application,
}: EditableTableFieldProps) => {
  const { formatMessage } = useLocale()

  return (
    <div>
      <h3>{formatText('Samanlagt', application, formatMessage)}</h3>
    </div>
  )
}
