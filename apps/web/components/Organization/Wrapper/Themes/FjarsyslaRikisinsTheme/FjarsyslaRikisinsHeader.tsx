import { Box, Hidden, Link, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { OrganizationPage } from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'

import * as styles from './FjarsyslaRikisinsHeader.css'

interface HeaderProps {
  organizationPage: OrganizationPage
}

const FjarsyslaRikisinsHeader = ({ organizationPage }: HeaderProps) => {
  const { width } = useWindowSize()
  const { linkResolver } = useLinkResolver()

  return (
    <Box className={styles.headerBg}>
      <Box className={styles.headerWrapper}>
        <SidebarLayout
          sidebarContent={
            !!organizationPage.organization.logo && (
              <Link
                href={
                  linkResolver('organizationpage', [organizationPage.slug]).href
                }
                className={styles.iconCircle}
              >
                <img
                  src={organizationPage.organization.logo.url}
                  className={styles.headerLogo}
                  alt=""
                />
              </Link>
            )
          }
        >
          {!!organizationPage.organization.logo && (
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
                  alt=""
                />
              </Link>
            </Hidden>
          )}
          <Box marginTop={[2, 2, 6]} textAlign={['center', 'center', 'right']}>
            <Link
              href={
                linkResolver('organizationpage', [organizationPage.slug]).href
              }
            >
              <Hidden above="sm">
                <Text
                  variant="h1"
                  as="h1"
                  color={width < theme.breakpoints.md ? 'white' : 'blue600'}
                >
                  {organizationPage.title}
                </Text>
              </Hidden>
              <Hidden below="md">
                <img
                  src="https://images.ctfassets.net/8k0h54kbe6bj/5aRF31iP8lJr66f9QLwpno/e318d034263a0454d37750e5273d69b8/Group_1169.svg"
                  alt="Fjársýsla ríkisins"
                />
              </Hidden>
            </Link>
          </Box>
        </SidebarLayout>
      </Box>
    </Box>
  )
}

export default FjarsyslaRikisinsHeader
