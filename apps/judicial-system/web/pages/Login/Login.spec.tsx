import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, Route } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import { MockedProvider } from '@apollo/client/testing'

import { mockJudgeQuery } from '@island.is/judicial-system-web/src/utils/mocks'
import { api } from '@island.is/judicial-system-web/src/services'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import Login from './Login'

describe('Login route', () => {
  fetchMock.mock('/api/auth/logout', 200)

  test('should render successfully', () => {
    // Arrange

    // Act
    const { baseElement } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    )

    // Assert
    expect(baseElement).toBeTruthy()
  })

  test('should have a title set', () => {
    // Arrange

    // Act
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    )

    // Assert
    expect(document.title).toEqual('Réttarvörslugátt')
  })

  test('should logout a logged in user', async () => {
    // Arrange
    const spy = jest.spyOn(api, 'logOut')

    // Act
    render(
      <MockedProvider mocks={mockJudgeQuery} addTypename={false}>
        <MemoryRouter initialEntries={['/']}>
          <Route path="/">
            <UserProvider>
              <Login />
            </UserProvider>
          </Route>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    await waitFor(() => expect(spy).toHaveBeenCalled())
  })
})
