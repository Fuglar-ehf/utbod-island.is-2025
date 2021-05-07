import React, { FC } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { screen, render, waitFor } from '@testing-library/react'
import { UserManagerEvents } from 'oidc-client'

import { Authenticator } from './Authenticator'
import { getUserManager, getAuthSettings } from '../userManager'
import { useAuth } from './AuthContext'

jest.mock('../userManager')
const mockedGetUserManager = getUserManager as jest.Mock
const mockedGetAuthSettings = getAuthSettings as jest.Mock

const Wrapper: FC = ({ children }) => <MemoryRouter>{children}</MemoryRouter>
const Greeting = () => {
  const { userInfo } = useAuth()
  return <>Hello {userInfo?.profile.name}</>
}
const renderAuthenticator = () =>
  render(
    <Authenticator>
      <h2>
        <Greeting />
      </h2>
    </Authenticator>,
    { wrapper: Wrapper },
  )

type MinimalUser = {
  expired?: boolean
  profile?: {
    name: string
  }
}
type MinimalUserManager = {
  events: {
    addUserLoaded: (cb: UserManagerEvents.UserLoadedCallback) => void
    addUserSignedOut: (cb: UserManagerEvents.UserSignedOutCallback) => void
    removeUserLoaded: () => void
    removeUserSignedOut: () => void
  }
  getUser: jest.Mock<Promise<MinimalUser>>
  signinRedirect: jest.Mock
  signinSilent: jest.Mock
}

describe('Authenticator', () => {
  let userManager: MinimalUserManager

  const expectSignin = () =>
    waitFor(() => {
      if (userManager.signinRedirect.mock.calls.length === 0) {
        throw new Error('... wait')
      }
    })

  const expectAuthenticated = (name: string) =>
    screen.findByText(`Hello ${name}`)

  beforeEach(() => {
    userManager = {
      events: {
        addUserLoaded: jest.fn(),
        addUserSignedOut: jest.fn(),
        removeUserLoaded: jest.fn(),
        removeUserSignedOut: jest.fn(),
      },
      getUser: jest.fn(),
      signinRedirect: jest.fn(),
      signinSilent: jest.fn(),
    }
    mockedGetUserManager.mockReturnValue(userManager)
    mockedGetAuthSettings.mockReturnValue({
      redirectPath: '/callback',
      redirectPathSilent: 'callback-silent',
    })
  })

  it('starts signin flow when no stored user', async () => {
    // Act
    renderAuthenticator()

    // Assert
    await expectSignin()
  })

  it('should show a progress bar while authenticating', async () => {
    // Act
    const { getByRole } = renderAuthenticator()

    // Assert
    getByRole('progressbar')
    await expectSignin()
  })

  it('authenticates with non-expired user', async () => {
    // Arrange
    userManager.getUser.mockResolvedValue({
      expired: false,
      profile: {
        name: 'John',
      },
    })

    // Act
    renderAuthenticator()

    // Assert
    await expectAuthenticated('John')
  })

  it('performs silent signin with expired user', async () => {
    // Arrange
    userManager.getUser.mockResolvedValue({
      expired: true,
    })
    userManager.signinSilent.mockResolvedValue({
      profile: {
        name: 'Doe',
      },
    })

    // Act
    renderAuthenticator()

    // Assert
    await expectAuthenticated('Doe')
    expect(userManager.signinSilent).toHaveBeenCalled()
  })

  it('starts signin flow if silent signin fails', async () => {
    // Arrange
    userManager.getUser.mockResolvedValue({
      expired: true,
    })
    userManager.signinSilent.mockRejectedValue(new Error('Not signed in'))

    // Act
    renderAuthenticator()

    // Assert
    await expectSignin()
    expect(userManager.signinSilent).toHaveBeenCalled()
  })
})
