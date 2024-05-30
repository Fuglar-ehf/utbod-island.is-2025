import { coreMessages, formatText } from '@island.is/application/core'
import {
  FieldBaseProps,
  TableRepeaterField,
} from '@island.is/application/types'
import {
  Stack,
  Box,
  Button,
  Table as T,
  Text,
  Icon,
  Tooltip,
  GridRow,
  GridColumn,
  AlertMessage,
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
import { FC, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

interface Props extends FieldBaseProps {
  field: TableRepeaterField
}

const componentMapper = {
  input: InputController,
  select: SelectController,
  checkbox: CheckboxController,
  date: DatePickerController,
  radio: RadioController,
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

  const getFieldError = (id: string) => {
    /**
     * Errors that occur in a field-array have incorrect typing
     * This hack is needed to get the correct type
     */
    const errorList = error as unknown as Record<string, string>[] | undefined
    const errors = errorList?.[activeIndex]
    return errors?.[id]
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
                        {formatTableValue(item, values[index])}
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
                {items.map((item) => {
                  const {
                    component,
                    id: itemId,
                    backgroundColor = 'blue',
                    label = '',
                    placeholder = '',
                    options,
                    width = 'full',
                    condition,
                    ...props
                  } = item
                  const isHalfColumn = component !== 'radio' && width === 'half'
                  const span = isHalfColumn ? '1/2' : '1/1'
                  const Component = componentMapper[component]
                  const id = `${data.id}[${activeIndex}].${itemId}`
                  const activeValues =
                    activeIndex >= 0 && values ? values[activeIndex] : undefined

                  const translatedOptions = options?.map((option) => ({
                    ...option,
                    label: formatText(option.label, application, formatMessage),
                  }))

                  if (condition && !condition(application, activeValues)) {
                    return null
                  }

                  return (
                    <GridColumn key={id} span={['1/1', '1/1', '1/1', span]}>
                      {component === 'radio' && label && (
                        <Text
                          variant="h4"
                          as="h4"
                          id={id + 'title'}
                          marginBottom={3}
                        >
                          {formatText(label, application, formatMessage)}
                        </Text>
                      )}
                      <Component
                        id={id}
                        name={id}
                        label={formatText(label, application, formatMessage)}
                        options={translatedOptions}
                        placeholder={formatText(
                          placeholder,
                          application,
                          formatMessage,
                        )}
                        split={width === 'half' ? '1/2' : '1/1'}
                        error={getFieldError(itemId)}
                        control={methods.control}
                        backgroundColor={backgroundColor}
                        onChange={() => {
                          if (error) {
                            methods.clearErrors(id)
                          }
                        }}
                        {...props}
                      />
                    </GridColumn>
                  )
                })}
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
