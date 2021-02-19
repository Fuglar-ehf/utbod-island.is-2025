import React, { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { Box, Input, Stack, Button } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { Organisation } from '@island.is/api/schema'
import {
  OrganisationInput,
  useUpdateOrganisation,
} from '../../shared/useUpdateOrganisation'

export interface InstitutionFormData {
  name: string
  nationalId: string
  address: string
  email: string
  tel: string
}

interface Props {
  organisation: Organisation
}

export const InstitutionForm: FC<Props> = ({ organisation }) => {
  const { handleSubmit, control, errors } = useForm()
  const { formatMessage } = useLocale()
  const { updateOrganisation, loading } = useUpdateOrganisation()

  const onSubmit = (formData: Organisation) => {
    if (formData) {
      const input: OrganisationInput = {
        ...formData,
        id: organisation?.id || '',
      }
      updateOrganisation(input)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack space={2}>
        <Controller
          control={control}
          name="name"
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditInstitutionNameRequiredMessage,
              ),
            },
          }}
          defaultValue={organisation?.name || ''}
          render={({ onChange, value, name }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditInstitutionName)}
              placeholder={formatMessage(m.SettingsEditInstitutionName)}
              value={value}
              onChange={onChange}
              hasError={errors.name}
              errorMessage={errors.name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="nationalId"
          defaultValue={organisation?.nationalId || ''}
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditInstitutionNationalIdRequiredMessage,
              ),
            },
            pattern: {
              value: /([0-9]){6}-?([0-9]){4}/,
              message: formatMessage(
                m.SettingsEditInstitutionNationalIdWrongFormatMessage,
              ),
            },
          }}
          render={({ onChange, value, name }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditInstitutionNationalId)}
              value={value}
              placeholder={formatMessage(m.SettingsEditInstitutionNationalId)}
              onChange={onChange}
              hasError={errors.nationalId}
              errorMessage={errors.nationalId?.message}
            ></Input>
          )}
        />
        <Controller
          control={control}
          name="address"
          defaultValue={organisation?.address || ''}
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditInstitutionAddressRequiredMessage,
              ),
            },
          }}
          render={({ onChange, value, name }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditInstitutionAddress)}
              value={value}
              placeholder={formatMessage(m.SettingsEditInstitutionAddress)}
              onChange={onChange}
              hasError={errors.address}
              errorMessage={errors.address?.message}
            ></Input>
          )}
        />
        <Controller
          control={control}
          name="email"
          defaultValue={organisation?.email || ''}
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditInstitutionEmailRequiredMessage,
              ),
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: formatMessage(
                m.SettingsEditInstitutionEmailWrongFormatMessage,
              ),
            },
          }}
          render={({ onChange, value, name }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditInstitutionEmail)}
              placeholder={formatMessage(m.SettingsEditInstitutionEmail)}
              value={value}
              onChange={onChange}
              hasError={errors.email}
              errorMessage={errors.email?.message}
            ></Input>
          )}
        />
        <Controller
          control={control}
          name="phoneNumber"
          defaultValue={organisation?.phoneNumber || ''}
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditInstitutionTelRequiredMessage,
              ),
            },
            pattern: {
              value: /^\d{3}[\d- ]*$/,
              message: formatMessage(
                m.SettingsEditInstitutionTelWrongFormatMessage,
              ),
            },
          }}
          render={({ onChange, value, name }) => (
            <Input
              name={name}
              label={formatMessage(m.SettingsEditInstitutionTel)}
              placeholder={formatMessage(m.SettingsEditInstitutionTel)}
              value={value}
              onChange={onChange}
              hasError={errors.phoneNumber}
              errorMessage={errors.phoneNumber?.message}
            ></Input>
          )}
        />
      </Stack>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
        flexDirection={['columnReverse', 'row']}
        marginTop={4}
      >
        <Box marginTop={[1, 0]}>
          {/* <Link to={ServicePortalPath.DocumentProviderSettingsRoot}>
            <Button variant="ghost">
              {formatMessage(m.SettingsEditInstitutionBackButton)}
            </Button>
          </Link> */}
        </Box>
        <Button
          type="submit"
          variant="primary"
          icon="arrowForward"
          loading={loading}
        >
          {formatMessage(m.SettingsEditInstitutionSaveButton)}
        </Button>
      </Box>
    </form>
  )
}
