import React from 'react'
import { render } from '@testing-library/react'
import { Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'

import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { Header } from './'

describe('Header', () => {
  test('should direct users to detention requests route when user click the logo', () => {
    // Arrange
    const history = createMemoryHistory()
    history.push(Constants.STEP_ONE_ROUTE)
    const { getByTestId } = render(
      <Router history={history}>
        <Header pathname={Constants.REQUEST_LIST_ROUTE} />
      </Router>,
    )
    const logo = getByTestId('link-to-home')

    // Act
    expect(history.location.pathname).toEqual(Constants.STEP_ONE_ROUTE)
    userEvent.click(logo)

    // Assert
    expect(history.location.pathname).toEqual(Constants.REQUEST_LIST_ROUTE)
  })
})
