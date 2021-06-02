import React, { FC } from 'react'
import {
  RepeaterProps,
  getValueViaPath,
  Application,
  RecordObject,
} from '@island.is/application/core'

import { useFields } from '../context/FieldContext'
import { RepeaterScreen } from '../types'

type RepeaterItems = unknown[]

const FormRepeater: FC<{
  application: Application
  repeater: RepeaterScreen
  errors: RecordObject
  expandRepeater: () => void
  onRemoveRepeaterItem: (newRepeaterItems: RepeaterItems) => Promise<unknown>
}> = ({
  application,
  errors,
  expandRepeater,
  onRemoveRepeaterItem,
  repeater,
}) => {
  const [allFields] = useFields()
  if (!repeater.isNavigable) {
    return null
  }

  const error = getValueViaPath(errors, repeater.id, undefined) as
    | string
    | undefined

  const repeaterItems = getValueViaPath(
    application.answers,
    repeater.id,
    [],
  ) as RepeaterItems

  async function removeRepeaterItem(index: number) {
    if (index >= 0 && index < repeaterItems.length) {
      const newRepeaterItems = [
        ...repeaterItems.slice(0, index),
        ...repeaterItems.slice(index + 1),
      ]
      await onRemoveRepeaterItem(newRepeaterItems)
    }
  }

  const repeaterProps: RepeaterProps = {
    expandRepeater,
    error,
    repeater,
    application,
    removeRepeaterItem,
  }
  const Component = allFields[repeater.component] as
    | FC<RepeaterProps>
    | undefined
  if (!Component) {
    return <p>We have not implemented this repeater yet {repeater.type}</p>
  }

  return <Component {...repeaterProps} />
}

export default FormRepeater
