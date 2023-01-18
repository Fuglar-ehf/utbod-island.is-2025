import React from 'react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import * as constants from '@island.is/judicial-system/consts'

import { UserProvider } from '../UserProvider/UserProvider'
import { mockJudgeQuery } from '../../utils/mocks'

import Logo from './Logo'

describe('Logo', () => {
  test('should display the current users institution', async () => {
    // Arrange
    const history = createMemoryHistory()
    history.push(constants.RESTRICTION_CASE_DEFENDANT_ROUTE)

    render(
      <MockedProvider mocks={[...mockJudgeQuery]} addTypename={false}>
        <Router history={history}>
          <UserProvider authenticated={true}>
            <Logo />
          </UserProvider>
        </Router>
      </MockedProvider>,
    )

    expect(await screen.findByText('Héraðsdómur')).toBeInTheDocument()
    expect(await screen.findByText('Reykjavíkur')).toBeInTheDocument()
  })
})
