import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'

import { UpdateCase } from '@island.is/judicial-system/types'
import {
  mockCaseQueries,
  mockProsecutorQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import StepFour from './StepFour'

describe('Create detention request, step four', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockProsecutorQuery,
          ...mockUpdateCaseMutation([
            { caseFacts: 'Lorem ipsum dolor sit amet,' } as UpdateCase,
            {
              legalArguments: 'Lorem ipsum dolor sit amet,',
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.STEP_FOUR_ROUTE}/test_id_2`]}
        >
          <UserProvider>
            <Route path={`${Constants.STEP_FOUR_ROUTE}/:id`}>
              <StepFour />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Act and Assert
    userEvent.type(
      await screen.findByLabelText('Málsatvik *'),
      'Lorem ipsum dolor sit amet,',
    )

    expect(
      (await screen.findByRole('button', {
        name: /Halda áfram/i,
      })) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(
      await screen.findByLabelText('Lagarök *'),
      'Lorem ipsum dolor sit amet,',
    )

    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).not.toBeDisabled()
  })

  test('should not have a disabled continue button if step is valid when a valid request is opened', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={[`${Constants.STEP_FOUR_ROUTE}/test_id`]}>
          <UserProvider>
            <Route path={`${Constants.STEP_FOUR_ROUTE}/:id`}>
              <StepFour />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).not.toBeDisabled()
  })
})
