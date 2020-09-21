import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const row = style({
  '@media': {
    [`screen and (max-width: ${theme.breakpoints.md - 1}px)`]: {
      marginLeft: -24,
      marginRight: -24,
      backgroundColor: theme.color.blue100,
      borderRadius: 0,
    },
  },
})

export const column = style({})
