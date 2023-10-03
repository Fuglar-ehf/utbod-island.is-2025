import React, { forwardRef, SyntheticEvent, useRef, useState } from 'react'
import { AriaError, InputBackgroundColor, InputProps } from '../Input/types'
import * as styles from './PhoneInput.css'
import cn from 'classnames'
import { Box } from '../Box/Box'
import { Tooltip } from '../Tooltip/Tooltip'
import { UseBoxStylesProps } from '../Box/useBoxStyles'
import { resolveResponsiveProp } from '../../utils/responsiveProp'
import { useMergeRefs } from '../../hooks/useMergeRefs'
import { Icon } from '../IconRC/Icon'
import { StringOption } from '../Select/Select.types'
import { CountryCodeSelect } from './CountryCodeSelect/CountryCodeSelect'
import NumberFormat, { NumberFormatValues } from 'react-number-format'
import { countryCodes as countryCodeList } from './countryCodes'
import { parse } from 'libphonenumber-js'
import { useEffectOnce } from 'react-use'

const DEFAULT_COUNTRY_CODE = '+354'

const getCountryCodes = (allowedCountryCodes?: string[]): StringOption[] => {
  return countryCodeList
    .filter((x) =>
      allowedCountryCodes ? allowedCountryCodes.includes(x.code) : true,
    )
    .map((x) => ({
      label: `${x.name} ${x.dial_code}`,
      value: x.dial_code,
      description: x.flag,
    }))
}

/**
 * Gets default value for the controller.
 * If the incoming value is empty or starts with "+",
 * then we don't have to prefix it with the country code.
 */
const getDefaultValue = (
  defaultValue?: string,
  defaultCountryCode?: string,
) => {
  const cleanedValue = defaultValue?.replace(/-/g, '')
  return !cleanedValue || cleanedValue?.startsWith('+')
    ? cleanedValue
    : `${defaultCountryCode ?? ''}${cleanedValue}`
}

/**
 * Gets default country code.
 * This function tries to extract a country calling code
 * by using libphonenumber-js to parse the code from the number.
 * Defaults to IS code.
 *
 * Example outputs:
 * getDefaultCountryCode("+3545812345") // +354
 * getDefaultCountryCode("+455812345") // +45
 * getDefaultCountryCode("5812345") // +354
 */
const getDefaultCountryCode = (phoneNumber?: string) => {
  if (!phoneNumber) return DEFAULT_COUNTRY_CODE
  const parsedPhoneNumber = parse(phoneNumber)

  if (parsedPhoneNumber && parsedPhoneNumber.country) {
    return (
      countryCodeList.find((x) => x.code === parsedPhoneNumber.country)
        ?.dial_code || DEFAULT_COUNTRY_CODE
    )
  }

  return DEFAULT_COUNTRY_CODE
}

export type PhoneInputProps = Omit<
  InputProps,
  | 'rows'
  | 'type'
  | 'icon'
  | 'iconType'
  | 'backgroundColor'
  | 'defaultValue'
  | 'value'
> & {
  defaultValue?: string
  value?: string
  backgroundColor?: InputBackgroundColor
  onValueChange?: (values: NumberFormatValues) => void
  allowedCountryCodes?: string[]
  format?: string
  onFormatValueChange?: (...event: any[]) => void
  disableDropdown?: boolean
}

export const PhoneInput = forwardRef(
  (
    props: PhoneInputProps,
    ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {
      name,
      label,
      errorMessage = '',
      hasError = Boolean(errorMessage),
      value,
      defaultValue,
      id = name,
      disabled,
      required,
      rightAlign,
      placeholder,
      tooltip,
      backgroundColor = 'white',
      readOnly,
      textarea,
      size = 'md',
      fixedFocusState,
      autoExpand,
      loading,
      allowedCountryCodes,
      disableDropdown,
      onFormatValueChange,
      onFocus,
      onBlur,
      onClick,
      onKeyDown,
      ...inputProps
    } = props

    const [hasFocus, setHasFocus] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
    const mergedRefs = useMergeRefs(inputRef, ref || null)

    // Extract default country code from value, with value from form context having priority
    const defaultCountryCode = getDefaultCountryCode(value || defaultValue)
    const countryCodes = getCountryCodes(allowedCountryCodes)

    const selected = countryCodes.find(
      (x) => x.value === defaultCountryCode,
    ) as StringOption

    const [selectedCountryCode, setSelectedCountryCode] = useState(selected)
    const cc = selectedCountryCode?.value

    const errorId = `${id}-error`
    const selectId = `country-code-select-${id}`
    const ariaError = hasError
      ? {
          'aria-invalid': true,
          'aria-describedby': errorId,
        }
      : {}

    const mapBlue = (color: InputBackgroundColor) =>
      color === 'blue' ? 'blue100' : color
    const containerBackground = Array.isArray(backgroundColor)
      ? backgroundColor.map(mapBlue)
      : mapBlue(backgroundColor as InputBackgroundColor)

    /**
      Used to handle autofill and paste events.
      Value cannot start with '+' unless it is from autofill or paste,
      because NumberFormat doesn't allow it.
      So we know that if the value starts with '+', then we need to
      extract the country code from it and set it as the selected country code.
     */
    const handleInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
      if (e.currentTarget.value.startsWith('+')) {
        const updatedCC = getDefaultCountryCode(e.currentTarget.value)
        e.currentTarget.value = e.currentTarget.value.replace(updatedCC, '')
        if (!disableDropdown) {
          setSelectedCountryCode(
            countryCodes.find((x) => x.value === updatedCC) as StringOption,
          )
        }
      }
    }

    useEffectOnce(() => {
      // We need to initialize defaultValues with country code prefix if it is missing
      if (value && !value.startsWith('+') && onFormatValueChange) {
        onFormatValueChange(getDefaultValue(value, defaultCountryCode))
      }
    })

    return (
      <>
        <Box
          position="relative"
          onClick={() => {
            if (disableDropdown) {
              inputRef.current?.focus()
            }
          }}
        >
          {/* If size is xs then the label is above the input box */}
          {size === 'xs' && label && (
            <label
              htmlFor={id}
              className={cn(styles.label, styles.labelSizes[size], {
                [styles.labelDisabledEmptyInput]:
                  disabled && !value && !defaultValue,
              })}
            >
              {label}
              {required && (
                <span aria-hidden="true" className={styles.isRequiredStar}>
                  {' '}
                  *
                </span>
              )}
              {tooltip && (
                <Box marginLeft={1} display="inlineBlock">
                  <Tooltip text={tooltip} />
                </Box>
              )}
            </label>
          )}
          <Box
            display="flex"
            alignItems="center"
            background={containerBackground as UseBoxStylesProps['background']}
            className={cn(styles.container, styles.containerSizes[size], {
              [styles.hasError]: hasError,
              [styles.hasFocus]: hasFocus,
              [styles.fixedFocusState]: fixedFocusState,
              [styles.noLabel]: !label,
              [styles.containerDisabled]: disabled,
              [styles.readOnly]: readOnly,
              [styles.menuOpen]: isMenuOpen,
            })}
          >
            <Box flexGrow={1}>
              {size !== 'xs' && label && (
                <label
                  htmlFor={id}
                  className={cn(styles.label, styles.labelSizes[size], {
                    [styles.labelDisabledEmptyInput]:
                      disabled && !value && !defaultValue,
                  })}
                >
                  {label}
                  {required && (
                    <span aria-hidden="true" className={styles.isRequiredStar}>
                      {' '}
                      *
                    </span>
                  )}
                  {tooltip && (
                    <Box marginLeft={1} display="inlineBlock">
                      <Tooltip text={tooltip} />
                    </Box>
                  )}
                </label>
              )}
              <Box display="flex">
                {/**
                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict*/}
                <CountryCodeSelect
                  id={selectId}
                  name={selectId}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  onChange={(option) => {
                    if (option) {
                      const newCc = option.value
                      setSelectedCountryCode(option)
                      onFormatValueChange?.(value?.replace(cc, newCc))
                      if (inputRef.current) {
                        inputRef.current.focus()
                      }
                    }
                  }}
                  value={selectedCountryCode}
                  defaultValue={countryCodes.find(
                    (x) => x.value === defaultCountryCode,
                  )}
                  options={countryCodes}
                  isDisabled={disabled || readOnly || disableDropdown}
                  backgroundColor={backgroundColor}
                  inputHasLabel={!!label}
                  size={size}
                  onFocus={() => setHasFocus(true)}
                  onBlur={() => setHasFocus(false)}
                  onMenuOpen={() => setIsMenuOpen(true)}
                  onMenuClose={() => setIsMenuOpen(false)}
                  dataTestId={`country-code-test-${id}`}
                />
                <NumberFormat
                  className={cn(
                    styles.input,
                    resolveResponsiveProp(
                      backgroundColor,
                      styles.inputBackgroundXs,
                      styles.inputBackgroundSm,
                      styles.inputBackgroundMd,
                      styles.inputBackgroundLg,
                      styles.inputBackgroundXl,
                    ),
                    styles.inputSize[size],
                    styles.inputNoPaddingRight,
                    {
                      [styles.inputDisabled]:
                        disabled || readOnly || disableDropdown,
                    },
                  )}
                  id={id}
                  name={name}
                  type="tel"
                  disabled={disabled}
                  getInputRef={mergedRefs}
                  placeholder={placeholder}
                  onInput={handleInputChange}
                  value={value?.replace(cc, '')}
                  defaultValue={getDefaultValue(
                    defaultValue,
                    defaultCountryCode,
                  )}
                  readOnly={readOnly}
                  format={
                    countryCodeList.find(
                      (x) => x.dial_code === cc && !!x.format,
                    )?.format
                  }
                  onValueChange={({ value }) => {
                    // Don't prefix value with country code it it's empty.
                    value
                      ? onFormatValueChange?.(cc + value)
                      : onFormatValueChange?.(value)
                  }}
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                    setHasFocus(true)
                    if (onFocus) {
                      onFocus(e)
                    }
                  }}
                  onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                    if (onClick) {
                      onClick(e)
                    }
                  }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (onKeyDown) {
                      onKeyDown(e)
                    }
                  }}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    setHasFocus(false)
                    if (onBlur) {
                      onBlur(e)
                    }
                  }}
                  {...(ariaError as AriaError)}
                  {...inputProps}
                  {...(required && { 'aria-required': true })}
                />
              </Box>
            </Box>
            {loading && (
              <Box
                className={styles.spinner}
                flexShrink={0}
                borderRadius="circle"
              />
            )}
            {!loading && hasError && (
              <Icon
                icon="warning"
                skipPlaceholderSize
                className={cn(styles.icon, styles.iconError)}
                ariaHidden
              />
            )}
          </Box>
        </Box>
        {hasError && errorMessage && (
          <div
            id={errorId}
            className={styles.errorMessage}
            aria-live="assertive"
            data-testid="phoneInputErrorMessage"
          >
            {errorMessage}
          </div>
        )}
      </>
    )
  },
)
