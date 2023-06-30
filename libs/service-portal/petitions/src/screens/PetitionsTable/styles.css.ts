import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const buttonWrapper = style({
  zIndex: 1,
})

export const menuItem = style({
  paddingTop: '16px',
  display: 'flex',
  justifyContent: 'center',
  transition: 'color .2s',
  fontSize: 14,
  fontWeight: 600,
  selectors: {
    '&:hover, &:focus': {
      textDecoration: 'none',
      color: theme.color.blue400,
    },
  },
})

export const hideInMobile = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      display: 'none',
    },
  },
})
