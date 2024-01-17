import React from 'react'

import {
  Box,
  GridContainer,
  Hidden,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

import * as styles from './SjukratryggingarHeader.css'

interface HeaderProps {
  organizationPage: OrganizationPage
  logoAltText: string
}

const SjukratryggingarHeader: React.FC<
  React.PropsWithChildren<HeaderProps>
> = ({ organizationPage, logoAltText }) => {
  const { linkResolver } = useLinkResolver()

  return (
    <div className={styles.headerBg}>
      <div className={styles.trianglesLeft}></div>
      <div className={styles.trianglesRight}></div>
      <GridContainer className={styles.headerContainer}>
        <div className={styles.headerWrapper}>
          <SidebarLayout
            sidebarContent={
              !!organizationPage.organization?.logo && (
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
                    linkResolver('organizationpage', [organizationPage.slug])
                      .href
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
              marginTop={[2, 2, 0]}
              textAlign={['center', 'center', 'center']}
            >
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
              >
                <Hidden below="md">
                  <div className={styles.trianglesTop}></div>
                  <div className={styles.titleImage}></div>
                </Hidden>
                <Hidden above="sm">
                  <Text variant="h1" color="blueberry600">
                    {organizationPage.title}
                  </Text>
                </Hidden>
              </Link>
            </Box>
          </SidebarLayout>
        </div>
      </GridContainer>
    </div>
  )
}

export default SjukratryggingarHeader
