import React, { FC, useState } from 'react'
import {
  ServicePortalNavigationItem,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import * as styles from './Sidebar.css'
import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import AnimateHeight from 'react-animate-height'
import { useLocale } from '@island.is/localization'
import NavItem from './NavItem/NavItem'
import SubNavItem from './NavItem/SubNavItem'
import { servicePortalOutboundLink } from '@island.is/plausible'
import { getUnreadDocumentsCount } from '@island.is/service-portal/graphql'

interface Props {
  nav: ServicePortalNavigationItem
  alwaysExpanded?: boolean
  badge?: boolean
  onItemClick?: () => void
}

const ModuleNavigation: FC<Props> = ({
  nav,
  alwaysExpanded,
  onItemClick,
  badge,
}) => {
  const [expand, setExpand] = useState(false)
  // eslint-disable-next-line no-empty-pattern
  const { pathname } = useLocation()
  const isModuleActive =
    (nav.path &&
      nav.path !== ServicePortalPath.MinarSidurRoot &&
      pathname.includes(nav.path)) ||
    nav.children?.find((x) => x.path && pathname.includes(x.path)) !==
      undefined ||
    expand ||
    nav.path === pathname
  const { formatMessage } = useLocale()
  const handleExpand = () => {
    setExpand(!expand)
  }
  const handleRootItemClick = (external?: boolean) => {
    if (nav.path === undefined) {
      handleExpand()
    }
    if (onItemClick) onItemClick()
    if (external) {
      servicePortalOutboundLink()
    }
  }

  // const unreadDocsCounter = getUnreadDocumentsCount()

  const navChildren = nav?.children?.filter((child) => !child.navHide)
  const navArray = Array.isArray(navChildren) && navChildren.length > 0
  return (
    <Box>
      {nav.heading && (
        <Text
          variant="eyebrow"
          color="blue400"
          fontWeight="semiBold"
          marginBottom={2}
          marginTop={2}
        >
          {formatMessage(nav.heading)}
        </Text>
      )}
      {nav.divider && (
        <Box paddingBottom={3}>
          <Divider />
        </Box>
      )}
      <NavItem
        path={nav.path}
        icon={isModuleActive ? nav.activeIcon : nav.icon}
        active={isModuleActive}
        hasArray={navArray}
        enabled={nav.enabled}
        external={nav.external}
        onClick={() => {
          handleRootItemClick(nav.external)
        }}
        alwaysExpanded={alwaysExpanded}
        badge={badge}
      >
        {formatMessage(nav.name)}
      </NavItem>
      {navArray && (
        <AnimateHeight
          duration={300}
          height={isModuleActive || alwaysExpanded ? 'auto' : 0}
        >
          <div>
            <Box className={styles.subnav} marginTop={2} marginLeft={'p2'}>
              <Stack space={1}>
                {navChildren?.map((child, index) => (
                  <SubNavItem
                    path={child.path}
                    enabled={child.enabled}
                    key={`child-${index}`}
                    active={
                      child.path && pathname.includes(child.path) ? true : false
                    }
                    external={child.external}
                    onClick={onItemClick}
                  >
                    {formatMessage(child.name)}
                  </SubNavItem>
                ))}
              </Stack>
            </Box>
          </div>
        </AnimateHeight>
      )}
    </Box>
  )
}

export default ModuleNavigation
