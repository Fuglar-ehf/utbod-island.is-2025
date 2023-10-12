import React from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import {
  ErrorScreen,
  ExcludesFalse,
  IntroHeader,
  MultiImage,
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
  Inline,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import Timeline from '../../components/Timeline/Timeline'
import chunk from 'lodash/chunk'
import { useGetIntellectualPropertyDesignQuery } from './IntellectualPropertiesDesignDetail.generated'

type UseParams = {
  id: string
}

const IntellectualPropertiesDesignDetail = () => {
  useNamespaces('sp.intellectual-property')
  const { formatMessage } = useLocale()
  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetIntellectualPropertyDesignQuery({
    variables: {
      input: {
        key: id,
      },
    },
  })

  if (error && !loading) {
    return (
      <ErrorScreen
        figure="./assets/images/hourglass.svg"
        tagVariant="red"
        tag={formatMessage(m.errorTitle)}
        title={formatMessage(m.somethingWrong)}
        children={formatMessage(m.errorFetchModule, {
          module: formatMessage(m.intellectualProperty).toLowerCase(),
        })}
      />
    )
  }

  if (!data?.intellectualPropertyDesign && !loading) {
    return <NotFound title={formatMessage(m.notFound)} />
  }

  const ip = data?.intellectualPropertyDesign

  return (
    <>
      <Box marginBottom={[1, 1, 3]}>
        <IntroHeader title={id} />
      </Box>

      <Stack space="containerGutter">
        <Box marginBottom={3} paddingRight={2}>
          <Inline space={2}>
            <Button
              size="medium"
              icon="reader"
              iconType="outline"
              variant="utility"
            >
              {'Ógilding'}
            </Button>
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
        <MultiImage
          loading={loading}
          images={data?.intellectualPropertyDesignImageList?.images ?? []}
          title="Design images"
        />
        <Stack space="p2">
          <UserInfoLine
            title={formatMessage(ipMessages.baseInfo)}
            label={formatMessage(ipMessages.name)}
            content={ip?.specification?.specificationText ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(ipMessages.description)}
            content={ip?.specification?.description ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label={formatMessage(ipMessages.status)}
            content={ip?.status ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        {!loading && !error && (
          <>
            <Timeline
              title={'Tímalína'}
              maxDate={ip?.expiryDate}
              minDate={ip?.internationalRegistrationDate}
            >
              <Stack space="smallGutter">
                <Text variant="h5">
                  {ip?.internationalRegistrationDate
                    ? formatDate(ip.internationalRegistrationDate, 'dd.MM.yy')
                    : ''}
                </Text>
                <Text>
                  {formatMessage(ipMessages.internationalRegistration)}
                </Text>
              </Stack>
              <Stack space="smallGutter">
                <Text variant="h5">
                  {ip?.expiryDate ? formatDate(ip.expiryDate, 'dd.MM.yy') : ''}
                </Text>
                <Text>{formatMessage(ipMessages.expires)}</Text>
              </Stack>
            </Timeline>
            <TableGrid
              title={'Aðrar upplýsingar'}
              dataArray={chunk(
                [
                  {
                    title: formatMessage(
                      ipMessages.internationalRegistrationDate,
                    ),
                    value: ip?.internationalRegistrationDate
                      ? formatDate(ip.internationalRegistrationDate, 'dd.MM.yy')
                      : '',
                  },
                  {
                    title: 'Umsóknarnúmer',
                    value: ip?.applicationNumber ?? '',
                  },
                  {
                    title: 'Flokkun',
                    value: ip?.classification?.[0] ?? '',
                  },
                  {
                    title: 'Umsóknardagur',
                    value: ip?.registrationDate
                      ? formatDate(ip.registrationDate, 'dd.MM.yy')
                      : '',
                  },
                  {
                    title: 'Flokkun',
                    value: ip?.status ?? '',
                  },
                ].filter(Boolean as unknown as ExcludesFalse),
                2,
              )}
            />
          </>
        )}
        <Stack space="p2">
          <UserInfoLine
            title="Eigandi"
            label="Nafn"
            content={ip?.owners?.[0]?.name ?? ''}
            loading={loading}
          />
          <Divider />
          <UserInfoLine
            label="Heimilsfang"
            content={ip?.owners?.[0]?.address ?? ''}
            loading={loading}
          />
          <Divider />
        </Stack>
        <Stack space="p2">
          <UserInfoLine
            title="Hönnuður"
            label="Nafn"
            content={ip?.designers?.[0]?.name ?? ''}
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

export default IntellectualPropertiesDesignDetail
