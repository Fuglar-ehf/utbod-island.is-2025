import React, { FC, ReactNode, MouseEvent } from 'react'
import { messages } from '../../utils/messages'

import { Box } from '@island.is/island-ui/core'
import cn from 'classnames'
import * as styles from './DocumentLine.css'
import { useLocale } from '@island.is/localization'
import { theme } from '@island.is/island-ui/theme'

interface Props {
  background: 'blue100' | 'blue200' | 'white'
  img?: string
  avatar?: ReactNode
  onClick?: (event: MouseEvent<HTMLElement>) => void
  large?: boolean
}

export const AvatarImage: FC<Props> = ({
  img,
  background,
  avatar,
  large,
  onClick,
}) => {
  const { formatMessage } = useLocale()
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      background={background}
      style={
        background === 'blue100'
          ? { background: theme.color.blueberry100 }
          : undefined
      }
      borderRadius="circle"
      className={cn(styles.imageContainer, {
        [styles.largeAvatar]: large,
      })}
      component="button"
      aria-label={formatMessage(messages.markAsBulkSelection)}
      onClick={onClick}
    >
      {avatar ? (
        avatar
      ) : (
        <img className={styles.image} src={img} alt="document" />
      )}
    </Box>
  )
}

export default AvatarImage
