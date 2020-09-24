import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
})

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  opacity: '30%',
  backgroundColor: theme.color.blue600,
  '@keyframes': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 0.3,
    },
  },
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
})

export const modal = style({
  position: 'relative',
  flexGrow: 0,

  zIndex: 1,
  borderRadius: '16px',
  boxSizing: 'border-box',
  backgroundColor: theme.color.white,
  '@keyframes': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
})

export const modalClose = style({
  position: 'absolute',
  top: 15,
  right: 15,
  width: 40,
  height: 40,
  lineHeight: 0,
  outline: 0,
})
