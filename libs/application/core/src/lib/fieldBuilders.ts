import { Colors } from '@island.is/island-ui/theme'

import {
  Application,
  BaseField,
  CallToAction,
  Condition,
  CheckboxField,
  CustomField,
  DateField,
  DividerField,
  KeyValueField,
  FormText,
  FormTextArray,
  FieldComponents,
  FieldTypes,
  FieldWidth,
  FileUploadField,
  DescriptionField,
  Option,
  RadioField,
  SubmitField,
  SelectField,
  TextField,
  MaybeWithApplicationAndField,
  AsyncSelectField,
  RecordObject,
  Field,
  CompanySearchField,
  RedirectToServicePortalField,
} from '@island.is/application/types'
import { SpanType } from '@island.is/island-ui/core/types'

const extractCommonFields = (
  data: Omit<BaseField, 'type' | 'component' | 'children'>,
) => {
  const {
    condition,
    defaultValue,
    description,
    disabled = false,
    doesNotRequireAnswer = false,
    id,
    title,
    width = 'full',
  } = data

  return {
    id,
    condition,
    defaultValue,
    description,
    disabled,
    doesNotRequireAnswer,
    title,
    width,
  }
}

export function buildCheckboxField(
  data: Omit<CheckboxField, 'type' | 'component' | 'children'>,
): CheckboxField {
  const {
    options,
    strong = false,
    large = true,
    backgroundColor = 'blue',
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    large,
    strong,
    backgroundColor,
    options,
    type: FieldTypes.CHECKBOX,
    component: FieldComponents.CHECKBOX,
  }
}

export function buildDateField(
  data: Omit<DateField, 'type' | 'component' | 'children'>,
): DateField {
  const {
    maxDate,
    minDate,
    excludeDates,
    placeholder,
    backgroundColor = 'blue',
    required,
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    placeholder,
    maxDate,
    minDate,
    excludeDates,
    type: FieldTypes.DATE,
    component: FieldComponents.DATE,
    backgroundColor,
    required,
  }
}

export function buildDescriptionField(
  data: Omit<DescriptionField, 'type' | 'component' | 'children'>,
): DescriptionField {
  const {
    titleVariant = 'h2',
    description,
    tooltip,
    titleTooltip,
    space,
    marginBottom,
  } = data
  return {
    ...extractCommonFields(data),
    doesNotRequireAnswer: true,
    children: undefined,
    description,
    titleVariant,
    tooltip,
    titleTooltip,
    space,
    marginBottom,
    type: FieldTypes.DESCRIPTION,
    component: FieldComponents.DESCRIPTION,
  }
}

export function buildRadioField(
  data: Omit<RadioField, 'type' | 'component' | 'children'>,
): RadioField {
  const { options, largeButtons = true, backgroundColor, space } = data

  return {
    ...extractCommonFields(data),
    children: undefined,
    largeButtons,
    options,
    backgroundColor,
    space,
    type: FieldTypes.RADIO,
    component: FieldComponents.RADIO,
  }
}

export function buildSelectField(
  data: Omit<SelectField, 'type' | 'component' | 'children'>,
): SelectField {
  const { options, placeholder, onSelect, backgroundColor = 'blue' } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    placeholder,
    options,
    type: FieldTypes.SELECT,
    component: FieldComponents.SELECT,
    onSelect,
    backgroundColor,
  }
}

export function buildAsyncSelectField(
  data: Omit<AsyncSelectField, 'type' | 'component' | 'children'>,
): AsyncSelectField {
  const {
    loadOptions,
    loadingError,
    placeholder,
    onSelect,
    backgroundColor = 'blue',
    isSearchable,
  } = data

  return {
    ...extractCommonFields(data),
    children: undefined,
    placeholder,
    loadOptions,
    loadingError,
    type: FieldTypes.ASYNC_SELECT,
    component: FieldComponents.ASYNC_SELECT,
    onSelect,
    backgroundColor,
    isSearchable,
  }
}

export function buildCompanySearchField(
  data: Omit<CompanySearchField, 'type' | 'component' | 'children'>,
): CompanySearchField {
  const { placeholder, shouldIncludeIsatNumber } = data

  return {
    ...extractCommonFields(data),
    children: undefined,
    placeholder,
    shouldIncludeIsatNumber,
    type: FieldTypes.COMPANY_SEARCH,
    component: FieldComponents.COMPANY_SEARCH,
  }
}

export function buildTextField(
  data: Omit<TextField, 'type' | 'component' | 'children'>,
): TextField {
  const {
    backgroundColor = 'blue',
    placeholder,
    variant = 'text',
    format,
    suffix,
    rows,
    required,
    maxLength,
    readOnly,
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    placeholder,
    backgroundColor,
    variant,
    format,
    suffix,
    rows,
    required,
    maxLength,
    readOnly,
    type: FieldTypes.TEXT,
    component: FieldComponents.TEXT,
  }
}

export function buildCustomField(
  data: Omit<CustomField, 'props' | 'type' | 'children'>,
  props?: RecordObject,
): CustomField {
  const { component, childInputIds } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    childInputIds,
    type: FieldTypes.CUSTOM,
    component,
    props: props ?? {},
  }
}

export function buildFileUploadField(
  data: Omit<FileUploadField, 'type' | 'component' | 'children'>,
): FileUploadField {
  const {
    introduction,
    uploadHeader,
    uploadDescription,
    uploadButtonLabel,
    uploadMultiple,
    uploadAccept,
    maxSize,
    maxSizeErrorText,
    forImageUpload,
  } = data
  return {
    ...extractCommonFields(data),
    children: undefined,
    introduction,
    uploadHeader,
    uploadDescription,
    uploadButtonLabel,
    uploadMultiple,
    uploadAccept,
    maxSize,
    maxSizeErrorText,
    forImageUpload,
    type: FieldTypes.FILEUPLOAD,
    component: FieldComponents.FILEUPLOAD,
  }
}

export function buildDividerField(data: {
  condition?: Condition
  title?: FormText
  color?: Colors
}): DividerField {
  const { title, color, condition } = data
  return {
    id: '',
    children: undefined,
    type: FieldTypes.DIVIDER,
    component: FieldComponents.DIVIDER,
    doesNotRequireAnswer: true,
    title: title ?? '',
    color,
    condition,
  }
}

export function buildKeyValueField(data: {
  label: FormText
  value: FormText | FormTextArray
  width?: FieldWidth
  colSpan?: SpanType
  condition?: Condition
}): KeyValueField {
  const { label, value, condition, width = 'full', colSpan } = data

  return {
    id: '',
    title: '',
    children: undefined,
    doesNotRequireAnswer: true,
    condition,
    width,
    colSpan,
    label,
    value,
    type: FieldTypes.KEY_VALUE,
    component: FieldComponents.KEY_VALUE,
  }
}

export function buildSubmitField(data: {
  id: string
  title: FormText
  placement?: 'footer' | 'screen'
  refetchApplicationAfterSubmit?: boolean
  actions: CallToAction[]
}): SubmitField {
  const {
    id,
    placement = 'footer',
    title,
    actions,
    refetchApplicationAfterSubmit,
  } = data
  return {
    children: undefined,
    id,
    title,
    actions,
    placement,
    doesNotRequireAnswer: true,
    refetchApplicationAfterSubmit:
      typeof refetchApplicationAfterSubmit !== 'undefined'
        ? refetchApplicationAfterSubmit
        : false,
    type: FieldTypes.SUBMIT,
    component: FieldComponents.SUBMIT,
  }
}

export function buildFieldOptions(
  maybeOptions: MaybeWithApplicationAndField<Option[]>,
  application: Application,
  field: Field,
): Option[] {
  if (typeof maybeOptions === 'function') {
    return maybeOptions(application, field)
  }

  return maybeOptions
}

export function buildRedirectToServicePortalField(data: {
  id: string
  title: FormText
}): RedirectToServicePortalField {
  const { id, title } = data
  return {
    children: undefined,
    id,
    title,
    type: FieldTypes.REDIRECT_TO_SERVICE_PORTAL,
    component: FieldComponents.REDIRECT_TO_SERVICE_PORTAL,
  }
}
