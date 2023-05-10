import { FC, useEffect } from 'react'
import { useFieldArray } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  ProfileCard,
} from '@island.is/island-ui/core'
import { Answers, AssetFormField } from '../../types'

import { m } from '../../lib/messages'
import { EstateAsset } from '@island.is/clients/syslumenn'
import { AdditionalRealEstate } from './AdditionalRealEstate'
import { InputController } from '@island.is/shared/form-fields'

export const RealEstateRepeater: FC<FieldBaseProps<Answers>> = ({
  application,
  field,
  errors,
}) => {
  const error = (errors as any)?.estate?.assets
  const { id } = field
  const { formatMessage } = useLocale()
  const { fields, append, remove, update } = useFieldArray({
    name: id,
  })

  const externalData = application.externalData.syslumennOnEntry?.data as {
    estate: { assets: EstateAsset[] }
  }

  useEffect(() => {
    if (fields.length === 0 && externalData.estate.assets) {
      append(externalData.estate.assets)
    }
  }, [])

  const handleAddProperty = () =>
    append({
      share: 1,
      assetNumber: '',
      description: '',
      initial: false,
      enabled: true,
      marketValue: '',
    })
  const handleRemoveProperty = (index: number) => remove(index)

  return (
    <Box marginTop={2}>
      <GridRow>
        {fields.reduce((acc, asset: AssetFormField, index) => {
          const fieldError = error && error[index] ? error[index] : null

          if (!asset.initial) {
            return acc
          }
          return [
            ...acc,
            <GridColumn
              span={['12/12', '12/12', '6/12']}
              paddingBottom={3}
              key={asset.id}
            >
              <ProfileCard
                disabled={!asset.enabled}
                title={asset.description}
                description={[
                  `${formatMessage(m.propertyNumber)}: ${asset.assetNumber}`,
                  asset.share
                    ? `${formatMessage(m.propertyShare)}: ${asset.share * 100}%`
                    : '',
                  <Box marginTop={1} as="span">
                    <Button
                      variant="text"
                      icon={asset.enabled ? 'remove' : 'add'}
                      size="small"
                      iconType="outline"
                      onClick={() => {
                        const updatedAsset = {
                          ...asset,
                          enabled: !asset.enabled,
                        }
                        update(index, updatedAsset)
                      }}
                    >
                      {asset.enabled
                        ? formatMessage(m.inheritanceDisableMember)
                        : formatMessage(m.inheritanceEnableMember)}
                    </Button>
                  </Box>,
                ]}
              />
              <Box marginTop={2}>
                <InputController
                  id={`${id}[${index}].marketValue`}
                  name={`${id}[${index}].marketValue`}
                  label={formatMessage(m.marketValueTitle)}
                  disabled={!asset.enabled}
                  backgroundColor="blue"
                  placeholder="0 kr."
                  defaultValue={(asset as any).marketValue}
                  error={fieldError?.marketValue}
                  currency
                  size="sm"
                />
              </Box>
            </GridColumn>,
          ]
        }, [] as JSX.Element[])}
      </GridRow>
      {fields.map((field: AssetFormField, index) => (
        <Box key={field.id} hidden={field.initial}>
          <AdditionalRealEstate
            field={field}
            fieldName={id}
            remove={handleRemoveProperty}
            index={index}
            error={error && error[index] ? error[index] : null}
          />
        </Box>
      ))}
      <Box marginTop={1}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddProperty}
          size="small"
        >
          {formatMessage(m.addProperty)}
        </Button>
      </Box>
    </Box>
  )
}

export default RealEstateRepeater
