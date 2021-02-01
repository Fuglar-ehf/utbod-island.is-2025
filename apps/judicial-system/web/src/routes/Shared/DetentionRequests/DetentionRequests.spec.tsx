import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { DetentionRequests } from './DetentionRequests'
import { CaseState } from '@island.is/judicial-system/types'
import { MemoryRouter, Route } from 'react-router-dom'
import {
  mockJudgeQuery,
  mockProsecutorQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import '@testing-library/jest-dom'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import userEvent from '@testing-library/user-event'
import { CasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'

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
            modified: '2020-09-16T19:51:39.466Z',
            created: '2020-09-16T19:50:08.033Z',
            state: CaseState.DRAFT,
            policeCaseNumber: 'string',
            accusedNationalId: 'string',
            accusedName: 'Jon Harring Sr.',
            custodyEndDate: null,
          },
          {
            id: 'test_id_2',
            created: '2020-12-16T19:50:08.033Z',
            modified: '2020-12-16T19:51:39.466Z',
            state: CaseState.DRAFT,
            policeCaseNumber: 'string',
            accusedNationalId: 'string',
            accusedName: 'Jon Harring',
            custodyEndDate: null,
          },
          {
            id: 'test_id_3',
            created: '2020-05-16T19:50:08.033Z',
            modified: '2020-09-16T19:51:39.466Z',
            state: CaseState.ACCEPTED,
            policeCaseNumber: '008-2020-X',
            accusedNationalId: '012345-6789',
            accusedName: 'Mikki Refur',
            custodyEndDate: '2020-11-11T12:31:00.000Z',
          },
          {
            id: 'test_id_4',
            created: '2020-08-16T19:50:08.033Z',
            modified: '2020-09-16T19:51:39.466Z',
            state: CaseState.NEW,
            policeCaseNumber: '008-2020-X',
            accusedNationalId: '012345-6789',
            accusedName: 'Erlingur L Kristinsson',
            custodyEndDate: '2020-11-11T12:31:00.000Z',
          },
          {
            id: 'test_id_5',
            created: '2020-08-16T19:50:08.033Z',
            modified: '2020-09-16T19:51:39.466Z',
            state: CaseState.DELETED,
            policeCaseNumber: '008-2020-X',
            accusedNationalId: '012345-6789',
            accusedName: 'Erlingur L Kristinsson',
            custodyEndDate: '2020-11-11T12:31:00.000Z',
          },
          {
            id: 'test_id_6',
            created: '2021-01-16T19:50:08.033Z',
            modified: '2021-01-16T19:51:39.466Z',
            state: CaseState.RECEIVED,
            policeCaseNumber: '008-2020-X',
            accusedNationalId: '012345-6789',
            accusedName: 'D. M. Kil',
            custodyEndDate: '2020-11-11T12:31:00.000Z',
          },
          {
            id: 'test_id_7',
            created: '2021-02-16T19:50:08.033Z',
            modified: '2021-02-16T19:51:39.466Z',
            state: CaseState.SUBMITTED,
            policeCaseNumber: '008-2020-X',
            accusedNationalId: '012345-6789',
            accusedName: 'Moe',
            custodyEndDate: '2020-11-11T12:31:00.000Z',
          },
        ],
      },
    },
  },
]

describe('Detention requests route', () => {
  test('should list all cases that do not have status NEW or DELETED in a list if you are a judge', async () => {
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
    ).toEqual(5)
  }, 10000)

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

  test('should not display a button to create a request if the user is a judge', async () => {
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

  test('should not display a button to delete a request if the user is a judge', async () => {
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
      await waitFor(() => screen.queryByLabelText('Viltu eyða drögum?')),
    ).not.toBeInTheDocument()
  })

  test('should not display a buttton to delete a request that do not have a NEW or DRAFT or SUBMITTED or RECEIVED state', async () => {
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
        () => screen.getAllByLabelText('Viltu afturkalla kröfu?').length,
      ),
    ).toEqual(5)
  })

  test('should not show deleted requests', async () => {
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
    ).toEqual(6)
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
    ).toEqual(6)
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

  test('should order the table data by accused name in ascending order when the user clicks the accused name table header', async () => {
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

    userEvent.click(await waitFor(() => screen.getByText('Sakborningur')))

    const tableRows = await waitFor(() =>
      screen.getAllByTestId('detention-requests-table-row'),
    )

    expect(tableRows[0]).toHaveTextContent('D. M. Kil')
    expect(tableRows[1]).toHaveTextContent('Erlingur L Kristinsson')
    expect(tableRows[2]).toHaveTextContent('Jon Harring')
    expect(tableRows[3]).toHaveTextContent('Jon Harring Sr.')
    expect(tableRows[4]).toHaveTextContent('Mikki Refur')
    expect(tableRows[5]).toHaveTextContent('Moe')
  })

  test('should order the table data by accused name in descending order when the user clicks the accused name table header twice', async () => {
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

    userEvent.dblClick(await waitFor(() => screen.getByText('Sakborningur')))

    const tableRows = await waitFor(() =>
      screen.getAllByTestId('detention-requests-table-row'),
    )

    expect(tableRows[5]).toHaveTextContent('D. M. Kil')
    expect(tableRows[4]).toHaveTextContent('Erlingur L Kristinsson')
    expect(tableRows[3]).toHaveTextContent('Jon Harring')
    expect(tableRows[2]).toHaveTextContent('Jon Harring Sr.')
    expect(tableRows[1]).toHaveTextContent('Mikki Refur')
    expect(tableRows[0]).toHaveTextContent('Moe')
  })

  test('should order the table data by created in ascending order when the user clicks the created table header', async () => {
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

    userEvent.click(await waitFor(() => screen.getByText('Krafa stofnuð')))

    const tableRows = await waitFor(() =>
      screen.getAllByTestId('detention-requests-table-row'),
    )

    expect(tableRows[0]).toHaveTextContent('Mikki Refur')
    expect(tableRows[1]).toHaveTextContent('Erlingur L Kristinsson')
    expect(tableRows[2]).toHaveTextContent('Jon Harring Sr.')
    expect(tableRows[3]).toHaveTextContent('Jon Harring')
    expect(tableRows[4]).toHaveTextContent('D. M. Kil')
    expect(tableRows[5]).toHaveTextContent('Moe')
  })

  test('should order the table data by created in descending order when the user clicks the created table header twice', async () => {
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

    userEvent.dblClick(await waitFor(() => screen.getByText('Krafa stofnuð')))

    const tableRows = await waitFor(() =>
      screen.getAllByTestId('detention-requests-table-row'),
    )

    expect(tableRows[5]).toHaveTextContent('Mikki Refur')
    expect(tableRows[4]).toHaveTextContent('Erlingur L Kristinsson')
    expect(tableRows[3]).toHaveTextContent('Jon Harring Sr.')
    expect(tableRows[2]).toHaveTextContent('Jon Harring')
    expect(tableRows[1]).toHaveTextContent('D. M. Kil')
    expect(tableRows[0]).toHaveTextContent('Moe')
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
