import React, { useEffect, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  Accordion,
  AccordionItem,
  Box,
  Bullet,
  BulletList,
  Button,
  GridColumn,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  EmptyState,
  IntroHeader,
  m,
  ServicePortalModuleComponent,
  TableGrid,
  formatDate,
} from '@island.is/service-portal/core'

import { messages } from '../../lib/messages'
import { GET_USERS_VEHICLES_SEARCH_LIMIT } from '../../queries/getUsersVehicleSearchLimit'
import { GET_VEHICLES_SEARCH } from '../../queries/getVehiclesSearch'

export const Lookup: ServicePortalModuleComponent = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [expanded, setExpanded] = useState(!termsAccepted)
  const [searchValue, setSearchValue] = useState('')
  const [
    getUsersVehicleSearchLimit,
    { loading, error, called: limitCalled, ...searchLimitData },
  ] = useLazyQuery<Query>(GET_USERS_VEHICLES_SEARCH_LIMIT, {
    fetchPolicy: 'no-cache',
  })

  const [
    getVehiclesSearch,
    {
      loading: infoLoading,
      error: infoError,
      called: infoCalled,
      ...vehicleSearch
    },
  ] = useLazyQuery<Query>(GET_VEHICLES_SEARCH, {
    variables: {
      input: {
        search: searchValue,
      },
    },
    onCompleted: () => getUsersVehicleSearchLimit(),
  })

  const {
    permno,
    regno,
    vin,
    type,
    color,
    firstRegDate,
    nextInspection,
    currentOwner,
    currentOwnerAddress,
    useGroup,
    regType,
    mass,
    massLaden,
    vehicleStatus,
    co,
    co2Wltp,
    weightedco2Wltp,
  } = vehicleSearch.data?.vehiclesSearch || {}

  const noInfo =
    vehicleSearch?.data?.vehiclesSearch === null ||
    typeof vehicleSearch?.data?.vehiclesSearch === undefined

  const noSearchData =
    searchLimitData?.data?.vehiclesSearchLimit === undefined ||
    searchLimitData?.data?.vehiclesSearchLimit === null

  useEffect(() => {
    getUsersVehicleSearchLimit()
  }, [])

  useEffect(() => {
    const newLimit = searchLimitData?.data?.vehiclesSearchLimit || 5 // Default value
    if (newLimit < 5) {
      setTermsAccepted(true)
    }
  }, [searchLimitData?.data?.vehiclesSearchLimit])

  if (error) {
    return (
      <Box>
        <EmptyState description={m.errorFetch} />
      </Box>
    )
  }

  const confirmSearch = () => {
    getVehiclesSearch({
      variables: {
        input: {
          search: searchValue,
        },
      },
    })
  }

  const limit = searchLimitData?.data?.vehiclesSearchLimit || 0
  const limitExceeded = limit === 0
  return (
    <>
      <Box marginBottom={[2, 3, 5]}>
        <IntroHeader
          title={messages.vehiclesLookup}
          intro={messages.searchIntro}
        />
        <GridRow>
          <GridColumn span="1/1">
            <Accordion dividerOnTop={false}>
              <AccordionItem
                id="terms-1"
                label={formatMessage(messages.termsTitle)}
                labelUse="h5"
                expanded={expanded}
                onToggle={(expanded) => setExpanded(expanded)}
              >
                <BulletList>
                  <Bullet>
                    <Text as="p" variant="small">
                      {formatMessage(messages.termsBulletOne)}
                    </Text>
                  </Bullet>
                  <Bullet>
                    <Text as="p" variant="small">
                      {formatMessage(messages.termsBulletTwo)}
                    </Text>
                  </Bullet>
                  <Bullet>
                    <Text as="p" variant="small">
                      {formatMessage(messages.termsBulletThree)}
                    </Text>
                  </Bullet>
                  <Bullet>
                    <Text as="p" variant="small">
                      {formatMessage(messages.termsBulletFour)}
                    </Text>
                  </Bullet>
                  <Bullet>
                    <Text as="p" variant="small">
                      {formatMessage(messages.termsBulletFive)}
                    </Text>
                  </Bullet>
                </BulletList>
                <Box marginTop={3} marginBottom={4}>
                  <Button
                    size="small"
                    variant="ghost"
                    disabled={termsAccepted}
                    onClick={
                      !termsAccepted
                        ? () => {
                            setTermsAccepted(true)
                            setExpanded(false)
                          }
                        : undefined
                    }
                    icon={termsAccepted ? 'checkmark' : undefined}
                  >
                    {' '}
                    {!termsAccepted
                      ? formatMessage(messages.acceptTerms)
                      : formatMessage(messages.termsAccepted)}
                  </Button>
                </Box>
              </AccordionItem>
            </Accordion>
          </GridColumn>
        </GridRow>
      </Box>
      <GridRow marginTop={2}>
        {limitExceeded && !noSearchData && (
          <GridColumn span={['12/12', '12/12', '12/12']}>
            <Text marginBottom={4}>
              {formatMessage(messages.searchLimitExceeded)}
            </Text>
          </GridColumn>
        )}
        <GridColumn span={['12/12', '12/12', '12/12']}>
          <Box
            display="flex"
            flexDirection={['column', 'row']}
            alignItems={['flexStart', 'flexEnd']}
          >
            <Input
              icon="search"
              backgroundColor="blue"
              size="xs"
              value={searchValue}
              onChange={(ev) => setSearchValue(ev.target.value)}
              name="uppfletting-okutaekjaskra-leit"
              label={formatMessage(messages.searchLabel)}
              placeholder={formatMessage(messages.searchPlaceholder)}
              disabled={!termsAccepted || limitExceeded}
            />
            <Box marginLeft={[0, 3]} marginTop={[2, 0]}>
              <Button
                disabled={!termsAccepted || limitExceeded}
                variant="ghost"
                size="small"
                onClick={() => confirmSearch()}
                loading={infoLoading || loading}
              >
                {formatMessage(messages.search)} {' ('}
                {limit}
                {')'}
              </Button>
            </Box>
          </Box>
        </GridColumn>
      </GridRow>
      {infoCalled && !infoError && !infoLoading && noInfo && (
        <Box marginTop={4}>
          <Text variant="h4" as="h3">
            {formatMessage(messages.noVehicleFound)}
          </Text>
        </Box>
      )}
      {infoCalled && !infoLoading && !infoError && !noInfo && (
        <>
          <Text variant="h5" as="h3" marginTop={4} marginBottom={2}>
            {formatMessage(messages.searchResults)}
          </Text>
          <TableGrid
            title={type ?? ''}
            dataArray={[
              [
                {
                  title: formatMessage(messages.permno),
                  value: permno ?? '',
                },
                {
                  title: formatMessage(messages.regno),
                  value: regno ?? '',
                },
              ],
              [
                {
                  title: formatMessage(messages.verno),
                  value: vin ?? '',
                },
                {
                  title: formatMessage(messages.useGroup),
                  value: useGroup ?? '',
                },
              ],

              [
                {
                  title: formatMessage(messages.regType),
                  value: regType ?? '',
                },
                {
                  title: formatMessage(messages.owner),
                  value: currentOwner ?? '',
                },
              ],
              [
                {
                  title: formatMessage(messages.firstReg),
                  value: firstRegDate ? formatDate(firstRegDate) : '',
                },
                {
                  title: formatMessage(messages.address),
                  value: currentOwnerAddress ?? '',
                },
              ],
              [
                {
                  title: formatMessage(messages.vehicleStatus),
                  value: vehicleStatus ?? '',
                },
                {
                  title: formatMessage(messages.color),
                  value: color ?? '',
                },
              ],
              [
                {
                  title: formatMessage(messages.nextInspection),
                  value:
                    nextInspection && nextInspection.nextinspectiondate
                      ? formatDate(nextInspection.nextinspectiondate)
                      : '',
                },
                {
                  title: formatMessage(messages.co2),
                  value: co ? String(co) : '',
                },
              ],
              [
                {
                  title: formatMessage(messages.vehicleWeightLong),
                  value: mass ? String(mass) : '',
                },
                {
                  title: formatMessage(messages.wltpWeighted),
                  value: co2Wltp ? String(co2Wltp) : '',
                },
              ],
              [
                {
                  title: formatMessage(messages.vehicleTotalWeightLong),
                  value: massLaden ? String(massLaden) : '',
                },
                {
                  title: formatMessage(messages.weightedWLTPCo2),
                  value: weightedco2Wltp ? String(weightedco2Wltp) : '',
                },
              ],
            ]}
          />
        </>
      )}
    </>
  )
}

export default Lookup
