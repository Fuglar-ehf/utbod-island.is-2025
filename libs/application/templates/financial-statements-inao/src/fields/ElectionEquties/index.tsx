import React from 'react'
import debounce from 'lodash/debounce'
import { useFormContext } from 'react-hook-form'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { InputController } from '@island.is/shared/form-fields'
import { getErrorViaPath } from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Total } from '../KeyNumbers'
import {
  INPUTCHANGEINTERVAL,
  EQUITIESANDLIABILITIESIDS,
} from '../../lib/constants'
import { useTotals } from '../../hooks'

export const ElectionEquities = (): JSX.Element => {
  const [getTotalEquity, totalEquity] = useTotals(
    EQUITIESANDLIABILITIESIDS.equityPrefix,
  )
  const [getTotalAssets, totalAssets] = useTotals(
    EQUITIESANDLIABILITIESIDS.assetPrefix,
  )
  const [getTotalLiabilities, totalLiabilities] = useTotals(
    EQUITIESANDLIABILITIESIDS.liabilityPrefix,
  )

  const { errors, clearErrors } = useFormContext()
  const { formatMessage } = useLocale()

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.properties)}
          </Text>
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.current}
              name={EQUITIESANDLIABILITIESIDS.current}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.current)
              }
              label={formatMessage(m.currentAssets)}
              onChange={debounce(() => {
                getTotalAssets()
                clearErrors(EQUITIESANDLIABILITIESIDS.current)
              }, INPUTCHANGEINTERVAL)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.tangible}
              name={EQUITIESANDLIABILITIESIDS.tangible}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.tangible)
              }
              onChange={debounce(() => {
                getTotalAssets()
                clearErrors(EQUITIESANDLIABILITIESIDS.tangible)
              }, INPUTCHANGEINTERVAL)}
              label={formatMessage(m.tangibleAssets)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name={EQUITIESANDLIABILITIESIDS.assetTotal}
            total={totalAssets}
            label={formatMessage(m.totalAssets)}
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.expenses)}
          </Text>
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.longTerm}
              name={EQUITIESANDLIABILITIESIDS.longTerm}
              onChange={debounce(() => {
                getTotalLiabilities()
                clearErrors(EQUITIESANDLIABILITIESIDS.longTerm)
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.longTerm)
              }
              label={formatMessage(m.longTerm)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.shortTerm}
              name={EQUITIESANDLIABILITIESIDS.shortTerm}
              onChange={debounce(() => {
                getTotalLiabilities()
                clearErrors(EQUITIESANDLIABILITIESIDS.shortTerm)
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.shortTerm)
              }
              label={formatMessage(m.shortTerm)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name={EQUITIESANDLIABILITIESIDS.totalLiability}
            total={totalLiabilities}
            label={formatMessage(m.totalDebts)}
          />
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.totalEquity}
              name={EQUITIESANDLIABILITIESIDS.totalEquity}
              onChange={debounce(() => {
                getTotalEquity()
                clearErrors(EQUITIESANDLIABILITIESIDS.totalEquity)
              }, INPUTCHANGEINTERVAL)}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.totalEquity)
              }
              label={formatMessage(m.equity)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name={EQUITIESANDLIABILITIESIDS.totalCash}
            total={totalLiabilities - totalEquity}
            label={formatMessage(m.debtsAndCash)}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
