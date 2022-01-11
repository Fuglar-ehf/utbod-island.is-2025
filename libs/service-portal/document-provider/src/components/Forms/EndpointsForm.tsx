import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { useForm, Controller } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { Box, Stack, Input, Button } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'

export interface EndpointsFormData {
  endpoint: string
}

interface Props {
  onSubmit: (data: EndpointsFormData) => void
}

export const EndpointsForm: FC<Props> = ({ onSubmit }) => {
  const { formatMessage } = useLocale()
  const { handleSubmit, control, errors } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack space={2}>
        <Controller
          control={control}
          name="endpoint"
          rules={{
            required: {
              value: true,
              message: formatMessage({
                id: 'test',
                defaultMessage: formatMessage(
                  m.SettingsEditEndPointsUrlRequiredMessage,
                ),
              }),
            },
            //TODO get correct url pattern
            pattern: {
              value: /^((?:https?:\/\/)?[^./]+(?:\.[^./]+)+(?:\/.*)?)$/,
              message: formatMessage(
                m.SettingsEditEndPointsUrlWrongFormatMessage,
              ),
            },
          }}
          defaultValue=""
          render={({ onChange, value, name }) => (
            <Input
              size="xs"
              name={name}
              label={formatMessage(m.SettingsEditEndPointsUrl)}
              placeholder={formatMessage(m.SettingsEditEndPointsUrl)}
              value={value}
              hasError={errors.endpoint}
              errorMessage={errors.endpoint?.message}
              onChange={onChange}
            />
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
          <Link to={ServicePortalPath.DocumentProviderSettingsRoot}>
            <Button variant="ghost">
              {formatMessage(m.SettingsEditEndPointsBackButton)}
            </Button>
          </Link>
        </Box>
        <Button type="submit" variant="primary" icon="arrowForward">
          {formatMessage(m.SettingsEditEndPointsSaveButton)}
        </Button>
      </Box>
    </form>
  )
}
