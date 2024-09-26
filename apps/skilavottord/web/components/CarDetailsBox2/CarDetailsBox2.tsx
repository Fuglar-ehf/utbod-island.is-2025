import {
  AlertMessage,
  Box,
  Checkbox,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import React, { FC, useState } from 'react'

import { useI18n } from '@island.is/skilavottord-web/i18n'

import {
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'

import {
  OutInUsage,
  PlateInfo,
  UseStatus,
} from '@island.is/skilavottord-web/utils/consts'
import { Controller } from 'react-hook-form'

interface BoxProps {
  vehicleId: string
  vehicleType: string
  modelYear: string
  mileage?: number
  vehicleOwner?: string | null
  vinNumber?: string
  outInStatus: number
  useStatus: string
  reloadFlag: boolean // To force reload of the component to make sure the data in the parent is correct
}

export const CarDetailsBox2: FC<React.PropsWithChildren<BoxProps>> = ({
  vehicleId,
  vehicleType,
  modelYear,
  vehicleOwner,
  vinNumber,
  mileage,
  outInStatus,
  useStatus,
}) => {
  const {
    t: {
      deregisterVehicle: { deregister: t },
    },
  } = useI18n()

  const [missingPlates, setMissingPlates] = useState(false)
  const [lostPlate, setLostPlate] = useState(false)

  return (
    <GridContainer>
      <Stack space={3}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
            >
              <Stack space={1}>
                <Text variant="h3">{vehicleId}</Text>
                <Text variant="h5">{mileage} km</Text>
                <Text>{`${vehicleType}, ${modelYear}`}</Text>
                {vinNumber && <Text variant="small">VIN: {vinNumber}</Text>}
                <Text>{vehicleOwner}</Text>
              </Stack>
            </Box>
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '6/12']}
            paddingTop={[3, 3, 3, 2]}
          >
            <InputController
              id="mileage"
              label={t.currentMileage}
              name="mileage"
              type="number"
              defaultValue={mileage?.toString()}
            />
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span="12/12" paddingTop={[3, 3, 3, 3]}>
            <Text variant="h5">{t.numberplate.sectionTitle}</Text>
          </GridColumn>
        </GridRow>

        {outInStatus === OutInUsage.OUT && (
          <GridRow>
            <GridColumn span="12/12">
              {useStatus !== UseStatus.OUT_TICKET && (
                <AlertMessage
                  type="info"
                  title={t.numberplate.alert.info.title}
                  message={t.numberplate.alert.info.message}
                />
              )}
              {useStatus === UseStatus.OUT_TICKET && (
                <AlertMessage
                  type="warning"
                  title={t.numberplate.alert.warning.title}
                  message={t.numberplate.alert.warning.message}
                />
              )}
            </GridColumn>
          </GridRow>
        )}

        {(outInStatus === OutInUsage.IN ||
          (outInStatus === OutInUsage.OUT &&
            useStatus === UseStatus.OUT_TICKET)) && (
          <GridRow>
            <GridColumn span="12/12">
              <SelectController
                label={t.numberplate.count}
                id="plateCount"
                name="plateCount"
                options={[
                  { label: '0', value: 0 },
                  { label: '1', value: 1 },
                  { label: '2', value: 2 },
                ]}
                onSelect={(option) => {
                  if (option?.value === 2) {
                    setMissingPlates(false)
                    setLostPlate(false)
                  } else {
                    setMissingPlates(true)
                  }
                }}
                defaultValue={2}
              />
            </GridColumn>
          </GridRow>
        )}
        {missingPlates && (
          <GridRow>
            <GridColumn span="12/12">
              <Controller
                name="plateLost"
                render={({ field: { onChange, value, name } }) => {
                  return (
                    <Checkbox
                      large
                      name={name}
                      label={t.numberplate.lost}
                      onChange={() => {
                        if (!lostPlate) {
                          onChange(PlateInfo.PLATE_LOST)
                        } else {
                          onChange()
                        }

                        setLostPlate(!lostPlate)
                      }}
                    />
                  )
                }}
              />
            </GridColumn>
          </GridRow>
        )}

        {lostPlate && (
          <GridRow>
            <GridColumn span="12/12">
              <AlertMessage type="info" message={t.numberplate.missingInfo} />
            </GridColumn>
          </GridRow>
        )}
      </Stack>
    </GridContainer>
  )
}
