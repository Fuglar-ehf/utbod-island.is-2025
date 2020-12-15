import { Condition } from '../types/Condition'
import {
  CheckboxField,
  CustomField,
  DateField,
  DividerField,
  FieldComponents,
  FieldTypes,
  FieldWidth,
  FileUploadField,
  IntroductionField,
  Option,
  RadioField,
  SubmitField,
  SelectField,
  TextField,
  TextFieldVariant,
  MaybeWithApplication,
  AsyncSelectField,
  Context,
} from '../types/Fields'
import { CallToAction } from '../types/StateMachine'
import { FormText } from '..'
import { Colors } from '@island.is/island-ui/theme'
import { FormatInputValueFunction } from 'react-number-format'

export function buildCheckboxField(data: {
  condition?: Condition
  id: string
  name: FormText
  description?: FormText
  options: MaybeWithApplication<Option[]>
  disabled?: boolean
  width?: FieldWidth
}): CheckboxField {
  const {
    condition,
    id,
    name,
    description,
    options,
    disabled = false,
    width = 'full',
  } = data
  return {
    children: undefined,
    disabled,
    width,
    condition,
    id,
    name,
    description,
    options,
    type: FieldTypes.CHECKBOX,
    component: FieldComponents.CHECKBOX,
  }
}

export function buildDateField(data: {
  condition?: Condition
  id: string
  name: FormText
  placeholder?: FormText
  description?: FormText
  maxDate?: Date
  minDate?: Date
  disabled?: boolean
  width?: FieldWidth
}): DateField {
  const {
    condition,
    id,
    name,
    description,
    maxDate,
    minDate,
    disabled = false,
    width = 'full',
    placeholder,
  } = data
  return {
    children: undefined,
    condition,
    id,
    placeholder,
    disabled,
    width,
    name,
    description,
    maxDate,
    minDate,
    type: FieldTypes.DATE,
    component: FieldComponents.DATE,
  }
}

export function buildIntroductionField(data: {
  condition?: Condition
  id: string
  name: FormText
  introduction: FormText
}): IntroductionField {
  const { condition, id, name, introduction } = data
  return {
    children: undefined,
    condition,
    introduction,
    id,
    name,
    type: FieldTypes.INTRO,
    component: FieldComponents.INTRO,
  }
}

export function buildRadioField(data: {
  condition?: Condition
  id: string
  name: FormText
  description?: FormText
  options: MaybeWithApplication<Option[]>
  emphasize?: boolean
  largeButtons?: boolean
  disabled?: boolean
  width?: FieldWidth
}): RadioField {
  const {
    condition,
    id,
    name,
    description,
    options,
    emphasize = false,
    largeButtons = false,
    disabled = false,
    width = 'full',
  } = data
  return {
    children: undefined,
    emphasize,
    largeButtons,
    disabled,
    width,
    condition,
    id,
    name,
    description,
    options,
    type: FieldTypes.RADIO,
    component: FieldComponents.RADIO,
  }
}

export function buildSelectField(data: {
  condition?: Condition
  id: string
  name: FormText
  description?: FormText
  placeholder?: FormText
  options: MaybeWithApplication<Option[]>
  disabled?: boolean
  width?: FieldWidth
}): SelectField {
  const {
    condition,
    id,
    name,
    description,
    options,
    placeholder,
    disabled = false,
    width = 'full',
  } = data
  return {
    children: undefined,
    placeholder,
    disabled,
    width,
    condition,
    id,
    name,
    description,
    options,
    type: FieldTypes.SELECT,
    component: FieldComponents.SELECT,
  }
}

export function buildAsyncSelectField(data: {
  condition?: Condition
  id: string
  name: FormText
  description?: FormText
  placeholder?: string
  loadOptions: (c: Context) => Promise<Option[]>
  loadingError?: FormText
  disabled?: boolean
  width?: FieldWidth
}): AsyncSelectField {
  const {
    condition,
    id,
    name,
    description,
    loadOptions,
    loadingError,
    placeholder,
    disabled = false,
    width = 'full',
  } = data
  return {
    children: undefined,
    placeholder,
    disabled,
    width,
    condition,
    id,
    name,
    description,
    loadOptions,
    loadingError,
    type: FieldTypes.ASYNC_SELECT,
    component: FieldComponents.ASYNC_SELECT,
  }
}

export function buildTextField(data: {
  condition?: Condition
  id: string
  name: FormText
  description?: FormText
  disabled?: boolean
  width?: FieldWidth
  variant?: TextFieldVariant
  placeholder?: FormText
  format?: string | FormatInputValueFunction
}): TextField {
  const {
    condition,
    id,
    name,
    description,
    placeholder,
    disabled = false,
    width = 'full',
    variant = 'text',
    format,
  } = data
  return {
    children: undefined,
    placeholder,
    disabled,
    width,
    condition,
    id,
    name,
    description,
    variant,
    format,
    type: FieldTypes.TEXT,
    component: FieldComponents.TEXT,
  }
}

export function buildCustomField(
  data: {
    condition?: Condition
    id: string
    name: FormText
    description?: FormText
    component: string
  },
  props?: object,
): CustomField {
  const { condition, id, name, description, component } = data
  return {
    children: undefined,
    condition,
    id,
    name,
    description,
    type: FieldTypes.CUSTOM,
    component,
    props: props ?? {},
  }
}

export function buildFileUploadField(data: {
  condition?: Condition
  id: string
  name: FormText
  introduction: FormText
  uploadHeader?: string
  uploadDescription?: string
  uploadButtonLabel?: string
  uploadMultiple?: boolean
  uploadAccept?: string
}): FileUploadField {
  const {
    condition,
    id,
    name,
    introduction,
    uploadHeader,
    uploadDescription,
    uploadButtonLabel,
    uploadMultiple,
    uploadAccept,
  } = data
  return {
    children: undefined,
    condition,
    id,
    name,
    introduction,
    uploadHeader,
    uploadDescription,
    uploadButtonLabel,
    uploadMultiple,
    uploadAccept,
    type: FieldTypes.FILEUPLOAD,
    component: FieldComponents.FILEUPLOAD,
  }
}

export function buildDividerField(data: {
  name?: FormText
  color?: Colors
}): DividerField {
  const { name, color } = data
  return {
    id: '',
    children: undefined,
    type: FieldTypes.DIVIDER,
    component: FieldComponents.DIVIDER,
    name: name ?? '',
    color,
  }
}

export function buildSubmitField(data: {
  id: string
  name: FormText
  placement?: 'footer' | 'screen'
  actions: CallToAction[]
}): SubmitField {
  const { id, placement = 'footer', name, actions } = data
  return {
    children: undefined,
    id,
    name,
    actions,
    placement,
    type: FieldTypes.SUBMIT,
    component: FieldComponents.SUBMIT,
  }
}
