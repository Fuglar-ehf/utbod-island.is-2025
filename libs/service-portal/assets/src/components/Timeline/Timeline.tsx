import React, { FC, ReactElement } from 'react'
import cn from 'classnames'
import * as styles from './Timeline.css'
import {
  Box,
  Column,
  Columns,
  Stack,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { ProgressBar } from '@island.is/service-portal/core'

interface Props {
  children?: Array<ReactElement>
  title?: string
  maxDate?: Date | null
  minDate?: Date | null
  className?: string
}
export const Timeline: FC<Props> = ({
  children,
  title,
  maxDate,
  minDate,
  className,
}) => {
  if (!children) {
    return null
  }

  const today = new Date()
  let currentProgress = 0

  if (maxDate && minDate) {
    const dateDifferenceStart = differenceInCalendarDays(
      today,
      minDate instanceof Date ? minDate : new Date(minDate),
    )
    const dateDifferenceEnd = differenceInCalendarDays(
      maxDate instanceof Date ? maxDate : new Date(maxDate),
      today,
    )
    currentProgress = (dateDifferenceStart + 1) / (dateDifferenceEnd + 1)
  }

  return (
    <Stack space={5}>
      {title && (
        <Text variant="eyebrow" color="purple400">
          {title}
        </Text>
      )}
      <Stack space="p1">
        <Box
          className={cn(styles.outer, className)}
          position="relative"
          background="blue100"
          borderRadius="large"
          width="full"
        >
          {currentProgress && (
            <>
              <ProgressBar progress={currentProgress} />
              <Tooltip text="Í dag" placement="top">
                <Box
                  position="absolute"
                  className={styles.tooltip}
                  style={{
                    left: `${currentProgress * 100}%`,
                  }}
                />
              </Tooltip>
            </>
          )}
        </Box>
        <Columns>
          {children?.map((child, index) => (
            <Column key={`step-item-${index}`}>
              <Box textAlign={index === children.length - 1 ? 'right' : 'left'}>
                {child}
              </Box>
            </Column>
          ))}
        </Columns>
      </Stack>
    </Stack>
  )
}

export default Timeline
