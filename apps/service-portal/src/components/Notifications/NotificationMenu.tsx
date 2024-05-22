import React, { ReactElement } from 'react'
import {
  Box,
  Button,
  GridContainer,
  Hidden,
  Icon,
  ModalBase,
  Text,
} from '@island.is/island-ui/core'
import { LinkResolver } from '@island.is/service-portal/core'
import {
  GetUserNotificationsOverviewQuery,
  InformationPaths,
} from '@island.is/service-portal/information'
import { sharedMessages } from '@island.is/shared/translations'
import { useLocale, useNamespaces } from '@island.is/localization'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'
import { m } from '@island.is/service-portal/core'
import NotificationLine from './NotificationLine'
import cn from 'classnames'
import * as styles from './Notifications.css'
import * as mStyles from '../Sidemenu/Sidemenu.css'

interface Props {
  closeNotificationMenu: () => void
  sideMenuOpen: boolean
  rightPosition?: number
  data?: GetUserNotificationsOverviewQuery
}
const NotificationMenu = ({
  closeNotificationMenu,
  sideMenuOpen,
  rightPosition,
  data,
}: Props): ReactElement | null => {
  useNamespaces(['service.portal'])
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()

  const isMobile = width < theme.breakpoints.md

  const onClose = () => {
    closeNotificationMenu()
  }

  const closeButton = (
    <button
      className={mStyles.closeButton}
      onClick={onClose}
      aria-label={formatMessage(sharedMessages.close)}
    >
      <Icon icon="close" color="blue400" />
    </button>
  )

  const content = (
    <Box display="flex" justifyContent="flexEnd">
      <Box
        position="relative"
        background="white"
        padding={2}
        borderRadius="large"
        display="flex"
        flexDirection="column"
        height={isMobile ? 'full' : undefined}
        className={cn(
          isMobile ? mStyles.fullScreen : mStyles.dropdown,
          mStyles.container,
        )}
        style={
          !isMobile
            ? {
                left: rightPosition ?? '75%',
                transform: 'translateX(-100%)',
              }
            : undefined
        }
      >
        <Box display="flex" flexDirection="column" className={mStyles.wrapper}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            marginBottom={1}
            marginTop={2}
          >
            <Box
              borderRadius="circle"
              background="blue100"
              display="flex"
              justifyContent="center"
              alignItems="center"
              className={mStyles.overviewIcon}
              marginRight={1}
            >
              <Icon
                icon="notifications"
                type="outline"
                color="blue400"
                size="small"
              />
            </Box>
            <Text variant="h4">{formatMessage(m.notifications)}</Text>
          </Box>
          <Box className={styles.navWrapper}>
            {(data?.userNotificationsOverview?.data ?? []).map((item, i) => (
              <NotificationLine
                key={item.metadata.created ?? i}
                onClickCallback={onClose}
                data={item}
              />
            ))}
            <Box
              paddingTop={2}
              paddingBottom={1}
              textAlign="center"
              width="full"
            >
              <LinkResolver
                className={styles.link}
                href={InformationPaths.Notifications}
              >
                <Button
                  icon="arrowForward"
                  iconType="filled"
                  size="medium"
                  type="text"
                  variant="text"
                  unfocusable
                  onClick={onClose}
                >
                  {formatMessage(m.notificationsViewAll)}
                </Button>
              </LinkResolver>
            </Box>
          </Box>
        </Box>
        <Hidden below="md">{closeButton}</Hidden>
      </Box>
    </Box>
  )

  return isMobile ? (
    <Box display={sideMenuOpen ? 'flex' : 'none'} height="full">
      {content}
    </Box>
  ) : (
    <ModalBase
      baseId="service-portal-notification-menu"
      isVisible={sideMenuOpen}
      hideOnClickOutside={true}
      hideOnEsc={true}
      modalLabel={formatMessage({
        id: 'service.portal:notification-button-aria',
        defaultMessage: 'Valmynd fyrir tilkynningar',
      })}
      removeOnClose={true}
      preventBodyScroll={false}
      onVisibilityChange={(visibility: boolean) => {
        if (visibility !== sideMenuOpen) {
          onClose()
        }
      }}
    >
      <GridContainer>{content}</GridContainer>
    </ModalBase>
  )
}

export default NotificationMenu
