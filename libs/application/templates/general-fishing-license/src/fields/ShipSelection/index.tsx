import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Text,
  Stack,
  Tag,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC, useState } from 'react'
import { ShipInformation, ShipSelectionAlertModal } from '../components'
import { RadioController } from '@island.is/shared/form-fields'
import format from 'date-fns/format'
import { shipSelection } from '../../lib/messages'
import is from 'date-fns/locale/is'
import {
  FishingLicenseShip as Ship,
  FishingLicenseUnfulfilledLicense,
} from '@island.is/api/schema'
import parseISO from 'date-fns/parseISO'
import { useFormContext } from 'react-hook-form'

interface Option {
  value: string
  label: React.ReactNode
  disabled?: boolean
}

export const ShipSelection: FC<FieldBaseProps> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()
  const [showTitle, setShowTitle] = useState<boolean>(false)
  const [visibility, setVisibility] = useState<boolean>(false)
  const [unfulfilledLicenses, setUnfulfilledLicenses] = useState<
    FishingLicenseUnfulfilledLicense[] | null
  >(null)

  const registrationNumberValue = getValueViaPath(
    application.answers,
    'shipSelection.registrationNumber',
  ) as string

  const [registrationNumber, setRegistrationNumber] = useState<string>(
    registrationNumberValue || '',
  )

  const ships = getValueViaPath(
    application.externalData,
    'directoryOfFisheries.data.ships',
  ) as Ship[]

  const shipOptions = (ships: Ship[]) => {
    const options = [] as Option[]
    for (const [index, ship] of ships.entries()) {
      if (ship.fishingLicenses.length !== 0) {
        continue
      }

      const handleShowAlertModal = () => {
        setUnfulfilledLicenses(ship.unfulfilledLicenses)
        setVisibility(true)
      }
      const isDisabled = ship.doesNotFulfillFishingLicenses
      const isExpired = new Date(ship.seaworthiness.validTo) < new Date()
      const seaworthinessDate = format(
        parseISO(ship.seaworthiness.validTo),
        'dd.MM.yy',
        {
          locale: is,
        },
      )
      options.push({
        value: `${index}`,
        label: (
          <>
            <Box width="full" display="flex" justifyContent="spaceBetween">
              <ShipInformation
                ship={ship}
                seaworthinessHasColor
                isExpired={isExpired}
                isDisabled={isDisabled}
              />
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="spaceBetween"
                alignItems="flexEnd"
              >
                <Tag
                  variant={isExpired || isDisabled ? 'disabled' : 'purple'}
                  disabled
                >
                  {formatMessage(shipSelection.tags.noFishingLicensesFound)}
                </Tag>

                {ship.unfulfilledLicenses.length > 0 && (
                  <Box>
                    <Button variant="text" onClick={handleShowAlertModal}>
                      {formatMessage(
                        shipSelection.labels.unfulfilledLicensesButton,
                      )}
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
            {isExpired && (
              <Box marginTop={2}>
                <AlertMessage
                  type="warning"
                  title={formatMessage(shipSelection.labels.expired, {
                    date: seaworthinessDate,
                  })}
                  message={formatMessage(shipSelection.labels.expiredMessage)}
                />
              </Box>
            )}
          </>
        ),
        disabled: isDisabled || isExpired,
      })
    }
    return options
  }

  return (
    <Box marginBottom={2}>
      <RadioController
        id={`${field.id}.ship`}
        largeButtons
        backgroundColor="white"
        error={errors && getErrorViaPath(errors, `${field.id}.ship`)}
        defaultValue={
          (getValueViaPath(application.answers, 'shipSelection') as string[]) ??
          undefined
        }
        onSelect={(value) => {
          const ship = ships[parseInt(value)]
          setRegistrationNumber(ship.registrationNumber.toString())
        }}
        options={shipOptions(ships)}
      />

      {showTitle && (
        <Text variant="h4" paddingY={3}>
          {formatMessage(shipSelection.labels.withFishingLicenseTitle)}
        </Text>
      )}

      {ships?.map((ship: Ship, index: number) => {
        if (ship.fishingLicenses.length === 0) {
          return null
        }
        if (!showTitle) setShowTitle(true)
        return (
          <Box
            border="standard"
            borderRadius="large"
            padding={3}
            width="full"
            display="flex"
            justifyContent="spaceBetween"
            marginBottom={2}
            key={index}
          >
            <ShipInformation ship={ship} />
            <Stack space={1} align="right">
              {ship.fishingLicenses?.map((license) => {
                if (license.code === 'unknown') return null
                return (
                  <Tag variant="blue" disabled key={`${license}`}>
                    {formatMessage(shipSelection.tags[license.code])}
                  </Tag>
                )
              })}
            </Stack>
          </Box>
        )
      })}
      <input
        type="hidden"
        value={registrationNumber}
        ref={register({ required: true })}
        name={`${field.id}.registrationNumber`}
      />
      <ShipSelectionAlertModal
        visibility={visibility}
        setVisibility={setVisibility}
        unfulfilledLicenses={unfulfilledLicenses}
      />
    </Box>
  )
}
