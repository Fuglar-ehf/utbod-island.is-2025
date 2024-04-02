import {
  GridRow as Row,
  GridColumn as Column,
  Select,
  Stack,
  Input,
  Checkbox,
  Option,
} from '@island.is/island-ui/core'
import { useContext } from 'react'
import FormBuilderContext from '../../../../../context/FormBuilderContext'
import {
  IInput,
  IInputSettings,
  IInputType,
} from '../../../../../types/interfaces'
import { translationStation } from '../../../../../services/translationStation'
import { SingleValue } from 'react-select'

export default function BaseInput() {
  const { formBuilder, lists, listsDispatch, onFocus, blur } =
    useContext(FormBuilderContext)
  const { activeItem } = lists
  const currentItem = activeItem.data as IInput
  const createAndSortOptions = formBuilder.inputTypes
    .map((it) => {
      return {
        label: it.type,
        value: it.type,
      }
    })
    .sort((a, b) => a.label.localeCompare(b.label))

  const defaultOption =
    currentItem.type === ''
      ? null
      : createAndSortOptions.find((o) => o.value === currentItem.type)

  return (
    <Stack space={2}>
      <Row>
        <Column span="5/10">
          <Select
            label="Tegund"
            name="inputTypeSelect"
            options={createAndSortOptions}
            placeholder="Veldu tegund"
            backgroundColor="blue"
            isSearchable
            value={defaultOption}
            onChange={(e: SingleValue<Option<string>>) =>
              listsDispatch({
                type: 'changeInputType',
                payload: {
                  newValue: e?.value ?? 'Default',
                  inputSettings:
                    (formBuilder?.inputTypes?.find(
                      (inputType: IInputType) => inputType?.type === e?.value,
                    )?.inputSettings as IInputSettings) ?? {},
                },
              })
            }
          />
        </Column>
      </Row>

      <Row>
        {/* Name  */}
        <Column span="10/10">
          <Input
            label="Heiti"
            name="name"
            value={currentItem.name.is}
            backgroundColor="blue"
            onChange={(e) =>
              listsDispatch({
                type: 'changeName',
                payload: {
                  lang: 'is',
                  newValue: e.target.value,
                },
              })
            }
            onFocus={(e) => onFocus(e.target.value)}
            onBlur={(e) => blur(e)}
          />
        </Column>
      </Row>
      <Row>
        {/* Name en */}
        <Column span="10/10">
          <Input
            label="Heiti (enska)"
            name="nameEn"
            value={currentItem.name.en}
            backgroundColor="blue"
            onChange={(e) =>
              listsDispatch({
                type: 'changeName',
                payload: {
                  lang: 'en',
                  newValue: e.target.value,
                },
              })
            }
            onFocus={(e) => onFocus(e.target.value)}
            onBlur={(e) => blur(e)}
            buttons={[
              {
                label: 'translate',
                name: 'reader',
                onClick: async () => {
                  const translation = await translationStation(
                    currentItem.name.is,
                  )
                  listsDispatch({
                    type: 'changeName',
                    payload: {
                      lang: 'en',
                      newValue: translation.translations[0].translatedText,
                    },
                  })
                },
              },
            ]}
          />
        </Column>
      </Row>
      {/* Description  */}
      {['Textalýsing'].includes(currentItem.type) && (
        <>
          <Row>
            <Column span="10/10">
              <Input
                label="Lýsing"
                name="description"
                value={currentItem.description.is}
                textarea
                backgroundColor="blue"
                onFocus={(e) => onFocus(e.target.value)}
                onBlur={(e) => blur(e)}
                onChange={(e) =>
                  listsDispatch({
                    type: 'setDescription',
                    payload: {
                      lang: 'is',
                      newValue: e.target.value,
                    },
                  })
                }
              />
            </Column>
          </Row>
          <Row>
            <Column span="10/10">
              <Input
                label="Lýsing (enska)"
                name="description"
                value={currentItem.description.en}
                textarea
                backgroundColor="blue"
                onFocus={(e) => onFocus(e.target.value)}
                onBlur={(e) => blur(e)}
                onChange={(e) =>
                  listsDispatch({
                    type: 'setDescription',
                    payload: {
                      lang: 'en',
                      newValue: e.target.value,
                    },
                  })
                }
                buttons={[
                  {
                    label: 'translate',
                    name: 'reader',
                    onClick: async () => {
                      const translation = await translationStation(
                        currentItem.description.is,
                      )
                      listsDispatch({
                        type: 'setDescription',
                        payload: {
                          lang: 'en',
                          newValue: translation.translations[0].translatedText,
                        },
                      })
                    },
                  },
                ]}
              />
            </Column>
          </Row>
        </>
      )}
      <Row>
        {/* Required checkbox */}
        <Column span="5/10">
          <Checkbox
            label="Krafist"
            checked={currentItem.isRequired}
            onChange={(e) =>
              listsDispatch({
                type: 'setIsRequired',
                payload: {
                  guid: currentItem.guid,
                  isRequired: e.target.checked,
                },
              })
            }
          />
        </Column>
      </Row>
    </Stack>
  )
}
