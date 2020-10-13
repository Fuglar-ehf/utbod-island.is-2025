import React, { FC } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './Statistic.treat'

export interface StatisticProps {
  value: string | number
  label: string
}

export const Statistic: FC<StatisticProps> = ({ value, label }) => {
  return (
    <div className={styles.container}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        flexGrow={1}
      >
        <Text variant="h1" as="div" color="blue400">
          <span className={styles.value}>{value}</span>
        </Text>
        <Text variant="h5" as="div" color="blue300">
          {label}
        </Text>
      </Box>
    </div>
  )
}

export default Statistic
