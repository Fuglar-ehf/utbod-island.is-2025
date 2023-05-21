import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
} from '@island.is/island-ui/core'
import { PortalNavigation, PortalNavigationItem } from '@island.is/portals/core'
import React from 'react'

interface LayoutProps {
  children: React.ReactNode
  navTitle: string
  navItems: PortalNavigationItem
}

const Layout: React.FC<LayoutProps> = ({ children, navTitle, navItems }) => {
  return (
    <GridContainer>
      <Hidden above="md">
        <Box paddingBottom={4}>
          <PortalNavigation title={navTitle} navigation={navItems} />
        </Box>
      </Hidden>
      <GridRow rowGap={'gutter'}>
        <GridColumn
          span={['12/12', '12/12', '12/12', '4/12', '3/12']}
          order={[2, 2, 2, 0]}
        >
          <Box position="sticky" top={4}>
            <Hidden below="lg">
              <PortalNavigation title={navTitle} navigation={navItems} />
            </Hidden>
          </Box>
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '12/12', '8/12']}
          offset={['0', '0', '0', '0', '1/12']}
          order={[2, 2, 2, 0]}
        >
          {children}
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Layout
