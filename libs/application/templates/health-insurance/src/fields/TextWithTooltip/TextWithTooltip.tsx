import React, { FC } from 'react'
import { formatText, FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Tooltip } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './TextWithTooltip.treat'

export interface Props extends FieldBaseProps {
  title?: string
  description?: string
}

const TextWithTooltip: FC<Props> = ({
  application,
  field,
  title = '',
  description = '',
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingTop={6} className={styles.marginFix}>
      <Text as="span">
        {formatText(
          field.title ? field.title : title,
          application,
          formatMessage,
        )}{' '}
        <Tooltip
          placement="top"
          text={formatText(
            field.description ? field.description : description,
            application,
            formatMessage,
          )}
        />
      </Text>
    </Box>
  )
}

export default TextWithTooltip
