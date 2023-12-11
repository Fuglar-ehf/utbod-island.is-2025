import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import {
  ErrorScreen,
  HUGVERKASTOFAN_SLUG,
  IntroHeader,
  NotFound,
  TableGrid,
  UserInfoLine,
  formatDate,
  m,
} from '@island.is/service-portal/core'
import { ipMessages } from '../../lib/messages'
import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Inline,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import Timeline from '../../components/Timeline/Timeline'
import chunk from 'lodash/chunk'
import { useGetIntellectualPropertiesPatentByIdQuery } from './IntellectualPropertiesPatentDetail.generated'
import { isDefined } from '@island.is/shared/utils'
import { Problem } from '@island.is/react-spa/shared'

type UseParams = {
  id: string
}

const IntellectualPropertiesPatentDetail = () => {
  useNamespaces('sp.intellectual-property')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetIntellectualPropertiesPatentByIdQuery({
    variables: {
      input: {
        key: id,
      },
    },
  })

  if (error && !loading) {
    return <Problem type="internal_service_error" />
  }

  if (!data?.intellectualPropertiesPatent && !loading) {
    return <NotFound title={formatMessage(m.notFound)} />
  }

  const ip = data?.intellectualPropertiesPatent
  return (
    <>
      <Box marginBottom={[1, 1, 3]}>
        <IntroHeader
          title={id}
          serviceProviderSlug={HUGVERKASTOFAN_SLUG}
          serviceProviderTooltip={formatMessage(
            m.intellectualPropertiesTooltip,
          )}
        />
      </Box>
      <Stack space="containerGutter">
        <GridRow>
          <GridColumn span="12/12">
            <Box marginBottom={3} paddingRight={2}>
              <Inline space={2}>
                <Button
                  size="medium"
                  icon="reader"
                  iconType="outline"
                  variant="utility"
                >
                  {'Veðsetning'}
                </Button>
                <Button
                  size="medium"
                  icon="reader"
                  iconType="outline"
                  variant="utility"
                >
                  {'Nytjaleyfi'}
                </Button>
                <Button
                  size="medium"
                  icon="reader"
                  iconType="outline"
                  variant="utility"
                >
                  {'Afturköllun'}
                </Button>
              </Inline>
            </Box>
          </GridColumn>
        </GridRow>
        <Stack space="p2">
          <UserInfoLine
            title={formatMessage(ipMessages.baseInfo)}
            label={ipMessages.name}
            content={ip?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={ipMessages.status}
            content={ip?.statusText ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        {!loading && !error && (
          <>
            <Timeline title={'Tímalína'}>
              {[
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.lifecycle.applicationDate
                      ? formatDate(ip.lifecycle.applicationDate)
                      : ''}
                  </Text>
                  <Text>Umsókn</Text>
                </Stack>,
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.lifecycle.registrationDate
                      ? formatDate(ip.lifecycle.registrationDate)
                      : ''}
                  </Text>
                  <Text>Skráning</Text>
                </Stack>,
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.lifecycle.applicationDatePublishedAsAvailable
                      ? formatDate(
                          ip.lifecycle.applicationDatePublishedAsAvailable,
                          'dd.MM.yy',
                        )
                      : ''}
                  </Text>
                  <Text>Birting</Text>
                </Stack>,
                <Stack space="smallGutter">
                  <Text variant="h5">
                    {ip?.lifecycle.maxValidObjectionDate
                      ? formatDate(
                          ip.lifecycle.maxValidObjectionDate,
                          'dd.MM.yy',
                        )
                      : ''}
                  </Text>
                  <Text>Andmælafrestur</Text>
                </Stack>,
              ]}
            </Timeline>
            <TableGrid
              title={'Upplýsingar'}
              dataArray={chunk(
                [
                  {
                    title: 'Umsóknardagur',
                    value: ip?.lifecycle.applicationDate
                      ? formatDate(ip.lifecycle.applicationDate)
                      : '',
                  },
                  {
                    title: 'Umsóknarnúmer',
                    value: ip?.applicationNumber
                      ? formatDate(ip?.applicationNumber)
                      : '',
                  },
                  {
                    title: 'Birtingardagur',
                    value: ip?.lifecycle.applicationDatePublishedAsAvailable
                      ? formatDate(
                          ip.lifecycle.applicationDatePublishedAsAvailable,
                          'dd.MM.yy',
                        )
                      : '',
                  },
                  /* {
                    title: 'Flokkun',
                    value: ip?.internalClassifications?.[0]?.category ?? '',
                  },*/
                  {
                    title: 'Andmælafrestur',
                    value: ip?.lifecycle.maxValidObjectionDate
                      ? formatDate(
                          ip?.lifecycle.maxValidObjectionDate,
                          'dd.MM.yy',
                        )
                      : '',
                  },
                  {
                    title: 'Staða',
                    value: ip?.statusText ?? '',
                  },
                  {
                    title: 'Skráningardagur',
                    value: ip?.lifecycle.registrationDate
                      ? formatDate(ip.lifecycle.registrationDate)
                      : '',
                  },
                  {
                    title: '',
                    value: '',
                  },
                ].filter(isDefined),
                2,
              )}
            />
          </>
        )}
        <Stack space="p2">
          <UserInfoLine
            title="Eigandi"
            label="Nafn"
            content={ip?.owner?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label="Heimilsfang"
            content={ip?.owner?.address ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        <Stack space="p2">
          <UserInfoLine
            title="Hönnuður"
            label="Nafn"
            content={ip?.inventors?.[0]?.name ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        <Stack space="p2">
          <UserInfoLine
            title="Umboðsmaður"
            label="Nafn"
            content={ip?.agent?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label="Heimilisfang"
            content={ip?.agent?.address ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        <Text variant="small" paddingBottom={2}>
          Lorem ipsum dolor sit amet consectetur. Sem libero at mi feugiat diam.
          Turpis quam dignissim eleifend lectus venenatis. Nullam et aliquet
          augue ultrices dignissim nibh. Orci justo diam tincidunt et ut.
          Egestas tincidunt aliquam consectetur feugiat lectus. Risus fringilla
          vitae nec id lectus ullamcorper.
        </Text>
      </Stack>
    </>
  )
}

export default IntellectualPropertiesPatentDetail
