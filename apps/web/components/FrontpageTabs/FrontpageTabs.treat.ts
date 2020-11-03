import { style } from 'treat'
import { ThemeOrAny } from 'treat/theme'
import { ThemedStyle, Style } from 'treat/lib/types/types'
import { theme, themeUtils } from '@island.is/island-ui/theme'

const whenMobile = (style: ThemedStyle<Style, ThemeOrAny>) => ({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md - 1}px)`]: {
      ...style,
    },
  },
})

export const link = style({
  ':hover': {
    textDecoration: 'none',
  },
})

export const tabWrapper = style({
  display: 'inline-flex',
})

export const tabContainer = style({
  outline: 0,
})

export const tabPanelWrapper = style({
  position: 'relative',
  minHeight: 300,

  ...themeUtils.responsiveStyle({
    lg: {
      minHeight: 350,
    },
  }),
})

export const tabPanelRow = style({
  position: 'relative',
})

export const tabPanel = style({
  opacity: 0,
  pointerEvents: 'none',
  display: 'flex',
  position: 'absolute',
})

export const tabPanelVisible = style({
  position: 'relative',
  opacity: 1,
  outline: 0,
  pointerEvents: 'initial',
})

export const textItem = style({
  position: 'relative',
  display: 'inline-block',
  opacity: 0,
  transition: `opacity 1000ms, transform 800ms`,
  transform: 'translateX(-20px)',
})

export const textItemVisible = style({
  opacity: 1,
  transform: 'translateX(0)',
})

export const tabBullet = style({
  width: 8,
  height: 8,
  backgroundColor: theme.color.red200,
  borderRadius: 8,
  marginRight: 16,
  transition: `all 300ms ease`,
})

export const tabBulletSelected = style({
  width: 32,
  backgroundColor: theme.color.red400,
})

export const srOnly = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  border: '0',
})

export const dots = style({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
})

export const imageContainer = style({
  position: 'relative',
  display: 'inline-block',
  overflow: 'hidden',
  height: '100%',
  width: '100%',
})

export const arrowButton = style({
  position: 'relative',
  display: 'flex',
  zIndex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
  width: 40,
  height: 40,
  backgroundColor: theme.color.red100,
  opacity: 1,
  transition: 'all 150ms ease',
  outline: 0,
  ':focus': {
    backgroundColor: theme.color.red200,
  },
  ':hover': {
    backgroundColor: theme.color.red200,
  },
})

export const arrowButtonDisabled = style({
  opacity: 0.5,
})

export const searchContentContainer = style({
  borderRadius: theme.border.radius.large,
  ...whenMobile({
    borderRadius: 0,
    marginLeft: -24,
    marginRight: -24,
    width: `calc(100% + ${24 * 2}px)`,
  }),
})

export const tabListArrowLeft = style({
  position: 'absolute',
  top: 0,
  left: 12,
})

export const tabListArrowRight = style({
  position: 'absolute',
  top: 0,
  right: 12,
})
