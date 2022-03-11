import React, { FC } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { RegisteredProperties } from '../RegisteredProperties'
import { SearchProperties } from '../SearchProperties'
import { PropertyDetail } from '../../../types/schema'

export const PropertiesManager: FC<FieldBaseProps> = ({
  application,
  field,
}) => {
  const { externalData } = application
  const { id } = field
  const { setValue } = useFormContext()

  const myProperties =
    (externalData.nationalRegistryRealEstate?.data as {
      properties: [PropertyDetail]
    })?.properties || []

  const selectedPropertyNumber = getValueViaPath(
    application.answers,
    'selectProperty.propertyNumber',
  ) as string

  const defaultProperty = myProperties[0]

  return (
    <Controller
      name="selectProperty.propertyNumber"
      defaultValue={selectedPropertyNumber || defaultProperty?.propertyNumber}
      render={({ value, onChange }) => {
        return (
          <>
            <RegisteredProperties
              application={application}
              field={field}
              selectHandler={(p: PropertyDetail | undefined) => {
                onChange(p?.propertyNumber)
                setValue(id, {
                  propertyNumber: p?.propertyNumber,
                  isFromSearch: false,
                })
              }}
              selectedPropertyNumber={value}
            />
            <SearchProperties
              application={application}
              field={field}
              selectHandler={(p: PropertyDetail | undefined) => {
                onChange(p?.propertyNumber)
                setValue(id, {
                  propertyNumber: p?.propertyNumber,
                  isFromSearch: true,
                })
              }}
              selectedPropertyNumber={value}
            />
          </>
        )
      }}
    />
  )
}
