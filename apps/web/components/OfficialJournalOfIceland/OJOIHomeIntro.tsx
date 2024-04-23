import React, { ReactNode } from 'react'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  Input,
  Tag,
  TagVariant,
  Text,
} from '@island.is/island-ui/core'
import { Organization } from '@island.is/web/graphql/schema'

import * as s from './OJOIHomeIntro.css'

export type OJOIHomeIntroProps = {
  organization?: Organization
  breadCrumbs: ReactNode
  searchPlaceholder: string
  quickLinks: Array<{ title: string; href: string; variant?: TagVariant }>
  searchUrl: string
  shortcutsTitle: string
  featuredImage?: string
}

export const OJOIHomeIntro = (props: OJOIHomeIntroProps) => {
  const organization = props.organization

  if (!organization) {
    return null
  }

  return (
    <GridContainer>
      <GridRow>
        <GridColumn
          offset={['0', '0', '0', '0', '1/12']}
          span={['1/1', '1/1', '1/1', '9/12', '7/12']}
          paddingTop={[0, 0, 0, 8]}
          paddingBottom={2}
        >
          {props.breadCrumbs}

          <Text as="h1" variant="h1" marginTop={2} marginBottom={2}>
            {organization && organization.title}
          </Text>

          {organization?.description && (
            <Text variant="default">{organization?.description}</Text>
          )}

          <Box paddingTop={6} component="form" action={props.searchUrl}>
            <Input
              id="q"
              name="q"
              placeholder={props.searchPlaceholder}
              backgroundColor={['blue']}
              size="md"
              icon={{ name: 'search', type: 'outline' }}
            />
          </Box>

          <Box paddingTop={4}>
            <Text variant="eyebrow" as="h3" paddingBottom={1} color="purple400">
              {props.shortcutsTitle}
            </Text>
            <Inline space={1}>
              {props.quickLinks.map((q, i) => (
                <Tag key={i} href={q.href} variant={q.variant}>
                  {q.title}
                </Tag>
              ))}
            </Inline>
          </Box>
        </GridColumn>

        {props.featuredImage && (
          <GridColumn span="3/12" hiddenBelow="lg" paddingTop={[0, 0, 0, 2]}>
            <Box
              display="flex"
              height="full"
              justifyContent="center"
              alignItems="center"
            >
              <img className={s.introImage} src={props.featuredImage} alt="" />
            </Box>
          </GridColumn>
        )}
      </GridRow>
    </GridContainer>
  )
}
