import React from 'react'

import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '../../i18n/withLocale'
import { Screen } from '@island.is/web/types'

// TODO: remove this redirect route after 9.1.0 is released
const StofnanirRedirect: Screen = () => {
  return (
    <div>
      <meta httpEquiv="refresh" content="0;url=/s" />
    </div>
  )
}

StofnanirRedirect.getInitialProps = async ({ res }) => {
  if (res) {
    res.writeHead(302, {
      Location: '/s',
    })
    res.end()
  }
}

export default withApollo(withLocale('is')(StofnanirRedirect))
