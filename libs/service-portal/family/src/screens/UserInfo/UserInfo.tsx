import React from 'react'
import {
  Typography,
  Box,
  Stack,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { defineMessage } from 'react-intl'
import {
  useUserProfile,
  useNationalRegistryInfo,
} from '@island.is/service-portal/graphql'

const SubjectInfo: ServicePortalModuleComponent = ({ userInfo }) => {
  const { formatMessage } = useLocale()
  const { data: userProfile } = useUserProfile(userInfo.profile.natreg)
  const { data: natRegInfo } = useNationalRegistryInfo(userInfo.profile.natreg)

  return (
    <>
      <Box marginBottom={6}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Typography variant="h1" as="h1">
                {formatMessage({
                  id: 'service.portal:user-info',
                  defaultMessage: 'Mínar upplýsingar',
                })}
              </Typography>
              <Typography variant="p" as="p">
                {formatMessage({
                  id: 'sp.family:user-info-description',
                  defaultMessage:
                    'Hér eru þín gögn frá þjóðskrá. Þú hefur kost á að gera breytingar á þessum gögnum',
                })}
              </Typography>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={1}>
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:display-name',
            defaultMessage: 'Birtingarnafn',
          })}
          content={userInfo.profile.name}
          editLink={{
            external: true,
            url:
              'https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=5c55d7a6-089b-11e6-943d-005056851dd2',
          }}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:natreg',
            defaultMessage: 'Kennitala',
          })}
          content={userInfo.profile.natreg}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:citizenship',
            defaultMessage: 'Ríkisfang',
          })}
          content={
            userInfo.profile.nat === 'IS' ? 'Ísland' : userInfo.profile.nat
          }
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:email',
            defaultMessage: 'Netfang',
          })}
          content={userProfile?.email || ''}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:tel',
            defaultMessage: 'Símanúmer',
          })}
          content={userProfile?.mobilePhoneNumber || ''}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:language',
            defaultMessage: 'Tungumál',
          })}
          content={userProfile?.locale || ''}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:legal-residence',
            defaultMessage: 'Lögheimili',
          })}
          content={natRegInfo?.legalResidence || ''}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:birth-place',
            defaultMessage: 'Fæðingarstaður',
          })}
          content={natRegInfo?.birthPlace || ''}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:gender',
            defaultMessage: 'Kyn',
          })}
          content={natRegInfo?.gender || ''}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:marital-status',
            defaultMessage: 'Hjúskaparstaða',
          })}
          content={natRegInfo?.maritalStatus || ''}
        />
        <UserInfoLine
          label={defineMessage({
            id: 'service.portal:religion',
            defaultMessage: 'Trúfélag',
          })}
          content={natRegInfo?.religion || ''}
        />
      </Stack>
    </>
  )
}

export default SubjectInfo
