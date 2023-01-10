import React, { useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ErrorScreen,
  ServicePortalModuleComponent,
  m as coreMessage,
  ActionCard,
  EmptyState,
  CardLoader,
} from '@island.is/service-portal/core'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Bullet,
  BulletList,
  Button,
  GridColumn,
  GridRow,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { messages as m } from '../../lib/messages'
import copyToClipboard from 'copy-to-clipboard'
import { ModuleAlertBannerSection } from '@island.is/service-portal/core'

const AirDiscountQuery = gql`
  query AirDiscountQuery {
    airDiscountSchemeDiscounts {
      nationalId
      discountCode
      connectionDiscountCodes {
        code
        flightId
        flightDesc
        validUntil
      }
      expiresIn
      user {
        name
        fund {
          credit
          used
          total
        }
      }
    }
  }
`

const AirDiscountFlightLegsQuery = gql`
  query AirDiscountFlightLegsQuery {
    airDiscountSchemeUserAndRelationsFlights {
      flight {
        bookingDate
        user {
          nationalId
        }
        flightLegs {
          travel
          flight {
            id
          }
        }
      }
    }
  }
`

type CopiedCode = {
  code: string
  copied: boolean
}

export const AirDiscountOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.air-discount')
  const { formatMessage } = useLocale()
  const { data, loading, error } = useQuery<Query>(AirDiscountQuery)
  const {
    data: flightLegData,
    loading: flightLegLoading,
    error: flightLegError,
  } = useQuery<Query>(AirDiscountFlightLegsQuery)

  const [copiedCodes, setCopiedCodes] = useState<CopiedCode[]>([])
  const airDiscounts = data?.airDiscountSchemeDiscounts
  console.log(flightLegData)

  console.log(airDiscounts)
  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(coreMessage.errorTitle)}
        title={formatMessage(coreMessage.somethingWrong)}
        children={formatMessage(coreMessage.errorFetchModule, {
          module: formatMessage(coreMessage.airDiscount).toLowerCase(),
        })}
      />
    )
  }

  const copy = (code: string) => {
    copyToClipboard(code)
    const newCode: CopiedCode = { code: code, copied: true }
    setCopiedCodes([...copiedCodes, newCode])
    toast.success(formatMessage(m.codeCopiedSuccess))
  }

  return (
    <>
      <Box marginBottom={[3, 4, 5]}>
        <GridRow marginBottom={2}>
          <GridColumn span={['8/8', '5/8']} order={1}>
            <Text variant="h3" as="h1">
              {formatMessage(m.introTitle)}
            </Text>

            <Text variant="default" paddingTop={2}>
              {formatMessage(m.introLink, {
                link: (str) => (
                  <a href="http://island.is">
                    <Button variant="text">{str}</Button>
                  </a>
                ),
              })}
            </Text>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/8']} order={3} paddingTop={4}>
            <BulletList>
              <Bullet>{formatMessage(m.discountTextFirst)}</Bullet>
              <Bullet>{formatMessage(m.discountTextSecond)}</Bullet>
            </BulletList>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '6/8']} order={3} paddingTop={4}>
            <ModuleAlertBannerSection />
          </GridColumn>
        </GridRow>

        <AlertMessage
          type="warning"
          title={formatMessage(m.attention)}
          message={formatMessage(m.codeRenewalText)}
        />
      </Box>
      {loading && <CardLoader />}
      {data && (
        <Box marginBottom={3}>
          <Text variant="eyebrow" paddingBottom={1} color="purple600">
            {formatMessage(m.myRights)}
          </Text>
          <Stack space={2}>
            {airDiscounts?.map((item, index) => {
              const message = [
                formatMessage(m.remainingAirfares),
                item.user.fund?.credit,
                formatMessage(m.of),
                item.user.fund?.total,
              ]
                .filter((x) => x !== null)
                .join(' ')
              const isCopied = copiedCodes.find(
                (x) => x.code === item.discountCode,
              )?.copied
              return (
                <ActionCard
                  key={`loftbru-item-${index}`}
                  heading={item.user.name}
                  text={message}
                  secondaryText={
                    item.user.fund?.credit === 0 ? undefined : item.discountCode
                  }
                  cta={{
                    label: formatMessage(m.copyCode),
                    onClick: () => copy(item.discountCode),
                    centered: true,
                    icon: isCopied ? 'checkmark' : 'copy',
                    hide: item.user.fund?.credit === 0,
                  }}
                />
              )
            })}
          </Stack>
        </Box>
      )}

      {!loading && !error && airDiscounts?.length === 0 && (
        <Box marginTop={8}>
          <EmptyState />
        </Box>
      )}
    </>
  )
}

export default AirDiscountOverview
