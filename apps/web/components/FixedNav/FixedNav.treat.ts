import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { STICKY_NAV_HEIGHT } from '@island.is/web/constants'

export const wrapper = style({
  position: 'fixed',
  display: 'flex',
  width: '100%',
  left: 0,
  right: 0,
  top: 0,
  margin: 0,
  padding: 0,
  height: STICKY_NAV_HEIGHT,
  zIndex: 1000,
  backgroundColor: theme.color.blue400,
  transform: `translateY(-100%)`,
  opacity: 0,
  visibility: 'hidden',
  transition:
    'opacity 150ms ease, transform 150ms ease, visibility 0ms linear 150ms',
})

export const container = style({
  margin: '0 auto',
  padding: 0,
})

export const show = style({
  transform: `translateY(0%)`,
  opacity: 1,
  visibility: 'visible',
  transition:
    'opacity 150ms ease, transform 150ms ease, visibility 0ms linear 0ms',
})
