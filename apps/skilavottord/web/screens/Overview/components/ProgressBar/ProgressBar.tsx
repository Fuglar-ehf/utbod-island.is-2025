import React, { FC } from 'react'
import { Box } from '@island.is/island-ui/core'
import * as styles from './ProgressBar.treat'

interface Props {
  progress: number
}

const ProgressBar: FC<Props> = ({ progress }) => {
  return (
    <Box
      background={progress === 100 ? 'mint100' : 'roseTinted100'}
      borderRadius="large"
      className={styles.wrapper}
    >
      <Box
        background={progress === 100 ? 'mint400' : 'roseTinted400'}
        borderRadius="large"
        style={{ width: `${progress}%` }}
        className={styles.bar}
      />
    </Box>
  )
}

export default ProgressBar
