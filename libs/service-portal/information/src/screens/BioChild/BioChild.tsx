import { useParams } from 'react-router-dom'
import { useUserInfo } from '@island.is/auth/react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  formatNationalId,
  UserInfoLine,
  m,
  IntroHeader,
  THJODSKRA_SLUG,
} from '@island.is/service-portal/core'
import { defineMessage } from 'react-intl'
import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Inline,
  Stack,
} from '@island.is/island-ui/core'
import { formatNameBreaks } from '../../helpers/formatting'
import { spmm } from '../../lib/messages'
import { unmaskString } from '@island.is/shared/utils'
import { Problem } from '@island.is/react-spa/shared'
import { useNationalRegistryBioChildQuery } from './BioChild.generated'

type UseParams = {
  baseId: string
}

const BioChild = () => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()
  const userInfo = useUserInfo()
  const { baseId } = useParams() as UseParams

  const { data, loading, error } = useNationalRegistryBioChildQuery({
    variables: {
      childNationalId: unmaskString(baseId, userInfo.profile.nationalId),
    },
  })

  const child = data?.nationalRegistryPerson?.biologicalChildren?.[0].details
  const nationalId = child?.nationalId

  //Either the user is the child or a parent of the child being vieweds
  const isChild = nationalId === userInfo.profile.nationalId
  const isChildOfUser = child?.birthParents?.some(
    (c) => c.nationalId === userInfo.profile.nationalId,
  )

  const isChildOrChildOfUser = isChild || isChildOfUser
  const noChildFound = !loading && !isChildOrChildOfUser && !error

  return (
    <>
      <IntroHeader
        hideImgPrint
        title={child?.fullName ?? ''}
        intro={formatMessage(spmm.childIntro)}
        serviceProviderSlug={THJODSKRA_SLUG}
        serviceProviderTooltip={formatMessage(m.tjodskraTooltip)}
      />

      {error && !loading && <Problem error={error} noBorder={false} />}
      {(!baseId || noChildFound) && (
        <Problem
          type="no_data"
          noBorder={false}
          title={formatMessage(m.noData)}
          message={formatMessage(m.noDataFoundDetail)}
          imgSrc="./assets/images/sofa.svg"
        />
      )}
      {!error && (loading || isChildOrChildOfUser) && (
        <>
          <Box printHidden>
            <GridRow>
              <GridColumn paddingBottom={4} span="12/12">
                <Box
                  display="flex"
                  justifyContent="flexStart"
                  flexDirection={['column', 'row']}
                >
                  <Inline space={2}>
                    {!loading && !isChild && (
                      <Button
                        variant="utility"
                        size="small"
                        onClick={() => window.print()}
                        icon="print"
                        iconType="filled"
                      >
                        {formatMessage(m.print)}
                      </Button>
                    )}
                  </Inline>
                </Box>
              </GridColumn>
            </GridRow>
          </Box>
          <Stack space={6}>
            <Stack component="ul" space={2}>
              <UserInfoLine
                title={formatMessage(m.myRegistration)}
                label={formatMessage(m.fullName)}
                translate="no"
                printable
                content={child?.fullName || '...'}
                tooltip={formatNameBreaks(child?.name ?? undefined, {
                  givenName: formatMessage(spmm.givenName),
                  middleName: formatMessage(spmm.middleName),
                  lastName: formatMessage(spmm.lastName),
                })}
                tooltipFull
                loading={loading}
              />
              <Box printHidden>
                <Divider />
              </Box>
              <UserInfoLine
                label={formatMessage(m.natreg)}
                content={nationalId ? formatNationalId(nationalId) : ''}
                loading={loading}
                printable
              />
              <Box printHidden>
                <Divider />
              </Box>
              {child?.housing?.address?.streetAddress && (
                <>
                  <UserInfoLine
                    label={defineMessage(m.legalResidence)}
                    content={child?.housing?.address?.streetAddress || ''}
                    loading={loading}
                    printable
                  />
                  <Box printHidden>
                    <Divider />
                  </Box>
                </>
              )}
            </Stack>
          </Stack>
        </>
      )}
    </>
  )
}

export default BioChild
