import { ReactDatePickerProps } from 'react-datepicker'
import { Icon as IconType, Type } from '../IconRC/iconMap'

import pl from 'date-fns/locale/pl'
import is from 'date-fns/locale/is'
import en from 'date-fns/locale/en-US'

const languageConfig = {
  is: {
    format: 'dd.MM.yyyy',
    locale: is,
  },
  en: {
    format: 'MM/dd/yyyy',
    locale: en,
  },
  pl: {
    format: 'dd.MM.yyyy',
    locale: pl,
  },
}

type LocaleKeys = keyof typeof languageConfig

export type DatePickerBackgroundColor = 'white' | 'blue'
export type DatePickerSize = 'md' | 'sm'

export interface DatePickerProps {
  label: string
  placeholderText: ReactDatePickerProps['placeholderText']
  locale?: LocaleKeys
  minDate?: ReactDatePickerProps['minDate']
  maxDate?: ReactDatePickerProps['maxDate']
  selected?: ReactDatePickerProps['selected']
  disabled?: boolean
  hasError?: boolean
  errorMessage?: string
  id?: string
  handleChange?: (startDate: Date) => void
  onInputClick?: ReactDatePickerProps['onInputClick']
  handleCloseCalendar?: (date: Date | null) => void
  handleOpenCalendar?: () => void
  required?: boolean
  inputName?: string
  size?: DatePickerSize
  backgroundColor?: DatePickerBackgroundColor
  icon?: IconType
  iconType?: Type
  /**
   * Minimum selectable year inside datepicker
   */
  minYear?: number
  /**
   * Maximum selectable year inside datepicker
   */
  maxYear?: number
}

export interface DatePickerCustomHeaderProps {
  date: Date
  changeYear(year: number): void
  changeMonth(month: number): void
  decreaseMonth(): void
  increaseMonth(): void
  prevMonthButtonDisabled: boolean
  nextMonthButtonDisabled: boolean
  decreaseYear(): void
  increaseYear(): void
  prevYearButtonDisabled: boolean
  nextYearButtonDisabled: boolean
  locale: Locale
  minYear?: number
  maxYear?: number
}
