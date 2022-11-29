import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { useFormContext } from 'react-hook-form'
import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import {
  getMaxMultipleBirthsDays,
  getMaxMultipleBirthsAndDefaultMonths,
  getMultipleBirthRequestDays,
} from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import Slider from '../components/Slider'
import BoxChart, { BoxChartKey } from '../components/BoxChart'
import { defaultMonths, daysInMonth } from '../../config'
import { formatText } from '@island.is/application/core'
import { NO } from '../../constants'

const RequestMultipleBirthsDaysSlider: FC<FieldBaseProps> = ({
  field,
  application,
}) => {
  const { id, description } = field
  const { formatMessage } = useLocale()
  const { register } = useFormContext()
  const multipleBirthsRequestDays = getMultipleBirthRequestDays(
    application.answers,
  )

  const maxDays = getMaxMultipleBirthsDays(application.answers)
  const maxMonths = getMaxMultipleBirthsAndDefaultMonths(application.answers)

  const [chosenRequestDays, setChosenRequestDays] = useState<number>(
    multipleBirthsRequestDays,
  )

  const requestedMonths = defaultMonths + chosenRequestDays / daysInMonth

  const daysStringKey =
    chosenRequestDays === 1
      ? parentalLeaveFormMessages.shared.requestMultipleBirthsDay
      : parentalLeaveFormMessages.shared.requestMultipleBirthsDays

  const boxChartKeys: BoxChartKey[] = [
    {
      label: () => ({
        ...parentalLeaveFormMessages.shared.yourRightsInMonths,
        values: { months: defaultMonths },
      }),
      bulletStyle: 'blue',
    },
    {
      label: () => ({ ...daysStringKey, values: { day: chosenRequestDays } }),
      bulletStyle: 'purpleWithLines',
    },
  ]

  return (
    <>
      <p>{formatText(description!, application, formatMessage)}</p>
      <Box marginBottom={6} marginTop={5}>
        <Box marginBottom={12}>
          <Slider
            label={{
              singular: formatMessage(parentalLeaveFormMessages.shared.day),
              plural: formatMessage(parentalLeaveFormMessages.shared.days),
            }}
            min={0}
            max={maxDays}
            step={1}
            currentIndex={chosenRequestDays}
            showMinMaxLabels
            showToolTip
            trackStyle={{ gridTemplateRows: 8 }}
            calculateCellStyle={() => {
              return {
                background: theme.color.dark200,
              }
            }}
            onChange={(newValue: number) => {
              setChosenRequestDays(newValue)
            }}
          />
        </Box>
        <BoxChart
          application={application}
          boxes={Math.ceil(maxMonths)}
          calculateBoxStyle={(index) => {
            if (index < defaultMonths) {
              return 'blue'
            }

            if (index < requestedMonths) {
              return 'purpleWithLines'
            }

            return 'grayWithLines'
          }}
          keys={boxChartKeys as BoxChartKey[]}
        />
      </Box>

      <input
        type="hidden"
        ref={register}
        name={id}
        value={chosenRequestDays.toString()}
      />

      <input
        type="hidden"
        ref={register}
        name="requestRights.isRequestingRights"
        value={NO}
      />

      <input
        type="hidden"
        ref={register}
        name="requestRights.requestDays"
        value={0}
      />

      <input
        type="hidden"
        ref={register}
        name="giveRights.isGivingRights"
        value={NO}
      />

      <input
        type="hidden"
        ref={register}
        name="giveRights.giveDays"
        value={0}
      />
    </>
  )
}

export default RequestMultipleBirthsDaysSlider
