import React, { useState, useEffect } from 'react'
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
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { Total } from '../KeyNumbers'
import {
  INPUTCHANGEINTERVAL,
  EQUITIESANDLIABILITIESIDS,
  OPERATINGCOST,
} from '../../lib/constants'
import { useTotals } from '../../hooks'

export const ElectionEquities = ({
  application,
}: {
  application: Application
}): JSX.Element => {
  const answers = application.answers

  const { formatMessage } = useLocale()

  const { errors, clearErrors, setValue } = useFormContext()

  const operatingCostTotal = getValueViaPath(
    answers,
    OPERATINGCOST.total,
  ) as string

  useEffect(() => {
    setValue(EQUITIESANDLIABILITIESIDS.operationResult, operatingCostTotal)
    setTotalOperatingCost(Number(operatingCostTotal))
  }, [operatingCostTotal, setValue])

  const [getTotalEquity, totalEquity] = useTotals(
    EQUITIESANDLIABILITIESIDS.equityPrefix,
  )
  const [getTotalAssets, totalAssets] = useTotals(
    EQUITIESANDLIABILITIESIDS.assetPrefix,
  )
  const [getTotalLiabilities, totalLiabilities] = useTotals(
    EQUITIESANDLIABILITIESIDS.liabilityPrefix,
  )

  const [totalOperatingCost, setTotalOperatingCost] = useState(0)
  const [equityTotal, setEquityTotal] = useState(0)

  useEffect(() => {
    const total = totalEquity - totalLiabilities
    setEquityTotal(total)
  }, [totalLiabilities, totalEquity, totalOperatingCost])

  return (
    <GridContainer>
      <GridRow align="spaceBetween">
        <GridColumn span={['12/12', '12/12', '12/12', '6/12']}>
          <Text paddingY={1} as="h2" variant="h4">
            {formatMessage(m.properties)}
          </Text>
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.fixedAssetsTotal}
              name={EQUITIESANDLIABILITIESIDS.fixedAssetsTotal}
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  EQUITIESANDLIABILITIESIDS.fixedAssetsTotal,
                )
              }
              label={formatMessage(m.fixedAssetsTotal)}
              onChange={debounce(() => {
                getTotalAssets()
                clearErrors(EQUITIESANDLIABILITIESIDS.fixedAssetsTotal)
              }, INPUTCHANGEINTERVAL)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.currentAssets}
              name={EQUITIESANDLIABILITIESIDS.currentAssets}
              error={
                errors &&
                getErrorViaPath(errors, EQUITIESANDLIABILITIESIDS.currentAssets)
              }
              onChange={debounce(() => {
                getTotalAssets()
                clearErrors(EQUITIESANDLIABILITIESIDS.currentAssets)
              }, INPUTCHANGEINTERVAL)}
              label={formatMessage(m.currentAssets)}
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
          <Box paddingY={1}>
            <InputController
              id={EQUITIESANDLIABILITIESIDS.operationResult}
              name={EQUITIESANDLIABILITIESIDS.operationResult}
              readOnly
              error={
                errors &&
                getErrorViaPath(
                  errors,
                  EQUITIESANDLIABILITIESIDS.operationResult,
                )
              }
              label={formatMessage(m.operationResult)}
              backgroundColor="blue"
              currency
            />
          </Box>
          <Total
            name={EQUITIESANDLIABILITIESIDS.totalCash}
            total={equityTotal}
            label={formatMessage(m.debtsAndCash)}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
