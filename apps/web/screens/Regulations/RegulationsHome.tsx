import {
  RegulationLawChapterTree,
  RegulationListItem,
  RegulationMinistryList,
  RegulationSearchResults,
} from './Regulations.types'

import {
  RegulationHomeTexts,
  regulationsSearchResults,
} from './Regulations.mock'

import React from 'react'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import getConfig from 'next/config'
import { CustomNextError } from '@island.is/web/units/errors'
import { SubpageDetailsContent } from '@island.is/web/components'
import { RegulationsHomeImg } from './RegulationsHomeImg'
import { SubpageLayout } from '@island.is/web/screens/Layouts/Layouts'
import {
  Box,
  Breadcrumbs,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useNamespaceStrict as useNamespace } from '@island.is/web/hooks'
import {
  RegulationSearchFilters,
  RegulationsSearchSection,
} from './RegulationsSearchSection'
import { shuffle } from 'lodash'
import { getParams, useRegulationLinkResolver } from './regulationUtils'
import { getUiTexts } from './getUiTexts'
import {
  GetRegulationsSearchQuery,
  QueryGetRegulationsSearchArgs,
  GetRegulationsQuery,
  QueryGetRegulationsArgs,
  GetRegulationsYearsQuery,
  GetRegulationsMinistriesQuery,
  GetRegulationsLawChaptersQuery,
  QueryGetRegulationsLawChaptersArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_REGULATIONS_SEARCH_QUERY,
  GET_REGULATIONS_LAWCHAPTERS_QUERY,
  GET_REGULATIONS_MINISTRIES_QUERY,
  GET_REGULATIONS_QUERY,
  GET_REGULATIONS_YEARS_QUERY,
} from '../queries'

const { publicRuntimeConfig } = getConfig()

// ---------------------------------------------------------------------------

type RegulationsHomeProps = {
  regulations: RegulationSearchResults
  texts: RegulationHomeTexts
  searchQuery: RegulationSearchFilters
  years: ReadonlyArray<number>
  ministries: RegulationMinistryList
  lawChapters: Readonly<RegulationLawChapterTree>
  doSearch: boolean
}

const RegulationsHome: Screen<RegulationsHomeProps> = (props) => {
  const { disableRegulationsPage: disablePage } = publicRuntimeConfig
  if (disablePage === 'true') {
    throw new CustomNextError(404, 'Not found')
  }

  const txt = useNamespace(props.texts)
  const { linkResolver, linkToRegulation } = useRegulationLinkResolver()
  const totalItems = props.regulations?.totalItems ?? 0

  const breadCrumbs = (
    <Box display={['none', 'none', 'block']}>
      {/* Show when NOT a device */}
      <Breadcrumbs
        items={[
          {
            title: txt('crumbs_1'),
            href: linkResolver('homepage').href,
          },
          {
            title: txt('crumbs_2'),
            href: linkResolver('article').href,
          },
          {
            title: txt('crumbs_3'),
            href: linkResolver('regulationshome').href,
          },
        ]}
      />
    </Box>
  )

  return (
    <SubpageLayout
      main={
        <>
          <GridContainer>
            <GridRow>
              <GridColumn
                offset={['0', '0', '0', '0', '1/12']}
                span={['1/1', '1/1', '1/1', '9/12', '7/12']}
                paddingTop={[0, 0, 0, 8]}
                paddingBottom={[4, 4, 4, 4, 1]}
              >
                {breadCrumbs}
                <Text as="h1" variant="h1" marginTop={2}>
                  {txt('homeIntroLegend')}
                </Text>
                <Text variant="intro" as="p">
                  {txt('homeIntro')}
                </Text>
              </GridColumn>

              <GridColumn
                span="3/12"
                hiddenBelow="lg"
                paddingTop={[0, 0, 0, 2]}
                paddingBottom={0}
              >
                <RegulationsHomeImg />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span="12/12" paddingTop={0} paddingBottom={[4, 4, 4]}>
                <RegulationsSearchSection
                  searchFilters={props.searchQuery}
                  lawChapters={props.lawChapters}
                  ministries={props.ministries}
                  years={props.years}
                  texts={props.texts}
                />
              </GridColumn>
            </GridRow>
          </GridContainer>
        </>
      }
      details={
        <SubpageDetailsContent
          header=""
          content={
            <GridContainer>
              {props.doSearch && (
                <GridRow>
                  <GridColumn span={'10/12'} paddingTop={3} paddingBottom={4}>
                    <p>
                      {totalItems === 0
                        ? 'Engar reglugerðir fundust fyrir þessi leitarskilyrði.'
                        : String(totalItems).substr(-1) === '1'
                        ? totalItems + ' reglugerð fannst'
                        : `${totalItems} reglugerðir fundust${
                            totalItems > props.regulations.perPage
                              ? ', sýni ' +
                                Math.min(totalItems, props.regulations?.perPage)
                              : ''
                          }
                          `}
                    </p>
                  </GridColumn>
                </GridRow>
              )}
              <GridRow>
                {props.regulations?.data?.length > 0 &&
                  props.regulations.data.map((reg, i) => (
                    <GridColumn
                      key={reg.name}
                      span={['1/1', '1/2', '1/2', '1/3']}
                      paddingTop={3}
                      paddingBottom={4}
                    >
                      <CategoryCard
                        href={linkToRegulation(reg.name)}
                        heading={reg.name}
                        text={reg.title}
                        tags={
                          reg.ministry && [
                            {
                              label: reg.ministry.name ?? reg.ministry,
                              disabled: true,
                            },
                          ]
                        }
                      />
                    </GridColumn>
                  ))}
              </GridRow>
            </GridContainer>
          }
        />
      }
    />
  )
}

RegulationsHome.getInitialProps = async (ctx) => {
  const { apolloClient, locale, query } = ctx
  const serviceId = String(query.slug)
  const searchQuery = getParams(query, ['q', 'rn', 'year', 'ch', 'all'])
  const doSearch = Object.values(searchQuery).some((value) => !!value)

  const [
    texts,
    regulations,
    years,
    ministries,
    lawChapters,
  ] = await Promise.all([
    await getUiTexts<RegulationHomeTexts>(
      apolloClient,
      locale,
      'Regulations_Home',
    ),

    doSearch
      ? apolloClient
          .query<GetRegulationsSearchQuery, QueryGetRegulationsSearchArgs>({
            query: GET_REGULATIONS_SEARCH_QUERY,
            variables: {
              input: {
                q: searchQuery.q,
                rn: searchQuery.rn,
                year: searchQuery.year,
                ch: searchQuery.ch,
              },
            },
          })
          .then(
            (res) => res.data?.getRegulationsSearch as RegulationSearchResults,
          )
      : apolloClient
          .query<GetRegulationsQuery, QueryGetRegulationsArgs>({
            query: GET_REGULATIONS_QUERY,
            variables: {
              input: {
                type: 'newest',
                page: 1,
              },
            },
          })
          .then((res) => res.data?.getRegulations as RegulationSearchResults),

    apolloClient
      .query<GetRegulationsYearsQuery>({
        query: GET_REGULATIONS_YEARS_QUERY,
      })
      .then((res) => res.data?.getRegulationsYears as Array<number>),

    apolloClient
      .query<GetRegulationsMinistriesQuery>({
        query: GET_REGULATIONS_MINISTRIES_QUERY,
      })
      .then(
        (res) => res.data?.getRegulationsMinistries as RegulationMinistryList,
      ),

    apolloClient
      .query<
        GetRegulationsLawChaptersQuery,
        QueryGetRegulationsLawChaptersArgs
      >({
        query: GET_REGULATIONS_LAWCHAPTERS_QUERY,
        variables: {
          input: {
            tree: true,
          },
        },
      })
      .then(
        (res) =>
          res.data?.getRegulationsLawChapters as RegulationLawChapterTree,
      ),
  ])

  return {
    regulations,
    texts,
    searchQuery,
    years,
    ministries,
    lawChapters,
    doSearch,
  }
}

export default withMainLayout(RegulationsHome)
