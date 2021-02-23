import React, { FC } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { Box, Stack, Input, Button } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { Contact } from '@island.is/api/schema'
import {
  ContactInput,
  useUpdateTechnicalContact,
} from '../../shared/useUpdateTechnicalContact'

export interface TechnicalContactFormData {
  name: string
  email: string
  tel: string
}

interface Props {
  organisationId: string
  technicalContact: Contact
}
export const TechnicalContactForm: FC<Props> = ({
  organisationId,
  technicalContact,
}) => {
  const { handleSubmit, control, errors } = useForm()
  const { formatMessage } = useLocale()
  const { updateTechnicalContact, loading } = useUpdateTechnicalContact(
    organisationId,
  )

  const onSubmit = (contact: Contact) => {
    if (contact) {
      const input: ContactInput = {
        ...contact,
        id: technicalContact?.id,
      }
      updateTechnicalContact(input)
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack space={2}>
        <Controller
          control={control}
          name="name"
          defaultValue={technicalContact?.name || ''}
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditTechnicalContactNameRequiredMessage,
              ),
            },
          }}
          render={({ onChange, name, value }) => (
            <Input
              label={formatMessage(m.SettingsEditTechnicalContactName)}
              placeholder={formatMessage(m.SettingsEditTechnicalContactName)}
              name={name}
              value={value}
              onChange={onChange}
              hasError={errors.name}
              errorMessage={errors.name?.message}
            ></Input>
          )}
        />
        <Controller
          control={control}
          name="email"
          defaultValue={technicalContact?.email || ''}
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditTechnicalContactEmailRequiredMessage,
              ),
            },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: formatMessage(
                m.SettingsEditTechnicalContactEmailWrongFormatMessage,
              ),
            },
          }}
          render={({ onChange, name, value }) => (
            <Input
              label={formatMessage(m.SettingsEditTechnicalContactEmail)}
              placeholder={formatMessage(m.SettingsEditTechnicalContactEmail)}
              name={name}
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
          defaultValue={technicalContact?.phoneNumber || ''}
          rules={{
            required: {
              value: true,
              message: formatMessage(
                m.SettingsEditTechnicalContactTelRequiredMessage,
              ),
            },
            pattern: {
              value: /^\d{3}[\d- ]*$/,
              message: formatMessage(
                m.SettingsEditTechnicalContactTelWrongFormatMessage,
              ),
            },
          }}
          render={({ onChange, name, value }) => (
            <Input
              label={formatMessage(m.SettingsEditTechnicalContactTel)}
              placeholder={formatMessage(m.SettingsEditTechnicalContactTel)}
              name={name}
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
              {formatMessage(m.SettingsEditTechnicalContactBackButton)}
            </Button>
          </Link> */}
        </Box>
        <Button
          type="submit"
          variant="primary"
          icon="arrowForward"
          loading={loading}
        >
          {formatMessage(m.SettingsEditTechnicalContactSaveButton)}
        </Button>
      </Box>
    </form>
  )
}
