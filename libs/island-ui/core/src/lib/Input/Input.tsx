import cn from 'classnames'
import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import { resolveResponsiveProp } from '../../utils/responsiveProp'
import { Box } from '../Box/Box'
import { UseBoxStylesProps } from '../Box/useBoxStyles'
import { Icon } from '../IconRC/Icon'
import { Tooltip } from '../Tooltip/Tooltip'
import { ErrorMessage } from './ErrorMessage'

import * as styles from './Input.css'
import {
  AriaError,
  InputBackgroundColor,
  InputComponentProps,
  InputProps,
} from './types'
import { useMergeRefs } from '../../hooks/useMergeRefs'

const InputHOC = forwardRef(
  (
    props: Omit<InputComponentProps, 'size'>,
    ref: React.Ref<HTMLInputElement>,
  ) => <input ref={ref} {...props} />,
)
const TextareaHOC = forwardRef(
  (props: InputComponentProps, ref: React.Ref<HTMLTextAreaElement>) => (
    <textarea ref={ref} {...props} />
  ),
)

export const Input = forwardRef(
  (
    props: InputProps,
    ref?: React.Ref<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {
      name,
      label,
      errorMessage = '',
      maxLength,
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
      onFocus,
      onBlur,
      readOnly,
      onClick,
      onKeyDown,
      textarea,
      type,
      icon,
      size = 'md',
      fixedFocusState,
      autoExpand,
      loading,
      ...inputProps
    } = props
    const [hasFocus, setHasFocus] = useState(false)
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
    const errorId = `${id}-error`
    const ariaError = hasError
      ? {
          'aria-invalid': true,
          'aria-describedby': errorId,
        }
      : {}
    const mergedRefs = useMergeRefs(inputRef, ref || null)

    const renderIcon = () => {
      if (!icon) {
        return null
      }
      return (
        <Icon
          icon={icon.name}
          type={icon.type || 'filled'}
          skipPlaceholderSize
          className={cn(styles.icon, {
            [styles.iconError]: hasError,
            [styles.iconExtraSmall]: size === 'xs',
          })}
          ariaHidden
        />
      )
    }

    const InputComponent = textarea ? TextareaHOC : InputHOC
    const mapBlue = (color: InputBackgroundColor) =>
      color === 'blue' ? 'blue100' : color
    const containerBackground = Array.isArray(backgroundColor)
      ? backgroundColor.map(mapBlue)
      : mapBlue(backgroundColor as InputBackgroundColor)

    useLayoutEffect(() => {
      const input = inputRef.current

      if (autoExpand?.on && input) {
        const handler = () => {
          input.style.height = 'auto'
          // The +1 here prevents a scrollbar from appearing in the textarea
          input.style.height = `${input.scrollHeight + 1}px`
          input.style.maxHeight = autoExpand.maxHeight
            ? `${autoExpand.maxHeight}px`
            : `${window.innerHeight - 50}px`
        }

        handler()

        input.addEventListener('input', handler, false)

        return function cleanup() {
          input.removeEventListener('input', handler)
        }
      }
    }, [autoExpand?.maxHeight, autoExpand?.on, inputRef])

    return (
      <div>
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
          })}
          onClick={(e) => {
            e.preventDefault()
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }}
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
            <InputComponent
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
                {
                  [styles.rightAlign]: rightAlign,
                  [styles.textarea]: textarea,
                },
              )}
              id={id}
              disabled={disabled}
              name={name}
              ref={mergedRefs}
              placeholder={placeholder}
              value={value}
              maxLength={maxLength}
              defaultValue={defaultValue}
              onFocus={(e) => {
                setHasFocus(true)
                if (onFocus) {
                  onFocus(e)
                }
              }}
              onClick={(e) => {
                if (onClick) {
                  onClick(e)
                }
              }}
              onKeyDown={(e) => {
                if (onKeyDown) {
                  onKeyDown(e)
                }
              }}
              onBlur={(e) => {
                setHasFocus(false)
                if (onBlur) {
                  onBlur(e)
                }
              }}
              readOnly={readOnly}
              type={type}
              {...(ariaError as AriaError)}
              {...inputProps}
              {...(required && { 'aria-required': true })}
            />
          </Box>
          {loading && (
            <Box
              className={styles.spinner}
              flexShrink={0}
              borderRadius="circle"
            />
          )}
          {!loading && hasError && !icon && (
            <Icon
              icon="warning"
              skipPlaceholderSize
              className={cn(styles.icon, styles.iconError)}
              ariaHidden
            />
          )}
          {!loading && icon ? (
            icon?.onClick ? (
              <button onClick={icon.onClick}> {renderIcon()} </button>
            ) : (
              renderIcon()
            )
          ) : null}
        </Box>
        {hasError && errorMessage && (
          <ErrorMessage id={errorId}>{errorMessage}</ErrorMessage>
        )}
      </div>
    )
  },
)
