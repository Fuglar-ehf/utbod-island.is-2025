import React, { useEffect, useState } from 'react'
import {
  Stack,
  GridContainer,
  GridRow,
  GridColumn,
  Text,
  Divider,
  Button,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useRouter } from 'next/router'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { CarDetailsBox } from '../Confirm/components'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { REQUEST_TYPES } from '@island.is/skilavottord-web/graphql/queries'
import { useQuery } from '@apollo/client'
import { RecyclingRequestTypes } from '@island.is/skilavottord-web/types'
import { getTime, getDate } from '@island.is/skilavottord-web/utils'
import { OutlinedError } from '@island.is/skilavottord-web/components'

const Completed = ({ apolloState }) => {
  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()
  const {
    t: { completed: t, routes },
  } = useI18n()

  const router = useRouter()
  const { id } = router.query

  const { data, error, loading } = useQuery(REQUEST_TYPES, {
    variables: { permno: id },
  })

  const recyclingRequests = data?.skilavottordRecyclingRequest || []
  const car = apolloState[`VehicleInformation:${id}`]

  useEffect(() => {
    if (!car) {
      router.push({
        pathname: routes.myCars,
      })
    }
  }, [car, router, routes])

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const onClose = () => {
    router.replace(routes.myCars)
  }

  const sortedRequests = recyclingRequests.slice().sort((a, b) => {
    return new Date(a.createdAt).getDate() - new Date(b.createdAt).getDate()
  })

  const latestUserRequest = sortedRequests.filter(
    (request) => request.requestType === 'pendingRecycle',
  )[0]

  const partnerRequests = sortedRequests.filter(
    (request) =>
      request.requestType === 'handedOver' ||
      request.requestType === 'deregistered' ||
      request.requestType === 'paymentInitiated' ||
      request.requestType === 'paymentFailed',
  )

  const getConfirmationText = (
    requestType: RecyclingRequestTypes,
    requestor: string,
  ) => {
    switch (requestType) {
      case 'pendingRecycle':
        return `${t.confirmedBy.user} ${requestor}`
      case 'handedOver':
        return `${t.confirmedBy.company} ${requestor}`
      case 'deregistered':
        return t.confirmedBy.authority
      case 'paymentInitiated':
      case 'paymentFailed':
        return t.confirmedBy.fund
    }
  }

  if (error || (loading && !data)) {
    return (
      <ProcessPageLayout
        sectionType={'citizen'}
        activeSection={2}
        activeCar={id.toString()}
      >
        <Stack space={3}>
          <Text variant="h1">{t.title}</Text>
          <Stack space={4}>
            <Stack space={2}>
              <Text variant="h3">{t.subTitles.summary}</Text>
            </Stack>
            {error ? (
              <OutlinedError
                title={t.error.title}
                message={t.error.message}
                primaryButton={{
                  text: `${t.error.primaryButton}`,
                  action: () => router.back(),
                }}
              />
            ) : (
              <SkeletonLoader space={2} repeat={4} />
            )}
          </Stack>
        </Stack>
      </ProcessPageLayout>
    )
  }

  return (
    <>
      {car && (
        <ProcessPageLayout
          sectionType={'citizen'}
          activeSection={2}
          activeCar={id.toString()}
        >
          <Stack space={3}>
            <Text variant="h1">{t.title}</Text>
            <Stack space={4}>
              <Stack space={2}>
                <Text variant="h3">{t.subTitles.summary}</Text>
                <CarDetailsBox car={car} />
              </Stack>
              {sortedRequests.length > 0 ? (
                <Stack space={4}>
                  <GridContainer>
                    <Stack space={4}>
                      <Stack space={2}>
                        {latestUserRequest && (
                          <GridRow>
                            <GridColumn span={['9/9', '6/9', '6/9', '6/9']}>
                              <Text>
                                {`${getConfirmationText(
                                  latestUserRequest.requestType,
                                  latestUserRequest.nameOfRequestor,
                                )}`}
                              </Text>
                            </GridColumn>
                            <GridColumn span={['9/9', '3/9', '3/9', '3/9']}>
                              <Text variant="h5">
                                {`${getDate(
                                  latestUserRequest.createdAt,
                                )} ${getTime(latestUserRequest.createdAt)}`}
                              </Text>
                            </GridColumn>
                          </GridRow>
                        )}
                      </Stack>
                      <Divider />
                      <Stack space={2}>
                        {partnerRequests.map((request) => (
                          <GridRow>
                            <GridColumn span={['9/9', '6/9', '6/9', '6/9']}>
                              <Text>
                                {`${getConfirmationText(
                                  request.requestType,
                                  request.nameOfRequestor,
                                )}`}
                              </Text>
                            </GridColumn>
                            <GridColumn span={['9/9', '3/9', '3/9', '3/9']}>
                              <Text variant="h5">
                                {`${getDate(request.createdAt)} ${getTime(
                                  request.createdAt,
                                )}`}
                              </Text>
                            </GridColumn>
                          </GridRow>
                        ))}
                      </Stack>
                    </Stack>
                  </GridContainer>
                  <Stack space={2}>
                    <Text variant="h3">{t.subTitles.payment}</Text>
                    <Text>
                      {t.info.payment}{' '}
                      <a href="https://www.fjs.is/">{t.info.paymentLinkText}</a>
                      .
                    </Text>
                  </Stack>
                </Stack>
              ) : (
                <Text>{t.info.oldDeregistration}</Text>
              )}
              <Button onClick={onClose} fluid={isMobile}>
                {t.buttons.close}
              </Button>
            </Stack>
          </Stack>
        </ProcessPageLayout>
      )}
    </>
  )
}

export default Completed
