import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const relative = style({
  position: 'relative',
})

export const imageAbsolute = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    md: {
      top: -252,
      display: 'block',
      position: 'absolute',
      right: -55,
      height: 'auto',
    },
    lg: {
      right: -45,
    },
    xl: {
      right: 0,
    },
  }),
})
