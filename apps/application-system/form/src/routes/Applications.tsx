import React, { FC, useEffect } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useParams, useHistory } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { isLocale } from 'class-validator'

import {
  CREATE_APPLICATION,
  APPLICATION_APPLICATIONS,
} from '@island.is/application/graphql'
import {
  Text,
  Box,
  Page,
  Button,
  GridContainer,
} from '@island.is/island-ui/core'
import { coreMessages, getTypeFromSlug } from '@island.is/application/core'
import { Locale } from '@island.is/shared/types'
import { ApplicationList } from '@island.is/application/ui-components'
import { ErrorShell } from '@island.is/application/ui-shell'
import { useAuth } from '@island.is/auth/react'
import {
  useApplicationNamespaces,
  useLocale,
  useLocalizedQuery,
} from '@island.is/localization'
import { USER_PROFILE } from '@island.is/service-portal/graphql'
import { Query } from '@island.is/api/schema'

import { ApplicationLoading } from '../components/ApplicationsLoading/ApplicationLoading'

export const Applications: FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const history = useHistory()
  const { formatMessage, changeLanguage, lang } = useLocale()
  const type = getTypeFromSlug(slug)
  const { userInfo } = useAuth()

  useApplicationNamespaces(type)

  const {
    data,
    loading,
    error: applicationsError,
    refetch,
  } = useLocalizedQuery(APPLICATION_APPLICATIONS, {
    variables: {
      input: { typeId: type },
    },
    skip: !type,
  })

  const [createApplicationMutation, { error: createError }] = useMutation(
    CREATE_APPLICATION,
    {
      onCompleted({ createApplication }) {
        history.push(`../${slug}/${createApplication.id}`)
      },
    },
  )

  const createApplication = () => {
    createApplicationMutation({
      variables: {
        input: {
          typeId: type,
        },
      },
    })
  }

  // TODO: Change when IDS has locale
  const [
    getUserProfile,
    { data: userProfData, loading: userProfileLoading },
  ] = useLazyQuery<Query>(USER_PROFILE)
  const userProfile = userProfData?.getUserProfile || null

  useEffect(() => {
    if (userInfo?.profile.nationalId) getUserProfile()
  }, [userInfo, getUserProfile])

  useEffect(() => {
    if (
      userProfile?.locale &&
      isLocale(userProfile.locale) &&
      userProfile.locale !== lang
    )
      changeLanguage(userProfile.locale as Locale)
  }, [userProfile, changeLanguage, lang])

  useEffect(() => {
    if (type && data && isEmpty(data.applicationApplications)) {
      createApplication()
    }
  }, [type, data])

  if (loading || userProfileLoading) {
    return <ApplicationLoading />
  }

  if (!type || applicationsError) {
    return (
      <ErrorShell
        title={formatMessage(coreMessages.notFoundApplicationType)}
        subTitle={formatMessage(coreMessages.notFoundApplicationTypeMessage, {
          type,
        })}
      />
    )
  }

  if (createError) {
    return (
      <ErrorShell
        title={formatMessage(coreMessages.createErrorApplication)}
        subTitle={formatMessage(coreMessages.createErrorApplicationMessage, {
          type,
        })}
      />
    )
  }

  return (
    <Page>
      <GridContainer>
        {!loading && !isEmpty(data?.applicationApplications) && (
          <Box>
            <Box marginTop={5} marginBottom={5}>
              <Text variant="h1">
                {formatMessage(coreMessages.applications)}
              </Text>
            </Box>

            {data?.applicationApplications && (
              <ApplicationList
                applications={data.applicationApplications}
                onClick={(applicationUrl) =>
                  history.push(`../${applicationUrl}`)
                }
                refetch={refetch}
              />
            )}

            <Box
              marginTop={5}
              marginBottom={5}
              display="flex"
              justifyContent="flexEnd"
            >
              <Button onClick={createApplication}>
                {formatMessage(coreMessages.newApplication)}
              </Button>
            </Box>
          </Box>
        )}
      </GridContainer>
    </Page>
  )
}
