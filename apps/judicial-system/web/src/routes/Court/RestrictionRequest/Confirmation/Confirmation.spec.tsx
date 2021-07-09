import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { CaseAppealDecision } from '@island.is/judicial-system/types'
import {
  mockCaseQueries,
  mockJudgeQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import { Confirmation } from './Confirmation'
import { LocaleProvider } from '@island.is/localization'

describe('Confirmation route', () => {
  test(`should allow users to continue if the user is the assigned judge`, async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_5' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <UserProvider authenticated={true}>
          <LocaleProvider locale="is" messages={{}}>
            <Confirmation />
          </LocaleProvider>
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await screen.findByRole('button', {
        name: /Staðfesta og hefja undirritun/i,
      }),
    ).not.toBeDisabled()
  })

  test(`should not allow users to continue if the user is not the assigned judge`, async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_6' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <UserProvider authenticated={true}>
          <LocaleProvider locale="is" messages={{}}>
            <Confirmation />
          </LocaleProvider>
        </UserProvider>
      </MockedProvider>,
    )

    expect(
      await screen.findByText(
        'Einungis skráður dómari getur undirritað úrskurð',
      ),
    ).toBeInTheDocument()
  })

  test(`should not display prosecutor or judge appeal announcements if appeal decision is not ${CaseAppealDecision.APPEAL}`, async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_2' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <UserProvider>
          <LocaleProvider locale="is" messages={{}}>
            <Confirmation />
          </LocaleProvider>
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(() => screen.queryByText('accusedAppealAnnouncement test')),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('prosecutorAppealAnnouncement test'),
    ).not.toBeInTheDocument()
  })

  test(`should display prosecutor and judge appeal announcements if appeal decision is ${CaseAppealDecision.APPEAL}`, async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <UserProvider>
          <LocaleProvider locale="is" messages={{}}>
            <Confirmation />
          </LocaleProvider>
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await screen.findByText('accusedAppealAnnouncement test'),
    ).toBeInTheDocument()

    expect(
      await screen.findByText('prosecutorAppealAnnouncement test'),
    ).toBeInTheDocument()
  })
})
