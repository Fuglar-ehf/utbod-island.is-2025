import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const pdfRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  minHeight: `${theme.spacing[10]}px`,
  boxShadow: `inset 0 -1px 0 0 ${theme.color.blue200}`,
})

export const cursor = style({ cursor: 'pointer' })
