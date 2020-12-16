import {
  ArrowLink,
  Box,
  Bullet,
  BulletList,
  GridColumn,
  GridRow,
  Inline,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { servicePortalOutboundLink } from '@island.is/plausible'

interface Props {
  title: MessageDescriptor
  intro: MessageDescriptor
  list?: {
    title: MessageDescriptor
    items: MessageDescriptor[]
  }
  externalHref?: string
  externalLinkTitle?: MessageDescriptor
  institutionTitle: MessageDescriptor
  institutionSubtitle: MessageDescriptor
  institutionDescription: MessageDescriptor
  institutionHref: string
  institutionLinkTitle: MessageDescriptor
  figure: string
}

export const InfoScreen: FC<Props> = ({
  title,
  intro,
  list,
  externalHref,
  externalLinkTitle,
  figure,
}) => {
  const { formatMessage } = useLocale()
  const trackExternalLinkClick = () => {
    servicePortalOutboundLink()
  }
  return (
    <>
      <Box marginBottom={[4, 6, 9]}>
        <GridRow>
          <GridColumn span={['12/12', '7/12']} order={[2, 1]}>
            <Box marginBottom={2}>
              <Box display="flex" marginBottom={[2, 3]}>
                <Inline space={1}>
                  <Text variant="h1" as="h1">
                    {formatMessage(title)}
                  </Text>
                  <Tag variant="blue" outlined>
                    {formatMessage({
                      id: 'service.portal:in-progress',
                      defaultMessage: 'Í vinnslu',
                    })}
                  </Tag>
                </Inline>
              </Box>
              <Box marginBottom={[3, 4, 6]}>
                <Text variant="intro">{formatMessage(intro)}</Text>
              </Box>
              {list && (
                <>
                  <Box marginBottom={[2, 3]}>
                    <Text variant="h2" as="h2">
                      {formatMessage(list.title)}
                    </Text>
                  </Box>
                  <BulletList>
                    {list.items.map((item, index) => (
                      <Bullet key={index}>{formatMessage(item)}</Bullet>
                    ))}
                  </BulletList>
                </>
              )}
              {externalHref && externalLinkTitle && (
                <Box marginTop={[3, 4]}>
                  <ArrowLink
                    href={externalHref}
                    onClick={trackExternalLinkClick}
                  >
                    {formatMessage(externalLinkTitle)}
                  </ArrowLink>
                </Box>
              )}
            </Box>
          </GridColumn>
          <GridColumn span={['12/12', '5/12']} order={[1, 2]}>
            <Box marginBottom={[3, 0]}>
              <img src={figure} alt={`skrautmynd fyrir ${title}`} />
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
    </>
  )
}
