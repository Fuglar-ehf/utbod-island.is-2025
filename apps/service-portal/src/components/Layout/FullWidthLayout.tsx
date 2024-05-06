import React, { FC, useEffect, useState, ReactNode } from 'react'
import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  BreadcrumbsDeprecated as Breadcrumbs,
  Button,
} from '@island.is/island-ui/core'
import {
  m,
  ModuleAlertBannerSection,
  TabNavigation,
} from '@island.is/service-portal/core'
import * as styles from './Layout.css'
import { useLocale } from '@island.is/localization'
import { PortalNavigationItem } from '@island.is/portals/core'
import { IntroHeader, ServicePortalPaths } from '@island.is/service-portal/core'
import { Link, matchPath, useNavigate } from 'react-router-dom'
import { DocumentsPaths } from '@island.is/service-portal/documents'
import { theme } from '@island.is/island-ui/theme'

interface FullWidthLayoutWrapperProps {
  activeParent?: PortalNavigationItem
  height: number
  pathname: string
  children: ReactNode
}
type FullWidthLayoutProps = {
  isDashboard: boolean
  isDocuments: boolean
} & FullWidthLayoutWrapperProps

export const FullWidthLayout: FC<FullWidthLayoutProps> = ({
  activeParent,
  height,
  pathname,
  children,
  isDashboard,
  isDocuments,
}) => {
  const navigate = useNavigate()
  const { formatMessage } = useLocale()
  const [navItems, setNavItems] = useState<PortalNavigationItem[] | undefined>()
  const [activeChild, setActiveChild] = useState<
    PortalNavigationItem | undefined
  >()

  useEffect(() => {
    const visibleNavItems =
      activeParent?.children?.filter((item) => !item.navHide) || undefined
    setNavItems(visibleNavItems)

    const activeVisibleChild = visibleNavItems?.filter(
      (item) => item.active,
    )?.[0]
    setActiveChild(activeVisibleChild)
  }, [activeParent?.children])

  return (
    <Box
      as="main"
      component="main"
      className={isDocuments ? styles.fullWidthSplit : undefined}
      paddingTop={isDocuments ? undefined : 9}
      style={{
        marginTop: height,
        minHeight: `calc(100vh - ${theme.headerHeight.large}px`,
      }}
    >
      <Box>
        {!isDashboard && !isDocuments && (
          <>
            <Box paddingBottom={[3, 4]} paddingTop={[4, 4, 0]}>
              <GridContainer className={styles.wrap} position="none">
                <GridRow>
                  <GridColumn span="12/12">
                    <Breadcrumbs color="blue400" separatorColor="blue400">
                      <Box display="inline" className={styles.btn}>
                        <Button
                          preTextIcon="arrowBack"
                          preTextIconType="filled"
                          size="small"
                          type="button"
                          variant="text"
                          onClick={() => navigate('/')}
                        >
                          {formatMessage(m.goBackToDashboard)}
                        </Button>
                      </Box>
                      {activeParent?.path && activeParent?.name && (
                        <Link to={activeParent.path}>
                          {formatMessage(activeParent.name)}
                        </Link>
                      )}
                    </Breadcrumbs>
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </Box>
            <Box>
              <GridContainer position="none">
                <GridRow>
                  <GridColumn span="12/12">
                    <IntroHeader
                      title={activeParent?.name || ''}
                      intro={activeParent?.heading}
                    />
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </Box>
          </>
        )}
        {navItems && navItems?.length > 0 ? (
          <Box>
            <GridContainer position="none">
              <GridRow>
                <GridColumn span="12/12">
                  <TabNavigation
                    label={
                      activeParent?.name ? formatMessage(activeParent.name) : ''
                    }
                    pathname={pathname}
                    items={navItems}
                  />
                  {children}
                </GridColumn>
              </GridRow>
            </GridContainer>
          </Box>
        ) : (
          children
        )}
      </Box>
    </Box>
  )
}

const FullWidthLayoutWrapper: FC<FullWidthLayoutWrapperProps> = (props) => {
  // Dashboard has a special "no top navigation view"
  const isDashboard = Object.values(ServicePortalPaths).find((route) =>
    matchPath(route, props.pathname),
  )

  // Documents has a special "split screen view"
  const isDocuments = Object.values(DocumentsPaths).find((route) =>
    matchPath(route, props.pathname),
  )

  const isSpecialView = !!isDashboard || !!isDocuments

  return (
    <FullWidthLayout
      isDashboard={!!isDashboard}
      isDocuments={!!isDocuments}
      {...props}
    >
      <ModuleAlertBannerSection paddingTop={isSpecialView ? 0 : 2} />
      {props.children}
    </FullWidthLayout>
  )
}

export default FullWidthLayoutWrapper
