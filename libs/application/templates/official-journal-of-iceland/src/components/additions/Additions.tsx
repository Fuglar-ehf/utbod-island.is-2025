import { useState } from 'react'
import { convertNumberToRoman, getAddition, isAddition } from '../../lib/utils'
import { additionSchema } from '../../lib/dataSchema'
import {
  Stack,
  Inline,
  RadioButton,
  Box,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { HTMLText } from '@island.is/regulations-tools/types'
import { z } from 'zod'
import {
  DEBOUNCE_INPUT_TIMER,
  DEFAULT_ADDITIONS_COUNT,
  MAXIMUM_ADDITIONS_COUNT,
} from '../../lib/constants'
import { HTMLEditor } from '../htmlEditor/HTMLEditor'
import { useApplication } from '../../hooks/useUpdateApplication'
import { getValueViaPath } from '@island.is/application/core'
import { useFormContext } from 'react-hook-form'
import { InputFields, OJOIApplication } from '../../lib/types'
import set from 'lodash/set'
import debounce from 'lodash/debounce'
import { useLocale } from '@island.is/localization'
import { attachments } from '../../lib/messages'

type Props = {
  application: OJOIApplication
}

type Addition = z.infer<typeof additionSchema>[number]

export const Additions = ({ application }: Props) => {
  const [asRoman, setAsRoman] = useState<boolean>(false)

  const { formatMessage: f } = useLocale()
  const { setValue } = useFormContext()
  const { updateApplication, application: currentApplication } = useApplication(
    {
      applicationId: application.id,
    },
  )

  const getAdditions = () => {
    const additions = getValueViaPath(
      currentApplication ? currentApplication.answers : application.answers,
      InputFields.advert.additions,
    )

    return isAddition(additions)
      ? additions
      : [getAddition(DEFAULT_ADDITIONS_COUNT, false)]
  }

  const onRemoveAddition = (index: number) => {
    const filtered = additions.filter((_, i) => i !== index)
    const mapped = filtered.map((addition, i) => {
      if (addition.type !== 'html') return addition

      const title = f(attachments.additions.title, {
        index: asRoman ? convertNumberToRoman(i + 1) : i + 1,
      })

      return {
        ...addition,
        title: title,
      }
    })

    const currentAnswers = structuredClone(currentApplication.answers)

    const updatedAnswers = set(
      currentAnswers,
      InputFields.advert.additions,
      mapped,
    )

    setValue(InputFields.advert.additions, mapped)
    updateApplication(updatedAnswers)
  }

  const onRomanChange = (val: boolean) => {
    const handleTitleChange = (addition: Addition, i: number) => {
      if (addition.type !== 'html') return addition

      const title = f(attachments.additions.title, {
        index: asRoman ? convertNumberToRoman(i + 1) : i + 1,
      })
      return {
        ...addition,
        title: title,
      }
    }

    const currentAnswers = structuredClone(currentApplication.answers)
    const updatedAdditions = additions.map(handleTitleChange)

    const updatedAnswers = set(
      currentAnswers,
      InputFields.advert.additions,
      updatedAdditions,
    )

    setAsRoman(val)
    setValue(InputFields.advert.additions, updatedAdditions)
    updateApplication(updatedAnswers)
  }

  const onAddAddition = () => {
    const currentAnswers = structuredClone(currentApplication.answers)
    let currentAdditions = getValueViaPath(
      currentAnswers,
      InputFields.advert.additions,
    )

    if (!isAddition(currentAdditions)) {
      currentAdditions = []
    }

    // TS not inferring the type after the check above
    if (isAddition(currentAdditions)) {
      const newAddition = getAddition(additions.length + 1, asRoman)

      const updatedAdditions = [...currentAdditions, newAddition]
      const updatedAnswers = set(
        currentAnswers,
        InputFields.advert.additions,
        updatedAdditions,
      )

      setValue(InputFields.advert.additions, updatedAdditions)
      updateApplication(updatedAnswers)
    }
  }

  const onAdditionChange = (index: number, value: string) => {
    const currentAnswers = structuredClone(currentApplication.answers)
    const updatedAdditions = additions.map((addition, i) =>
      i === index ? { ...addition, content: value } : addition,
    )

    const updatedAnswers = set(
      currentAnswers,
      InputFields.advert.additions,
      updatedAdditions,
    )

    setValue(InputFields.advert.additions, updatedAdditions)
    updateApplication(updatedAnswers)
  }

  const debouncedAdditionChange = debounce(
    onAdditionChange,
    DEBOUNCE_INPUT_TIMER,
  )

  const additionChangeHandler = (index: number, value: string) => {
    debouncedAdditionChange.cancel()
    debouncedAdditionChange(index, value)
  }

  const additions = getAdditions()

  return (
    <Stack space={2}>
      <Text variant="h3">{f(attachments.inputs.radio.title.label)}</Text>
      <Inline space={2}>
        <RadioButton
          label={f(attachments.inputs.radio.numeric.label)}
          name="asNumbers"
          checked={!asRoman}
          onChange={() => onRomanChange(false)}
        />
        <RadioButton
          label={f(attachments.inputs.radio.roman.label)}
          name="asRoman"
          checked={asRoman}
          onChange={() => onRomanChange(true)}
        />
      </Inline>
      <Stack space={4}>
        {additions.map((addition, additionIndex) => {
          const currentAddition = additions.at(additionIndex)

          const defaultValue = currentAddition?.content || ''
          return (
            <Box
              key={addition.id}
              border="standard"
              borderRadius="xs"
              padding={2}
            >
              <Stack space={2}>
                <Text variant="h3">{addition.title}</Text>
                <HTMLEditor
                  controller={false}
                  name="addition"
                  key={addition.id}
                  value={defaultValue as HTMLText}
                  onChange={(value) =>
                    additionChangeHandler(additionIndex, value)
                  }
                />
                <Button
                  variant="utility"
                  colorScheme="destructive"
                  icon="remove"
                  size="small"
                  onClick={() => onRemoveAddition(additionIndex)}
                >
                  {f(attachments.buttons.removeAddition)}
                </Button>
              </Stack>
            </Box>
          )
        })}
        <Inline space={2} flexWrap="wrap">
          <Button
            disabled={additions.length >= MAXIMUM_ADDITIONS_COUNT}
            variant="utility"
            icon="add"
            size="small"
            onClick={onAddAddition}
          >
            {f(attachments.buttons.addAddition)}
          </Button>
        </Inline>
      </Stack>
    </Stack>
  )
}
