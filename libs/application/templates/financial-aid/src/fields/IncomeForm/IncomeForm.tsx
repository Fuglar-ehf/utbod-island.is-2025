import React from 'react'
import { Box, Text, GridRow, GridColumn } from '@island.is/island-ui/core'
import { FAFieldBaseProps, ApproveOptions } from '../../lib/types'
import { useIntl } from 'react-intl'
import { incomeForm, approveOptions } from '../../lib/messages'
import { RadioController } from '@island.is/shared/form-fields'
import DescriptionText from '../DescriptionText/DescriptionText'

const IncomeForm = ({ field, errors, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application

  return (
    <>
      <Box marginTop={[2, 2, 3]}>
        <RadioController
          id={field.id}
          defaultValue={answers?.income}
          options={[
            {
              value: ApproveOptions.No,
              label: formatMessage(approveOptions.no),
            },
            {
              value: ApproveOptions.Yes,
              label: formatMessage(approveOptions.yes),
            },
          ]}
          largeButtons
          split="1/2"
          backgroundColor="white"
          error={errors?.income}
        />
      </Box>
      <Text as="h2" variant="h3" marginBottom={2} marginTop={[3, 3, 5]}>
        {formatMessage(incomeForm.bulletList.headline)}
      </Text>
      <GridRow marginBottom={5}>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <DescriptionText text={incomeForm.examplesOfIncome.leftSidedList} />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Box marginTop={[2, 2, 2, 0]}>
            <DescriptionText
              text={incomeForm.examplesOfIncome.rightSidedList}
            />
          </Box>
        </GridColumn>
      </GridRow>
    </>
  )
}

export default IncomeForm
