import React, { useEffect } from 'react'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import { Institution, User, UserRole } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useMutation, useQuery } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import {
  CreateUserMutation,
  InstitutionsQuery,
} from '@island.is/judicial-system-web/src/utils/mutations'
import UserForm from '../UserForm/UserForm'

const user: User = {
  id: '',
  created: '',
  modified: '',
  nationalId: '',
  name: '',
  title: '',
  mobileNumber: '',
  email: '',
  role: UserRole.PROSECUTOR,
  institution: undefined,
  active: true,
}

interface InstitutionData {
  institutions: Institution[]
}

export const NewUser: React.FC = () => {
  const history = useHistory()

  useEffect(() => {
    document.title = 'Nýr notandi - Réttarvörslugátt'
  }, [])

  const {
    data: institutionData,
    loading: institutionLoading,
    error: institutionError,
  } = useQuery<InstitutionData>(InstitutionsQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const [createUserMutation, { loading: createLoading }] = useMutation(
    CreateUserMutation,
  )

  const createUser = async (user: User): Promise<void> => {
    if (createLoading === false && user) {
      await createUserMutation({
        variables: {
          input: {
            name: user.name,
            nationalId: user.nationalId,
            role: user.role,
            institutionId: user.institution?.id,
            title: user.title,
            mobileNumber: user.mobileNumber,
            email: user.email,
            active: user.active,
          },
        },
      })
    }

    history.push(Constants.USER_LIST_ROUTE)
  }

  return (
    <PageLayout
      showSidepanel={false}
      isLoading={institutionLoading}
      notFound={false}
    >
      {institutionData?.institutions && (
        <UserForm
          user={user}
          institutions={institutionData?.institutions}
          onSave={createUser}
          loading={createLoading}
        />
      )}
    </PageLayout>
  )
}

export default NewUser
