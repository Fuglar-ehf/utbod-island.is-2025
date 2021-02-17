import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'

import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  mockCaseQueries,
  mockProsecutorQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import Overview from './Overview'

describe('/stofna-krofu/yfirlit', () => {
  test('should display the approprieate custody provisions', async () => {
    // Arrange
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.STEP_THREE_ROUTE}/test_id`]}
        >
          <UserProvider>
            <Route path={`${Constants.STEP_THREE_ROUTE}/:id`}>
              <Overview />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(await screen.findByText('a-lið 1. mgr. 95. gr.')).toBeInTheDocument()

    expect(await screen.findByText('c-lið 1. mgr. 95. gr.')).toBeInTheDocument()
  })

  test('should display the custody end date of the parent case of an extended case', async () => {
    // Arrange
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.STEP_THREE_ROUTE}/test_id_8`]}
        >
          <UserProvider>
            <Route path={`${Constants.STEP_THREE_ROUTE}/:id`}>
              <Overview />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(await screen.findByText('Fyrri gæsla')).toBeInTheDocument()

    expect(
      await screen.findByText('Mánud. 18. janúar 2021 kl. 19:50'),
    ).toBeInTheDocument()
  })
})
