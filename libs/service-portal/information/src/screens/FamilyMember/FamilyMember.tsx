import React from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { useUserInfo } from '@island.is/auth/react'
import ChildView from '../../components/ChildView/ChildView'

import { NATIONAL_REGISTRY_FAMILY_DETAIL } from '../../lib/queries/getNationalRegistryFamily'

type UseParams = {
  nationalId: string
}

const FamilyMember = () => {
  const userInfo = useUserInfo()
  const { nationalId } = useParams() as UseParams
  const { data, loading, error } = useQuery<Query>(
    NATIONAL_REGISTRY_FAMILY_DETAIL,
    {
      variables: { input: { familyMemberNationalId: nationalId } },
    },
  )
  const { nationalRegistryFamilyDetail } = data || {}

  const person =
    nationalRegistryFamilyDetail?.nationalId === nationalId
      ? nationalRegistryFamilyDetail
      : null

  const isChild = nationalId === userInfo.profile.nationalId

  return (
    <ChildView
      nationalId={nationalId}
      error={error}
      loading={loading}
      person={person}
      isChild={isChild}
      userName={userInfo.profile.name}
      userNationalId={userInfo.profile.nationalId}
    />
  )
}

export default FamilyMember
