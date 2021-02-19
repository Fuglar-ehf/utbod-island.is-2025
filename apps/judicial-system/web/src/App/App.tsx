import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { Overview } from '@island.is/judicial-system-web/src/routes/Prosecutor/Overview'
import {
  StepOne,
  StepTwo,
  StepThree,
  StepFour,
} from '@island.is/judicial-system-web/src/routes/Prosecutor/CreateDetentionRequest'
import { DetentionRequests } from '@island.is/judicial-system-web/src/routes/Shared/DetentionRequests/DetentionRequests'
import { Login } from '@island.is/judicial-system-web/src/routes/Shared/Login/Login'
import JudgeOverview from '@island.is/judicial-system-web/src/routes/Judge/Overview/Overview'
import CourtRecord from '@island.is/judicial-system-web/src/routes/Judge/CourtRecord/CourtRecord'
import {
  RulingStepOne,
  RulingStepTwo,
} from '@island.is/judicial-system-web/src/routes/Judge/Ruling'
import Confirmation from '@island.is/judicial-system-web/src/routes/Judge/Confirmation/Confirmation'
import { client } from '@island.is/judicial-system-web/src/graphql'
import HearingArrangements from '@island.is/judicial-system-web/src/routes/Judge/HearingArrangements/HearingArrangements'
import {
  UserProvider,
  Header,
} from '@island.is/judicial-system-web/src/shared-components'
import SignedVerdictOverview from '@island.is/judicial-system-web/src/routes/Shared/SignedVerdictOverview/SignedVerdictOverview'
import { CaseType } from '@island.is/judicial-system/types'
import { Users } from '@island.is/judicial-system-web/src/routes/Shared/Users/Users'
import ChangeUser from '../routes/Shared/ChangeUser/ChangeUser'
import NewUser from '../routes/Shared/NewUser/NewUser'

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <UserProvider>
          <Route
            render={(props) => {
              return <Header pathname={props.location.pathname} />
            }}
          ></Route>
          <main>
            <Switch>
              <Route
                path={Constants.FEEDBACK_FORM_ROUTE}
                component={() => {
                  window.open(Constants.FEEDBACK_FORM_URL, '_blank')
                  return <DetentionRequests />
                }}
              />
              <Route path={`${Constants.SIGNED_VERDICT_OVERVIEW}/:id`}>
                <SignedVerdictOverview />
              </Route>
              <Route path={`${Constants.CONFIRMATION_ROUTE}/:id`}>
                <Confirmation />
              </Route>
              <Route path={`${Constants.RULING_STEP_TWO_ROUTE}/:id`}>
                <RulingStepTwo />
              </Route>
              <Route path={`${Constants.RULING_STEP_ONE_ROUTE}/:id`}>
                <RulingStepOne />
              </Route>
              <Route path={`${Constants.COURT_RECORD_ROUTE}/:id`}>
                <CourtRecord />
              </Route>
              <Route path={`${Constants.STEP_TWO_ROUTE}/:id`}>
                <StepTwo />
              </Route>
              <Route path={`${Constants.STEP_THREE_ROUTE}/:id`}>
                <StepThree />
              </Route>
              <Route path={`${Constants.STEP_FOUR_ROUTE}/:id`}>
                <StepFour />
              </Route>
              <Route path={`${Constants.STEP_FIVE_ROUTE}/:id`}>
                <Overview />
              </Route>
              <Route path={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/:id`}>
                <HearingArrangements />
              </Route>
              <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
                <JudgeOverview />
              </Route>
              <Route path={`${Constants.STEP_ONE_NEW_DETENTION_ROUTE}/:id?`}>
                <StepOne type={CaseType.CUSTODY} />
              </Route>
              <Route path={`${Constants.STEP_ONE_NEW_TRAVEL_BAN_ROUTE}/:id?`}>
                <StepOne type={CaseType.TRAVEL_BAN} />
              </Route>
              <Route path={`${Constants.STEP_ONE_ROUTE}/:id?`}>
                <StepOne />
              </Route>
              <Route path={Constants.REQUEST_LIST_ROUTE}>
                <DetentionRequests />
              </Route>
              <Route path={`${Constants.USER_NEW_ROUTE}/`}>
                <NewUser />
              </Route>
              <Route path={`${Constants.USER_CHANGE_ROUTE}/:id?`}>
                <ChangeUser />
              </Route>
              <Route path={Constants.USER_LIST_ROUTE}>
                <Users />
              </Route>
              <Route path="/">
                <Login />
              </Route>
            </Switch>
          </main>
        </UserProvider>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App
