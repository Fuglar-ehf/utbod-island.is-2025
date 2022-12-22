import { Box, SkeletonLoader, Tag, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC, useState } from 'react'
import { VehiclesCurrentVehicleWithDebtStatus } from '@island.is/api/schema'
import { information } from '../../lib/messages'
import { RadioController } from '@island.is/shared/form-fields'
import { gql, useQuery } from '@apollo/client'
import { GET_CURRENT_VEHICLES_WITH_DEBT_STATUS } from '../../graphql/queries'
import { useFormContext } from 'react-hook-form'
import { getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { VehiclesCurrentVehicle } from '../../types'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

interface VehicleSearchFieldProps {
  currentVehicleList: VehiclesCurrentVehicle[]
}

export const VehicleRadioField: FC<
  VehicleSearchFieldProps & FieldBaseProps
> = ({ currentVehicleList, application }) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()

  const [plate, setPlate] = useState<string>(
    getValueViaPath(application.answers, 'pickVehicle.plate', '') as string,
  )
  const [color, setColor] = useState<string | undefined>(
    getValueViaPath(application.answers, 'pickVehicle.color', undefined) as
      | string
      | undefined,
  )

  const { data, loading } = useQuery(
    gql`
      ${GET_CURRENT_VEHICLES_WITH_DEBT_STATUS}
    `,
    {
      variables: {
        input: {
          showOwned: true,
          showCoowned: false,
          showOperated: false,
        },
      },
    },
  )

  const onRadioControllerSelect = (s: string) => {
    const currentVehicle = currentVehicleList[parseInt(s, 10)]
    setPlate(currentVehicle.permno || '')
    setColor(currentVehicle.color || undefined)
  }

  const vehicleOptions = (vehicles: VehiclesCurrentVehicleWithDebtStatus[]) => {
    const options = [] as Option[]

    for (const [index, vehicle] of vehicles.entries()) {
      const disabled = !!vehicle.isStolen || !vehicle.isDebtLess
      options.push({
        value: `${index}`,
        label: (
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <Box>
              <Text variant="default" color={disabled ? 'dark200' : 'dark400'}>
                {vehicle.make}
              </Text>
              <Text variant="small" color={disabled ? 'dark200' : 'dark400'}>
                {vehicle.color} - {vehicle.permno}
              </Text>
            </Box>
            <Box display="flex" flexDirection="row" wrap="wrap">
              {vehicle.isStolen && (
                <Tag variant="red">
                  {formatMessage(information.labels.pickVehicle.isStolenTag)}
                </Tag>
              )}
              {!vehicle.isDebtLess && (
                <Box paddingLeft={2}>
                  <Tag variant="red">
                    {formatMessage(
                      information.labels.pickVehicle.isNotDebtLessTag,
                    )}
                  </Tag>
                </Box>
              )}
            </Box>
          </Box>
        ),
        disabled: disabled,
      })
    }
    return options
  }

  return (
    <div>
      {loading ? (
        <SkeletonLoader
          height={100}
          space={2}
          repeat={currentVehicleList.length}
          borderRadius="large"
        />
      ) : (
        <RadioController
          id="pickVehicle.vehicle"
          largeButtons
          backgroundColor="blue"
          onSelect={onRadioControllerSelect}
          options={vehicleOptions(
            data.currentVehiclesWithDebtStatus as VehiclesCurrentVehicleWithDebtStatus[],
          )}
        />
      )}
      <input
        type="hidden"
        value={plate}
        ref={register({ required: true })}
        name="pickVehicle.plate"
      />
      <input
        type="hidden"
        value={color}
        ref={register({ required: true })}
        name="pickVehicle.color"
      />
    </div>
  )
}
