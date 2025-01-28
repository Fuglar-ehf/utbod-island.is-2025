import { Button } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  HEALTH_DIRECTORATE_SLUG,
  InfoLine,
  InfoLineStack,
  IntroWrapper,
  LinkResolver,
} from '@island.is/portals/my-pages/core'
import React from 'react'
import { messages } from '../../lib/messages'
import { useParams } from 'react-router-dom'
import { useGetWaitlistsQuery } from './Waitlists.generated'
import { isDefined } from '@island.is/shared/utils'
import { Problem } from '@island.is/react-spa/shared'

type UseParams = {
  id: string
}

const WaitlistsDetail: React.FC = () => {
  useNamespaces('sp.health')
  const { formatMessage, lang } = useLocale()

  const { id } = useParams() as UseParams

  const { data, loading, error } = useGetWaitlistsQuery({
    variables: { locale: lang },
  })

  const waitlist = data?.healthDirectorateWaitlists.waitlists.find(
    (item) => item.id === id,
  )

  return (
    <IntroWrapper
      title={formatMessage(messages.waitlists)}
      intro={formatMessage(messages.waitlistsIntro)}
      serviceProviderSlug={HEALTH_DIRECTORATE_SLUG}
      serviceProviderTooltip={formatMessage(
        messages.landlaeknirVaccinationsTooltip,
      )}
      buttonGroup={[
        <LinkResolver href={'/'} key="link-to-detail-info">
          <Button variant="utility" size="small" icon="open" iconType="outline">
            {formatMessage(messages.moreDetail)}
          </Button>
        </LinkResolver>,
      ]}
      marginBottom={6}
    >
      {!loading && !error && isDefined(waitlist) && (
        <Problem
          type="no_data"
          message={formatMessage(messages.noWaitlists)}
          imgSrc="./assets/images/nodata.svg"
        />
      )}
      {error && !loading && <Problem error={error} noBorder={false} />}

      <InfoLineStack space={1}>
        <InfoLine label="Biðlisti" content="Liðskiptiaðgerð á hné" />
        <InfoLine
          label="Stofnun"
          content="Landspítalinn"
          button={{
            type: 'link',
            label: formatMessage(messages.organizationWebsite),
            to: '/',
            icon: 'open',
          }}
        />
        <InfoLine label="Skráning á lista" content="08.10.2023" />
        <InfoLine label="Staða" content="Samþykktur á lista" />
        <InfoLine label="Staða síðast uppfærð" content="23.11.2023" />
        <InfoLine label="Nafn læknis" content="Sóley Gunnarsdóttir" />
      </InfoLineStack>
    </IntroWrapper>
  )
}

export default WaitlistsDetail
