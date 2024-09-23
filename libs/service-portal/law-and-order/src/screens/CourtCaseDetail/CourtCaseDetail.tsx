import { Box, Button } from '@island.is/island-ui/core'
import {
  DOMSMALARADUNEYTID_SLUG,
  IntroHeader,
  LinkResolver,
  m,
  NotFound,
} from '@island.is/service-portal/core'
import { messages } from '../../lib/messages'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useParams } from 'react-router-dom'
import { LawAndOrderPaths } from '../../lib/paths'
import InfoLines from '../../components/InfoLines/InfoLines'
import { useEffect } from 'react'
import { useGetCourtCaseQuery } from './CourtCaseDetail.generated'
import { Problem } from '@island.is/react-spa/shared'

type UseParams = {
  id: string
}

const CourtCaseDetail = () => {
  useNamespaces('sp.law-and-order')
  const { formatMessage, lang } = useLocale()

  const { id } = useParams() as UseParams

  const { data, error, loading, refetch } = useGetCourtCaseQuery({
    variables: {
      input: {
        id,
      },
      locale: lang,
    },
  })

  const courtCase = data?.lawAndOrderCourtCaseDetail

  useEffect(() => {
    refetch()
  }, [lang])

  if (data?.lawAndOrderCourtCaseDetail == null && !loading) {
    return <NotFound title={formatMessage(messages.courtCaseNotFound)} />
  }

  return (
    <>
      <IntroHeader
        loading={loading}
        title={
          courtCase?.data?.caseNumberTitle ??
          formatMessage(messages.courtCaseNumberNotRegistered)
        }
        intro={messages.courtCasesDescription}
        serviceProviderSlug={DOMSMALARADUNEYTID_SLUG}
        serviceProviderTooltip={formatMessage(m.domsmalaraduneytidTooltip)}
      />
      <Box marginBottom={3} display="flex" flexWrap="wrap">
        {data?.lawAndOrderCourtCaseDetail && !loading && (
          <Box paddingRight={2} marginBottom={[1]}>
            {/* TODO: Uncomment when ready in service */}
            {/* {courtCase?.data?.acknowledged && ( */}

            <LinkResolver
              href={LawAndOrderPaths.SubpoenaDetail.replace(
                ':id',
                id?.toString() || '',
              )}
            >
              <Button
                as="span"
                unfocusable
                colorScheme="default"
                icon="receipt"
                iconType="outline"
                size="default"
                variant="utility"
              >
                {formatMessage(messages.seeSubpoena)}
              </Button>
            </LinkResolver>
            {/* )} */}
          </Box>
        )}
      </Box>
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error && courtCase && courtCase?.data?.groups && (
        <InfoLines groups={courtCase?.data?.groups} loading={loading} />
      )}

      {!loading &&
        !error &&
        courtCase?.data &&
        courtCase?.data?.groups?.length === 0 && (
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noData)}
            message={formatMessage(m.noDataFoundDetail)}
            imgSrc="./assets/images/sofa.svg"
          />
        )}
    </>
  )
}
export default CourtCaseDetail
