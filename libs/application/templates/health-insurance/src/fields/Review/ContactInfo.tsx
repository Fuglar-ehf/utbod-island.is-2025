import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { formatText, getValueViaPath } from '@island.is/application/core'
import {
  Box,
  GridColumn,
  GridRow,
  Input,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'
import { m } from '../../forms/messages'
import { ReviewFieldProps } from '../../types'

interface ExternalDataNationalRegistry {
  data: NationalRegistryType
}

interface NationalRegistryType {
  name: string
  nationalId: string
  address: string
  postalCode: string
  city: string
  nationality: string
  email: string
  phoneNumber: string
  mobilePhoneNumber: string
}

const ContactInfo: FC<ReviewFieldProps> = ({ application, isEditable }) => {
  const { register } = useFormContext()
  const { formatMessage } = useLocale()

  const { data } =
    (getValueViaPath(
      application.externalData,
      'nationalRegistry',
    ) as ExternalDataNationalRegistry) || {}

  return (
    <Box marginTop={[0, 0, 1]} marginBottom={[1, 1, 3]}>
      <Stack space={[3, 5]}>
        <Box>
          <Stack space={2}>
            <GridRow>
              <GridColumn span={['12/12', '6/12']} paddingBottom={[2, 2, 0]}>
                <Input
                  id={'applicant.name'}
                  name={'applicant.name'}
                  label={formatText(m.name, application, formatMessage)}
                  ref={register}
                  disabled
                  defaultValue={data?.name}
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <Input
                  id={'applicant.nationalId'}
                  name={'applicant.nationalId'}
                  label={formatText(m.nationalId, application, formatMessage)}
                  ref={register}
                  disabled
                  defaultValue={data?.nationalId}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={['12/12', '6/12']} paddingBottom={[2, 2, 0]}>
                <Input
                  id={'applicant.address'}
                  name={'applicant.address'}
                  label={formatText(m.address, application, formatMessage)}
                  ref={register}
                  disabled
                  defaultValue={data?.address}
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <Input
                  id={'applicant.postalCode'}
                  name={'applicant.postalCode'}
                  label={formatText(m.postalCode, application, formatMessage)}
                  ref={register}
                  disabled
                  defaultValue={data?.postalCode}
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span={['12/12', '6/12']} paddingBottom={[2, 2, 0]}>
                <Input
                  id={'applicant.city'}
                  name={'applicant.city'}
                  label={formatText(m.city, application, formatMessage)}
                  ref={register}
                  disabled
                  defaultValue={data?.city}
                />
              </GridColumn>
            </GridRow>
          </Stack>
          <FieldDescription
            description={formatText(
              m.editNationalRegistryData,
              application,
              formatMessage,
            )}
          />
        </Box>
        <Box>
          <GridRow>
            <GridColumn span={['12/12', '6/12']} paddingBottom={[2, 2, 0]}>
              <Input
                id={'applicant.email'}
                name={'applicant.email'}
                label={formatText(m.email, application, formatMessage)}
                ref={register}
                disabled
                defaultValue={data?.email}
              />
            </GridColumn>
            <GridColumn span={['12/12', '6/12']}>
              <Input
                id={'applicant.phoneNumber'}
                name={'applicant.phoneNumber'}
                label={formatText(m.phoneNumber, application, formatMessage)}
                ref={register}
                disabled
                defaultValue={data?.phoneNumber}
              />
            </GridColumn>
          </GridRow>
          <FieldDescription
            description={formatText(
              m.editDigitalIslandData,
              application,
              formatMessage,
            )}
          />
        </Box>
      </Stack>
    </Box>
  )
}

export default ContactInfo
