import React, { FC, ReactNode } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import {
  render,
  screen,
  fireEvent,
  act,
  getByText,
  getByRole,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import { MockedProvider } from '@apollo/client/testing'
import { LocaleProvider, LocaleContext } from '@island.is/localization'
import { MockedAuthenticator, MockUser } from '@island.is/auth/react'
import {
  Features,
  MockedFeatureFlagProvider,
} from '@island.is/react/feature-flags'
import { UserMenu } from './UserMenu'
import { ACTOR_DELEGATIONS } from './actorDelegations.graphql'
import { ActorDelegationsQuery } from '../../../gen/graphql'
import { USER_PROFILE } from './userProfile.graphql'
import { GetUserProfileQuery } from '../../../gen/graphql'

const delegation = {
  name: 'Phil',
  nationalId: '1111111111',
}
const mocks = [
  {
    request: {
      query: ACTOR_DELEGATIONS,
    },
    result: {
      data: {
        authActorDelegations: [
          {
            from: delegation,
          },
        ],
      } as ActorDelegationsQuery,
    },
  },
  {
    request: {
      query: USER_PROFILE,
    },
    result: {
      data: {
        getIslykillSettings: {
          email: 'test@test.is',
          mobile: '0000000',
        },
      } as GetUserProfileQuery,
    },
  },
]

const wrapper: FC = ({ children }) => (
  <MockedFeatureFlagProvider flags={[Features.delegationsEnabled]}>
    <MockedProvider mocks={mocks} addTypename={false}>
      <Router>
        <LocaleProvider skipPolyfills>{children}</LocaleProvider>
      </Router>
    </MockedProvider>
  </MockedFeatureFlagProvider>
)

async function openMenu() {
  // Open user dropdown and wait for a few promise updates.
  await act(async () => {
    fireEvent.click(screen.getAllByRole('button', { name: /útskráning/i })[0])
  })
  return screen.getByRole('dialog', { name: /útskráning/i })
}

describe('UserMenu', () => {
  let switchUser: (nationalId?: string) => void
  let signOut: () => void

  const renderAuthenticated = (
    ui: ReactNode,
    { user }: { user?: MockUser } = {},
  ) =>
    render(
      <MockedAuthenticator
        switchUser={switchUser}
        signOut={signOut}
        user={user}
      >
        {ui}
      </MockedAuthenticator>,
      {
        wrapper,
      },
    )

  beforeEach(() => {
    switchUser = jest.fn()
    signOut = jest.fn()
  })

  it('renders nothing when not authenticated', () => {
    // Act
    renderAuthenticated(<UserMenu />)

    // Assert
    expect(screen.queryByRole('button', { name: /útskráning/i })).toBeNull()
  })

  it('shows user menu when authenticated', async () => {
    // Act
    renderAuthenticated(<UserMenu />, {
      user: { profile: { name: 'John' } },
    })

    // Assert
    const button = screen.getAllByRole('button', { name: /útskráning/i })[0]
    expect(button).toHaveTextContent('John')
  })

  it('shows delegation name when authenticated with delegations', async () => {
    // Act
    renderAuthenticated(<UserMenu />, {
      user: {
        profile: {
          name: 'John',
          actor: { name: 'Anna', nationalId: '2222222222' },
        },
      },
    })

    // Assert
    const button = screen.getAllByRole('button', { name: /útskráning/i })
    expect(button[0]).toHaveTextContent('John')
    expect(button[1]).toHaveTextContent('Anna')
  })

  it('can open and close user menu', async () => {
    // Arrange
    renderAuthenticated(<UserMenu />, { user: { profile: { name: 'John' } } })

    // Act
    const dialog = await openMenu()

    // Assert
    getByText(dialog, 'John')

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Loka' }))

    // Assert
    expect(screen.queryByRole('dialog', { name: /útskráning/i })).toBeNull()
  })

  it('can log out user', async () => {
    // Arrange
    renderAuthenticated(<UserMenu />, { user: {} })
    await openMenu()

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Útskrá' }))

    // Assert
    expect(screen.queryByRole('dialog', { name: /útskráning/i })).toBeNull()
    expect(signOut).toHaveBeenCalled()
  })

  it('can switch languages', async () => {
    // Arrange
    renderAuthenticated(
      <>
        <UserMenu />
        <LocaleContext.Consumer>
          {({ lang }) => <span>Current: {lang}</span>}
        </LocaleContext.Consumer>
      </>,
      { user: {} },
    )
    const dialog = await openMenu()
    const languageSelector = dialog.querySelector('#language-switcher')!
    expect(languageSelector).not.toBeNull()
    expect(screen.getByText(/Current/)).toHaveTextContent('Current: is')

    // Act
    fireEvent.mouseDown(
      languageSelector.querySelector('.island-select__dropdown-indicator')!,
      { button: 1 },
    )
    fireEvent.click(screen.getByText('English'))

    // Assert
    expect(screen.getByText(/Current/)).toHaveTextContent('Current: en')
  })

  it('can switch between delegations', async () => {
    // Arrange
    renderAuthenticated(<UserMenu />, {
      user: {},
    })
    const dialog = await openMenu()
    const delegationButton = getByRole(dialog, 'button', {
      name: delegation.name,
    })

    // Act
    fireEvent.click(delegationButton)

    // Assert
    expect(screen.queryByRole('dialog', { name: /útskráning/i })).toBeNull()
    expect(switchUser).toHaveBeenCalledWith(delegation.nationalId)
  })
})
