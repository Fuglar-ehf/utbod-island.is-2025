import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import userEvent from '@testing-library/user-event'

import {
  mockCaseQueries,
  mockJudgeQuery,
  mockProsecutorQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import { formatDate, TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { SignedVerdictOverview } from './SignedVerdictOverview'

describe('Signed Verdict Overview route', () => {
  describe('Rejected case', () => {
    test('should have the correct title if case is not accepted', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_2' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByText('Kröfu hafnað', { selector: 'h1' }),
      ).toBeInTheDocument()
    })

    test('should have the correct subtitle if case is not accepted', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_4' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByText('Úrskurðað 16. september 2020 kl. 19:51'),
      ).toBeInTheDocument()
    })

    test('should not show restrictions tag if case is rejected event though there are restrictions', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_2' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await waitFor(() =>
          screen.queryByText('Heimsóknarbann', { selector: 'span' }),
        ),
      ).not.toBeInTheDocument()
    })

    test('should not show a button for extension', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_2' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await waitFor(() =>
          screen.queryByRole('button', { name: 'Framlengja gæslu' }),
        ),
      ).not.toBeInTheDocument()

      expect(
        await screen.findByText(
          'Ekki hægt að framlengja gæsluvarðhald sem var hafnað.',
        ),
      ).toBeInTheDocument()
    })
  })

  describe('Accepted case with active custody', () => {
    test('should have the correct title', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_5' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByText('Gæsluvarðhald virkt', { selector: 'h1' }),
      ).toBeInTheDocument()
    })

    test('should have the correct subtitle', async () => {
      const date = '2020-09-25T19:50:08.033Z'
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_5' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByText(
          `Gæsla til ${formatDate(date, 'PPP')} kl. ${formatDate(
            date,
            TIME_FORMAT,
          )}`,
        ),
      ).toBeInTheDocument()
    })

    test('should show restrictions tag if there are restrictions', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByText('Fjölmiðlabann', { selector: 'span' }),
      ).toBeInTheDocument()
    })

    test('should not show a button for extension because the user is a judge', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await waitFor(() =>
          screen.queryByRole('button', { name: 'Framlengja gæslu' }),
        ),
      ).not.toBeInTheDocument()
    })

    test('should show case files', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByRole('button', { name: 'Rannsóknargögn (1)' }),
      ).toBeInTheDocument()
    })

    test('should show a button to open case files if you are a prosecutor', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      userEvent.click(
        await screen.findByRole('button', { name: 'Rannsóknargögn (1)' }),
      )

      expect(
        await screen.findAllByRole('button', { name: 'Opna' }),
      ).toHaveLength(1)
    })
  })

  describe('Accepted case with custody end time in the past', () => {
    test('should have the correct title', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_6' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByText('Gæsluvarðhaldi lokið', { selector: 'h1' }),
      ).toBeInTheDocument()
    })

    test('should have the correct subtitle', async () => {
      const dateInPast = '2020-09-24T19:50:08.033Z'
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_6' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByText(
          `Gæsla rann út ${formatDate(dateInPast, 'PPP')} kl. ${formatDate(
            dateInPast,
            TIME_FORMAT,
          )}`,
        ),
      ).toBeInTheDocument()
    })

    test('should display restriction tags if there are restrictions', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_6' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByText('Heimsóknarbann', { selector: 'span' }),
      ).toBeInTheDocument()
    })

    test('should not show a button for extension because the user is a judge', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await waitFor(() =>
          screen.queryByRole('button', { name: 'Framlengja gæslu' }),
        ),
      ).not.toBeInTheDocument()
    })

    test('should display an indicator that the case cannot be extended', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_8' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByText(
          'Ekki hægt að framlengja kröfu þegar dómari hefur úrskurðað um annað en dómkröfur sögðu til um.',
        ),
      ).toBeInTheDocument()
    })
  })

  describe('Accepted case with active travel ban', () => {
    test('should have the correct title', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_7' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByText('Farbann virkt', { selector: 'h1' }),
      ).toBeInTheDocument()
    })

    test('should have the correct subtitle', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_7' },
      }))
      const date = '2020-09-25T19:50:08.033Z'

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByText(
          `Farbann til ${formatDate(date, 'PPP')} kl. ${formatDate(
            date,
            TIME_FORMAT,
          )}`,
        ),
      ).toBeInTheDocument()
    })

    test('should not show a button for extension because the user is a judge', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await waitFor(() =>
          screen.queryByRole('button', { name: 'Framlengja gæslu' }),
        ),
      ).not.toBeInTheDocument()
    })

    test('should not show an extension for why the case cannot be extended if the user is a prosecutor', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_7' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByText(
          'Ekki hægt að framlengja kröfu þegar dómari hefur úrskurðað um annað en dómkröfur sögðu til um.',
        ),
      ).toBeInTheDocument()
    })
  })

  describe('Accepted case with travel ban end time in the past', () => {
    test('should have the correct title', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_8' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByText('Farbanni lokið', { selector: 'h1' }),
      ).toBeInTheDocument()
    })

    test('should have the correct subtitle', async () => {
      const dateInPast = '2020-09-24T19:50:08.033Z'
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id_8' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByText(
          `Farbann rann út ${formatDate(dateInPast, 'PPP')} kl. ${formatDate(
            dateInPast,
            TIME_FORMAT,
          )}`,
        ),
      ).toBeInTheDocument()
    })

    test('should show a button for extension because the user is a prosecutor', async () => {
      const useRouter = jest.spyOn(require('next/router'), 'useRouter')
      useRouter.mockImplementation(() => ({
        query: { id: 'test_id' },
      }))

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
          addTypename={false}
        >
          <UserProvider>
            <SignedVerdictOverview />
          </UserProvider>
        </MockedProvider>,
      )

      expect(
        await screen.findByRole('button', { name: 'Framlengja gæslu' }),
      ).toBeInTheDocument()
    })
  })
})
