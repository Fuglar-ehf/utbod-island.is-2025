import { useContext } from 'react'
import { ControlContext } from '../../../../context/ControlContext'
import { Stack } from '@island.is/island-ui/core'
import { BaseInput } from './components/BaseInput'
import { Preview } from '../Preview/Preveiw'
import { FormSystemField } from '@island.is/api/schema'
import { FieldSettings } from './components/FieldSettings/FieldSettings'
import { ListBuilder } from './components/ListBuilder/ListBuilder'

export const FieldContent = () => {
  const { control, inListBuilder } = useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemField

  if (inListBuilder) {
    return <ListBuilder />
  }
  return (
    <Stack space={2}>
      <BaseInput />
      <FieldSettings />
      {currentItem.fieldType !== 'Default' && <Preview data={currentItem} />}
    </Stack>
  )
}
