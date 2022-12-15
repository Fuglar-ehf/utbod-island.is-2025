import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'

import { client } from '../graphql'
import { LocaleProvider } from '@island.is/localization'
import { defaultLanguage } from '@island.is/shared/constants'
import { Authenticator } from '@island.is/auth/react'
import { FeatureFlagProvider } from '@island.is/react/feature-flags'
import { UserProfileLocale } from '@island.is/shared/components'
import {
  PortalMetaProvider,
  Modules,
  ModulesProvider,
} from '@island.is/portals/core'
import { modules } from '../lib/modules'
import environment from '../environments/environment'
import { Layout } from '../components/Layout/Layout'
import { ApplicationErrorBoundary } from '@island.is/portals/core'
import { AdminPortalPaths } from '../lib/paths'
import { Dashboard } from '../screens/Dashboard'
import { masterNavigation } from '../lib/masterNavigation'

export const App = () => {
  return (
    <ApolloProvider client={client}>
      <PortalMetaProvider
        basePath={AdminPortalPaths.Base}
        masterNav={masterNavigation}
      >
        <LocaleProvider locale={defaultLanguage} messages={{}}>
          <ApplicationErrorBoundary>
            <Router basename={AdminPortalPaths.Base}>
              <Authenticator>
                <FeatureFlagProvider sdkKey={environment.featureFlagSdkKey}>
                  <ModulesProvider modules={modules}>
                    <UserProfileLocale />
                    <Layout>
                      <Switch>
                        <Route exact path={AdminPortalPaths.Root}>
                          <Dashboard />
                        </Route>
                        <Route>
                          <Modules />
                        </Route>
                      </Switch>
                    </Layout>
                  </ModulesProvider>
                </FeatureFlagProvider>
              </Authenticator>
            </Router>
          </ApplicationErrorBoundary>
        </LocaleProvider>
      </PortalMetaProvider>
    </ApolloProvider>
  )
}
