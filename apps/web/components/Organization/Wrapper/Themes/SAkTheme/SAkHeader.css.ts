import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  height: 385,
  marginTop: -130,
  paddingTop: 130,
  backgroundColor: '#00498E',
})

export const iconCircle = style({
  height: 136,
  width: 136,
  background: '#fff',
  borderRadius: '50%',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.08)',
  ...themeUtils.responsiveStyle({
    xs: {
      margin: '32px auto 0',
    },
    md: {
      marginTop: 32,
      paddingTop: 0,
    },
    lg: {
      marginTop: 104,
      position: 'relative',
    },
  }),
})

export const headerWrapper = style({
  marginTop: -20,
})

export const headerLogo = style({
  width: 70,
  maxHeight: 70,
})

export const navigation = style({
  ...themeUtils.responsiveStyle({
    md: {
      background: 'none',
      paddingTop: 0,
    },
    xs: {
      marginLeft: -24,
      marginRight: -24,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 32,
    },
  }),
})

export const title = style({
  ...themeUtils.responsiveStyle({
    lg: {
      display: 'block',
      width: '260px',
    },
  }),
})

export const headerBgImageWrapper = style({
  maxWidth: 1440,
  margin: '0 auto',
  position: 'relative',
})

export const headerBgImage = style({
  position: 'absolute',
  bottom: -275,
  left: 119,
  height: 'auto',
  maxHeight: 370,
  width: 'auto',
  maxWidth: '56vw',
})

export const titleWrapper = style({
  ...themeUtils.responsiveStyle({
    lg: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  }),
})
