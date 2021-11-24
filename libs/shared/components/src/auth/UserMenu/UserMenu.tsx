import React, { useState } from 'react'
import { Box } from '@island.is/island-ui/core'
import { useAuth } from '@island.is/auth/react'
import { UserDropdown } from './UserDropdown'
import { UserButton } from './UserButton'
import { UserDropdown as ServicePortalUserDropdown } from './ServicePortal/UserDropdownSP'

export const UserMenu = ({
  isServicePortal = false,
}: {
  isServicePortal?: boolean
}) => {
  const [dropdownState, setDropdownState] = useState<'closed' | 'open'>(
    'closed',
  )
  const { signOut, switchUser, userInfo: user } = useAuth()

  const handleClick = () => {
    setDropdownState(dropdownState === 'open' ? 'closed' : 'open')
  }

  if (!user) {
    return null
  }

  return (
    <Box display="flex" position="relative" height="full">
      <UserButton user={user} onClick={handleClick} />

      {isServicePortal ? (
        <ServicePortalUserDropdown
          user={user}
          dropdownState={dropdownState}
          setDropdownState={setDropdownState}
          onLogout={() => {
            setDropdownState('closed')
            signOut()
          }}
          onSwitchUser={(nationalId: string) => {
            setDropdownState('closed')
            switchUser(nationalId)
          }}
        ></ServicePortalUserDropdown>
      ) : (
        <UserDropdown
          user={user}
          dropdownState={dropdownState}
          setDropdownState={setDropdownState}
          onLogout={() => {
            setDropdownState('closed')
            signOut()
          }}
          onSwitchUser={(nationalId: string) => {
            setDropdownState('closed')
            switchUser(nationalId)
          }}
        />
      )}
    </Box>
  )
}
