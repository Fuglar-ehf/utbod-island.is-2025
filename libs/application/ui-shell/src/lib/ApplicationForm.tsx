import React, { FC, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

import { APPLICATION_APPLICATION } from '@island.is/application/graphql'

import {
  ApplicationTemplateHelper,
  coreMessages,
  getTypeFromSlug,
} from '@island.is/application/core'
import {
  Application,
  ApplicationConfigurations,
  ApplicationFormTypes,
  ApplicationTypes,
  Form,
  Schema,
} from '@island.is/application/types'
import {
  getApplicationTemplateByTypeId,
  getApplicationUIFields,
} from '@island.is/application/template-loader'
import { useLocale } from '@island.is/localization'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'

import { RefetchProvider } from '../context/RefetchContext'
import { FieldProvider, useFields } from '../context/FieldContext'
import { LoadingShell } from '../components/LoadingShell'
import { useApplicationNamespaces } from '../hooks/useApplicationNamespaces'
import { FormShell } from './FormShell'
import { ErrorShell } from '../components/ErrorShell'
import {
  ProblemType,
  findProblemInApolloError,
} from '@island.is/shared/problem'
import { DelegationsScreen } from '../components/DelegationsScreen'
import { generateZodSchema } from './jsonStuff/jsonToDataSchema'
import { FormTypeConverter } from './FormyTypeConverter'

const ApplicationLoader: FC<
  React.PropsWithChildren<{
    applicationId: string
    nationalRegistryId: string
    slug: string
    useJSON: boolean
  }>
> = ({ applicationId, nationalRegistryId, slug, useJSON = false }) => {
  const type = getTypeFromSlug(slug)
  const [delegationsChecked, setDelegationsChecked] = useState(
    type ? false : true,
  )

  const { lang: locale } = useLocale()
  const { data, error, loading, refetch } = useQuery(APPLICATION_APPLICATION, {
    variables: {
      input: {
        id: applicationId,
      },
      locale,
    },
    // Setting this so that refetch causes a re-render
    // https://github.com/apollographql/react-apollo/issues/321#issuecomment-599087392
    // We want to refetch after setting the application back to 'draft', so that
    // it loads the correct form for the 'draft' state.
    notifyOnNetworkStatusChange: true,
    skip: !applicationId,
  })

  const application = data?.applicationApplication

  if (loading) {
    return <LoadingShell />
  }

  const currentTypeId: ApplicationTypes = application?.typeId

  if (ApplicationConfigurations[currentTypeId]?.slug !== slug) {
    return <ErrorShell errorType="idNotFound" />
  }

  if (!applicationId || error) {
    const foundError = findProblemInApolloError(error, [
      ProblemType.BAD_SUBJECT,
    ])
    if (
      foundError?.type === ProblemType.BAD_SUBJECT &&
      type &&
      !delegationsChecked
    ) {
      return (
        <DelegationsScreen
          slug={slug}
          alternativeSubjects={foundError.alternativeSubjects}
          checkDelegation={setDelegationsChecked}
        />
      )
    }
    return <ErrorShell />
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
        useJSON={useJSON}
      />
    </RefetchProvider>
  )
}

interface ShellWrapperProps {
  application: Application
  nationalRegistryId: string
  useJSON?: boolean
}

const ShellWrapper: FC<ShellWrapperProps> = ({
  application,
  nationalRegistryId,
  useJSON = false,
}) => {
  const [dataSchema, setDataSchema] = useState<Schema>()
  const [form, setForm] = useState<Form>()
  const [, fieldsDispatch] = useFields()
  const { formatMessage } = useLocale()
  const featureFlagClient = useFeatureFlagClient()
  const applicationType = application.typeId as ApplicationTypes

  const config = ApplicationConfigurations[applicationType]

  useApplicationNamespaces(application.typeId)

  useEffect(() => {
    async function populateForm() {
      if (dataSchema === undefined && form === undefined) {
        if (
          config.formType === ApplicationFormTypes.DYNAMIC &&
          application.form
        ) {
          const converter = new FormTypeConverter()
          const formFromJSON = JSON.parse(
            JSON.stringify(application.form),
          ) as unknown as Form
          const ffooorm = converter.convertIForm(application.form)

          const dataSchemaFromJSON = generateZodSchema(formFromJSON)
          setForm(ffooorm)
          setDataSchema(dataSchemaFromJSON)
        } else {
          const template = await getApplicationTemplateByTypeId(
            application.typeId,
          )
          if (template !== null) {
            const helper = new ApplicationTemplateHelper(application, template)
            const stateInformation =
              helper.getApplicationStateInformation() || null

            if (stateInformation?.roles?.length) {
              const role = template.mapUserToRole(
                nationalRegistryId,
                application,
              )

              if (!role) {
                throw new Error(formatMessage(coreMessages.userRoleError))
              }

              const currentRole = stateInformation.roles.find(
                (r) => r.id === role,
              )

              const applicationFields = await getApplicationUIFields(
                application.typeId,
              )
              if (currentRole && currentRole.formLoader) {
                const formDescriptor = await currentRole.formLoader({
                  featureFlagClient,
                })

                setForm(formDescriptor)
                setDataSchema(template.dataSchema)
                fieldsDispatch(applicationFields)
              }
            }
          }
        }
      }
    }
    populateForm()
  }, [
    config.formType,
    fieldsDispatch,
    application,
    form,
    nationalRegistryId,
    dataSchema,
    formatMessage,
    featureFlagClient,
    useJSON,
  ])

  if (!form || !dataSchema) {
    return <LoadingShell />
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

export const ApplicationForm: FC<
  React.PropsWithChildren<{
    applicationId: string
    nationalRegistryId: string
    slug: string
    useJSON: boolean
  }>
> = ({ applicationId, nationalRegistryId, slug, useJSON }) => {
  return (
    <FieldProvider>
      <ApplicationLoader
        applicationId={applicationId}
        nationalRegistryId={nationalRegistryId}
        slug={slug}
        useJSON={useJSON}
      />
    </FieldProvider>
  )
}
