import { useMutation } from '@apollo/client'
import {
  Mutation,
  MutationCreateSmsVerificationArgs,
  MutationConfirmSmsVerificationArgs,
} from '@island.is/api/schema'
import { CONFIRM_SMS_VERIFICATION } from '../../lib/mutations/confirmSmsVerification'
import { CREATE_SMS_VERIFICATION } from '../../lib/mutations/createSmsVerification'
import { USER_PROFILE } from '../../lib/queries/getUserProfile'

export type CreateSmsVerificationData = {
  mobilePhoneNumber: string
}

export type ConfirmSmsVerificationData = {
  code: string
}

export const useVerifySms = () => {
  const [
    createSmsVerificationMutation,
    { loading: createLoading, error: createError },
  ] = useMutation<Mutation, MutationCreateSmsVerificationArgs>(
    CREATE_SMS_VERIFICATION,
    {
      refetchQueries: [
        {
          query: USER_PROFILE,
        },
      ],
    },
  )
  const [
    confirmSmsVerificationMutation,
    { loading: confirmLoading, error: confirmError },
  ] = useMutation<Mutation, MutationConfirmSmsVerificationArgs>(
    CONFIRM_SMS_VERIFICATION,
    {
      refetchQueries: [
        {
          query: USER_PROFILE,
        },
      ],
    },
  )

  const createSmsVerification = (data: CreateSmsVerificationData) => {
    return createSmsVerificationMutation({
      variables: {
        input: {
          mobilePhoneNumber: data.mobilePhoneNumber,
        },
      },
    })
  }

  const confirmSmsVerification = (data: ConfirmSmsVerificationData) => {
    return confirmSmsVerificationMutation({
      variables: {
        input: {
          code: data.code,
        },
      },
    })
  }

  return {
    createSmsVerification,
    createLoading,
    createError,
    confirmSmsVerification,
    confirmLoading,
    confirmError,
  }
}
