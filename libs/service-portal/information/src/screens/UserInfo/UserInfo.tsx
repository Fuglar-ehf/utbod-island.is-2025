import React from 'react'
import { defineMessage } from 'react-intl'
import { checkDelegation } from '@island.is/shared/utils'
import { info } from 'kennitala'

import { Box, Divider, Stack } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  FootNote,
  formatNationalId,
  IntroHeader,
  m,
  THJODSKRA_SLUG,
  UserInfoLine,
} from '@island.is/service-portal/core'
import { useUserInfo } from '@island.is/auth/react'

import {
  natRegGenderMessageDescriptorRecord,
  natRegMaritalStatusMessageDescriptorRecord,
} from '../../helpers/localizationHelpers'
import { spmm, urls } from '../../lib/messages'
import { formatAddress, formatNameBreaks } from '../../helpers/formatting'
import { useNationalRegistryPersonQuery } from './UserInfo.generated'
import { Problem } from '@island.is/react-spa/shared'

const SubjectInfo = () => {
  useNamespaces('sp.family')
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()

  const { data, loading, error } = useNationalRegistryPersonQuery()

  const { nationalRegistryPerson } = data || {}
  const isDelegation = userInfo && checkDelegation(userInfo)

  const isUserAdult = info(userInfo.profile.nationalId).age >= 18

  return (
    <>
      <IntroHeader
        title={userInfo.profile.name}
        intro={spmm.userInfoDesc}
        serviceProviderSlug={THJODSKRA_SLUG}
        serviceProviderTooltip={formatMessage(m.tjodskraTooltip)}
      />
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && !loading && !data?.nationalRegistryPerson && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noDataFound)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!error && (loading || data?.nationalRegistryPerson) && (
        <Stack space={2}>
          <UserInfoLine
            title={formatMessage(m.myRegistration)}
            label={m.fullName}
            loading={loading}
            content={nationalRegistryPerson?.fullName ?? ''}
            translate="no"
            tooltip={formatNameBreaks(
              nationalRegistryPerson?.name ?? undefined,
              {
                givenName: formatMessage(spmm.givenName),
                middleName: formatMessage(spmm.middleName),
                lastName: formatMessage(spmm.lastName),
              },
            )}
            tooltipFull
            editLink={{
              external: true,
              title: spmm.changeInNationalReg,
              url: formatMessage(urls.editAdult),
            }}
          />
          <Divider />
          <UserInfoLine
            label={m.natreg}
            loading={loading}
            content={formatNationalId(userInfo.profile.nationalId)}
          />
          <Divider />

          <UserInfoLine
            label={m.legalResidence}
            content={
              formatAddress(nationalRegistryPerson?.housing?.address ?? null) ||
              ''
            }
            loading={loading}
            editLink={{
              external: true,
              title: spmm.changeInNationalReg,
              url: formatMessage(urls.editResidence),
            }}
          />
          <Divider />
          <Box marginY={3} />
          <UserInfoLine
            title={formatMessage(m.baseInfo)}
            label={m.birthPlace}
            content={nationalRegistryPerson?.birthplace?.location || ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={m.familyNumber}
            content={nationalRegistryPerson?.housing?.domicileId || ''}
            loading={loading}
            tooltip={formatMessage({
              id: 'sp.family:family-number-tooltip',
              defaultMessage: `Lögheimilistengsl er samtenging á milli einstaklinga á lögheimili, en veitir ekki upplýsingar um hverjir eru foreldrar barns eða forsjáraðilar.`,
            })}
          />
          {isUserAdult ? (
            <>
              <Divider />
              <UserInfoLine
                label={m.maritalStatus}
                content={
                  nationalRegistryPerson?.maritalStatus
                    ? formatMessage(
                        natRegMaritalStatusMessageDescriptorRecord[
                          nationalRegistryPerson?.maritalStatus
                        ],
                      )
                    : ''
                }
                loading={loading}
              />
            </>
          ) : null}

          <Divider />
          <UserInfoLine
            label={defineMessage(m.religion)}
            content={nationalRegistryPerson?.religion || ''}
            loading={loading}
            editLink={{
              external: true,
              title: spmm.changeInNationalReg,
              url: formatMessage(urls.editReligion),
            }}
          />
          <Divider />
          <UserInfoLine
            label={m.banMarking}
            content={
              nationalRegistryPerson?.exceptionFromDirectMarketing
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
              title: spmm.changeInNationalReg,
              url: formatMessage(urls.editBanmarking),
            }}
          />
          <Divider />
          <UserInfoLine
            label={m.gender}
            content={
              nationalRegistryPerson?.gender
                ? formatMessage(
                    natRegGenderMessageDescriptorRecord[
                      nationalRegistryPerson.gender
                    ],
                  )
                : ''
            }
            loading={loading}
          />
          {nationalRegistryPerson?.citizenship?.name ? (
            <>
              <Divider />
              <UserInfoLine
                label={m.citizenship}
                content={nationalRegistryPerson.citizenship.name}
                loading={loading}
              />
            </>
          ) : null}
          {!isDelegation && (
            <>
              <Divider />
              <Box marginY={3} />
              <UserInfoLine
                title={formatMessage(spmm.userFamilyMembersOnNumber)}
                label={userInfo.profile.name}
                translateLabel="no"
                content={formatNationalId(userInfo.profile.nationalId)}
                loading={loading}
              />
              <Divider />
              {nationalRegistryPerson?.housing?.domicileInhabitants?.map(
                (item) => (
                  <React.Fragment key={item.nationalId}>
                    <UserInfoLine
                      translateLabel="no"
                      label={item.fullName ?? ''}
                      content={formatNationalId(item.nationalId)}
                      loading={loading}
                    />
                    <Divider />
                  </React.Fragment>
                ),
              )}
            </>
          )}
        </Stack>
      )}
      <FootNote serviceProviderSlug={THJODSKRA_SLUG} />
    </>
  )
}

export default SubjectInfo
