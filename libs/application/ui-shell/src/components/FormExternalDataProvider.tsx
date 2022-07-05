import React, { FC, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Controller, useFormContext } from 'react-hook-form'
import Markdown from 'markdown-to-jsx'

import {
  AlertMessage,
  Box,
  Checkbox,
  Icon,
  InputError,
  Text,
} from '@island.is/island-ui/core'
import {
  getValueViaPath,
  coreMessages,
  coreErrorMessages,
  getErrorReasonIfPresent,
  isTranslationObject,
} from '@island.is/application/core'
import {
  DataProviderItem,
  DataProviderPermissionItem,
  DataProviderResult,
  ExternalData,
  FormValue,
  RecordObject,
  SetBeforeSubmitCallback,
  StaticText,
} from '@island.is/application/types'
import { UPDATE_APPLICATION_EXTERNAL_DATA } from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'

import { ExternalDataProviderScreen } from '../types'
import { verifyExternalData, hideSubmitErrorExternalData } from '../utils'

const ItemHeader: React.FC<{ title: StaticText; subTitle?: StaticText }> = ({
  title,
  subTitle,
}) => {
  const { formatMessage } = useLocale()

  return (
    <>
      <Text variant="h4" color="blue400">
        {formatMessage(title)}
      </Text>

      {subTitle && (
        <Text>
          <Markdown>{formatMessage(subTitle)}</Markdown>
        </Text>
      )}
    </>
  )
}

const ProviderItem: FC<{
  dataProviderResult: DataProviderResult
  provider: DataProviderItem
  suppressProviderError: boolean
}> = ({ dataProviderResult = {}, provider, suppressProviderError }) => {
  const { title, subTitle } = provider
  const { formatMessage } = useLocale()

  const showError =
    provider.type &&
    dataProviderResult?.status === 'failure' &&
    !suppressProviderError

  const errorCode = dataProviderResult?.statusCode ?? 500
  const errorType = errorCode < 500 ? 'warning' : 'error'
  const { title: errorTitle, summary } = getErrorReasonIfPresent(
    dataProviderResult?.reason,
  )

  return (
    <Box marginBottom={3}>
      <ItemHeader title={title} subTitle={subTitle} />

      {showError && (
        <Box marginTop={2}>
          <AlertMessage
            type={errorType}
            title={
              isTranslationObject(errorTitle)
                ? formatMessage(errorTitle)
                : (errorTitle as string)
            }
            message={
              isTranslationObject(summary) ? formatMessage(summary) : summary
            }
          />
        </Box>
      )}
    </Box>
  )
}

const PermissionItem: FC<{
  permission: DataProviderPermissionItem
}> = ({ permission }) => {
  const { title, subTitle } = permission

  return (
    <Box marginBottom={3}>
      <ItemHeader title={title} subTitle={subTitle} />
    </Box>
  )
}

// TODO: generate these interfaces with graphql codegen
interface UpdateApplicationExternalDataResponse {
  updateApplicationExternalData: {
    externalData: ExternalData
  }
}

const getExternalDataFromResponse = (
  responseData: UpdateApplicationExternalDataResponse,
) => responseData?.updateApplicationExternalData?.externalData

const FormExternalDataProvider: FC<{
  applicationId: string
  addExternalData(data: ExternalData): void
  setBeforeSubmitCallback: SetBeforeSubmitCallback
  externalData: ExternalData
  externalDataProvider: ExternalDataProviderScreen
  formValue: FormValue
  errors: RecordObject
}> = ({
  addExternalData,
  setBeforeSubmitCallback,
  applicationId,
  externalData,
  externalDataProvider,
  formValue,
  errors,
}) => {
  const { formatMessage, lang: locale } = useLocale()
  const { setValue, clearErrors } = useFormContext()
  const [updateExternalData] = useMutation(UPDATE_APPLICATION_EXTERNAL_DATA, {
    onCompleted(responseData: UpdateApplicationExternalDataResponse) {
      addExternalData(getExternalDataFromResponse(responseData))
    },
  })

  const {
    id,
    dataProviders,
    otherPermissions,
    subTitle,
    description,
    checkboxLabel,
  } = externalDataProvider
  const relevantDataProviders = dataProviders.filter((p) => p.type)

  const [suppressProviderErrors, setSuppressProviderErrors] = useState(true)

  // If id is undefined then the error won't be attached to the field with id
  const error = getValueViaPath(errors, id ?? '', undefined) as
    | string
    | undefined

  const activateBeforeSubmitCallback = (checked: boolean) => {
    if (checked) {
      setBeforeSubmitCallback(async () => {
        const response = await updateExternalData({
          variables: {
            input: {
              id: applicationId,
              dataProviders: relevantDataProviders.map(({ id, type }) => ({
                id,
                type,
              })),
            },
            locale,
          },
        })
        setSuppressProviderErrors(false)

        if (
          response.data &&
          verifyExternalData(
            getExternalDataFromResponse(response.data),
            relevantDataProviders,
          )
        ) {
          return [true, null]
        }

        const showSubmitError =
          response.data &&
          !hideSubmitErrorExternalData(
            getExternalDataFromResponse(response.data),
            relevantDataProviders,
          )

        return [
          false,
          showSubmitError
            ? formatMessage(coreErrorMessages.failedDataProviderSubmit)
            : '',
        ]
      })
    } else {
      setBeforeSubmitCallback(null)
    }
  }

  return (
    <Box>
      <Box marginTop={2} marginBottom={5}>
        <Box display="flex" alignItems="center" justifyContent="flexStart">
          <Box marginRight={1}>
            <Icon
              icon="fileTrayFull"
              size="medium"
              color="blue400"
              type="outline"
            />
          </Box>
          <Text variant="h4">
            {subTitle
              ? formatMessage(subTitle)
              : formatMessage(coreMessages.externalDataTitle)}
          </Text>
        </Box>
        {description && <Text marginTop={4}>{formatMessage(description)}</Text>}
      </Box>
      <Box marginBottom={5}>
        {dataProviders.map((provider) => (
          <ProviderItem
            provider={provider}
            key={provider.id}
            suppressProviderError={suppressProviderErrors}
            dataProviderResult={externalData[provider.id]}
          />
        ))}
        {otherPermissions &&
          otherPermissions.map((permission) => (
            <PermissionItem permission={permission} key={permission.id} />
          ))}
      </Box>
      <Controller
        name={`${id}`}
        defaultValue={getValueViaPath(formValue, id as string, false)}
        rules={{ required: true }}
        render={({ value, onChange }) => {
          return (
            <>
              <Checkbox
                large={true}
                onChange={(e) => {
                  const isChecked = e.target.checked
                  clearErrors(id)
                  setValue(id as string, isChecked)
                  onChange(isChecked)
                  activateBeforeSubmitCallback(isChecked)
                }}
                checked={value}
                hasError={error !== undefined}
                backgroundColor="blue"
                name={`${id}`}
                label={
                  <Markdown>
                    {checkboxLabel
                      ? formatMessage(checkboxLabel)
                      : formatMessage(coreMessages.externalDataAgreement)}
                  </Markdown>
                }
                value={id}
              />

              {error !== undefined && <InputError errorMessage={error} />}
            </>
          )
        }}
      />
    </Box>
  )
}

export default FormExternalDataProvider
