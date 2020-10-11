import React, {
  FC,
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from 'react'
import FocusLock from 'react-focus-lock'
import { RemoveScroll } from 'react-remove-scroll'
import { useKey, useWindowSize } from 'react-use'
import cn from 'classnames'
import {
  Text,
  Icon,
  Hidden,
  ButtonDeprecated as Button,
  GridContainer,
  GridRow,
  GridColumn,
  Box,
  FocusableBox,
  Logo,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { MenuTabsContext } from '@island.is/web/context/MenuTabsContext/MenuTabsContext'
import { useI18n } from '@island.is/web/i18n'
import { SearchInput } from '../SearchInput/SearchInput'
import { LanguageToggler } from '../LanguageToggler'
import * as styles from './SideMenu.treat'

interface TabLink {
  title: string
  href: string
}

interface Tab {
  title: string
  links: TabLink[]
  externalLinksHeading?: string
  externalLinks?: TabLink[]
}

interface Props {
  tabs?: Tab[]
  isVisible: boolean
  searchBarFocus?: boolean
  handleClose: () => void
}

export const SideMenu: FC<Props> = ({
  tabs = [],
  isVisible,
  searchBarFocus = false,
  handleClose,
}) => {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const ref = useRef(null)
  const searchInputRef = useRef(null)
  const { activeLocale, t } = useI18n()
  const { width } = useWindowSize()
  const tabRefs = useRef<Array<HTMLElement | null>>([])
  const isMobile = width < theme.breakpoints.md
  const { menuTabs } = useContext(MenuTabsContext)

  const tabList = menuTabs || tabs

  useKey('Escape', handleClose)

  const handleClickOutside = useCallback(
    (e) => {
      if (isVisible && ref.current && !ref.current.contains(e.target)) {
        handleClose()
      }
    },
    [ref, isVisible, handleClose],
  )

  const onKeyDown = useCallback((event, index) => {
    switch (event.key.toLowerCase()) {
      case 'arrowleft':
        if (index > 0) {
          setActiveTab(index - 1)
        }
        break
      case 'arrowright':
        if (index < tabList.length - 1) {
          setActiveTab(index + 1)
        }
        break
    }
  }, [])

  useEffect(() => {
    setActiveTab(0)

    if (searchBarFocus) {
      if (searchInputRef?.current) {
        searchInputRef.current.focus()
      }
    }
  }, [isVisible, searchBarFocus, searchInputRef])

  useEffect(() => {
    if (typeof window === 'object') {
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    tabRefs.current[activeTab].focus()
  }, [activeTab])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [isVisible, ref, handleClickOutside])

  const logoProps = {
    ...(mounted && { width: isMobile ? 30 : 40 }),
  }

  return (
    <RemoveScroll ref={ref} enabled={isMobile && isVisible}>
      <FocusLock noFocusGuards={true}>
        <Box
          className={cn(styles.root, {
            [styles.isVisible]: isVisible,
          })}
          background="white"
          borderRadius="large"
          height="full"
          id="sideMenu"
          aria-labelledby="sideMenuToggle"
        >
          <Box
            display="flex"
            alignItems="center"
            paddingBottom={3}
            justifyContent="spaceBetween"
          >
            <Logo {...logoProps} iconOnly id="sideMenuLogo" />
          </Box>
          <Hidden above="sm">
            <GridContainer>
              <GridRow>
                <GridColumn span="12/12">
                  <SearchInput
                    ref={searchInputRef}
                    id="search_input_side_menu"
                    activeLocale={activeLocale}
                    placeholder={t.searchPlaceholder}
                    size="medium"
                  />
                </GridColumn>
              </GridRow>
              <GridRow>
                <GridColumn
                  span="8/12"
                  paddingTop={[2, 2, 3]}
                  paddingBottom={[2, 2, 3]}
                >
                  <Button
                    href="https://minarsidur.island.is/"
                    variant="menu"
                    leftIcon="user"
                    width="fluid"
                  >
                    {t.login}
                  </Button>
                </GridColumn>
                <GridColumn
                  span="4/12"
                  paddingTop={[2, 2, 3]}
                  paddingBottom={[2, 2, 3]}
                >
                  <LanguageToggler />
                </GridColumn>
              </GridRow>
            </GridContainer>
          </Hidden>

          <ul className={styles.tabBar} role="tablist">
            {tabList.map((tab, index) => (
              <li
                key={index}
                className={styles.tabContainer}
                role="presentation"
              >
                <FocusableBox
                  ref={(el) => (tabRefs.current[index] = el)}
                  component="button"
                  role="tab"
                  aria-controls={`tab-content-${index}`}
                  aria-selected={activeTab === index}
                  tabIndex={activeTab === index ? 0 : -1}
                  id={`tab-${index}`}
                  onClick={() => setActiveTab(index)}
                  onKeyDown={(e) => onKeyDown(e, index)}
                  className={styles.tabButton}
                >
                  {({ isFocused }) => (
                    <div
                      className={cn(styles.tab, {
                        [styles.tabActive]: activeTab === index,
                        [styles.tabFocused]: isFocused,
                      })}
                    >
                      <Text
                        variant="small"
                        fontWeight={activeTab === index ? 'medium' : 'light'}
                        color="blue400"
                      >
                        {tab.title}
                      </Text>
                    </div>
                  )}
                </FocusableBox>
              </li>
            ))}
          </ul>
          {tabList.map((tab, index) => {
            const hasExternalLinks =
              tab.externalLinks && tab.externalLinks.length
            return (
              <div
                id={`tab-content-${index}`}
                key={index}
                aria-labelledby={`tab-${index}`}
                role="tabpanel"
                className={styles.content}
                aria-hidden={activeTab !== index}
                hidden={activeTab !== index}
              >
                <div className={styles.linksContent}>
                  {tab.links.map((link, index) => {
                    const props = {
                      ...(link.href && { href: link.href }),
                      ...(link.as && { as: link.as }),
                    }

                    return (
                      <Text
                        key={index}
                        color="blue400"
                        fontWeight="medium"
                        paddingBottom={index + 1 === tab.links.length ? 0 : 2}
                      >
                        <Box
                          component="span"
                          display="inlineBlock"
                          width="full"
                          onClick={handleClose}
                        >
                          <FocusableBox {...props}>{link.title}</FocusableBox>
                        </Box>
                      </Text>
                    )
                  })}
                </div>
                {hasExternalLinks && (
                  <Box
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                  >
                    <Text
                      variant="small"
                      fontWeight="medium"
                      color="blue400"
                      paddingTop={3}
                      paddingBottom={3}
                    >
                      {tab.externalLinksHeading}
                    </Text>
                    <div className={styles.linksContent}>
                      {tab.externalLinks.map((link, index) => (
                        <Text
                          key={index}
                          fontWeight="medium"
                          color="blue400"
                          paddingBottom={2}
                        >
                          <FocusableBox href={link.href}>
                            {link.title}
                          </FocusableBox>
                        </Text>
                      ))}
                    </div>
                  </Box>
                )}
              </div>
            )
          })}
          <Box
            display="flex"
            alignItems="center"
            className={styles.closeButton}
          >
            <FocusableBox component="button" onClick={handleClose} padding={1}>
              <Icon type="close" />
            </FocusableBox>
          </Box>
        </Box>
      </FocusLock>
    </RemoveScroll>
  )
}
