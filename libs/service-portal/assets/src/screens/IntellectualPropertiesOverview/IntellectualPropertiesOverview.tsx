import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  CardLoader,
  EmptyState,
  HUGVERKASTOFAN_SLUG,
  IntroHeader,
  m,
} from '@island.is/service-portal/core'
import { Box } from '@island.is/island-ui/core'
import { ipMessages, ipMessages as messages } from '../../lib/messages'
import { useGetIntellectualPropertiesQuery } from './IntellectualPropertiesOverview.generated'
import { isDefined } from '@island.is/shared/utils'
import { AssetsPaths } from '../../lib/paths'
import { Problem } from '@island.is/react-spa/shared'

const IntellectualPropertiesOverview = () => {
  useNamespaces('sp.intellectual-property')
  const { formatMessage } = useLocale()

  const { loading, data, error } = useGetIntellectualPropertiesQuery()

  const generateActionCard = (
    index: number,
    heading?: string | null,
    ipId?: string | null,
    description?: string | null,
    url?: string | null,
    tag?: string | null,
  ) => (
    <Box marginBottom={3} key={index}>
      <ActionCard
        text={`${ipId}${description ? ' - ' + description : ''}`}
        heading={heading ?? ''}
        cta={{
          label: formatMessage(m.view),
          variant: 'text',
          url: url ?? '',
        }}
        tag={{
          variant: 'blue',
          outlined: false,
          label: tag ?? '',
        }}
      />
    </Box>
  )

  if (error && !loading) {
    return <Problem error={error} />
  }

  if (!data?.intellectualProperties?.totalCount && !loading) {
    return <Problem type="no_data" />
  }

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={ipMessages.title}
        intro={ipMessages.description}
        serviceProviderSlug={HUGVERKASTOFAN_SLUG}
        serviceProviderTooltip={formatMessage(m.intellectualPropertiesTooltip)}
      />
      {loading && (
        <Box marginBottom={2}>
          <CardLoader />
        </Box>
      )}
      {!loading && (data?.intellectualProperties?.totalCount ?? 0) < 1 && (
        <Box width="full" marginTop={4} display="flex" justifyContent="center">
          <Box marginTop={8}>
            return <Problem type="no_data" />
          </Box>
        </Box>
      )}
      {!loading &&
        !error &&
        data?.intellectualProperties?.items
          ?.map((ip, index) => {
            switch (ip.__typename) {
              case 'IntellectualPropertiesDesign':
                if (!ip.id) {
                  return null
                }
                return generateActionCard(
                  index,
                  ip.specification?.description,
                  ip.id,
                  undefined,
                  AssetsPaths.AssetsIntellectualPropertiesDesign.replace(
                    ':id',
                    ip.id,
                  ),
                  ip.status,
                )
              case 'IntellectualPropertiesPatentIS':
              case 'IntellectualPropertiesPatentEP':
              case 'IntellectualPropertiesSPC':
                return generateActionCard(
                  index,
                  ip.name,
                  ip.applicationNumber,
                  undefined,
                  AssetsPaths.AssetsIntellectualPropertiesPatent.replace(
                    ':id',
                    ip.applicationNumber ?? '',
                  ),
                  ip.statusText,
                )
              case 'IntellectualPropertiesTrademark':
                return generateActionCard(
                  index,
                  ip.text,
                  ip.id,
                  ip.type,
                  AssetsPaths.AssetsIntellectualPropertiesTrademark.replace(
                    ':id',
                    ip.id ?? '',
                  ),
                  ip.status,
                )
              default:
                return null
            }
          })
          .filter(isDefined)}
    </Box>
  )
}

export default IntellectualPropertiesOverview
