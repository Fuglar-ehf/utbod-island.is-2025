import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const card = style({
  transition: 'background-color 250ms',
  ':hover': {
    backgroundColor: theme.color.blueberry100,
  },
})

export const unread = style({
  backgroundColor: theme.color.blue100,
})

export const controlMenu = style({
  position: 'absolute',
  top: theme.spacing['2'],
  right: theme.spacing['2'],
})

export const link = style({
  ':hover': {
    textDecoration: 'none',
  },
})
