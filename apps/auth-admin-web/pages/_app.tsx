import '../styles/App.scss'
import App from 'next/app'
import React from 'react'
import getConfig from 'next/config'
import { Provider } from 'next-auth/client'
import { withHealthchecks } from '@island.is/web/units/Healthchecks/withHealthchecks'

interface Props {}

class AuthAdminWebApp extends App<Props> {
  render() {
    const { Component, pageProps } = this.props
    return (
      <Provider
        session={pageProps.session}
        options={{
          keepAlive: parseInt(
            process.env.NEXT_PUBLIC_SESSION_KEEP_ALIVE_SECONDS || '300',
            10,
          ),
        }}
      >
        <Component {...pageProps} />
      </Provider>
    )
  }
}

const endpointDependencies = process.env.NEXTAUTH_URL
  ? [process.env.NEXTAUTH_URL]
  : []
const {
  serverRuntimeConfig: { backendUrl },
} = getConfig()
const externalEndpointDependencies = [backendUrl]

export default withHealthchecks(endpointDependencies)(AuthAdminWebApp)
