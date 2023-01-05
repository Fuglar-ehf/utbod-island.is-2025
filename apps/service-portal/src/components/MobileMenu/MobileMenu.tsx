import React, { ReactElement, useRef } from 'react'
import { Box, Stack } from '@island.is/island-ui/core'
import {
  ServicePortalPath,
  useDynamicRoutesWithNavigation,
} from '@island.is/service-portal/core'
import { ActionType } from '../../store/actions'
import { useStore } from '../../store/stateProvider'
import ModuleNavigation from '../Sidebar/ModuleNavigation'
import * as styles from './MobileMenu.css'
import { useListDocuments } from '@island.is/service-portal/graphql'
import { useAuth } from '@island.is/auth/react'
import NavItem from '../Sidebar/NavItem/NavItem'
import { sharedMessages } from '@island.is/shared/translations'
import { useLocale } from '@island.is/localization'
import { SERVICE_PORTAL_HEADER_HEIGHT_SM } from '@island.is/service-portal/constants'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
interface Props {
  position: number
}

const MobileMenu = ({ position }: Props): ReactElement | null => {
  const ref = useRef(null)
  const [{ mobileMenuState }, dispatch] = useStore()
  const { signOut } = useAuth()
  const mainNav = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const { unreadCounter } = useListDocuments()
  const { formatMessage } = useLocale()

  const handleLinkClick = () =>
    dispatch({
      type: ActionType.SetMobileMenuState,
      payload: 'closed',
    })

  if (mobileMenuState === 'closed') return null

  const topPosition = position + SERVICE_PORTAL_HEADER_HEIGHT_SM
  // Inline style to dynamicly change position of header because of alert banners
  return (
    <Box
      position="fixed"
      right={0}
      bottom={0}
      left={0}
      background="white"
      className={styles.wrapper}
      ref={ref}
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      style={{ top: topPosition, maxHeight: `calc(100vh - ${topPosition})` }}
    >
      {[mainNav].map((rootItem, rootIndex) => (
        <Box key={rootIndex} paddingX={0} marginTop={3}>
          <Stack space={2}>
            {rootItem?.children?.map(
              (navRoot, index) =>
                navRoot.path !== ServicePortalPath.MinarSidurRoot &&
                !navRoot.navHide && (
                  <ModuleNavigation
                    key={index}
                    nav={navRoot}
                    onItemClick={handleLinkClick}
                    badge={
                      navRoot.subscribesTo === 'documents' && unreadCounter > 0
                    }
                  />
                ),
            )}
          </Stack>
        </Box>
      ))}
      <Box marginTop={2} marginBottom={2}>
        <NavItem
          onClick={() => signOut()}
          active={false}
          icon={{ icon: 'logOut', type: 'outline' }}
        >
          {formatMessage(sharedMessages.logout)}
        </NavItem>
      </Box>
    </Box>
  )
}

export default MobileMenu
