import React from 'react'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import {
  Box,
  GridContainer,
  Hidden,
  Link,
  Text,
} from '@island.is/island-ui/core'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import * as styles from './LandskjorstjornHeader.css'

interface HeaderProps {
  organizationPage: OrganizationPage
}

export const LandskjorstjornHeader: React.FC<HeaderProps> = ({
  organizationPage,
}) => {
  const { linkResolver } = useLinkResolver()

  return (
    <Box className={styles.headerBg}>
      <GridContainer className={styles.headerContainer}>
        <Box className={styles.headerWrapper}>
          <SidebarLayout
            sidebarContent={
              !!organizationPage.organization.logo && (
                <Link
                  href={
                    linkResolver('organizationpage', [organizationPage.slug])
                      .href
                  }
                  className={styles.iconCircle}
                >
                  <img
                    src={organizationPage.organization.logo.url}
                    className={styles.headerLogo}
                    alt="organization logo"
                  />
                </Link>
              )
            }
          >
            {!!organizationPage.organization.logo && (
              <Hidden above="sm">
                <Link
                  href={
                    linkResolver('organizationpage', [organizationPage.slug])
                      .href
                  }
                  className={styles.iconCircle}
                >
                  <img
                    src={organizationPage.organization.logo.url}
                    className={styles.headerLogo}
                    alt="organization logo"
                  />
                </Link>
              </Hidden>
            )}
            <Box
              marginTop={[2, 2, 6]}
              textAlign={['center', 'center', 'right']}
            >
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
              >
                <Text variant="h1" color="white">
                  {organizationPage.title}
                </Text>
              </Link>
            </Box>
          </SidebarLayout>
        </Box>
      </GridContainer>
    </Box>
  )
}
