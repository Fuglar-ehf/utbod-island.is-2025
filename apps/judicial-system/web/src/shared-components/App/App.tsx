import React, { useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Header } from '../Header'
import * as Constants from '../../utils/constants'
import { Overview } from '../../routes/Prosecutor/Overview'
import {
  StepOne,
  StepTwo,
} from '../../routes/Prosecutor/CreateDetentionRequest'
import { DetentionRequests } from '../../routes/Prosecutor/DetentionRequests'
import { Login } from '../../routes/Login'
import * as styles from './App.treat'
import { User } from '../../types'
import { userContext } from '../../utils/userContext'
import JudgeOverview from '../../routes/Judge/Overview/Overview'
import CourtRecord from '../../routes/Judge/CourtRecord/CourtRecord'
import Ruling from '../../routes/Judge/Ruling/Ruling'
import Confirmation from '../../routes/Judge/Confirmation/Confirmation'

const App: React.FC = () => {
  const [user, setUser] = useState<User>(null)
  const onGetUser = (u: User) => {
    setUser(u)
  }

  return (
    <userContext.Provider value={{ user: user }}>
      <BrowserRouter>
        <Header />
        <main className={styles.mainConainer}>
          <Switch>
            <Route path={Constants.CONFIRMATION_ROUTE}>
              <Confirmation />
            </Route>
            <Route path={Constants.RULING_ROUTE}>
              <Ruling />
            </Route>
            <Route path={Constants.COURT_DOCUMENT_ROUTE}>
              <CourtRecord />
            </Route>
            <Route path={Constants.STEP_THREE_ROUTE}>
              <Overview />
            </Route>
            <Route path={Constants.STEP_TWO_ROUTE}>
              <StepTwo />
            </Route>
            <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <JudgeOverview />
            </Route>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <StepOne />
            </Route>
            <Route path={Constants.STEP_ONE_ROUTE}>
              <StepOne />
            </Route>
            <Route path={Constants.DETENTION_REQUESTS_ROUTE}>
              <DetentionRequests onGetUser={onGetUser} />
            </Route>
            <Route path="/">
              <Login />
            </Route>
          </Switch>
        </main>
      </BrowserRouter>
    </userContext.Provider>
  )
}

export default App
