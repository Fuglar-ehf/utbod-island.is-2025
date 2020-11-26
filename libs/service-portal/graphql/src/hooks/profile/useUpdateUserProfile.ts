import { useMutation } from '@apollo/client'
import {
  Mutation,
  MutationUpdateProfileArgs,
  UpdateUserProfileInput,
} from '@island.is/api/schema'
import { UPDATE_USER_PROFILE } from '../../lib/mutations/updateUserProfile'
import { Locale } from '@island.is/localization'
import { useUserProfile } from './useUserProfile'
import { USER_PROFILE } from '../../lib/queries/getUserProfile'

export type UpdateUserProfileData = {
  email?: string
  locale?: Locale
  mobilePhoneNumber?: string
}

export const useUpdateUserProfile = () => {
  const { data: userProfile } = useUserProfile()
  const [updateUserProfileMutation, { loading, error }] = useMutation<
    Mutation,
    MutationUpdateProfileArgs
  >(UPDATE_USER_PROFILE, {
    refetchQueries: [
      {
        query: USER_PROFILE,
      },
    ],
  })

  const updateUserProfile = (data: UpdateUserProfileData) => {
    // TODO: Call create user profile directly here?
    if (!userProfile)
      throw new Error(
        'User profile does not exist, one must be created before it can be updated',
      )

    // API only accepts the values as optional and not as null fields
    // so we have to build the object dynamically
    const input: UpdateUserProfileInput = {}
    if (data.email) input.email = data.email
    if (data.locale) input.locale = data.locale
    if (data.mobilePhoneNumber) input.mobilePhoneNumber = data.mobilePhoneNumber

    return updateUserProfileMutation({
      variables: {
        input,
      },
    })
  }

  return {
    updateUserProfile,
    loading,
    error,
  }
}
