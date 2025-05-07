import { FieldBaseProps } from '@island.is/application/types'
import { CustomField } from '@island.is/application/types'
import { NameValueTableField } from './name-value-table-field'
import { mapIncomeToNameValue } from '../../helpers/tax-return-data-helper'
import { TaxReturnData } from '../../lib/data-types'
import React from 'react'

interface Props extends FieldBaseProps {
  field: CustomField & {
    props: {
      header?: string
      totalLabel?: string
    }
  }
}

export const IncomeOverviewField = ({ application, field }: Props) => {
  const { header, totalLabel } = field.props
  const rawData = (application.externalData?.getData?.data as TaxReturnData)
    ?.income
  const items = mapIncomeToNameValue(rawData)

  return (
    <NameValueTableField
      items={items}
      header="Nafn launagreiðanda"
      totalLabel={totalLabel}
    />
  )
}
