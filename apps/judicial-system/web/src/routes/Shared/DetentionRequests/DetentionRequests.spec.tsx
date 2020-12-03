import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { DetentionRequests } from './DetentionRequests'
import { CaseState } from '@island.is/judicial-system/types'
import { MemoryRouter, Route } from 'react-router-dom'
import { mockJudgeQuery, mockProsecutorQuery } from '../../../utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { CasesQuery } from './DetentionRequests'
import * as Constants from '../../../utils/constants'
import '@testing-library/jest-dom'
import { UserProvider } from '../../../shared-components/UserProvider/UserProvider'

const mockCasesQuery = [
  {
    request: {
      query: CasesQuery,
    },
    result: {
      data: {
        cases: [
          {
            id: 'test_id_1',
            created: '2020-09-16T19:50:08.033Z',
            state: CaseState.DRAFT,
            policeCaseNumber: 'string',
            accusedNationalId: 'string',
            accusedName: 'Jon Harring',
            custodyEndDate: null,
          },
          {
            id: 'test_id_2',
            created: '2020-09-16T19:50:08.033Z',
            state: CaseState.DRAFT,
            policeCaseNumber: 'string',
            accusedNationalId: 'string',
            accusedName: 'Jon Harring',
            custodyEndDate: null,
          },
          {
            id: 'test_id_3',
            created: '2020-09-16T19:50:08.033Z',
            state: CaseState.ACCEPTED,
            policeCaseNumber: '008-2020-X',
            accusedNationalId: '012345-6789',
            accusedName: 'Erlingur L Kristinsson',
            custodyEndDate: '2020-11-11T12:31:00.000Z',
          },
          {
            id: 'test_id_4',
            created: '2020-09-16T19:50:08.033Z',
            state: CaseState.NEW,
            policeCaseNumber: '008-2020-X',
            accusedNationalId: '012345-6789',
            accusedName: 'Erlingur L Kristinsson',
            custodyEndDate: '2020-11-11T12:31:00.000Z',
          },
        ],
      },
    },
  },
]

describe('Detention requests route', () => {
  test('should list all cases that do not have status NEW in a list if you are a judge', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockJudgeQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.DETENTION_REQUESTS_ROUTE}`]}
        >
          <UserProvider>
            <Route path={`${Constants.DETENTION_REQUESTS_ROUTE}`}>
              <DetentionRequests />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    expect(
      await waitFor(
        () => screen.getAllByTestId('detention-requests-table-row').length,
      ),
    ).toEqual(
      mockCasesQuery[0].result.data.cases.filter((dr) => {
        return dr.state !== CaseState.NEW
      }).length,
    )
  })

  test('should display the judge logo if you are a judge', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockJudgeQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.DETENTION_REQUESTS_ROUTE}`]}
        >
          <UserProvider>
            <Route path={`${Constants.DETENTION_REQUESTS_ROUTE}`}>
              <DetentionRequests />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    expect(
      await waitFor(() => screen.getByTestId('judge-logo')),
    ).toBeInTheDocument()
  })

  test('should not display a button to create a request if you are a judge', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockJudgeQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.DETENTION_REQUESTS_ROUTE}`]}
        >
          <UserProvider>
            <Route path={`${Constants.DETENTION_REQUESTS_ROUTE}`}>
              <DetentionRequests />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    expect(
      await waitFor(() =>
        screen.queryByRole('button', { name: /Stofna nýja kröfu/i }),
      ),
    ).not.toBeInTheDocument()
  })

  test('should display the prosecutor logo if you are a prosecutor', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.DETENTION_REQUESTS_ROUTE}`]}
        >
          <UserProvider>
            <Route path={`${Constants.DETENTION_REQUESTS_ROUTE}`}>
              <DetentionRequests />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    expect(
      await waitFor(() => screen.getByTestId('prosecutor-logo')),
    ).toBeInTheDocument()
  })

  test('should list all cases in a list if you are a prosecutor', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.DETENTION_REQUESTS_ROUTE}`]}
        >
          <UserProvider>
            <Route path={`${Constants.DETENTION_REQUESTS_ROUTE}`}>
              <DetentionRequests />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    expect(
      await waitFor(
        () => screen.getAllByTestId('detention-requests-table-row').length,
      ),
    ).toEqual(mockCasesQuery[0].result.data.cases.length)
  })

  test('should display custody end date if case has ACCEPTED status', async () => {
    render(
      <MockedProvider
        mocks={[...mockCasesQuery, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.DETENTION_REQUESTS_ROUTE}`]}
        >
          <UserProvider>
            <Route path={`${Constants.DETENTION_REQUESTS_ROUTE}`}>
              <DetentionRequests />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    expect(
      await waitFor(() => screen.getByText('11. nóv. 2020')),
    ).toBeInTheDocument()
  })

  test('should display an error alert if the api call fails', async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: CasesQuery,
            },
            error: { name: 'error', message: 'message' },
          },
          ...mockProsecutorQuery,
        ]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.DETENTION_REQUESTS_ROUTE}`]}
        >
          <UserProvider>
            <Route path={`${Constants.DETENTION_REQUESTS_ROUTE}`}>
              <DetentionRequests />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(
      await waitFor(() =>
        screen.getByText(
          'Ekki tókst að ná sambandi við gagnagrunn. Málið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar.',
        ),
      ),
    ).toBeInTheDocument()
  })
})
