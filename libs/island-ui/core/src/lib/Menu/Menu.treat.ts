import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const container = style({
  width: '100%',
  minHeight: '100%',
  background: theme.color.white,
  ...themeUtils.responsiveStyle({
    md: {
      display: 'flex',
    },
  }),
})

export const main = style({
  position: 'relative',
  ...themeUtils.responsiveStyle({
    md: {
      flexBasis: '66.66666%',
      flexGrow: 1,
    },
  }),
})
export const bg = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    xl: {
      display: 'block',
      position: 'absolute',
      width: 546,
      top: 579,
      right: theme.spacing[15],
    },
  }),
})

export const mainContainer = style({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: 829,
    },
  }),
})
export const searchContainer = style({
  width: '100%',
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: 342,
    },
  }),
})

export const aside = style({
  ...themeUtils.responsiveStyle({
    md: {
      flexBasis: '33.33333%',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
  }),
})

export const asideTop = style({
  backgroundColor: theme.color.blue100,
})

export const asideBottom = style({
  backgroundColor: theme.color.blue200,
  flexGrow: 1,
})
export const asideContainer = style({
  ...themeUtils.responsiveStyle({
    md: {
      maxWidth: 342,
    },
  }),
})

export const mainLinkContainer = style({
  ...themeUtils.responsiveStyle({
    md: {
      columnCount: 2,
      columnGap: theme.spacing[2],
      height: 520,
      columnFill: 'auto',
    },
  }),
})
export const mainLinkOuter = style({
  paddingTop: theme.spacing[1],
  paddingBottom: theme.spacing[1],
  paddingLeft: theme.spacing[2],
  borderLeft: `1px solid ${theme.color.blue200}`,
})
export const mainLink = style({
  transition: 'color .3s',
  ':hover': {
    textDecoration: 'none',
    color: theme.color.blue600,
  },
})
export const asideLink = style({
  transition: 'color .3s',
  ':hover': {
    textDecoration: 'none',
    color: theme.color.blue400,
  },
})
