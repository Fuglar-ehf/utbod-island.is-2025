import { FieldBaseProps } from '@island.is/application/types'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { payment } from '../../lib/messages'
import { formatIsk, getChargeItemCodesWithInfo, PlateType } from '../../utils'
import { OrderVehicleLicensePlate } from '../../lib/dataSchema'

export const PaymentChargeOverview: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const chargeItemCodes = getChargeItemCodesWithInfo(
    application.answers as OrderVehicleLicensePlate,
  )
  const { externalData } = application
  const allItems = externalData?.payment?.data as [
    {
      priceAmount: number
      chargeItemName: string
      chargeItemCode: string
    },
  ]
  const items = chargeItemCodes.map(({ chargeItemCode, type }) => {
    return {
      ...allItems.find((item) => item.chargeItemCode === chargeItemCode),
      type,
    }
  })

  const totalPrice = items.reduce(
    (sum, item) => sum + (item?.priceAmount || 0),
    0,
  )

  return (
    <Box>
      <Box>
        <Text variant="h5">
          {formatMessage(payment.paymentChargeOverview.forPayment)}
        </Text>
        {items.map((item) => (
          <Box paddingTop={1} display="flex" justifyContent="spaceBetween">
            <Text>
              {item?.chargeItemName}
              {item?.type
                ? item?.type === PlateType.front
                  ? ' - ' +
                    formatMessage(payment.paymentChargeOverview.frontLabel)
                  : ' - ' +
                    formatMessage(payment.paymentChargeOverview.rearLabel)
                : ''}
            </Text>
            <Text>{formatIsk(item?.priceAmount || 0)}</Text>
          </Box>
        ))}
      </Box>
      <Box paddingY={3}>
        <Divider />
      </Box>
      <Box paddingBottom={4} display="flex" justifyContent="spaceBetween">
        <Text variant="h5">
          {formatMessage(payment.paymentChargeOverview.total)}
        </Text>
        <Text color="blue400" variant="h3">
          {formatIsk(totalPrice)}
        </Text>
      </Box>
    </Box>
  )
}
