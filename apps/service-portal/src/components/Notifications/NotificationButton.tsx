import React, { useEffect, useRef, useState } from 'react'
import cn from 'classnames'
import { Box, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'
import { m } from '@island.is/service-portal/core'
import NotificationMenu from './NotificationMenu'
import { MenuTypes } from '../Header/Header'
import * as styles from './Notifications.css'
import {
  useGetUserNotificationsOverviewQuery,
  useMarkAllNotificationsAsSeenMutation,
} from '@island.is/service-portal/information'

interface Props {
  setMenuState: (val: MenuTypes) => void
  showMenu?: boolean
  disabled?: boolean
}

const NotificationButton = ({
  setMenuState,
  showMenu = false,
  disabled,
}: Props) => {
  const { formatMessage, lang } = useLocale()
  const [hasMarkedLocally, setHasMarkedLocally] = useState(false)
  const [markAllAsSeen] = useMarkAllNotificationsAsSeenMutation()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md
  const ref = useRef<HTMLButtonElement>(null)

  const { data, refetch } = useGetUserNotificationsOverviewQuery({
    variables: {
      input: {
        limit: 5,
      },
      locale: lang,
    },
  })

  useEffect(() => {
    refetch()
  }, [lang, refetch])

  const showBadge =
    !!data?.userNotificationsOverview?.unseenCount && !hasMarkedLocally

  useEffect(() => {
    if (showMenu && showBadge) {
      markAllAsSeen()
      setHasMarkedLocally(true)
    }
  }, [showMenu, showBadge, markAllAsSeen])

  return (
    <Box
      className={disabled ? styles.noScope : undefined}
      position="relative"
      marginRight={[1, 1, 2]}
    >
      <Button
        variant="utility"
        colorScheme="white"
        disabled={disabled}
        icon={showMenu && isMobile ? 'close' : 'notifications'}
        iconType="outline"
        onClick={() => {
          showMenu && isMobile
            ? setMenuState(undefined)
            : setMenuState('notifications')
        }}
        ref={ref}
        aria-label={formatMessage(m.notifications)}
      />
      {data?.userNotificationsOverview?.data.length ? (
        <Box
          borderRadius="circle"
          className={cn({ [styles.badge]: showBadge })}
        />
      ) : undefined}
      <NotificationMenu
        closeNotificationMenu={() => setMenuState(undefined)}
        sideMenuOpen={showMenu}
        rightPosition={ref.current?.getBoundingClientRect().right}
        data={data}
      />
    </Box>
  )
}

export default NotificationButton
