import { style, Style, styleMap } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

// this is used to generate uniqe classname for button so we can target empty styles for icon
export const isEmpty = style({})

const buttonBase = {
  display: 'flex',
  alignItems: 'center',
  fontWeight: theme.typography.semiBold,
  borderRadius: 8,
  outline: 'none',
  transition: 'box-shadow .25s, color .25s, background-color .25s',
  ':focus': {
    color: theme.color.dark400,
    backgroundColor: theme.color.mint400,
  },
  ':active': {
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
}

const textBase = {
  fontWeight: theme.typography.semiBold,
  outline: 'none',
  cursor: 'pointer',
  transition: 'box-shadow .25s, color .25s, background-color .25s',

  ':focus': {
    color: theme.color.dark400,
    backgroundColor: theme.color.mint400,
    boxShadow: `inset 0 -1px 0 0 ${theme.color.dark400}`,
  },
  ':disabled': {
    cursor: 'normal',
  },
  selectors: {
    // text button uses span instead of button and data active is used to emulate button active, span is used to make text button inline, because button element will default to inline-block if you use display: inline
    '&[data-active="true"]': {
      boxShadow: `inset 0 -3px 0 0 ${theme.color.mint400}`,
    },
    '&[data-active="true"]:focus': {
      backgroundColor: 'transparent',
      boxShadow: `inset 0 -3px 0 0 ${theme.color.mint400}`,
    },
  },
}

export const variants = styleMap({
  primary: buttonBase,
  ghost: buttonBase,
  text: textBase,
  utility: buttonBase,
})

export const size = styleMap({
  default: {
    fontSize: 16,
    lineHeight: 1.25,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: 18,
        lineHeight: 1.6,
      },
    }),
  },
  small: {
    fontSize: 16,
    lineHeight: 1.25,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: 18,
        lineHeight: 1.6,
      },
    }),
  },
  large: {
    fontSize: 20,
    lineHeight: 1.4,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: 24,
        lineHeight: 1.42,
      },
    }),
  },
  utility: {
    fontSize: 12,
    lineHeight: 1.333333,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: 14,
        lineHeight: 1.142857,
      },
    }),
  },
})

export const padding = styleMap({
  text: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  default: {
    padding: '14px 16px',
    ...themeUtils.responsiveStyle({
      md: {
        padding: '18px 24px',
      },
    }),
  },
  small: {
    padding: '10px 16px',
  },
  large: {
    padding: '18px 24px',
    ...themeUtils.responsiveStyle({
      md: {
        padding: '23px 32px',
      },
    }),
  },
  utility: {
    padding: '12px 16px',
    ...themeUtils.responsiveStyle({
      md: {
        padding: '16px',
      },
    }),
  },
})

export const circleSizes = styleMap({
  default: {
    width: 32,
    height: 32,
    ...themeUtils.responsiveStyle({
      md: {
        width: 40,
        height: 40,
      },
    }),
  },
  small: {
    width: 24,
    height: 24,
  },
  large: {
    width: 48,
    height: 48,
    ...themeUtils.responsiveStyle({
      md: {
        width: 64,
        height: 64,
      },
    }),
  },
})

type PrimaryColors = (
  main: string,
  text: string,
  hover: string,
  disabled: string,
) => Style

type BorderedColors = (main: string, hover: string, disabled: string) => Style
type UtilityColors = (
  text: string,
  border: string,
  textHover: string,
  borderHover: string,
  textDisabled: string,
  borderDisabled: string,
) => Style

const primaryColors: PrimaryColors = (main, text, hover, disabled) => ({
  backgroundColor: main,
  color: text,
  ':disabled': {
    backgroundColor: disabled,
  },
  ':hover': {
    backgroundColor: hover,
  },
  ':active': {
    backgroundColor: hover,
  },
  selectors: {
    '&:focus:hover': {
      color: text,
    },
    '&:focus:active': {
      color: text,
    },
  },
})
const ghostColors: BorderedColors = (main, hover, disabled) => ({
  backgroundColor: theme.color.transparent,
  boxShadow: `inset 0 0 0 1px ${main}`,
  color: main,
  ':disabled': {
    boxShadow: `inset 0 0 0 1px ${disabled}`,
    color: disabled,
  },
  ':focus': {
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
  ':hover': {
    backgroundColor: theme.color.transparent,
    boxShadow: `inset 0 0 0 2px ${hover}`,
    color: hover,
  },
  selectors: {
    '&:focus:active': {
      backgroundColor: theme.color.transparent,
      boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
    },
  },
})
const textColors: BorderedColors = (main, hover, disabled) => ({
  backgroundColor: theme.color.transparent,
  boxShadow: `inset 0 -1px 0 0 ${main}`,
  color: main,
  ':disabled': {
    boxShadow: `inset 0 -1px 0 0 ${disabled}`,
    color: disabled,
  },
  ':focus': {
    boxShadow: `inset 0 -1px 0 0 ${theme.color.dark400}`,
  },
  ':hover': {
    backgroundColor: theme.color.transparent,
    boxShadow: `inset 0 -2px 0 0 ${hover}`,
    color: hover,
  },
  selectors: {
    '&:focus:active': {
      backgroundColor: theme.color.transparent,
      boxShadow: `inset 0 -3px 0 0 ${theme.color.mint400}`,
    },
  },
})
const utilityColors: UtilityColors = (
  text,
  border,
  textHover,
  borderHover,
  textDisabled,
  borderDisabled,
) => ({
  backgroundColor: theme.color.transparent,
  boxShadow: `inset 0 0 0 1px ${border}`,
  color: text,
  ':disabled': {
    boxShadow: `inset 0 0 0 1px ${borderDisabled}`,
    color: textDisabled,
  },
  ':focus': {
    boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
  },
  ':hover': {
    backgroundColor: theme.color.transparent,
    boxShadow: `inset 0 0 0 2px ${borderHover}`,
    color: textHover,
  },
  selectors: {
    '&:focus:active': {
      backgroundColor: theme.color.transparent,
      boxShadow: `inset 0 0 0 3px ${theme.color.mint400}`,
    },
  },
})

export const colors = {
  primary: styleMap({
    default: primaryColors(
      theme.color.blue400,
      theme.color.white,
      theme.color.blueberry400,
      theme.color.blue300,
    ),
    destructive: primaryColors(
      theme.color.red600,
      theme.color.white,
      theme.color.roseTinted400,
      theme.color.red200,
    ),
    negative: primaryColors(
      theme.color.white,
      theme.color.blue400,
      theme.color.blueberry100,
      theme.color.blue300,
    ),
  }),
  ghost: styleMap({
    default: ghostColors(
      theme.color.blue400,
      theme.color.blueberry400,
      theme.color.blue300,
    ),
    destructive: ghostColors(
      theme.color.red600,
      theme.color.roseTinted400,
      theme.color.red200,
    ),
    negative: ghostColors(
      theme.color.white,
      theme.color.dark100,
      theme.color.dark200,
    ),
  }),
  text: styleMap({
    default: textColors(
      theme.color.blue400,
      theme.color.blueberry400,
      theme.color.blue300,
    ),
    destructive: textColors(
      theme.color.red600,
      theme.color.roseTinted400,
      theme.color.red200,
    ),
    negative: textColors(
      theme.color.white,
      theme.color.dark100,
      theme.color.dark200,
    ),
  }),
  utility: styleMap({
    default: utilityColors(
      theme.color.dark400,
      theme.color.blue200,
      theme.color.dark400,
      theme.color.blue400,
      theme.color.dark200,
      theme.color.blue100,
    ),
    destructive: utilityColors(
      theme.color.dark400,
      theme.color.red200,
      theme.color.dark400,
      theme.color.roseTinted400,
      theme.color.dark200,
      theme.color.red100,
    ),
    negative: utilityColors(
      theme.color.white,
      theme.color.white,
      theme.color.white,
      theme.color.white,
      theme.color.dark200,
      theme.color.blue100,
    ),
  }),
}

export const circle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  padding: 0,
})

const utilityIconColor = (
  scheme: keyof typeof colors.utility,
  color: string,
  hovercolor: string,
) => ({
  [`${variants.utility}${colors.utility[scheme]}:not(:focus) &`]: {
    color: color,
  },
  [`${variants.utility}${colors.utility[scheme]}:active &`]: {
    color: color,
  },
  [`${variants.utility}${colors.utility[scheme]}:hover &`]: {
    color: hovercolor,
  },
})

export const icon = style({
  width: 24,
  height: 24,
  marginLeft: 15,
  selectors: {
    [`${isEmpty} &`]: {
      marginLeft: 0,
    },
    [`${circle} &`]: {
      marginLeft: 0,
      width: '50%',
      height: '50%',
    },
    [`${size.small} &`]: {
      width: 15,
      height: 15,
    },
    [`${variants.text}:not(${isEmpty}) &`]: {
      width: 15,
      height: 15,
      marginLeft: 8,
    },
    [`${variants.utility}:not(${isEmpty}) &`]: {
      width: 16,
      height: 16,
      marginLeft: 8,
    },
    ...utilityIconColor(
      'default',
      theme.color.blue400,
      theme.color.blueberry400,
    ),
    ...utilityIconColor(
      'destructive',
      theme.color.red600,
      theme.color.roseTinted400,
    ),
  },
})
