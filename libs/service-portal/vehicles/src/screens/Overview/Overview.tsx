import React, { useCallback, useState } from 'react'
import {
  ServicePortalModuleComponent,
  m,
  CardLoader,
  EmptyState,
} from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useQuery } from '@apollo/client'
import { Query, VehiclesVehicle } from '@island.is/api/schema'
import {
  Box,
  Stack,
  Text,
  GridColumn,
  GridRow,
  Input,
  Button,
} from '@island.is/island-ui/core'
import isEqual from 'lodash/isEqual'
import { VehicleCard } from '../../components/VehicleCard'
import { messages } from '../../lib/messages'
import { GET_USERS_VEHICLES } from '../../queries/getUsersVehicles'

const defaultFilterValues = {
  searchQuery: '',
}
type FilterValues = {
  searchQuery: string
}

const getFilteredVehicles = (
  vehicles: VehiclesVehicle[],
  filterValues: FilterValues,
): VehiclesVehicle[] => {
  const { searchQuery } = filterValues

  if (searchQuery) {
    return vehicles.filter(
      (x: VehiclesVehicle) =>
        x.permno?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        x.regno?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        x.type?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }
  return vehicles
}

export const VehiclesOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage, lang } = useLocale()
  const [page, setPage] = useState(1)
  const [searchInteractionEventSent, setSearchInteractionEventSent] = useState(
    false,
  )
  const [filterValue, setFilterValue] = useState<FilterValues>(
    defaultFilterValues,
  )
  const { data, loading, error } = useQuery<Query>(GET_USERS_VEHICLES)
  const vehicles = data?.vehiclesList?.vehicleList || []
  const filteredVehicles = getFilteredVehicles(vehicles, filterValue)

  const handleSearchChange = useCallback((value: string) => {
    setPage(1)
    setFilterValue({ ...defaultFilterValues, searchQuery: value })
    if (!searchInteractionEventSent) {
      setSearchInteractionEventSent(true)
    }
  }, [])

  const vehiclesFoundText = () =>
    filteredVehicles.length === 1 ||
    (lang === 'is' && filteredVehicles.length % 10 === 1)
      ? formatMessage(messages.foundSingular)
      : formatMessage(messages.found)
  const hasActiveFilters = () => !isEqual(filterValue, defaultFilterValues)

  const handleClearFilters = useCallback(() => {
    setPage(1)
    setFilterValue({ ...defaultFilterValues })
  }, [])

  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
            <Stack space={2}>
              <Text variant="h3" as="h1">
                {formatMessage(messages.title)}
              </Text>
              <Text as="p" variant="default">
                {formatMessage(messages.intro)}
              </Text>
            </Stack>
          </GridColumn>
        </GridRow>
      </Box>
      {error && (
        <Box>
          <EmptyState description={m.errorFetch} />
        </Box>
      )}
      {!loading && !error && vehicles.length === 0 && (
        <Box marginTop={8}>
          <EmptyState />
        </Box>
      )}

      {!loading && !error && vehicles.length > 0 && (
        <Box marginBottom={3}>
          <a
            href="/app/skilavottord/my-cars"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="utility"
              size="small"
              icon="reader"
              iconType="outline"
            >
              {formatMessage(messages.recycleCar)}
            </Button>
          </a>
        </Box>
      )}
      <Stack space={2}>
        {!loading && !error && vehicles.length > 4 && (
          <GridRow>
            <GridColumn span={['12/12', '12/12', '5/12', '4/12', '3/12']}>
              <Box marginBottom={1}>
                <Input
                  icon="search"
                  backgroundColor="blue"
                  size="xs"
                  value={filterValue.searchQuery}
                  onChange={(ev) => handleSearchChange(ev.target.value)}
                  name="okutaeki-leit"
                  label={formatMessage(m.searchLabel)}
                  placeholder={formatMessage(m.searchPlaceholder)}
                />
              </Box>
            </GridColumn>
          </GridRow>
        )}
        {hasActiveFilters() && (
          <GridRow>
            <GridColumn span={['12/12', '12/12']}>
              <Box marginTop={4}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="spaceBetween"
                >
                  <Text variant="h5" as="h3">{`${
                    filteredVehicles.length
                  } ${formatMessage(vehiclesFoundText())}`}</Text>
                  <div>
                    <Button variant="text" onClick={handleClearFilters}>
                      {formatMessage(messages.clearFilter)}
                    </Button>
                  </div>
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        )}
        {loading && <CardLoader />}

        {filteredVehicles.length > 0 && (
          <Box width="full">
            <Stack space={2}>
              {filteredVehicles.map((item, index) => {
                return <VehicleCard vehicle={item} key={index} />
              })}
            </Stack>
          </Box>
        )}
      </Stack>
    </>
  )
}

export default VehiclesOverview
