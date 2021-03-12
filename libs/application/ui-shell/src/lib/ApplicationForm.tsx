import React, { FC, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { APPLICATION_APPLICATION } from '@island.is/application/graphql'
import { RefetchProvider } from '../context/RefetchContext'

import {
  Application,
  ApplicationTemplateHelper,
  Form,
  Schema,
  coreMessages,
} from '@island.is/application/core'
import {
  getApplicationTemplateByTypeId,
  getApplicationUIFields,
} from '@island.is/application/template-loader'
import { useApplicationNamespaces, useLocale } from '@island.is/localization'
import { Box, LoadingIcon } from '@island.is/island-ui/core'

import { FormShell } from './FormShell'
import { FieldProvider, useFields } from '../components/FieldContext'
import { NotFound } from './NotFound'
import * as styles from './FormShell.treat'

function isOnProduction(): boolean {
  // TODO detect better when the application system is on production
  return false
}

const ApplicationLoader: FC<{
  applicationId: string
  nationalRegistryId: string
}> = ({ applicationId, nationalRegistryId }) => {
  const { data, error, loading, refetch } = useQuery(APPLICATION_APPLICATION, {
    variables: {
      input: {
        id: applicationId,
      },
    },
    // Setting this so that refetch causes a re-render
    // https://github.com/apollographql/react-apollo/issues/321#issuecomment-599087392
    // We want to refetch after setting the application back to 'draft', so that
    // it loads the correct form for the 'draft' state.
    notifyOnNetworkStatusChange: true,
    skip: !applicationId,
  })
  const application = data?.applicationApplication

  if (!applicationId || error) {
    return <NotFound />
  }

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="full"
        className={styles.root}
      >
        <LoadingIcon animate color="blue400" size={50} />
      </Box>
    )
  }

  return (
    <RefetchProvider
      value={() => {
        refetch()
      }}
    >
      <ShellWrapper
        application={application}
        nationalRegistryId={nationalRegistryId}
      />
    </RefetchProvider>
  )
}

const ShellWrapper: FC<{
  application: Application
  nationalRegistryId: string
}> = ({ application, nationalRegistryId }) => {
  const [dataSchema, setDataSchema] = useState<Schema>()
  const [form, setForm] = useState<Form>()
  const [, fieldsDispatch] = useFields()
  const { formatMessage } = useLocale()

  useApplicationNamespaces(application.typeId)

  useEffect(() => {
    async function populateForm() {
      if (dataSchema === undefined && form === undefined) {
        const template = await getApplicationTemplateByTypeId(
          application.typeId,
        )
        if (
          template !== null &&
          !(isOnProduction() && !template.readyForProduction)
        ) {
          const helper = new ApplicationTemplateHelper(application, template)
          const stateInformation =
            helper.getApplicationStateInformation() || null
          if (stateInformation?.roles?.length) {
            const applicationFields = await getApplicationUIFields(
              application.typeId,
            )
            const role = template.mapUserToRole(nationalRegistryId, application)
            if (!role) {
              throw new Error(formatMessage(coreMessages.userRoleError))
            }
            const currentRole = stateInformation.roles.find(
              (r) => r.id === role,
            )
            if (currentRole && currentRole.formLoader) {
              const formDescriptor = await currentRole.formLoader()
              setForm(formDescriptor)
              setDataSchema(template.dataSchema)
              fieldsDispatch(applicationFields)
            }
          }
        }
      }
    }
    populateForm()
  }, [
    fieldsDispatch,
    application,
    form,
    nationalRegistryId,
    dataSchema,
    formatMessage,
  ])

  if (!form || !dataSchema) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="full"
        className={styles.root}
      >
        <LoadingIcon animate color="blue400" size={50} />
      </Box>
    )
  }

  return (
    <FormShell
      application={application}
      dataSchema={dataSchema}
      form={form}
      nationalRegistryId={nationalRegistryId}
    />
  )
}

export const ApplicationForm: FC<{
  applicationId: string
  nationalRegistryId: string
}> = ({ applicationId, nationalRegistryId }) => {
  return (
    <FieldProvider>
      <ApplicationLoader
        applicationId={applicationId}
        nationalRegistryId={nationalRegistryId}
      />
    </FieldProvider>
  )
}
