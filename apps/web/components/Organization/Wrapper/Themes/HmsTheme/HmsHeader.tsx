import React, { useMemo } from 'react'
import type { CSSProperties } from '@vanilla-extract/css'

import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { getScreenWidthString } from '@island.is/web/utils/screenWidth'

import * as styles from './HmsHeader.css'

const getDefaultStyle = (width: number): CSSProperties => {
  if (width <= 1230) {
    return {
      backgroundImage: 'none',
      backgroundPosition: '107% bottom',
    }
  }
  if (width <= 1315) {
    return {
      backgroundPosition: '111% bottom',
    }
  }
  return {}
}

interface HeaderProps {
  organizationPage: OrganizationPage
  logoAltText: string
}

const HmsHeader: React.FC<HeaderProps> = ({
  organizationPage,
  logoAltText,
}) => {
  const { linkResolver } = useLinkResolver()
  const namespace = useMemo(
    () => JSON.parse(organizationPage.organization?.namespace?.fields ?? '{}'),
    [organizationPage.organization?.namespace?.fields],
  )
  const n = useNamespace(namespace)
  const { width } = useWindowSize()
  const screenWidth = getScreenWidthString(width)

  return (
    <div
      style={n(`hmsHeader-${screenWidth}`, getDefaultStyle(width))}
      className={styles.headerBg}
    >
      <div className={styles.headerWrapper}>
        <SidebarLayout
          sidebarContent={
            !!organizationPage.organization?.logo && (
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
                className={styles.iconCircle}
              >
                <img
                  src={organizationPage.organization.logo.url}
                  className={styles.headerLogo}
                  alt={logoAltText}
                />
              </Link>
            )
          }
        >
          {!!organizationPage.organization?.logo && (
            <Hidden above="sm">
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
                className={styles.iconCircle}
              >
                <img
                  src={organizationPage.organization.logo.url}
                  className={styles.headerLogo}
                  alt={logoAltText}
                />
              </Link>
            </Hidden>
          )}
          <Box
            className={styles.title}
            marginTop={[2, 2, 6]}
            textAlign={['center', 'center', 'left']}
          >
            <Link
              href={
                linkResolver('organizationpage', [organizationPage.slug]).href
              }
            >
              <Text
                variant={width > theme.breakpoints.md ? 'h1' : 'h2'}
                as="h1"
                fontWeight="semiBold"
                color="dark400"
              >
                {organizationPage.title}
              </Text>
            </Link>
          </Box>
        </SidebarLayout>
      </div>
    </div>
  )
}

export default HmsHeader
