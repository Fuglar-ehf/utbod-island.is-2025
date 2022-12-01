import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Authenticator } from '@island.is/auth/react'
import { ApolloProvider } from '@apollo/client'
import { client } from '@island.is/service-portal/graphql'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import {
  ApplicationErrorBoundary,
  PortalMetaProvider,
} from '@island.is/portals/core'

import { environment } from '../environments'
import { StateProvider } from '../store/stateProvider'
import * as store from '../store/store'
import Dashboard from '../screens/Dashboard/Dashboard'
import Layout from '../components/Layout/Layout'
import Modules from '../screens/Modules/Modules'
import { GlobalModules } from '../components/GlobalModules/GlobalModules'
import { UserProfileLocale } from '@island.is/shared/components'
import * as styles from './App.css'

export const App = () => {
  return (
    <div className={styles.page}>
      <ApolloProvider client={client}>
        <PortalMetaProvider basePath={ServicePortalPath.MinarSidurPath}>
          <StateProvider
            initialState={store.initialState}
            reducer={store.reducer}
          >
            <LocaleProvider locale={defaultLanguage} messages={{}}>
              <ApplicationErrorBoundary>
                <Router basename={ServicePortalPath.MinarSidurPath}>
                  <Authenticator>
                    <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
                      <UserProfileLocale />
                      <Layout>
                        <Switch>
                          <Route exact path={ServicePortalPath.MinarSidurRoot}>
                            <Dashboard />
                          </Route>
                          <Route>
                            <Modules />
                          </Route>
                        </Switch>
                        <GlobalModules />
                      </Layout>
                    </FeatureFlagProvider>
                  </Authenticator>
                </Router>
              </ApplicationErrorBoundary>
            </LocaleProvider>
          </StateProvider>
        </PortalMetaProvider>
      </ApolloProvider>
    </div>
  )
}

export default App
