import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

const lineWidth = '2px'

export const line = style({
  borderRight: `${lineWidth} solid ${theme.color.blue200}`,
  height: '86px',
})

export const fullWidth = style({
  width: '100%',
})

export const textMaxWidth = style({
  maxWidth: '793px',
})

globalStyle('tbody', {
  borderBottom: '32px solid white',
})

export const grid = style({
  display: 'grid',
  gridTemplateColumns: `140px ${lineWidth} auto`,
})

export const fitContent = style({
  width: 'fit-content',
})

export const alignSelfToFlexEnd = style({
  alignSelf: 'flex-end',
})

export const hiddenOnScreen = style({
  '@media': {
    screen: {
      display: 'none',
    },
    print: {
      display: 'block',
    },
  },
})
