import React, { FC } from 'react'
import {
  Box,
  Text,
  Button,
  GridRow,
  GridColumn,
  LoadingIcon,
  GridColumnProps,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { Link } from 'react-router-dom'
import * as styles from './UserInfoLine.treat'

interface Props {
  label: MessageDescriptor | string
  content?: string | JSX.Element
  renderContent?: () => JSX.Element
  loading?: boolean
  labelColumnSpan?: GridColumnProps['span']
  valueColumnSpan?: GridColumnProps['span']
  editColumnSpan?: GridColumnProps['span']
  editLink?: {
    external?: boolean
    url: string
    title?: MessageDescriptor
  }
}

export const UserInfoLine: FC<Props> = ({
  label,
  content,
  renderContent,
  labelColumnSpan = ['8/12', '4/12'],
  valueColumnSpan = ['1/1', '5/12'],
  editColumnSpan = ['1/1', '3/12'],
  loading,
  editLink,
}) => {
  const { formatMessage } = useLocale()

  return (
    <Box
      position="relative"
      paddingY={[2, 3]}
      paddingX={[2, 4]}
      border="standard"
      borderRadius="large"
    >
      <GridRow align={['flexStart', 'center']}>
        <GridColumn order={1} span={labelColumnSpan}>
          <Box
            display="flex"
            alignItems="center"
            height="full"
            overflow="hidden"
          >
            <Text variant="h5" as="h5" lineHeight="lg">
              {formatMessage(label)}
            </Text>
          </Box>
        </GridColumn>
        <GridColumn order={[3, 2]} span={valueColumnSpan}>
          <Box
            display="flex"
            alignItems="center"
            height="full"
            width="full"
            className={styles.content}
            overflow="hidden"
          >
            {loading ? (
              <LoadingIcon animate size={20} />
            ) : renderContent ? (
              renderContent()
            ) : (
              content
            )}
          </Box>
        </GridColumn>
        <GridColumn order={4} span={editColumnSpan}>
          {editLink ? (
            <Box
              display="flex"
              justifyContent={['flexStart', 'flexEnd']}
              alignItems="center"
              height="full"
            >
              {editLink.external ? (
                <a
                  href={editLink.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Button
                    variant="text"
                    size="small"
                    icon="open"
                    iconType="outline"
                  >
                    {editLink.title
                      ? formatMessage(editLink.title)
                      : formatMessage({
                          id: 'global:edit',
                          defaultMessage: 'Breyta',
                        })}
                  </Button>
                </a>
              ) : (
                <Link to={editLink.url}>
                  <Button variant="text" size="small">
                    {editLink.title
                      ? formatMessage(editLink.title)
                      : formatMessage({
                          id: 'global:edit',
                          defaultMessage: 'Breyta',
                        })}
                  </Button>
                </Link>
              )}
            </Box>
          ) : null}
        </GridColumn>
      </GridRow>
    </Box>
  )
}
