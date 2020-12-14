import React, { FC, useState } from 'react'
import {
  ServicePortalNavigationItem,
  ServicePortalPath,
} from '@island.is/service-portal/core'
import cn from 'classnames'
import * as styles from './Sidebar.treat'
import { Box, Stack } from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import AnimateHeight from 'react-animate-height'
import { useLocale } from '@island.is/localization'
import NavItem from './NavItem/NavItem'
import SubNavItem from './NavItem/SubNavItem'

interface Props {
  nav: ServicePortalNavigationItem
  variant: 'blue' | 'blueberry'
}

const ModuleNavigation: FC<Props> = ({ nav, variant }) => {
  const [expand, setExpand] = useState(false)
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
  const handleExpand = () => setExpand(!expand)

  return (
    <Box>
      <NavItem
        path={nav.path}
        icon={nav.icon}
        active={isModuleActive}
        external={nav.external}
        onClick={nav.path === undefined ? handleExpand : undefined}
        variant={variant}
      >
        {formatMessage(nav.name)}
      </NavItem>
      {Array.isArray(nav.children) && nav.children.length > 0 && (
        <AnimateHeight duration={300} height={isModuleActive ? 'auto' : 0}>
          <div>
            <Box className={styles.subnav} marginTop={2}>
              <Stack space={1}>
                {nav.children.map((child, index) => (
                  <SubNavItem
                    path={child.path}
                    key={`child-${index}`}
                    active={
                      child.path && pathname.includes(child.path) ? true : false
                    }
                    external={child.external}
                    variant={variant}
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
