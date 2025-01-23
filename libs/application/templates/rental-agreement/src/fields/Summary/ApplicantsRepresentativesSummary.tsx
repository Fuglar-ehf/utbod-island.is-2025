import { FC } from 'react'
import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { RentalAgreement } from '../../lib/dataSchema'
import { summary } from '../../lib/messages'
import { Routes } from '../../lib/constants'
import { formatNationalId, formatPhoneNumber } from '../../lib/utils'
import { KeyValue } from './components/KeyValue'
import { SummaryCardRow } from './components/SummaryCardRow'
import { SummaryCard } from './components/SummaryCard'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  landlordsRoute?: Routes
  tenantsRoute?: Routes
  isChangeButton: boolean
}

export const ApplicantsRepresentativesSummary: FC<Props> = ({ ...props }) => {
  const { formatMessage } = useLocale()
  const {
    application,
    goToScreen,
    landlordsRoute,
    tenantsRoute,
    isChangeButton,
  } = props
  const answers = application.answers as RentalAgreement

  const landlordListHasRepresentatives = answers.landlordInfo.table.some(
    (landlord) =>
      landlord.isRepresentative && landlord.isRepresentative.length > 0,
  )
  const tenantListHasRepresentatives = answers.tenantInfo.table.some(
    (tenant) => tenant.isRepresentative && tenant.isRepresentative.length > 0,
  )

  const landlordRepresentatives = answers.landlordInfo.table?.filter(
    (landlordRep) =>
      landlordRep.isRepresentative && landlordRep.isRepresentative.length > 0,
  )
  const tenantRepresentatives = answers.tenantInfo.table.filter(
    (tenantRep) =>
      tenantRep.isRepresentative && tenantRep.isRepresentative.length > 0,
  )

  if (landlordListHasRepresentatives || tenantListHasRepresentatives) {
    return (
      <>
        {landlordListHasRepresentatives ? (
          <SummaryCard
            cardLabel={formatMessage(summary.landlordsRepresentativeLabel)}
          >
            {landlordRepresentatives?.map((landlordRep) => {
              return (
                <SummaryCardRow
                  key={landlordRep.nationalIdWithName?.nationalId}
                  editAction={goToScreen}
                  route={landlordsRoute}
                  isChangeButton={isChangeButton}
                >
                  <GridColumn span={['12/12']}>
                    <KeyValue
                      labelVariant="h5"
                      labelAs="p"
                      label={landlordRep.nationalIdWithName?.name as string}
                      value={`${formatMessage(
                        summary.nationalIdLabel,
                      )}${formatNationalId(
                        landlordRep.nationalIdWithName?.nationalId || '-',
                      )}`}
                      gap={'smallGutter'}
                    />
                  </GridColumn>

                  <GridColumn span={['12/12', '8/12']}>
                    <KeyValue
                      label={summary.emailLabel}
                      value={landlordRep.email || '-'}
                    />
                  </GridColumn>
                  <GridColumn span={['12/12', '4/12']}>
                    <KeyValue
                      label={summary.phoneNumberLabel}
                      value={formatPhoneNumber(landlordRep.phone || '-')}
                    />
                  </GridColumn>
                </SummaryCardRow>
              )
            })}
          </SummaryCard>
        ) : (
          ''
        )}
        {tenantListHasRepresentatives ? (
          <SummaryCard
            cardLabel={formatMessage(summary.tenantsRepresentativeLabel)}
          >
            {tenantRepresentatives.map((tenantRep) => {
              return (
                <SummaryCardRow
                  key={tenantRep.nationalIdWithName?.nationalId}
                  editAction={props.goToScreen}
                  route={tenantsRoute}
                  isChangeButton={isChangeButton}
                >
                  <GridColumn span={['12/12']}>
                    <KeyValue
                      labelVariant="h5"
                      labelAs="p"
                      label={tenantRep.nationalIdWithName?.name as string}
                      value={`${formatMessage(
                        summary.nationalIdLabel,
                      )}${formatNationalId(
                        tenantRep.nationalIdWithName?.nationalId || '-',
                      )}`}
                      gap={'smallGutter'}
                    />
                  </GridColumn>
                  <GridColumn span={['12/12', '8/12']}>
                    <KeyValue
                      label={summary.emailLabel}
                      value={tenantRep.email || '-'}
                    />
                  </GridColumn>
                  <GridColumn span={['12/12', '4/12']}>
                    <KeyValue
                      label={summary.phoneNumberLabel}
                      value={formatPhoneNumber(tenantRep.phone || '-')}
                    />
                  </GridColumn>
                </SummaryCardRow>
              )
            })}
          </SummaryCard>
        ) : (
          ''
        )}
      </>
    )
  } else {
    return ''
  }
}
