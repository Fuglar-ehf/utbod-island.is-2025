import React, { PureComponent } from 'react'
import { useLocale } from '@island.is/localization'
import * as styles from './ApplicationErrorBoundry.css'
import { Box, Text, Tag, Button } from '@island.is/island-ui/core'

interface PropTypes {
  children: React.ReactNode
}

interface StateTypes {
  error?: Error
  hasError?: boolean
}

export class ApplicationErrorBoundary extends PureComponent<
  PropTypes,
  StateTypes
> {
  constructor(props: PropTypes) {
    super(props)
    this.state = { error: undefined, hasError: false }
  }

  public static getDerivedStateFromError(_: Error): StateTypes {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error(error)
  }

  render() {
    const { children } = this.props
    const { hasError } = this.state

    if (hasError) {
      return <Error />
    }

    return children
  }
}

const Error = () => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={8}>
      <Box
        marginTop={[0, 6]}
        marginBottom={[0, 6]}
        textAlign="center"
        justifyContent="center"
        alignItems="center"
      >
        <Box marginBottom={4}>
          <Tag variant="red">{500}</Tag>
        </Box>
        <Text variant="h1" as="h1" marginBottom={3}>
          {formatMessage({
            id: 'sp:error-page-heading',
            defaultMessage: 'Eitthvað fór úrskeiðis',
          })}
        </Text>
        <Text variant="default" as="p">
          {formatMessage({
            id: 'sp:error-page-text',
            defaultMessage:
              'Því miður hefur eitthvað farið úrskeiðis og ekki næst samband við vefþjón.',
          })}
        </Text>
        <Box marginTop={2}>
          <a href="https://island.is" target="_blank" rel="noreferrer">
            <Button variant="text" size="medium">
              Ísland.is
            </Button>
          </a>
        </Box>
      </Box>

      <Box display="flex" justifyContent="center" marginBottom={[1, 0]}>
        <img
          src="./assets/images/hourglass.svg"
          alt=""
          className={styles.img}
        />
      </Box>
    </Box>
  )
}
