import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import { ValueLine } from './ValueLine'
import { useLocale } from '@island.is/localization'
import { formatCurrency } from '../utils/helpers'
import { m } from '../lib/messages'
import { FinancialStatementPoliticalParty } from '../lib/dataSchema'
import { sectionColumn } from './css/overviewStyles.css'

type Props = {
  answers: FinancialStatementPoliticalParty
}

export const AssetDebtEquityOverview = ({ answers }: Props) => {
  const { formatMessage } = useLocale()

  return (
    <GridRow>
      <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
        <Box paddingTop={3} paddingBottom={2}>
          <Text variant="h4" as="h4">
            {formatMessage(m.properties)}
          </Text>
        </Box>
        <ValueLine
          label={m.fixedAssetsTotal}
          value={formatCurrency(answers.asset?.fixedAssetsTotal)}
        />
        <ValueLine
          label={m.currentAssets}
          value={formatCurrency(answers.asset?.currentAssets)}
        />
        <ValueLine
          label={m.totalAssets}
          value={formatCurrency(
            answers.equityAndLiabilitiesTotals?.assetsTotal,
          )}
          isTotal
        />
      </GridColumn>

      <GridColumn span={['12/12', '6/12']} className={sectionColumn}>
        <Box paddingTop={3} paddingBottom={2}>
          <Text variant="h4" as="h4">
            {formatMessage(m.debtsAndEquity)}
          </Text>
        </Box>
        <ValueLine
          label={m.longTerm}
          value={formatCurrency(answers.liability?.longTerm)}
        />
        <ValueLine
          label={m.shortTerm}
          value={formatCurrency(answers.liability?.shortTerm)}
        />
        <ValueLine
          label={m.totalLiabilities}
          value={formatCurrency(
            answers.equityAndLiabilitiesTotals?.liabilitiesTotal,
          )}
          isTotal
        />
        <Box paddingTop={3}>
          <ValueLine
            label={m.equity}
            value={formatCurrency(answers.equity?.totalEquity)}
          />
          <ValueLine
            label={m.debtsAndCash}
            value={formatCurrency(
              answers.equityAndLiabilitiesTotals.equityAndLiabilitiesTotal,
            )}
            isTotal
          />
        </Box>
      </GridColumn>
    </GridRow>
  )
}
