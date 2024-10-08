import type { WrappedLoaderFn } from '@island.is/portals/core'
import { FormSystemFormResponse } from '@island.is/api/schema'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { GET_FORM } from '@island.is/form-system/graphql'

export interface FormLoaderResponse {
  formBuilder: FormSystemFormResponse
}

interface FormLoaderQueryResponse {
  formSystemGetForm: FormSystemFormResponse
}

export const formLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<FormLoaderResponse> => {
    if (!params.formId) {
      throw new Error('FormId not provided in parameters')
    }

    try {
      const { data, loading } = await client.query<FormLoaderQueryResponse>({
        query: GET_FORM,
        variables: {
          input: {
            id: params.formId,
          },
        },
      })
      console.log(data)
      if (!loading && !data) {
        throw new Error('No form data found')
      }

      return {
        formBuilder: data.formSystemGetForm,
      }
    } catch (error) {
      throw new Error(`Failed to load form: ${error.message}`)
    }
  }
}
