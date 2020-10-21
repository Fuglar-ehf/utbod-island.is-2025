import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const wrapperGrowHeight = style({
  width: 310,
})
export const wrapperFixedSizeSmall = style({
  width: 310,
  height: 144,
})

const wrapperOrg = {
  marginBottom: 20,
  fontFamily: theme.typography.fontFamily,
  borderColor: theme.color.blue200,
  borderWidth: 1,
  borderStyle: 'solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 20,
}
const errorColor = theme.color.red400
export const wrapper = style(wrapperOrg)
export const wrapperNoBorder = style({
  ...wrapperOrg,
  ...{
    borderColor: theme.color.transparent,
  },
})

export const wrapperError = style({
  ...wrapperOrg,
  ...{
    borderColor: theme.color.red200,
  },
})

export const cardTexts = style({
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 24,
  paddingBottom: 24,
})

const titleOrg = {
  fontSize: 18,
  color: theme.color.blue400,
  fontWeight: 600,
}
export const title = style(titleOrg)
export const titleError = style({
  ...titleOrg,
  ...{
    color: errorColor,
  },
})

const textOrg = {
  fontSize: 14,
  color: theme.color.dark400,
  fontWeight: 300,
}

export const text = style(textOrg)

export const textError = style({
  ...textOrg,
  ...{
    color: errorColor,
  },
})

export const displayHidden = style({
  display: 'none',
})
