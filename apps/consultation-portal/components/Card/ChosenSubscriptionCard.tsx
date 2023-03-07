import { Box, Checkbox, Icon, Text } from '@island.is/island-ui/core'
import { mapIsToEn } from '../../utils/helpers'
import { useState } from 'react'
import SubscriptionChoices from '../SubscriptionChoices/SubscriptionChoices'
import { Area } from '../../types/enums'
import { SubscriptionArray } from '../../types/interfaces'

export interface ChosenSubscriptionCardProps {
  data: {
    name: string
    caseNumber?: string
    id: string
    area: Area
  }
  subscriptionArray: SubscriptionArray
  setSubscriptionArray: (arr: SubscriptionArray) => void
}

export const ChosenSubscriptionCard = ({
  data,
  subscriptionArray,
  setSubscriptionArray,
}: ChosenSubscriptionCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const onClick = () => {
    setIsOpen(!isOpen)
  }

  const onCheckboxChange = (id: number) => {
    const sub = [...subscriptionArray[mapIsToEn[data.area]]]
    const subArr = { ...subscriptionArray }
    const idx = sub.indexOf(id)
    sub.splice(idx, 1)
    subArr[mapIsToEn[data.area]] = sub
    return setSubscriptionArray(subArr)
  }

  return (
    <Box
      borderColor={'blue400'}
      borderRadius="large"
      borderWidth="standard"
      background="white"
      paddingX={3}
      paddingY={3}
      rowGap={3}
    >
      <Box display="flex" flexDirection="row" justifyContent={'spaceBetween'}>
        <Box display="flex" flexDirection="row" columnGap={3}>
          <Checkbox
            checked={true}
            onChange={() => onCheckboxChange(parseInt(data?.id))}
          />
          <Text
            lineHeight="sm"
            variant="h5"
            color={data?.area === 'Mál' ? 'dark400' : 'blue400'}
          >
            {data?.area === 'Mál' ? data?.caseNumber : data?.name}
          </Text>
          {data?.area === 'Mál' && <Text variant="medium">{data?.name}</Text>}
        </Box>
        <div onClick={onClick} style={{ height: '24px' }}>
          <Icon icon={isOpen ? 'chevronUp' : 'chevronDown'} color="blue400" />
        </div>
      </Box>
      {isOpen && (
        <Box paddingTop={3}>
          <SubscriptionChoices />
        </Box>
      )}
    </Box>
  )
}

export default ChosenSubscriptionCard
