import React, { FC, useRef } from 'react'
import { useStore } from '../../store/stateProvider'
import { Box, Button, Hidden } from '@island.is/island-ui/core'
import { useClickAway } from 'react-use'
import { ActionType, MenuState } from '../../store/actions'
import UserMenu from '../UserMenu/UserMenu'

const UserMenuTrigger: FC<{}> = () => {
  const ref = useRef<HTMLElement>(null)
  const [{ userMenuState }, dispatch] = useStore()

  const setMenuState = (state: MenuState) => {
    dispatch({
      type: ActionType.SetUserMenuState,
      payload: state,
    })
  }

  const closeMenus = () => {
    setMenuState('closed')
    dispatch({
      type: ActionType.SetMobileMenuState,
      payload: 'closed',
    })
  }

  const handleClick = () =>
    setMenuState(userMenuState === 'open' ? 'closed' : 'open')

  useClickAway(ref, () =>
    userMenuState === 'open' ? setMenuState('closed') : null,
  )

  const [{ userInfo }] = useStore()

  useClickAway(ref, () =>
    userMenuState === 'open' ? setMenuState('closed') : null,
  )
  return (
    <Box display="flex" position="relative" height="full" ref={ref}>
      <Hidden below="md">
        <Button variant="utility" onClick={handleClick} icon="chevronDown">
          {userInfo?.profile.name}
        </Button>
      </Hidden>
      <Hidden above="sm">
        <Button
          variant="utility"
          onClick={() => {
            setMenuState('open')
          }}
          icon="person"
          iconType="outline"
        />
      </Hidden>
      {userInfo && (
        <UserMenu
          state={userMenuState}
          onClose={() => {
            setMenuState('closed')
          }}
          onRouteChange={() => {
            closeMenus()
          }}
        />
      )}
    </Box>
  )
}

export default UserMenuTrigger
