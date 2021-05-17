import React, { ReactNode } from 'react'
import {
  Image,
  LinkGroup,
  Organization,
  OrganizationPage,
} from '@island.is/web/graphql/schema'
import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Link,
  Navigation,
  NavigationItem,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import NextLink from 'next/link'
import {
  ChatPanel,
  HeadWithSocialSharing,
  Main,
  Sticky,
} from '@island.is/web/components'
import SidebarLayout from '@island.is/web/screens/Layouts/SidebarLayout'
import { SyslumennHeader, SyslumennFooter } from './Themes/SyslumennTheme'
import { SjukratryggingarHeader } from './Themes/SjukratryggingarTheme'
import { DigitalIcelandHeader } from './Themes/DigitalIcelandTheme'
import { DefaultHeader } from './Themes/DefaultTheme'
import getConfig from 'next/config'
import { UtlendingastofnunHeader } from './Themes/UtlendingastofnunTheme'

interface NavigationData {
  title: string
  activeItemTitle?: string
  items: NavigationItem[]
}

interface WrapperProps {
  pageTitle: string
  pageDescription?: string
  pageFeaturedImage?: Image
  organizationPage: OrganizationPage
  breadcrumbItems?: BreadCrumbItem[]
  mainContent?: ReactNode
  sidebarContent?: ReactNode
  navigationData: NavigationData
  fullWidthContent?: boolean
  stickySidebar?: boolean
  minimal?: boolean
}

interface HeaderProps {
  organizationPage: OrganizationPage
}

export const lightThemes = ['digital_iceland', 'utlendingastofnun']

const OrganizationHeader: React.FC<HeaderProps> = ({ organizationPage }) => {
  switch (organizationPage.theme) {
    case 'syslumenn':
      return <SyslumennHeader organizationPage={organizationPage} />
    case 'sjukratryggingar':
      return <SjukratryggingarHeader organizationPage={organizationPage} />
    case 'utlendingastofnun':
      return <UtlendingastofnunHeader organizationPage={organizationPage} />
    case 'digital_iceland':
      return <DigitalIcelandHeader organizationPage={organizationPage} />
    default:
      return <DefaultHeader organizationPage={organizationPage} />
  }
}

interface FooterProps {
  theme: string
  organization?: Organization
}

export const OrganizationFooter: React.FC<FooterProps> = ({
  theme,
  organization,
}) => {
  if (!organization) return null

  switch (theme) {
    case 'syslumenn':
      return (
        <SyslumennFooter
          title={organization.title}
          logo={organization.logo?.url}
          footerItems={organization.footerItems}
        />
      )
    default:
      return null
  }
}

export const OrganizationChatPanel = ({ slugs }: { slugs: string[] }) => {
  // remove when organization chat-bot is ready for release
  const { publicRuntimeConfig } = getConfig()
  const { disableOrganizationChatbot } = publicRuntimeConfig
  if (disableOrganizationChatbot === 'true') {
    return null
  }

  if (slugs.includes('syslumenn')) {
    return <ChatPanel endpoint={'syslumenn'} />
  }

  return null
}

const SecondaryMenu = ({ linkGroup }: { linkGroup: LinkGroup }) => (
  <Box
    background="purple100"
    borderRadius="large"
    padding={[3, 3, 4]}
    marginY={3}
  >
    <Stack space={[1, 1, 2]}>
      <Text variant="eyebrow" as="h2">
        {linkGroup.name}
      </Text>
      {linkGroup.childrenLinks.map((link) => (
        <Link key={link.url} href={link.url} underline="normal">
          <Text key={link.url} as="span">
            {link.text}
          </Text>
        </Link>
      ))}
    </Stack>
  </Box>
)

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
  stickySidebar = true,
  children,
  minimal = false,
}) => {
  const secondaryNavList: NavigationItem[] =
    organizationPage.secondaryMenu?.childrenLinks.map(({ text, url }) => ({
      title: text,
      href: url,
      active: text === pageTitle,
    })) ?? []

  const metaTitleSuffix =
    pageTitle !== organizationPage.title ? ` | ${organizationPage.title}` : ''

  const SidebarContainer = stickySidebar ? Sticky : Box

  return (
    <>
      <HeadWithSocialSharing
        title={`${pageTitle}${metaTitleSuffix}`}
        description={pageDescription}
        imageUrl={pageFeaturedImage?.url}
        imageContentType={pageFeaturedImage?.contentType}
        imageWidth={pageFeaturedImage?.width?.toString()}
        imageHeight={pageFeaturedImage?.height?.toString()}
      />
      <OrganizationHeader organizationPage={organizationPage} />
      <Main>
        {!minimal && (
          <SidebarLayout
            paddingTop={[2, 2, 9]}
            paddingBottom={[4, 4, 4]}
            isSticky={false}
            fullWidthContent={fullWidthContent}
            sidebarContent={
              <SidebarContainer>
                <Navigation
                  baseId="pageNav"
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
                {organizationPage.secondaryMenu && (
                  <SecondaryMenu linkGroup={organizationPage.secondaryMenu} />
                )}
                {sidebarContent}
              </SidebarContainer>
            }
          >
            <Hidden above="sm">
              <Box marginY={2}>
                <Navigation
                  baseId="pageNav"
                  isMenuDialog={true}
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
              {organizationPage.secondaryMenu && (
                <Box marginY={2}>
                  <Navigation
                    colorScheme="purple"
                    baseId="secondarynav"
                    isMenuDialog={true}
                    title={organizationPage.secondaryMenu.name}
                    items={secondaryNavList}
                    renderLink={(link, item) => {
                      return item?.href ? (
                        <NextLink href={item?.href}>{link}</NextLink>
                      ) : (
                        link
                      )
                    }}
                  />
                </Box>
              )}
            </Hidden>
            <GridContainer>
              <GridRow>
                <GridColumn
                  span={fullWidthContent ? ['9/9', '9/9', '7/9'] : '9/9'}
                  offset={fullWidthContent ? ['0', '0', '1/9'] : '0'}
                >
                  {breadcrumbItems && (
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
                  )}
                  {pageDescription && (
                    <Box paddingTop={[2, 2, breadcrumbItems ? 5 : 0]}>
                      <Text variant="default">{pageDescription}</Text>
                    </Box>
                  )}
                </GridColumn>
              </GridRow>
            </GridContainer>
            <Hidden above="sm">{sidebarContent}</Hidden>
            <Box paddingTop={fullWidthContent ? 0 : 4}>
              {mainContent ?? children}
            </Box>
          </SidebarLayout>
        )}
        {!!mainContent && children}
        {minimal && (
          <GridContainer>
            <GridRow>
              <GridColumn
                paddingTop={6}
                span={['12/12', '12/12', '10/12']}
                offset={['0', '0', '1/12']}
              >
                {children}
              </GridColumn>
            </GridRow>
          </GridContainer>
        )}
      </Main>
      {!minimal && (
        <OrganizationFooter
          theme={organizationPage.theme}
          organization={organizationPage.organization}
        />
      )}
      <OrganizationChatPanel slugs={[organizationPage?.slug]} />
    </>
  )
}
