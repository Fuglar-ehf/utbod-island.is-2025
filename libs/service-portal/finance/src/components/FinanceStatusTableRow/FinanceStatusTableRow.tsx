import React, { FC } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import {
  FinanceStatusOrganizationType,
  FinanceStatusDetailsType,
  FinanceStatusOrganizationChargeType,
} from '../../screens/FinanceStatus/FinanceStatusData.types'
import FinanceStatusDetailTable from '../../components/FinanceStatusDetailTable/FinanceStatusDetailTable'
import { ExpandRow } from '../../components/ExpandableTable'
import amountFormat from '../../utils/amountFormat'

const GetFinanceStatusDetailsQuery = gql`
  query GetFinanceStatusDetailsQuery($input: GetFinancialOverviewInput!) {
    getFinanceStatusDetails(input: $input)
  }
`

interface Props {
  organization: FinanceStatusOrganizationType
  chargeType: FinanceStatusOrganizationChargeType
}

const FinanceStatusTableRow: FC<Props> = ({ organization, chargeType }) => {
  const [getDetailsQuery, { loading, error, ...detailsQuery }] = useLazyQuery(
    GetFinanceStatusDetailsQuery,
  )
  const financeStatusDetails: FinanceStatusDetailsType =
    detailsQuery.data?.getFinanceStatusDetails || {}

  return (
    <ExpandRow
      key={chargeType.id}
      onExpandCallback={() =>
        getDetailsQuery({
          variables: {
            input: {
              OrgID: organization.id,
              chargeTypeID: chargeType.id,
            },
          },
        })
      }
      data={[
        chargeType.name,
        organization.name,
        amountFormat(chargeType.totals),
      ]}
      loading={loading}
      error={error}
    >
      {financeStatusDetails?.chargeItemSubjects?.length > 0 ? (
        <FinanceStatusDetailTable
          organization={organization}
          financeStatusDetails={financeStatusDetails}
        />
      ) : null}
    </ExpandRow>
  )
}

export default FinanceStatusTableRow
