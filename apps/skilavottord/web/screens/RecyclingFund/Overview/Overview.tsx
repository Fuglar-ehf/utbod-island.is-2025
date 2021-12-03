import React, { FC, useContext } from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

import { useI18n } from '@island.is/skilavottord-web/i18n'
import {
  BreadcrumbsDeprecated as Breadcrumbs,
  Link,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { PartnerPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { Sidenav, NotFound } from '@island.is/skilavottord-web/components'
import { UserContext } from '@island.is/skilavottord-web/context'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { Query } from '@island.is/skilavottord-web/graphql/schema'
import { CarsTable } from './components/CarsTable'

export const SkilavottordVehiclesQuery = gql`
  query skilavottordVehiclesQuery {
    skilavottordAllDeregisteredVehicles {
      vehicleId
      vehicleType
      newregDate
      createdAt
      recyclingRequests {
        id
        nameOfRequestor
        createdAt
      }
    }
  }
`

const Overview: FC = () => {
  const { user } = useContext(UserContext)
  const {
    t: { recyclingFundOverview: t, recyclingFundSidenav: sidenavText, routes },
  } = useI18n()

  const { data } = useQuery<Query>(SkilavottordVehiclesQuery)
  const vehicles = data?.skilavottordAllDeregisteredVehicles ?? []

  if (!user) {
    return null
  } else if (!hasPermission('recycledVehicles', user?.role as Role)) {
    return <NotFound />
  }

  return (
    <PartnerPageLayout
      side={
        <Sidenav
          title={sidenavText.title}
          sections={[
            {
              icon: 'car',
              title: `${sidenavText.recycled}`,
              link: `${routes.recycledVehicles}`,
            },
            {
              icon: 'business',
              title: `${sidenavText.companies}`,
              link: `${routes.recyclingCompanies.baseRoute}`,
            },
            {
              icon: 'lockClosed',
              title: `${sidenavText.accessControl}`,
              link: `${routes.accessControl}`,
            },
          ]}
          activeSection={0}
        />
      }
    >
      <Stack space={4}>
        <Breadcrumbs>
          <Link href={routes.home['recyclingCompany']}>Ísland.is</Link>
          <span>{t.title}</span>
        </Breadcrumbs>
        <Text variant="h1">{t.title}</Text>
        <Text variant="intro">
          Here is the list of all deregistered vehicles, along with date of the
          registration.
        </Text>
        <Stack space={3}>
          <Text variant="h3">{t.subtitles.deregistered}</Text>
          {vehicles.length > 0 ? (
            <CarsTable titles={t.table} vehicles={vehicles} />
          ) : (
            <Text>{t.info}</Text>
          )}
        </Stack>
      </Stack>
    </PartnerPageLayout>
  )
}

export default Overview
