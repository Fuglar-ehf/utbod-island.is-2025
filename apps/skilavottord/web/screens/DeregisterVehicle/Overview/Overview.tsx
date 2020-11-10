import React, { FC, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useQuery } from '@apollo/client'
import { UserContext } from '@island.is/skilavottord-web/context'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import {
  Box,
  Stack,
  Text,
  Breadcrumbs,
  Button,
  GridColumn,
} from '@island.is/island-ui/core'
import {
  Sidenav,
  NotFound,
  PartnerPageLayout,
} from '@island.is/skilavottord-web/components'
import { CarsTable } from './components/CarsTable'
import { VEHICLES_BY_PARTNER_ID } from '@island.is/skilavottord-web/graphql/queries'

const Overview: FC = () => {
  const { user } = useContext(UserContext)
  const {
    t: { deregisterOverview: t, deregisterSidenav: sidenavText, routes },
  } = useI18n()
  const router = useRouter()

  const partnerId = user?.partnerId ?? ''
  const { data } = useQuery(VEHICLES_BY_PARTNER_ID, {
    variables: { partnerId },
    fetchPolicy: 'cache-and-network',
  })

  const vehicleOwners = data?.skilavottordRecyclingPartnerVehicles
  const deregisteredVehicles = vehicleOwners?.filter(({ vehicles }) => {
    for (const vehicle of vehicles) {
      for (const request of vehicle.recyclingRequests) {
        return request.requestType === 'deregistered'
      }
    }
  })

  const handleDeregister = () => {
    router.push(routes.deregisterVehicle.select)
  }

  if (!user) {
    return null
  } else if (!hasPermission('deregisterVehicle', user?.role as Role)) {
    return <NotFound />
  }

  return (
    <PartnerPageLayout
      side={
        <Sidenav
          title={user.name}
          sections={[
            {
              icon: 'car',
              title: `${sidenavText.deregister}`,
              link: `${routes.deregisterVehicle.baseRoute}`,
            },
            {
              icon: 'business',
              title: `${sidenavText.companyInfo}`,
              link: `${routes.companyInfo.baseRoute}`,
            },
          ]}
          activeSection={0}
        />
      }
    >
      <Stack space={6}>
        <GridColumn span={['8/8', '8/8', '7/8', '7/8']}>
          <Stack space={4}>
            <Breadcrumbs>
              <Link href={routes.home['recyclingCompany']}>Ísland.is</Link>
              <span>{t.title}</span>
            </Breadcrumbs>
            <Stack space={2}>
              <Text variant="h1">{t.title}</Text>
              <Text variant="intro">{t.info}</Text>
            </Stack>
            <Button onClick={handleDeregister}>{t.buttons.deregister}</Button>
          </Stack>
        </GridColumn>
        {deregisteredVehicles?.length > 0 && (
          <Box marginX={1}>
            <Stack space={4}>
              <Text variant="h3">{t.subtitles.history}</Text>
              <CarsTable titles={t.table} vehicleOwner={deregisteredVehicles} />
            </Stack>
          </Box>
        )}
      </Stack>
    </PartnerPageLayout>
  )
}

export default Overview
