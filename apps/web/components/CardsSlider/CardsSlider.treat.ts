import { style, globalStyle } from 'treat'
import { themeUtils, theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  position: 'relative',
  overflow: 'visible',
  marginTop: 24,
  marginLeft: 0,
  ...themeUtils.responsiveStyle({
    md: {
      marginTop: 77,
      marginLeft: 0,
    },
  }),
})

export const item = style({
  display: 'flex',
  minWidth: '100%',
  flexFlow: 'column',
})

globalStyle(`${wrapper} .alice-carousel__wrapper`, {
  overflow: 'visible',
  position: 'relative',
  width: `calc(100% + 16px)`,
  left: -16,
  ...themeUtils.responsiveStyle({
    md: {
      width: `calc(100% + 24px)`,
      left: -24,
    },
  }),
})

globalStyle(`${wrapper} .alice-carousel__dots`, {
  position: 'absolute',
  top: -60,
  right: -14,
  margin: 0,
  maxWidth: '62%',
})

globalStyle(`${wrapper} .alice-carousel__dots-item`, {
  backgroundColor: theme.color.red200,
  transition: `width 300ms ease`,
  borderRadius: 8,
  marginRight: 10,
})

globalStyle(`${wrapper} .alice-carousel__dots .__active`, {
  width: 32,
  backgroundColor: theme.color.red400,
})
