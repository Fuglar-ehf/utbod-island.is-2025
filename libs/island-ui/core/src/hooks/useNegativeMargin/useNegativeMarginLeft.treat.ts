import { styleMap } from 'treat'
import { mapToStyleProperty } from '../../utils'
import { theme } from '../../theme/index'
import { makeThemeUtils } from '../../themeUtils'

const utils = makeThemeUtils(theme)

const negativeMarginLeft = (grid: number, rows: number) => ({
  marginLeft: -(grid * rows),
})

export const xs = styleMap({
  none: {},
  ...mapToStyleProperty(theme.space, 'marginLeft', (rows) =>
    negativeMarginLeft(theme.grid, rows),
  ),
})
export const sm = styleMap(
  mapToStyleProperty({ none: 0, ...theme.space }, 'marginLeft', (rows) =>
    utils.responsiveStyle({ sm: negativeMarginLeft(theme.grid, rows) }),
  ),
)
export const md = styleMap(
  mapToStyleProperty({ none: 0, ...theme.space }, 'marginLeft', (rows) =>
    utils.responsiveStyle({ md: negativeMarginLeft(theme.grid, rows) }),
  ),
)
export const lg = styleMap(
  mapToStyleProperty({ none: 0, ...theme.space }, 'marginLeft', (rows) =>
    utils.responsiveStyle({ lg: negativeMarginLeft(theme.grid, rows) }),
  ),
)
export const xl = styleMap(
  mapToStyleProperty({ none: 0, ...theme.space }, 'marginLeft', (rows) =>
    utils.responsiveStyle({ xl: negativeMarginLeft(theme.grid, rows) }),
  ),
)
