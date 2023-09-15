import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const headerBg = style({
  height: 'fit-content',
  minHeight: '200px',
  order: 1,
  ...themeUtils.responsiveStyle({
    lg: {
      order: 0,
      minHeight: '100%',
    },
  }),
})

export const headerWrapper = style({
  display: 'grid',
  minHeight: '300px',
  height: 'fit-content',
  maxHeight: 'min-content',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'min-content',
    },
  }),
})

export const headerImageContainer = style({
  width: '100%',
  height: '100%',
})

export const headerImage = style({
  height: '100%',
  width: '100%',
  order: 0,
  ...themeUtils.responsiveStyle({
    xs: {
      maxHeight: '200px',
    },
    sm: {
      maxHeight: '200px',
    },
    md: {
      maxHeight: '200px',
    },
    lg: {
      order: 1,
      maxHeight: '300px',
    },
  }),
})
