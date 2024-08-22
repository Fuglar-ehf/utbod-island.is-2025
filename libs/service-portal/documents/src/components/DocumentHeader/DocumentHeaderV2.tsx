import { useEffect, useRef } from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import AvatarImage from '../DocumentLine/AvatarImage'
import { DocumentV2Actions, DocumentsV2Category } from '@island.is/api/schema'
import * as styles from './DocumentHeader.css'
import {
  DocumentActionBar,
  DocumentActionBarProps,
} from '../DocumentActionBar/DocumentActionBarV2'
import { helperStyles } from '@island.is/island-ui/theme'
import DocumentActions from '../DocumentActions/DocumentActions'

type DocumentHeaderProps = {
  avatar?: string
  sender?: string
  date?: string
  category?: DocumentsV2Category
  actionBar?: DocumentActionBarProps
  actions?: DocumentV2Actions[]
  subject?: string
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  avatar,
  sender,
  date,
  category,
  actionBar,
  actions,
  subject,
}) => {
  const wrapper = useRef<HTMLDivElement>(null)
  console.log(actions)
  useEffect(() => {
    if (wrapper.current) {
      wrapper.current.focus()
    }
  }, [wrapper])

  return (
    <>
      <Box tabIndex={0} outline="none" ref={wrapper} display="flex">
        <p className={helperStyles.srOnly} aria-live="assertive">
          {subject}
        </p>
        {avatar && <AvatarImage large img={avatar} background="blue100" />}
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          marginBottom={4}
          marginLeft={2}
        >
          {sender && (
            <Text variant="medium" fontWeight="semiBold">
              {sender}
            </Text>
          )}
          <Box
            className={styles.titleText}
            display="flex"
            justifyContent="flexStart"
            alignItems="center"
          >
            {date && <Text variant="medium">{date}</Text>}
            {category && (
              <Box className={styles.categoryDivider}>
                <Text variant="medium">{category.name ?? ''}</Text>
              </Box>
            )}
          </Box>
        </Box>
        {actionBar && (
          <Box className={styles.actionBarWrapper}>
            <DocumentActionBar spacing={1} {...actionBar} />
          </Box>
        )}
      </Box>
      {actions && (
        <Box>
          <DocumentActions />
        </Box>
      )}
    </>
  )
}
