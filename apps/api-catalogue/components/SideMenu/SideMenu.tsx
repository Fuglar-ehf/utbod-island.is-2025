import React, { useEffect, useRef } from 'react'
import FocusLock from 'react-focus-lock'
import * as styles from './SideMenu.treat'
import cn from 'classnames'
import { Box, FocusableBox, Icon, Logo, Text } from '@island.is/island-ui/core'
import { useKey } from 'react-use'

export interface SideMenuLink {
  title: string
  url: string
}

export interface SideMenuProps {
  title?: string
  links: SideMenuLink[]
  isVisible: boolean
  handleClose: () => void
}

function useOutsideClicked(ref, func) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        func()
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [func, ref])
}

export const SideMenu = (props: SideMenuProps) => {
  useKey('Escape', props.handleClose)

  const wrapperRef = useRef(null)
  useOutsideClicked(wrapperRef, props.handleClose)

  return (
    <FocusLock>
      <Box
        className={cn(props.isVisible ? styles.root : styles.hidden)}
        background="white"
        boxShadow="subtle"
        height="full"
        ref={wrapperRef}
      >
        <Box display="flex" paddingBottom={1} justifyContent="flexEnd">
          <Box
            display="flex"
            paddingBottom={3}
            flexGrow={1}
            justifyContent="spaceBetween"
          >
            <Box className={cn(styles.titleContainer)}>
              <Logo iconOnly width={30} id="side_menu-logo" />
              <span className={cn(styles.title)}>{props?.title}</span>
            </Box>
            <FocusableBox
              component="button"
              onClick={props.handleClose}
              tabIndex={-1}
              padding={1}
            >
              <Icon icon="close" type="filled" color="blue400" />
            </FocusableBox>
          </Box>
        </Box>

        <div className={styles.linksContent}>
          {props.links.map((link, index) => (
            <Text
              variant="h5"
              color="blue400"
              key={index}
              paddingBottom={index + 1 === props.links.length ? 0 : 2}
            >
              {
                <FocusableBox onClick={props.handleClose} href={link.url}>
                  {link.title}
                </FocusableBox>
              }
            </Text>
          ))}
        </div>
      </Box>
    </FocusLock>
  )
}
