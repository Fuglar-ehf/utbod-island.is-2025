import {
  DateFormField,
  SelectFormField,
  TextFormField,
} from '@island.is/application/ui-fields'
import { FormFieldMapperType } from '../../shared/types'
import {
  FieldComponents,
  FieldTypes,
  NO,
  YES,
} from '@island.is/application/types'
import { information } from '../../lib/messages'
import { coreErrorMessages } from '@island.is/application/core'

export const formFieldMapper = ({
  item,
  props,
  displayError,
  watchTechInfoFields,
  formatMessage,
}: FormFieldMapperType) => {
  const { variableName, label, type, required, maxLength, values } = item
  const { application, field } = props
  const error =
    displayError && required && variableName
      ? (watchTechInfoFields[variableName].length === 0
          ? formatMessage(coreErrorMessages.defaultError)
          : undefined) ||
        ((type === 'int' || type === 'float') &&
        maxLength &&
        watchTechInfoFields[variableName].length > maxLength
          ? formatMessage(coreErrorMessages.defaultError)
          : undefined)
      : undefined
  if (values && values.length > 0) {
    return (
      <SelectFormField
        application={application}
        error={error}
        field={{
          id: `${field.id}.${variableName}`,
          title: label ?? '',
          options: values.map((value) => {
            return { value: value, label: value }
          }),
          component: FieldComponents.SELECT,
          children: undefined,
          type: FieldTypes.SELECT,
          required: required,
          backgroundColor: 'blue',
        }}
      />
    )
  }
  if (type && (type === 'float' || type === 'int')) {
    return (
      <TextFormField
        application={application}
        showFieldName
        error={error}
        field={{
          id: `${field.id}.${variableName}`,
          title: label ?? '',
          component: FieldComponents.TEXT,
          type: FieldTypes.TEXT,
          children: undefined,
          backgroundColor: 'blue',
          required: required,
          variant: 'number',
          max: maxLength ? parseInt(maxLength, 10) : undefined,
          min: 0,
        }}
      />
    )
  }
  if (type && type === 'string') {
    return (
      <TextFormField
        application={application}
        error={error}
        showFieldName
        field={{
          id: `${field.id}.${variableName}`,
          title: label ?? '',
          component: FieldComponents.TEXT,
          type: FieldTypes.TEXT,
          children: undefined,
          backgroundColor: 'blue',
          required: required,
          maxLength: maxLength ? parseInt(maxLength, 10) : undefined,
          variant: 'text',
        }}
      />
    )
  }
  if (type && type === 'dateTime') {
    return (
      <DateFormField
        application={application}
        error={error}
        field={{
          id: `${field.id}.${variableName}`,
          title: label ?? '',
          component: FieldComponents.DATE,
          type: FieldTypes.DATE,
          children: undefined,
          backgroundColor: 'blue',
          required: required,
          maxDate: new Date(),
        }}
      />
    )
  }
  if (type && type === 'bool') {
    return (
      <SelectFormField
        application={application}
        error={error}
        field={{
          id: `${field.id}.${variableName}`,
          title: label ?? '',
          options: [
            {
              value: YES,
              label: information.labels.radioButtons.radioOptionYes,
            },
            {
              value: NO,
              label: information.labels.radioButtons.radioOptionNo,
            },
          ],
          component: FieldComponents.SELECT,
          children: undefined,
          type: FieldTypes.SELECT,
          required: required,
          backgroundColor: 'blue',
        }}
      />
    )
  }
  return null
}
