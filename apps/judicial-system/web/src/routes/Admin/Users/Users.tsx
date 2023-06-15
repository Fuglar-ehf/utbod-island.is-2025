import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { ValueType } from 'react-select'

import {
  AlertMessage,
  Box,
  Button,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { Loading } from '@island.is/judicial-system-web/src/components'
import {
  InstitutionsQuery,
  UsersQuery,
} from '@island.is/judicial-system-web/src/utils/mutations'
import { formatNationalId } from '@island.is/judicial-system/formatters'
import { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { titles, errors } from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  Institution,
  User,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import * as constants from '@island.is/judicial-system/consts'

import * as styles from './Users.css'

interface UserData {
  users: User[]
}
interface InstitutionData {
  institutions: Institution[]
}

export const Users: React.FC = () => {
  const router = useRouter()
  const [selectedInstitution, setSelectedInstitution] = useState<string>()
  const { formatMessage } = useIntl()
  const { data, error, loading } = useQuery<UserData>(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const {
    data: rawInstitutions,
    loading: loadingInstitutions,
  } = useQuery<InstitutionData>(InstitutionsQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const users = data?.users.filter((u) => {
    return selectedInstitution
      ? u.institution?.id === selectedInstitution
      : true
  })

  const handleClick = (user: User): void => {
    router.push(`${constants.CHANGE_USER_ROUTE}/${user.id}`)
  }

  const userRoleToString = (userRole: UserRole) => {
    switch (userRole) {
      case UserRole.PROSECUTOR:
        return 'Saksóknari'
      case UserRole.REPRESENTATIVE:
        return 'Fulltrúi'
      case UserRole.JUDGE:
        return 'Dómari'
      case UserRole.REGISTRAR:
        return 'Dómritari'
      case UserRole.ASSISTANT:
        return 'Aðstoðarmaður dómara'
      case UserRole.STAFF:
        return 'Starfsmaður'
    }
  }

  return (
    <div className={styles.userControlContainer}>
      <PageHeader title={formatMessage(titles.admin.users)} />
      <Box display="flex" marginBottom={9}>
        <Button
          icon="add"
          onClick={() => {
            router.push(constants.CREATE_USER_ROUTE)
          }}
        >
          Nýr notandi
        </Button>
      </Box>
      <Box
        marginBottom={8}
        display="flex"
        justifyContent="spaceBetween"
        alignItems="center"
      >
        <Text variant="h3" id="tableCaption">
          Notendur
        </Text>
        <Box width="half">
          <Select
            name="institutions"
            options={
              rawInstitutions?.institutions.map((i) => {
                return { label: i.name, value: i.id }
              }) || []
            }
            placeholder="Veldu stofnun"
            disabled={loadingInstitutions}
            onChange={(selectedOption: ValueType<ReactSelectOption>) =>
              setSelectedInstitution(
                (selectedOption as ReactSelectOption).value.toString(),
              )
            }
          />
        </Box>
      </Box>
      {users && users.length > 0 ? (
        <table
          className={styles.userTable}
          data-testid="users-table"
          aria-describedby="tableCation"
        >
          <thead className={styles.thead}>
            <tr>
              <Box component="th" paddingY={2} paddingX={3}>
                <Text as="span" fontWeight="regular">
                  Nafn
                </Text>
              </Box>
              <Box component="th" paddingY={2} paddingX={3}>
                <Text as="span" fontWeight="regular">
                  Kennitala
                </Text>
              </Box>
              <Box component="th" paddingY={2} paddingX={3}>
                <Text as="span" fontWeight="regular">
                  Hlutverk
                </Text>
              </Box>
              <Box component="th" paddingY={2} paddingX={3}>
                <Text as="span" fontWeight="regular">
                  Stofnun
                </Text>
              </Box>
              <Box component="th" paddingY={2} paddingX={3}>
                <Text as="span" fontWeight="regular">
                  Virkur
                </Text>
              </Box>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={i}
                className={cn(styles.tableRowContainer)}
                role="button"
                aria-label="Opna notanda"
                onClick={() => {
                  handleClick(user)
                }}
              >
                <Box component="td" paddingX={3} paddingY={2}>
                  <Text as="span">{user.name}</Text>
                </Box>
                <Box component="td" paddingX={3} paddingY={2}>
                  <Text as="span">{formatNationalId(user.nationalId)}</Text>
                </Box>
                <Box component="td" paddingX={3} paddingY={2}>
                  <Text as="span">{userRoleToString(user.role)}</Text>
                </Box>
                <Box component="td" paddingX={3} paddingY={2}>
                  <Text as="span">{user.institution?.name}</Text>
                </Box>
                <Box component="td" paddingX={3} paddingY={2}>
                  <Text as="span">{user.active ? 'Já' : 'Nei'}</Text>
                </Box>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Box width="half">
          <AlertMessage
            type="info"
            title="Enginn notandi fannst"
            message="Vinsamlegast veldur aðra stofnun"
          />
        </Box>
      )}
      {loading && (
        <Box width="full">
          <Loading />
        </Box>
      )}
      {error && (
        <div data-testid="users-error">
          <AlertMessage
            title={formatMessage(errors.failedToFetchDataFromDbTitle)}
            message={formatMessage(errors.failedToFetchDataFromDbMessage)}
            type="error"
          />
        </div>
      )}
    </div>
  )
}

export default Users
