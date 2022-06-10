import React from 'react'
import { defineMessage } from 'react-intl'
import { useQuery } from '@apollo/client'
import { spmm } from '../../lib/messages'

import { Query } from '@island.is/api/schema'
import {
  Text,
  Box,
  Stack,
  GridRow,
  GridColumn,
  Divider,
} from '@island.is/island-ui/core'
import {
  formatNationalId,
  ServicePortalModuleComponent,
  UserInfoLine,
  m,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  natRegGenderMessageDescriptorRecord,
  natRegMaritalStatusMessageDescriptorRecord,
} from '../../helpers/localizationHelpers'
import { NATIONAL_REGISTRY_USER } from '../../lib/queries/getNationalRegistryUser'
import { NATIONAL_REGISTRY_FAMILY } from '../../lib/queries/getNationalRegistryFamily'

const dataNotFoundMessage = defineMessage({
  id: 'sp.family:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const changeInNationalReg = defineMessage({
  id: 'sp.family:change-in-national-registry',
  defaultMessage: 'Breyta hjá Þjóðskrá',
})

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const { data, loading, error } = useQuery<Query>(NATIONAL_REGISTRY_USER)
  const { nationalRegistryUser } = data || {}

  // User's Family members
  const { data: famData, loading: familyLoading } = useQuery<Query>(
    NATIONAL_REGISTRY_FAMILY,
  )
  const { nationalRegistryFamily } = famData || {}
  return (
    <>
      <Box marginBottom={5}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={1}>
              <Text variant="h3" as="h1" paddingTop={0}>
                {userInfo.profile.name}
              </Text>
              <Text as="p" variant="default">
                {formatMessage(spmm.family.userInfoDesc)}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={2}>
        <UserInfoLine
          title={formatMessage(m.myRegistration)}
          label={m.fullName}
          content={userInfo.profile.name}
          editLink={{
            external: true,
            title: changeInNationalReg,
            url:
              'https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=5c55d7a6-089b-11e6-943d-005056851dd2',
          }}
        />
        <Divider />
        <UserInfoLine
          label={m.natreg}
          content={formatNationalId(userInfo.profile.nationalId)}
        />
        <Divider />

        <UserInfoLine
          label={m.legalResidence}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.legalResidence || ''
          }
          loading={loading}
          editLink={{
            external: true,
            title: changeInNationalReg,
            url:
              'https://www.skra.is/umsoknir/rafraen-skil/flutningstilkynning/',
          }}
        />
        <Divider />
        <Box marginY={3} />
        <UserInfoLine
          title={formatMessage(m.baseInfo)}
          label={m.birthPlace}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.birthPlace || ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={m.familyNumber}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.familyNr || ''
          }
          loading={loading}
          tooltip={formatMessage({
            id: 'sp.family:family-number-tooltip',
            defaultMessage:
              'Fjölskyldunúmer er samtenging á milli einstaklinga á lögheimili, en veitir ekki upplýsingar um hverjir eru foreldrar barns eða forsjáraðilar.',
          })}
        />
        <Divider />
        <UserInfoLine
          label={m.maritalStatus}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.maritalStatus
              ? formatMessage(
                  natRegMaritalStatusMessageDescriptorRecord[
                    nationalRegistryUser?.maritalStatus
                  ],
                )
              : ''
          }
          loading={loading}
        />

        <Divider />
        <UserInfoLine
          label={defineMessage(m.religion)}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.religion || ''
          }
          loading={loading}
          editLink={{
            external: true,
            title: changeInNationalReg,
            url:
              'https://www.skra.is/umsoknir/rafraen-skil/tru-og-lifsskodunarfelag',
          }}
        />
        <Divider />
        <UserInfoLine
          label={m.banMarking}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.banMarking?.banMarked
              ? formatMessage({
                  id: 'sp.family:yes',
                  defaultMessage: 'Já',
                })
              : formatMessage({
                  id: 'sp.family:no',
                  defaultMessage: 'Nei',
                })
          }
          tooltip={formatMessage({
            id: 'sp.family:ban-marking-tooltip',
            defaultMessage:
              'Bannmerktir einstaklingar koma t.d. ekki fram á úrtakslistum úr þjóðskrá og öðrum úrtökum í markaðssetningarskyni.',
          })}
          loading={loading}
          editLink={{
            external: true,
            title: changeInNationalReg,
            url: 'https://www.skra.is/umsoknir/rafraen-skil/bannmerking/',
          }}
        />
        <Divider />
        <UserInfoLine
          label={m.gender}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.gender
              ? formatMessage(
                  natRegGenderMessageDescriptorRecord[
                    nationalRegistryUser.gender
                  ],
                )
              : ''
          }
          loading={loading}
        />
        <Divider />
        <UserInfoLine
          label={m.citizenship}
          content={
            error
              ? formatMessage(dataNotFoundMessage)
              : nationalRegistryUser?.citizenship?.name || ''
          }
          loading={loading}
        />
        <Divider />
        <Box marginY={3} />
        <UserInfoLine
          title={formatMessage(spmm.family.userFamilyMembersOnNumber)}
          label={userInfo.profile.name}
          content={formatNationalId(userInfo.profile.nationalId)}
          loading={loading || familyLoading}
        />
        <Divider />
        {nationalRegistryFamily && nationalRegistryFamily.length > 0
          ? nationalRegistryFamily?.map((item) => (
              <React.Fragment key={item.nationalId}>
                <UserInfoLine
                  label={item.fullName}
                  content={formatNationalId(item.nationalId)}
                  loading={loading}
                />
                <Divider />
              </React.Fragment>
            ))
          : null}
      </Stack>
    </>
  )
}

export default SubjectInfo
