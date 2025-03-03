import { useWindowSize } from 'react-use'

import type { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  Breadcrumbs,
  GridContainer,
  PdfViewer,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  CustomPageUniqueIdentifier,
  type GetVerdictByIdQuery,
  type GetVerdictByIdQueryVariables,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import { withCustomPageWrapper } from '../CustomPage/CustomPageWrapper'
import { GET_VERDICT_BY_ID_QUERY } from '../queries/Verdicts'
import * as styles from './VerdictDetails.css'

const calculatePdfScale = (width: number) => {
  if (width > theme.breakpoints.md) return 1.4
  if (width > theme.breakpoints.sm) return 1
  return 0.63
}

interface VerdictDetailsProps {
  item: NonNullable<GetVerdictByIdQuery['webVerdictById']>['item']
}

const VerdictDetails: Screen<VerdictDetailsProps> = ({ item }) => {
  const { width } = useWindowSize()

  return (
    <>
      <GridContainer>
        <Breadcrumbs
          items={[
            { title: 'Ísland.is', href: '/' },
            { title: 'Dómar', href: '/domar' },
          ]}
        />
      </GridContainer>
      {Boolean(item.pdfString) && (
        <Box paddingY={5} background="overlayDefault">
          <GridContainer>
            <Box
              display="flex"
              justifyContent="center"
              className={styles.pdfContainer}
              height="full"
              overflow="auto"
              boxShadow="subtle"
            >
              <PdfViewer
                file={`data:application/pdf;base64,${item.pdfString}`}
                showAllPages={true}
                scale={calculatePdfScale(width)}
              />
            </Box>
          </GridContainer>
        </Box>
      )}
      {Boolean(item.richText) && (
        <Box paddingBottom={5}>
          <GridContainer>
            <Box>{webRichText([item.richText] as SliceType[])}</Box>
          </GridContainer>
        </Box>
      )}
    </>
  )
}

VerdictDetails.getProps = async ({ apolloClient, query }) => {
  const verdictResponse = await apolloClient.query<
    GetVerdictByIdQuery,
    GetVerdictByIdQueryVariables
  >({
    query: GET_VERDICT_BY_ID_QUERY,
    variables: {
      input: {
        id: query.id as string,
      },
    },
  })

  const item = verdictResponse?.data?.webVerdictById?.item

  if (!item || (!item?.pdfString && !item?.richText)) {
    throw new CustomNextError(
      404,
      `Verdict with id: ${query.id} could not be found`,
    )
  }

  return {
    item,
  }
}

export default withMainLayout(
  withCustomPageWrapper(CustomPageUniqueIdentifier.Verdicts, VerdictDetails),
)
