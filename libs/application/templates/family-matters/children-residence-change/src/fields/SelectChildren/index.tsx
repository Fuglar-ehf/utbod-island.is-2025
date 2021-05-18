import React from 'react'
import { SelectChildren } from '@island.is/application/templates/family-matters-core/fields'
import { selectChildren } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'

const CRCSelectChildren = ({
  field,
  application,
  error,
}: CRCFieldBaseProps) => {
  const {
    externalData: { nationalRegistry },
    answers,
  } = application
  const { address, children } = nationalRegistry.data
  return (
    <SelectChildren
      id={field.id}
      address={address}
      children={children}
      error={error}
      currentAnswer={answers.selectedChildren}
      translations={{
        title: selectChildren.checkboxes.title,
        description: selectChildren.general.description,
        ineligible: selectChildren.ineligible.text,
        checkBoxSubLabel: selectChildren.checkboxes.subLabel,
      }}
    />
  )
}

export default CRCSelectChildren
