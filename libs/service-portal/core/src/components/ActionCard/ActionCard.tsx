import React, { FC } from 'react'
import {
  Box,
  Stack,
  Button,
  Text,
  Link,
  LoadingIcon,
  FocusableBox,
} from '@island.is/island-ui/core'
import * as styles from './ActionCard.treat'
import format from 'date-fns/format'

interface Props {
  label: string
  title: string
  date: Date
  loading?: boolean
  cta: {
    label: string
    onClick: () => void
  }
}

export const ActionCard: FC<Props> = ({ label, title, date, cta, loading }) => {
  return (
    <Box
      className={styles.wrapper}
      paddingTop={[2, 4]}
      paddingBottom={[2, 3]}
      paddingX={[2, 4]}
      border="standard"
      borderRadius="large"
      position="relative"
    >
      <Stack space={1}>
        <Box display="flex" alignItems="center" justifyContent="spaceBetween">
          <Text variant="eyebrow" color="purple400">
            {label}
          </Text>
          <Text variant="small" as="span" color="dark400">
            {format(date, 'dd.MM.yyyy')}
          </Text>
        </Box>
        <Box
          display={['block', 'flex']}
          justifyContent="spaceBetween"
          alignItems="center"
        >
          <FocusableBox component="button" onClick={cta.onClick}>
            <Text variant="h4" as="h4">
              {title}
            </Text>
          </FocusableBox>
          <Box
            className={styles.buttonWrapper}
            marginTop={[1, 0]}
            marginLeft={[0, 3]}
          >
            <Button
              icon="open"
              colorScheme="default"
              iconType="outline"
              onClick={cta.onClick}
              size="small"
              type="button"
              variant="text"
            >
              {cta.label}
            </Button>
          </Box>
        </Box>
      </Stack>
      {loading && (
        <Box
          className={styles.isLoadingContainer}
          position="absolute"
          left={0}
          right={0}
          top={0}
          bottom={0}
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="large"
          background="blue100"
        >
          <LoadingIcon animate size={30} />
        </Box>
      )}
    </Box>
  )
}

export default ActionCard
