import React, { FC } from 'react'
import { Document } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { Text, Box, GridRow, GridColumn, Link } from '@island.is/island-ui/core'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'
import * as styles from './DocumentLine.css'
import { User } from 'oidc-client'
import cn from 'classnames'
import { m } from '@island.is/service-portal/core'
import { getAccessToken } from '@island.is/auth/react'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

interface Props {
  documentLine: Document
  userInfo: User
  img?: string
}

const DocumentLine: FC<Props> = ({ documentLine, userInfo, img }) => {
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.sm

  const onClickHandler = async () => {
    // Create form elements
    const form = document.createElement('form')
    const documentIdInput = document.createElement('input')
    const tokenInput = document.createElement('input')

    const token = await getAccessToken()
    if (!token) return

    form.appendChild(documentIdInput)
    form.appendChild(tokenInput)

    // Form values
    form.method = 'post'
    // TODO: Use correct url
    form.action = documentLine.url
    form.target = '_blank'

    // Document Id values
    documentIdInput.type = 'hidden'
    documentIdInput.name = 'documentId'
    documentIdInput.value = documentLine.id

    // National Id values
    tokenInput.type = 'hidden'
    tokenInput.name = '__accessToken'
    tokenInput.value = token

    document.body.appendChild(form)
    form.submit()
    document.body.removeChild(form)
  }

  const date = (variant: 'small' | 'medium') => (
    <Text variant={variant}>
      {format(new Date(documentLine.date), dateFormat.is)}
    </Text>
  )

  const image = img && (
    <img
      className={styles.image}
      src={img}
      alt={`${formatMessage(m.altText)} ${documentLine.subject}`}
    />
  )

  const subject =
    documentLine.fileType === 'url' && documentLine.url ? (
      <Link href={documentLine.url}>
        <button
          className={cn(styles.button, !documentLine.opened && styles.unopened)}
        >
          {documentLine.subject}
        </button>
      </Link>
    ) : (
      <button
        className={cn(styles.button, !documentLine.opened && styles.unopened)}
        onClick={onClickHandler}
      >
        {documentLine.subject}
      </button>
    )

  const sender = (variant: 'eyebrow' | 'medium') => (
    <Text variant={variant} id="senderName">
      {documentLine.senderName}
    </Text>
  )
  return (
    <Box
      position="relative"
      className={cn(
        styles.line,
        !documentLine.opened && styles.unopenedWrapper,
      )}
      paddingY={2}
    >
      {isMobile ? (
        <GridRow alignItems="flexStart" align="flexStart">
          {img && (
            <GridColumn span="2/12">
              <Box
                display="flex"
                alignItems="center"
                height="full"
                paddingX={[0, 2]}
                paddingBottom={[1, 0]}
              >
                {image}
              </Box>
            </GridColumn>
          )}
          <GridColumn span="7/12">
            <Box
              display="flex"
              alignItems="center"
              paddingX={[0, 2]}
              className={styles.sender}
            >
              {sender('eyebrow')}
            </Box>
            <Box display="flex" alignItems="center" paddingX={[0, 2]}>
              {subject}
            </Box>
          </GridColumn>
          <GridColumn span="3/12">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flexEnd"
              height="full"
              paddingX={[0, 2]}
            >
              {date('small')}
            </Box>
          </GridColumn>
        </GridRow>
      ) : (
        <GridRow>
          <GridColumn span={['1/1', '2/12']}>
            <Box
              display="flex"
              alignItems="center"
              height="full"
              paddingX={[0, 2]}
            >
              {date('medium')}
            </Box>
          </GridColumn>
          <GridColumn span={['1/1', '6/12', '6/12', '6/12', '7/12']}>
            <Box
              display="flex"
              alignItems="center"
              height="full"
              paddingX={[0, 2]}
              paddingBottom={[1, 0]}
            >
              {img && image}
              {subject}
            </Box>
          </GridColumn>
          <GridColumn span={['1/1', '4/12', '4/12', '4/12', '3/12']}>
            <Box
              display="flex"
              alignItems="center"
              height="full"
              paddingX={[0, 2]}
              className={styles.sender}
            >
              {sender('medium')}
            </Box>
          </GridColumn>
        </GridRow>
      )}
    </Box>
  )
}

export default DocumentLine
