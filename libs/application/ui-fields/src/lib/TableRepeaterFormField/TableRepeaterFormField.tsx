import {
  coreMessages,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  FieldBaseProps,
  TableRepeaterField,
  TableRepeaterItem,
} from '@island.is/application/types'
import { NationalIdWithName } from '@island.is/application/ui-components'
import {
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
  Stack,
  Table as T,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  DatePickerController,
  FieldDescription,
  InputController,
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { FC, useEffect, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { handleCustomMappedValues } from './utils'

interface Props extends FieldBaseProps {
  field: TableRepeaterField
}

const componentMapper = {
  input: InputController,
  select: SelectController,
  checkbox: CheckboxController,
  date: DatePickerController,
  radio: RadioController,
  nationalIdWithName: NationalIdWithName,
}

export const TableRepeaterFormField: FC<Props> = ({
  application,
  field: data,
  showFieldName,
  error,
}) => {
  const {
    fields: rawItems,
    table,
    formTitle,
    description,
    marginTop = 6,
    marginBottom,
    getStaticTableData,
    title,
    titleVariant = 'h4',
    addItemButtonText = coreMessages.buttonAdd,
    saveItemButtonText = coreMessages.reviewButtonSubmit,
    removeButtonTooltipText = coreMessages.deleteFieldText,
    editButtonTooltipText = coreMessages.editFieldText,
    editField = false,
    maxRows,
  } = data

  const items = Object.keys(rawItems).map((key) => ({
    id: key,
    ...rawItems[key],
  }))

  const { formatMessage } = useLocale()
  const methods = useFormContext()
  const [activeIndex, setActiveIndex] = useState(-1)
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: data.id,
  })

  const values = useWatch({ name: data.id, control: methods.control })
  const activeField = activeIndex >= 0 ? fields[activeIndex] : null
  const savedFields = fields.filter((_, index) => index !== activeIndex)
  const tableItems = items.filter((x) => x.displayInTable !== false)
  const tableHeader = table?.header ?? tableItems.map((item) => item.label)
  const tableRows = table?.rows ?? tableItems.map((item) => item.id)
  const staticData = getStaticTableData?.(application)
  const canAddItem = maxRows ? savedFields.length < maxRows : true

  // check for components that might need some custom value mapping
  const customMappedValues = handleCustomMappedValues(tableItems, values)

  const handleSaveItem = async (index: number) => {
    const isValid = await methods.trigger(`${data.id}[${index}]`, {
      shouldFocus: true,
    })

    if (isValid) {
      setActiveIndex(-1)
    }
  }

  const handleNewItem = () => {
    append({})
    setActiveIndex(fields.length)
    methods.clearErrors()
  }

  const handleRemoveItem = (index: number) => {
    if (activeIndex === index) setActiveIndex(-1)
    if (activeIndex > index) setActiveIndex(activeIndex - 1)
    remove(index)
  }

  const handleEditItem = (index: number) => {
    setActiveIndex(index)
  }

  const formatTableValue = (key: string, item: Record<string, string>) => {
    const formatFn = table?.format?.[key]
    const formatted = formatFn ? formatFn(item[key]) : item[key]
    return typeof formatted === 'string'
      ? formatted
      : formatText(formatted, application, formatMessage)
  }

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      {showFieldName && (
        <Text variant={titleVariant} marginBottom={2}>
          {formatText(title, application, formatMessage)}
        </Text>
      )}
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}
      <Box marginTop={description ? 3 : 0}>
        <Stack space={4}>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData></T.HeadData>
                {tableHeader.map((item, index) => (
                  <T.HeadData key={index}>
                    {formatText(item ?? '', application, formatMessage)}
                  </T.HeadData>
                ))}
              </T.Row>
            </T.Head>
            <T.Body>
              {staticData &&
                staticData.map((item, index) => (
                  <T.Row key={index}>
                    <T.Data></T.Data>
                    {Object.keys(item).map((key, index) => (
                      <T.Data key={`static-${key}-${index}`}>
                        {formatTableValue(key, item)}
                      </T.Data>
                    ))}
                  </T.Row>
                ))}
              {values &&
                savedFields.map((field, index) => (
                  <T.Row key={field.id}>
                    <T.Data>
                      <Box display="flex" alignItems="center">
                        <Tooltip
                          placement="left"
                          text={formatText(
                            removeButtonTooltipText,
                            application,
                            formatMessage,
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Icon
                              icon="removeCircle"
                              type="outline"
                              color="dark200"
                            />
                          </button>
                        </Tooltip>
                        {editField && (
                          <Tooltip
                            placement="left"
                            text={formatText(
                              editButtonTooltipText,
                              application,
                              formatMessage,
                            )}
                          >
                            <button
                              type="button"
                              onClick={() => handleEditItem(index)}
                            >
                              <Icon
                                icon="pencil"
                                color="dark200"
                                type="outline"
                                size="small"
                              />
                            </button>
                          </Tooltip>
                        )}
                      </Box>
                    </T.Data>
                    {tableRows.map((item, idx) => (
                      <T.Data key={`${item}-${idx}`}>
                        {formatTableValue(
                          item,
                          customMappedValues.length
                            ? customMappedValues[index]
                            : values[index],
                        )}
                      </T.Data>
                    ))}
                  </T.Row>
                ))}
            </T.Body>
          </T.Table>
          {activeField ? (
            <Stack space={2} key={activeField.id}>
              {formTitle && (
                <Text variant="h4">
                  {formatText(formTitle, application, formatMessage)}
                </Text>
              )}
              <GridRow rowGap={[2, 2, 2, 3]}>
                {items.map((item) => (
                  <Item
                    key={`${data.id}[${activeIndex}].${item.id}`}
                    application={application}
                    error={error}
                    item={item}
                    dataId={data.id}
                    activeIndex={activeIndex}
                    values={values}
                  />
                ))}
              </GridRow>
              <Box display="flex" justifyContent="flexEnd">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => handleSaveItem(activeIndex)}
                >
                  {formatText(saveItemButtonText, application, formatMessage)}
                </Button>
              </Box>
            </Stack>
          ) : (
            <Box display="flex" justifyContent="flexEnd">
              <Button
                variant="ghost"
                type="button"
                onClick={handleNewItem}
                icon="add"
                disabled={!canAddItem}
              >
                {formatText(addItemButtonText, application, formatMessage)}
              </Button>
            </Box>
          )}
        </Stack>
        {error && typeof error === 'string' && fields.length === 0 && (
          <Box marginTop={3}>
            <AlertMessage type="error" title={error} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

interface ItemFieldProps {
  application: Application
  error?: string
  item: TableRepeaterItem & { id: string }
  dataId: string
  activeIndex: number
  values: Array<Record<string, string>>
}

const Item: FC<ItemFieldProps> = ({
  application,
  error,
  item,
  dataId,
  activeIndex,
  values,
}) => {
  const { formatMessage } = useLocale()
  const { setValue, control, clearErrors } = useFormContext()

  const {
    component,
    id: itemId,
    backgroundColor = 'blue',
    label = '',
    placeholder = '',
    options,
    width = 'full',
    condition,
    readonly = false,
    updateValueObj,
    defaultValue,
    ...props
  } = item
  const isHalfColumn = component !== 'radio' && width === 'half'
  const isThirdColumn = component !== 'radio' && width === 'third'
  const span = isHalfColumn ? '1/2' : isThirdColumn ? '1/3' : '1/1'
  const Component = componentMapper[component]
  const id = `${dataId}[${activeIndex}].${itemId}`
  const activeValues =
    activeIndex >= 0 && values ? values[activeIndex] : undefined

  let watchedValues: string | (string | undefined)[] | undefined
  if (updateValueObj) {
    const watchedValuesId =
      typeof updateValueObj.watchValues === 'function'
        ? updateValueObj.watchValues(activeValues)
        : updateValueObj.watchValues

    if (watchedValuesId) {
      if (Array.isArray(watchedValuesId)) {
        watchedValues = watchedValuesId.map((value) => {
          return activeValues?.[`${value}`]
        })
      } else {
        watchedValues = activeValues?.[`${watchedValuesId}`]
      }
    }
  }

  useEffect(() => {
    if (
      updateValueObj &&
      watchedValues &&
      (Array.isArray(watchedValues)
        ? !watchedValues.every((value) => value === undefined)
        : true)
    ) {
      const finalValue = updateValueObj.valueModifier(activeValues)
      setValue(id, finalValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(watchedValues)])

  const getFieldError = (id: string) => {
    /**
     * Errors that occur in a field-array have incorrect typing
     * This hack is needed to get the correct type
     */
    const errorList = error as unknown as Record<string, string>[] | undefined
    const errors = errorList?.[activeIndex]
    return errors?.[id]
  }

  const getDefaultValue = (
    item: TableRepeaterItem,
    application: Application,
    activeField?: Record<string, string>,
  ) => {
    const { defaultValue } = item

    if (defaultValue === undefined) {
      return undefined
    }

    return defaultValue(application, activeField)
  }

  let translatedOptions: any = []
  if (typeof options === 'function') {
    translatedOptions = options(application, activeValues)
  } else {
    translatedOptions = options?.map((option) => ({
      ...option,
      label: formatText(option.label, application, formatMessage),
      ...(option.tooltip && {
        tooltip: formatText(option.tooltip, application, formatMessage),
      }),
    }))
  }

  let Readonly: boolean | undefined
  if (typeof readonly === 'function') {
    Readonly = readonly(application, activeValues)
  } else {
    Readonly = readonly
  }

  let DefaultValue: any
  if (component === 'input') {
    DefaultValue = getDefaultValue(item, application, activeValues)
  }
  if (component === 'select') {
    DefaultValue =
      getValueViaPath(application.answers, id) ??
      getDefaultValue(item, application, activeValues)
  }
  if (component === 'radio') {
    DefaultValue =
      (getValueViaPath(application.answers, id) as string[]) ??
      getDefaultValue(item, application, activeValues)
  }
  if (component === 'checkbox') {
    DefaultValue =
      (getValueViaPath(application.answers, id) as string[]) ??
      getDefaultValue(item, application, activeValues)
  }
  if (component === 'date') {
    DefaultValue =
      (getValueViaPath(application.answers, id) as string) ??
      getDefaultValue(item, application, activeValues)
  }

  if (condition && !condition(application, activeValues)) {
    return null
  }

  return (
    <GridColumn span={['1/1', '1/1', '1/1', span]}>
      {component === 'radio' && label && (
        <Text variant="h4" as="h4" id={id + 'title'} marginBottom={3}>
          {formatText(label, application, formatMessage)}
        </Text>
      )}
      <Component
        id={id}
        name={id}
        label={formatText(label, application, formatMessage)}
        options={translatedOptions}
        placeholder={formatText(placeholder, application, formatMessage)}
        split={width === 'half' ? '1/2' : '1/1'}
        error={getFieldError(itemId)}
        control={control}
        readOnly={Readonly}
        backgroundColor={backgroundColor}
        onChange={() => {
          if (error) {
            clearErrors(id)
          }
        }}
        application={application}
        defaultValue={DefaultValue}
        {...props}
      />
    </GridColumn>
  )
}
