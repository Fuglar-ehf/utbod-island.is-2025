import React, { ReactNode } from 'react'
import { Image, OrganizationPage } from '@island.is/web/graphql/schema'
import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  Hidden,
  Link,
  Navigation,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './OrganizationWrapper.treat'
import NextLink from 'next/link'
import {
  HeadWithSocialSharing,
  Main,
  OrganizationFooter,
  Sticky,
} from '@island.is/web/components'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

interface NavigationData {
  title: string
  activeItemTitle?: string
  items: NavigationItem[]
}

interface WrapperProps {
  pageTitle: string
  pageDescription?: string
  pageFeaturedImage?: Image
  organizationPage?: OrganizationPage
  breadcrumbItems?: BreadCrumbItem[]
  mainContent?: ReactNode
  sidebarContent?: ReactNode
  navigationData: NavigationData
  fullWidthContent?: boolean
}

export const OrganizationWrapper: React.FC<WrapperProps> = ({
  pageTitle,
  pageDescription,
  pageFeaturedImage,
  organizationPage,
  breadcrumbItems,
  mainContent,
  sidebarContent,
  navigationData,
  fullWidthContent = false,
  children,
}) => {
  const isMobile = useWindowSize().width < theme.breakpoints.md

  return (
    <>
      <HeadWithSocialSharing
        title={pageTitle}
        description={pageDescription}
        imageUrl={pageFeaturedImage?.url}
        imageWidth={pageFeaturedImage?.width?.toString()}
        imageHeight={pageFeaturedImage?.height?.toString()}
      />
      <Box className={styles.headerBg}>
        <Box className={styles.headerWrapper}>
          <SidebarLayout
            sidebarContent={
              !!organizationPage.organization.logo && (
                <Link href="#">
                  <Box
                    borderRadius="circle"
                    className={styles.iconCircle}
                    background="white"
                  >
                    <img
                      src={organizationPage.organization.logo.url}
                      className={styles.headerLogo}
                      alt=""
                    />
                  </Box>
                </Link>
              )
            }
          >
            <Hidden above="sm">
              <Link href="#">
                <Box
                  borderRadius="circle"
                  className={styles.iconCircle}
                  background="white"
                >
                  <img
                    src={organizationPage.organization.logo.url}
                    className={styles.headerLogo}
                    alt=""
                  />
                </Box>
              </Link>
            </Hidden>
            <Box
              marginTop={[2, 2, 6]}
              textAlign={['center', 'center', 'right']}
            >
              <Text variant="h1" color="white">
                {organizationPage.title}
              </Text>
            </Box>
          </SidebarLayout>
        </Box>
      </Box>
      <Main>
        <SidebarLayout
          paddingTop={[2, 2, 9]}
          paddingBottom={[4, 4, 4]}
          isSticky={false}
          sidebarContent={
            <Sticky>
              <Navigation
                baseId="pageNav"
                isMenuDialog={isMobile}
                items={navigationData.items}
                title={navigationData.title}
                activeItemTitle={navigationData.activeItemTitle}
                renderLink={(link, item) => {
                  return item?.href ? (
                    <NextLink href={item?.href}>{link}</NextLink>
                  ) : (
                    link
                  )
                }}
              />
              {sidebarContent}
            </Sticky>
          }
        >
          <Hidden above="sm">
            <Box marginY={2}>
              <Navigation
                baseId="pageNav"
                isMenuDialog={isMobile}
                items={navigationData.items}
                title={navigationData.title}
                activeItemTitle={navigationData.activeItemTitle}
                renderLink={(link, item) => {
                  return item?.href ? (
                    <NextLink href={item?.href}>{link}</NextLink>
                  ) : (
                    link
                  )
                }}
              />
            </Box>
          </Hidden>
          <Breadcrumbs
            items={breadcrumbItems ?? []}
            renderLink={(link, item) => {
              return item?.href ? (
                <NextLink href={item?.href}>{link}</NextLink>
              ) : (
                link
              )
            }}
          />
          <Box paddingTop={[2, 2, 5]} paddingBottom={2}>
            <Text variant="intro">{organizationPage.description}</Text>
          </Box>
          <Hidden above="sm">{sidebarContent}</Hidden>
          <Box paddingTop={4}>{mainContent ?? children}</Box>
        </SidebarLayout>
        {!!mainContent && children}
      </Main>
      <OrganizationFooter organizationPage={organizationPage} />
    </>
  )
}
