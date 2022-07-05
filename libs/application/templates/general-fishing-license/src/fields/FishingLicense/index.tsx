import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, SkeletonLoader, Tag, Text } from '@island.is/island-ui/core'
import React, { FC, useState } from 'react'
import { FishingLicenseAlertMessage, ShipInformation } from '../components'
import {
  FishingLicenseLicense as FishingLicenseSchema,
  FishingLicenseShip as Ship,
} from '@island.is/api/schema'
import { useQuery } from '@apollo/client'
import { queryFishingLicense } from '../../graphql/queries'
import { RadioController } from '@island.is/shared/form-fields'
import { fishingLicense, shipSelection } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useFormContext } from 'react-hook-form'

export const FishingLicense: FC<FieldBaseProps> = ({
  application,
  field,
  errors,
}) => {
  const { formatMessage } = useLocale()
  const { register } = useFormContext()
  const [chargeType, setChargeType] = useState<string>('')

  const ships = getValueViaPath(
    application.externalData,
    'directoryOfFisheries.data.ships',
  ) as Ship[]
  const shipIndex = getValueViaPath(
    application.answers,
    'shipSelection.ship',
    '0',
  ) as string
  const registrationNumber = getValueViaPath(
    application.answers,
    'shipSelection.registrationNumber',
  ) as string

  const { data, loading } = useQuery(queryFishingLicense, {
    variables: {
      registrationNumber: parseInt(registrationNumber),
    },
  })

  const ship = ships[parseInt(shipIndex)]
  const isExpired = new Date(ship.seaworthiness.validTo) < new Date()
  const hasDeprivations = ship.deprivations.length > 0

  const handleOnSelect = (value: string) => {
    const selectedLicense = data?.fishingLicenses?.find(
      ({ fishingLicenseInfo }: FishingLicenseSchema) =>
        fishingLicenseInfo.code === value,
    ) as FishingLicenseSchema

    if (selectedLicense)
      setChargeType(selectedLicense.fishingLicenseInfo.chargeType)
  }
  return (
    <>
      <Box marginBottom={3}>
        <Box
          border="standard"
          borderRadius="large"
          padding={3}
          width="full"
          display="flex"
          justifyContent="spaceBetween"
        >
          <ShipInformation ship={ship} seaworthinessHasColor />
          <Box>
            <Tag
              variant={isExpired || hasDeprivations ? 'disabled' : 'purple'}
              disabled
            >
              {formatMessage(shipSelection.tags.noFishingLicensesFound)}
            </Tag>
          </Box>
        </Box>
      </Box>
      <Box>
        <Text variant="h4" marginBottom={3}>
          {formatMessage(fishingLicense.labels.radioButtonTitle)}
        </Text>
        {loading ? (
          <SkeletonLoader
            repeat={2}
            space={2}
            height={75}
            borderRadius="standard"
          />
        ) : (
          <>
            <RadioController
              id={`${field.id}.license`}
              largeButtons
              backgroundColor="blue"
              error={errors && getErrorViaPath(errors, `${field.id}.license`)}
              onSelect={(value) => handleOnSelect(value)}
              options={data?.fishingLicenses
                ?.filter(({ answer }: FishingLicenseSchema) => answer)
                .map(({ fishingLicenseInfo }: FishingLicenseSchema) => {
                  return {
                    value: fishingLicenseInfo.code,
                    label:
                      fishingLicenseInfo.code === 'unknown'
                        ? fishingLicenseInfo.name
                        : formatMessage(
                            fishingLicense.labels[fishingLicenseInfo.code],
                          ),
                    tooltip:
                      fishingLicenseInfo.code === 'unknown'
                        ? ''
                        : formatMessage(
                            fishingLicense.tooltips[fishingLicenseInfo.code],
                          ),
                  }
                })}
            />
            {data?.fishingLicenses.map(
              ({
                fishingLicenseInfo,
                answer,
                reasons,
              }: FishingLicenseSchema) => {
                if (
                  answer ||
                  reasons.length === 0 ||
                  fishingLicenseInfo.code === 'unknown'
                )
                  return null
                return (
                  <Box marginBottom={2} key={fishingLicenseInfo.code}>
                    <FishingLicenseAlertMessage
                      title={formatMessage(
                        fishingLicense.warningMessageTitle[
                          fishingLicenseInfo.code
                        ],
                      )}
                      description={formatMessage(
                        fishingLicense.warningMessageDescription[
                          fishingLicenseInfo.code
                        ],
                      )}
                      reasons={reasons}
                    />
                  </Box>
                )
              },
            )}
          </>
        )}
        <input
          type="hidden"
          ref={register({ required: true })}
          id={`${field.id}.chargeType`}
          name={`${field.id}.chargeType`}
          value={chargeType}
        />
      </Box>
    </>
  )
}
