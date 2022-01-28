import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const countryCodeInput = style({
  marginRight: theme.spacing['2'],
  maxWidth: '120px',
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '90px',
    },
  },
})
