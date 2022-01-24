import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const inputContainer = style({
  maxHeight: '0',
  overflow: 'hidden',
  transition: 'max-height 300ms ease',
})

export const inputAppear = style({
  maxHeight: '300px',
})

export const bankInformationContainer = style({
  display: 'block',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
    },
  },
})

export const bankNumber = style({
  gridColumn: 'span 3',
})

export const accountNumber = style({
  gridColumn: 'span 4',
})

export const container = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  alignItems: 'flex-start',
  columnGap: theme.spacing[3],
  rowGap: theme.spacing[2],
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      rowGap: theme.spacing[3],
    },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
})

export const confirmationIllustration = style({
  marginTop: theme.spacing[5],
  display: 'none',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.sm}px)`]: {
      display: 'block',
    },
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      display: 'block',
    },
  },
})
