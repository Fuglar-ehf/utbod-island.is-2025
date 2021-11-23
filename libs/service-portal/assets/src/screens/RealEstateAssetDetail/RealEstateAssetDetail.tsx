import React from 'react'
import { useParams } from 'react-router-dom'
import { defineMessage } from 'react-intl'
import { useQuery, useLazyQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import { useNamespaces, useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import {
  ServicePortalModuleComponent,
  IntroHeader,
  NotFound,
} from '@island.is/service-portal/core'
import TableUnits from '../../components/TableUnits'
import AssetGrid from '../../components/AssetGrid'
import AssetLoader from '../../components/AssetLoader'
import AssetDisclaimer from '../../components/AssetDisclaimer'
import { Fasteign, ThinglysturEigandi } from '@island.is/clients/assets'
import amountFormat from '../../utils/amountFormat'
import { ownersArray } from '../../utils/createUnits'
import { messages } from '../../lib/messages'
import {
  GET_SINGLE_PROPERTY_QUERY,
  GET_PROPERTY_OWNERS_QUERY,
} from '../../lib/queries'
import DetailHeader from '../../components/DetailHeader'
import { DEFAULT_PAGING_ITEMS } from '../../utils/const'

export const AssetsOverview: ServicePortalModuleComponent = () => {
  useNamespaces('sp.assets')
  const { formatMessage } = useLocale()
  const { id }: { id: string | undefined } = useParams()

  const { loading, error, data } = useQuery<Query>(GET_SINGLE_PROPERTY_QUERY, {
    variables: {
      input: {
        assetId: id,
      },
    },
  })
  const assetData: Fasteign = data?.getRealEstateDetail || {}

  const [
    getEigendurQuery,
    { loading: ownerLoading, error: ownerError, fetchMore, ...eigendurQuery },
  ] = useLazyQuery(GET_PROPERTY_OWNERS_QUERY)
  const eigendurPaginationData: ThinglysturEigandi[] =
    eigendurQuery?.data?.getThinglystirEigendur.thinglystirEigendur || []

  const assetOwners: ThinglysturEigandi[] =
    assetData.thinglystirEigendur?.thinglystirEigendur || []

  const combinedOwnerArray = [...assetOwners, ...eigendurPaginationData]

  const owners = ownersArray(combinedOwnerArray)

  const paginate = () => {
    const variableObject = {
      variables: {
        input: {
          assetId: assetData?.fasteignanumer,
          cursor: Math.ceil(
            eigendurPaginationData.length / DEFAULT_PAGING_ITEMS + 1,
          ).toString(),
        },
      },
    }

    if (fetchMore) {
      fetchMore({
        ...variableObject,
        updateQuery: (prevResult, { fetchMoreResult }) => {
          fetchMoreResult.getThinglystirEigendur.thinglystirEigendur = [
            ...prevResult.getThinglystirEigendur.thinglystirEigendur,
            ...fetchMoreResult.getThinglystirEigendur.thinglystirEigendur,
          ]
          return fetchMoreResult
        },
      })
    } else {
      getEigendurQuery(variableObject)
    }
  }

  if (loading) {
    return <AssetLoader />
  }

  if (!id || error) {
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.assets',
          defaultMessage: 'Fasteign fannst ekki',
        })}
      />
    )
  }

  const paginateOwners =
    eigendurQuery?.data?.getThinglystirEigendur.paging?.hasNextPage ||
    (assetData.thinglystirEigendur?.paging?.hasNextPage &&
      !eigendurQuery?.data?.getThinglystirEigendur?.paging)
  return (
    <>
      <Box marginBottom={[3, 4, 5]}>
        <IntroHeader
          title={defineMessage({
            id: 'sp.assets:title',
            defaultMessage: 'Fasteignir',
          })}
          intro={defineMessage({
            id: 'sp.assets:intro',
            defaultMessage:
              'Hér færðu upplýsingar úr fasteignaskrá um fasteignir þínar, lönd og lóðir sem þú ert skráður eigandi að.',
          })}
          img="./assets/images/sofa.svg"
          hideImgPrint
        />
      </Box>
      <DetailHeader
        title={`${assetData?.sjalfgefidStadfang?.birtingStutt} - ${assetData?.fasteignanumer}`}
      />
      <Box>
        <TableUnits
          paginateCallback={() => paginate()}
          tables={[
            {
              header: [
                formatMessage(messages.legalOwners),
                formatMessage(messages.ssn),
                formatMessage(messages.authorization),
                formatMessage(messages.holdings),
                formatMessage(messages.purchaseDate),
              ],
              rows: owners,
              paginate: paginateOwners,
            },
            {
              header: [
                `${formatMessage(messages.appraisal)} ${
                  assetData.fasteignamat?.gildandiAr
                }`,
                `${formatMessage(messages.appraisal)} ${
                  assetData.fasteignamat?.fyrirhugadAr
                }`,
              ],
              rows: [
                [
                  assetData.fasteignamat?.gildandiFasteignamat
                    ? amountFormat(assetData.fasteignamat?.gildandiFasteignamat)
                    : '',
                  assetData.fasteignamat?.fyrirhugadFasteignamat
                    ? amountFormat(
                        assetData.fasteignamat?.fyrirhugadFasteignamat,
                      )
                    : '',
                ],
              ],
            },
          ]}
        />
      </Box>
      <Box marginTop={7}>
        {assetData?.notkunareiningar?.notkunareiningar &&
        assetData?.notkunareiningar?.notkunareiningar?.length > 0 ? (
          <AssetGrid
            title={formatMessage(messages.unitsOfUse)}
            locationData={assetData?.sjalfgefidStadfang}
            units={assetData?.notkunareiningar}
            assetId={assetData?.fasteignanumer}
          />
        ) : null}
      </Box>
      <Box marginTop={8}>
        <AssetDisclaimer />
      </Box>
    </>
  )
}

export default AssetsOverview
