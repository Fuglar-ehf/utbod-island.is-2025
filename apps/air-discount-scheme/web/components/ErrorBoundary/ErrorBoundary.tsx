import React, { PureComponent } from 'react'
import * as Sentry from '@sentry/node'

import { Box, ContentBlock, Typography } from '@island.is/island-ui/core'

interface PropTypes {
  children: React.ReactNode
}

interface StateTypes {
  error?: Error
  eventId?: string
}

const isServer = typeof window === 'undefined'

class ErrorBoundary extends PureComponent<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props)
    this.state = { error: undefined }
  }

  componentDidCatch(error: Error, errorInfo: {}) {
    this.setState({ error })
    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key])
      })
      Sentry.captureException(error)
    })
  }

  render() {
    const { children } = this.props
    const { error } = this.state

    if (error) {
      return (
        <Box marginTop={12}>
          <ContentBlock width="large">
            <Box marginBottom={3}>
              <Typography variant="h1" as="h1">
                Villa kom upp
              </Typography>
            </Box>
            <Box marginBottom={9}>
              <Typography variant="intro">
                Eitthvað hefur farið úrskeiðis.
              </Typography>
              <Typography variant="intro">
                Vinsamlega{' '}
                <a href="https://island.is/um-island-is/hafa-samband/">
                  hafðu samband
                </a>{' '}
                fyrir frekari hjálp
              </Typography>
            </Box>
          </ContentBlock>
        </Box>
      )
    }

    return isServer ? (
      <div />
    ) : (
      <React.Suspense fallback={<div />}>{children}</React.Suspense>
    )
  }
}

export default ErrorBoundary
