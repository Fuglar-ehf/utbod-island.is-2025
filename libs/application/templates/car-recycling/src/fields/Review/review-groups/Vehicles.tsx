import { Label, ReviewGroup } from '@island.is/application/ui-components'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { carRecyclingMessages } from '../../../lib/messages'
import { ReviewGroupProps } from './props'
import { States } from '../../../shared/constants'
import { getApplicationAnswers } from '../../../lib/carRecyclingUtils'

export const Vehicles = ({
  application,
  editable,
  goToScreen,
}: ReviewGroupProps) => {
  const { formatMessage } = useLocale()

  const { selectedVehicles } = getApplicationAnswers(application.answers)

  const { state } = application

  return (
    <ReviewGroup
      isLast
      isEditable={editable}
      editAction={() => goToScreen?.('vehicles')}
    >
      {state === `${States.DRAFT}` && (
        <Box position="relative" marginBottom={'containerGutter'}>
          <Label>
            {formatMessage(carRecyclingMessages.review.carsSectionTitle)}
          </Label>
        </Box>
      )}

      {selectedVehicles.map((vehicle, index) => {
        return (
          <Box
            key={index}
            position="relative"
            border="standard"
            borderRadius="large"
            padding={4}
            marginBottom={2}
          >
            <Label>{formatMessage(vehicle.permno || '')}</Label>
            {vehicle.make}, {vehicle.color}
          </Box>
        )
      })}
    </ReviewGroup>
  )
}
