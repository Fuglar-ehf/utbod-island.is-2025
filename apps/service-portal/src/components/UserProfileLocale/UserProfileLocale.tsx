import { useLazyQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { useLocale, useNamespaces, isLocale } from '@island.is/localization'
import { USER_PROFILE } from '@island.is/service-portal/graphql'
import { useEffect } from 'react'
import useAuth from '../../hooks/useAuth/useAuth'

/**
 * If the user has set a preferred language in his user
 * profile that is not the default language on startup,
 * set the current language to that one.
 * Note: This is a temporary solution, the preferred
 * language should be fetched by the auth server and returned
 * with the userInfo token in the future.
 */
export const UserProfileLocale = () => {
  const { changeLanguage } = useNamespaces()
  const { lang } = useLocale()
  const { userInfo } = useAuth()
  const [getUserProfile, { data }] = useLazyQuery<Query>(USER_PROFILE)
  const userProfile = data?.getUserProfile || null

  useEffect(() => {
    if (userInfo?.profile.nationalId) getUserProfile()
  }, [userInfo])

  useEffect(() => {
    if (
      userProfile &&
      isLocale(userProfile.locale) &&
      userProfile.locale !== lang
    )
      changeLanguage(userProfile.locale)
  }, [userProfile])

  return null
}
