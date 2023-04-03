import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { WrappedActionFn } from '@island.is/portals/core'
import {
  replaceParams,
  validateFormData,
  ValidateFormDataResult,
} from '@island.is/react-spa/shared'
import {
  AuthAdminCreateClientType,
  AuthAdminEnvironment,
} from '@island.is/api/schema'
import {
  CreateClientDocument,
  CreateClientMutation,
  CreateClientMutationVariables,
} from './CreateClient.generated'
import { redirect } from 'react-router-dom'
import { IDSAdminPaths } from '../../../lib/paths'

/**
 * Validates that the applicationId is prefixed with the tenant and that it matches the regex
 * Value can only contain alphanumeric characters, hyphens, underscores, periods and forward slashes.
 */
export const validateClientId = ({
  prefix,
  value,
}: {
  prefix: string
  value: string
}) => new RegExp(`^${prefix}/[a-zA-Z0-9]+([-_/.][a-zA-Z0-9]+)*$`).test(value)

const schema = z
  .object({
    displayName: z.string().nonempty('errorDisplayName'),
    clientId: z.string(),
    tenant: z.string(),
    environments: zfd.repeatable(
      z.array(z.nativeEnum(AuthAdminEnvironment)).nonempty('errorEnvironment'),
    ),
    clientType: z.nativeEnum(AuthAdminCreateClientType, {
      required_error: 'errorClientType',
    }),
  })
  // First refine is to check if the applicationId is prefixed with the tenant and is empty
  .refine((data) => `${data.tenant}/` !== data.clientId, {
    message: 'errorClientId',
    path: ['clientId'],
  })
  // Second refine is to check if the applicationId is prefixed with the tenant and matches the regex
  .refine(
    (data) =>
      validateClientId({
        prefix: data.tenant,
        value: data.clientId,
      }),
    {
      message: 'errorClientIdRegex',
      path: ['clientId'],
    },
  )

export type CreateClientResult =
  | (ValidateFormDataResult<typeof schema> & {
      /**
       * Global error message if the mutation fails
       */
      globalError?: boolean
    })
  | undefined

export const createClientAction: WrappedActionFn = ({ client }) => async ({
  request,
}) => {
  const formData = await request.formData()
  const result = await validateFormData({ formData, schema })

  if (result.errors || !result.data) {
    return result
  }

  const { data } = result
  try {
    await client.mutate<CreateClientMutation, CreateClientMutationVariables>({
      mutation: CreateClientDocument,
      variables: {
        input: {
          displayName: data.displayName,
          clientId: data.clientId,
          environments: data.environments,
          tenantId: data.tenant,
          clientType: data.clientType,
        },
      },
    })

    // TODO: Check for partial creation, and show a warning modal

    return redirect(
      replaceParams({
        href: IDSAdminPaths.IDSAdminClient,
        params: {
          tenant: data?.tenant,
          client: data?.clientId,
        },
      }),
    )
  } catch (e) {
    return {
      errors: null,
      data: null,
      globalError: true,
    }
  }
}
