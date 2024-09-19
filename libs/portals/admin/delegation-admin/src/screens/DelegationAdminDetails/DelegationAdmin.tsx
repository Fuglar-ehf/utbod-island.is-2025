import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Stack,
  Tabs,
} from '@island.is/island-ui/core'
import { BackButton } from '@island.is/portals/admin/core'
import { useLocale } from '@island.is/localization'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { DelegationAdminResult } from './DelegationAdmin.loader'
import { DelegationAdminPaths } from '../../lib/paths'
import { formatNationalId, IntroHeader } from '@island.is/portals/core'
import { m } from '../../lib/messages'
import React from 'react'
import DelegationList from '../../components/DelegationList'
import { AuthCustomDelegation } from '@island.is/api/schema'
import { DelegationsEmptyState } from '@island.is/portals/shared-modules/delegations'
import { useAuth } from '@island.is/auth/react'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { replaceParams } from '@island.is/react-spa/shared'
import { maskNationalId } from '@island.is/shared/pii'
import { maskString } from '@island.is/shared/utils'

const DelegationAdminScreen = () => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const delegationAdmin = useLoaderData() as DelegationAdminResult
  const { userInfo } = useAuth()

  const hasAdminAccess = userInfo?.scopes.includes(
    AdminPortalScope.delegationSystemAdmin,
  )

  return (
    <Stack space="containerGutter">
      <BackButton onClick={() => navigate(DelegationAdminPaths.Root)} />
      <GridRow rowGap={3}>
        <GridColumn span={['12/12', '8/12']}>
          <IntroHeader
            title={delegationAdmin.name}
            intro={formatNationalId(delegationAdmin.nationalId)}
          />
        </GridColumn>
        {hasAdminAccess && (
          <GridColumn span={['12/12', '4/12']}>
            <Button
              icon="arrowForward"
              onClick={async () => {
                const maskedNationalId = (await maskString(delegationAdmin.nationalId, userInfo?.profile.nationalId || '')) ?? ''
                const query = new URLSearchParams({
                  fromNationalId: maskedNationalId,
                })
                navigate(`${
                    DelegationAdminPaths.CreateDelegation
                  }?${query.toString()}`
                )
              }}
              size="small"
            >
              {formatMessage(m.createNewDelegation)}
            </Button>
          </GridColumn>
        )}
      </GridRow>
      <Tabs
        contentBackground="white"
        label={'Delegation Admin'}
        tabs={[
          {
            label: formatMessage(m.delegationFrom),
            content:
              delegationAdmin.incoming.length > 0 ? (
                <DelegationList
                  direction="incoming"
                  delegationsList={
                    delegationAdmin.incoming as AuthCustomDelegation[]
                  }
                />
              ) : (
                <DelegationsEmptyState
                  message={formatMessage(m.delegationFromNotFound)}
                  imageAlt={formatMessage(m.delegationFromNotFound)}
                />
              ),
          },
          {
            label: formatMessage(m.delegationTo),
            content:
              delegationAdmin.outgoing.length > 0 ? (
                <DelegationList
                  direction="outgoing"
                  delegationsList={
                    delegationAdmin.outgoing as AuthCustomDelegation[]
                  }
                />
              ) : (
                <DelegationsEmptyState
                  message={formatMessage(m.delegationToNotFound)}
                  imageAlt={formatMessage(m.delegationToNotFound)}
                />
              ),
          },
        ]}
      />
    </Stack>
  )
}

export default DelegationAdminScreen
