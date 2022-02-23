import React from 'react'
import { Text, Box } from '@island.is/island-ui/core'

import * as styles from './ProfileUnit.css'
import cn from 'classnames'
import Unit from './Unit'

interface Props {
  heading: string
  info: {
    title: string
    content?: string
    link?: string
    onclick?: () => void
    other?: string
  }[]
  className?: string
}

const ProfileUnit = ({ heading, info, className }: Props) => {
  return (
    <>
      <Box
        className={cn({
          [`${styles.fullWidth} `]: true,
          [`${className}`]: className,
        })}
        marginBottom={[2, 2, 3]}
        borderBottomWidth="standard"
        borderColor="dark200"
      >
        <Text as="h2" variant="h3" color="dark300" marginBottom={1}>
          {heading}
        </Text>
      </Box>
      <Unit info={info} className={className} />
    </>
  )
}

export default ProfileUnit
