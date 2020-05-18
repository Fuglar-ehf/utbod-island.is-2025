import { style, globalStyle } from 'treat'
import { theme } from '../styles'
import * as inputMixins from '../input/Input.mixins'

export const wrapper = style({}, 'wrapper')

export const valueContainer = style(
  {
    selectors: {
      [`${wrapper} &`]: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        marginLeft: 0,
      },
    },
  },
  'valueContainer',
)

globalStyle(`${wrapper} ${valueContainer} .css-b8ldur-Input`, {
  margin: 0,
  padding: 0,
})

export const placeholder = style(
  {
    selectors: {
      [`${wrapper} &`]: {
        marginLeft: 0,
        ...inputMixins.placeholder,
      },
    },
  },
  'placeholder',
)

export const input = style(inputMixins.input, 'input')

globalStyle(`${wrapper} ${input} input`, inputMixins.input)
globalStyle(`${wrapper} ${input} input:focus`, inputMixins.inputFocus)

export const containerDisabled = style({})
export const container = style({}, 'container')
globalStyle(`${wrapper} .island-select__control${container}`, {
  ...inputMixins.container,
  transition: 'border-color 0.1s',
})
globalStyle(
  `${wrapper} .island-select__control${container}${containerDisabled}`,
  inputMixins.containerDisabled,
)
globalStyle(
  `${wrapper} .island-select__control${container}:hover:not(.island-select__control--is-focused):not(${containerDisabled})`,
  inputMixins.containerHover,
)
globalStyle(
  `${wrapper} .island-select__control${container}.island-select__control--is-focused`,
  inputMixins.containerFocus,
)
globalStyle(
  `${wrapper} .island-select__control${container}.island-select__control--menu-is-open`,
  {
    borderColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
)

export const label = style(inputMixins.label, 'label')
export const singleValue = style(
  {
    marginLeft: 0,
    ...inputMixins.input,
  },
  'singleValue',
)
export const indicatorsContainer = style(
  {
    selectors: {
      [`${wrapper} &`]: {
        height: '100%',
        position: 'absolute',
        right: 32,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  },
  'indicatorsContainer',
)
export const dropdownIndicator = style(
  {
    selectors: {
      [`${wrapper} &`]: {
        padding: 0,
      },
    },
  },
  'dropdownIndicator',
)
export const menu = style(
  {
    selectors: {
      [`${wrapper} &`]: {
        marginTop: -1,
        boxShadow: `0 0 0 4px ${theme.mint400}`,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      },
      [`${wrapper} &:before `]: {
        content: '""',
        position: 'absolute',
        top: -4,
        left: 0,
        right: 0,
        height: 4,
        width: '100%',
        backgroundColor: theme.white,
        borderBottom: `1px solid ${theme.blue200}`,
      },
    },
  },
  'menu',
)
export const option = style(
  {
    selectors: {
      [`${wrapper} &`]: {
        position: 'relative',
        fontSize: theme.introFontSize,
        fontWeight: theme.fontWeightLight,
        padding: '23px 24px',
      },
    },
  },
  'option',
)

globalStyle(`${wrapper} ${option}.island-select__option--is-focused`, {
  backgroundColor: theme.blue100,
})

globalStyle(`${wrapper} ${option}.island-select__option--is-selected`, {
  fontWeight: theme.fontWeightSemiBold,
  color: theme.baseColor,
})

globalStyle(
  `${wrapper} ${option}.island-select__option--is-selected:not(.island-select__option--is-focused)`,
  {
    backgroundColor: theme.white,
  },
)

globalStyle(`${wrapper} ${option}.island-select__option--is-focused:before`, {
  content: '""',
  height: 1,
  backgroundColor: theme.white,
  position: 'absolute',
  top: -1,
  right: 20,
  left: 20,
})

globalStyle(
  `${wrapper} ${option}:not(:last-of-type):not(.island-select__option--is-focused):after`,
  {
    content: '""',
    height: 1,
    backgroundColor: theme.blue200,
    position: 'absolute',
    bottom: 0,
    right: 20,
    left: 20,
  },
)
