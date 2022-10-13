import format from 'date-fns/format'
import sub from 'date-fns/sub'
import React, { useEffect, useState } from 'react'
import cn from 'classnames'

import { useLazyQuery, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'
import {
  Accordion,
  AccordionItem,
  AlertBanner,
  Box,
  Button,
  DatePicker,
  Filter,
  FilterInput,
  FilterMultiChoice,
  GridColumn,
  GridRow,
  Hidden,
  SkeletonLoader,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  DynamicWrapper,
  IntroHeader,
  m,
  ServicePortalModuleComponent,
} from '@island.is/service-portal/core'
import {
  GET_CUSTOMER_CHARGETYPE,
  GET_CUSTOMER_RECORDS,
} from '@island.is/service-portal/graphql'

import DropdownExport from '../../components/DropdownExport/DropdownExport'
import FinanceTransactionsTable from '../../components/FinanceTransactionsTable/FinanceTransactionsTable'
import { exportHreyfingarFile } from '../../utils/filesHreyfingar'
import { transactionFilter } from '../../utils/simpleFilter'
import * as styles from '../Finance.css'
import {
  CustomerChargeType,
  CustomerRecords,
} from './FinanceTransactionsData.types'

const defaultCalState = { top: false, lower: false }

const FinanceTransactions: ServicePortalModuleComponent = () => {
  useNamespaces('sp.finance-transactions')
  const { formatMessage } = useLocale()

  const backInTheDay = sub(new Date(), {
    months: 3,
  })
  const [openCal, setOpenCal] = useState<{ top: boolean; lower: boolean }>(
    defaultCalState,
  )
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [q, setQ] = useState<string>('')
  const [chargeTypesEmpty, setChargeTypesEmpty] = useState(false)
  const [dropdownSelect, setDropdownSelect] = useState<string[] | undefined>()

  const {
    data: customerChartypeData,
    loading: chargeTypeDataLoading,
    error: chargeTypeDataError,
  } = useQuery<Query>(GET_CUSTOMER_CHARGETYPE, {
    onCompleted: () => {
      if (customerChartypeData?.getCustomerChargeType?.chargeType) {
        setAllChargeTypes()
      } else {
        setChargeTypesEmpty(true)
      }
    },
  })

  const chargeTypeData: CustomerChargeType =
    customerChartypeData?.getCustomerChargeType || {}

  const [loadCustomerRecords, { data, loading, called, error }] = useLazyQuery(
    GET_CUSTOMER_RECORDS,
  )

  useEffect(() => {
    if (toDate && fromDate && dropdownSelect) {
      loadCustomerRecords({
        variables: {
          input: {
            chargeTypeID: dropdownSelect,
            dayFrom: format(fromDate, 'yyyy-MM-dd'),
            dayTo: format(toDate, 'yyyy-MM-dd'),
          },
        },
      })
    }
  }, [toDate, fromDate, dropdownSelect])

  useEffect(() => {
    setFromDate(backInTheDay)
    setToDate(new Date())
  }, [])

  function getAllChargeTypes() {
    const allChargeTypeValues = chargeTypeData?.chargeType?.map((ct) => ct.id)
    return allChargeTypeValues ?? []
  }

  function setAllChargeTypes() {
    const allChargeTypes = getAllChargeTypes()
    setDropdownSelect(allChargeTypes)
  }

  function clearAllFilters() {
    setAllChargeTypes()
    setFromDate(backInTheDay)
    setToDate(new Date())
    setQ('')
  }

  const recordsData: CustomerRecords = data?.getCustomerRecords || {}
  const recordsDataArray =
    (recordsData?.records && transactionFilter(recordsData?.records, q)) || []
  const chargeTypeSelect = (chargeTypeData?.chargeType || []).map((item) => ({
    label: item.name,
    value: item.id,
  }))

  return (
    <DynamicWrapper>
      <Box marginBottom={[6, 6, 10]}>
        <IntroHeader
          title={{
            id: 'sp.finance-transactions:title',
            defaultMessage: 'Hreyfingar',
          }}
          intro={{
            id: 'sp.finance-transactions:intro',
            defaultMessage:
              'Hér er að finna hreyfingar fyrir valin skilyrði. Hreyfingar geta verið gjöld, greiðslur, skuldajöfnuður o.fl.',
          }}
        />
        <Stack space={2}>
          <GridRow>
            <GridColumn span={['11/12', '6/12']}>
              <Box
                display="flex"
                marginLeft="auto"
                paddingRight={2}
                printHidden
              >
                <Box paddingRight={2}>
                  <Button
                    colorScheme="default"
                    icon="print"
                    iconType="filled"
                    onClick={() => window.print()}
                    preTextIconType="filled"
                    size="default"
                    type="button"
                    variant="utility"
                  >
                    {formatMessage(m.print)}
                  </Button>
                </Box>
                <DropdownExport
                  onGetCSV={() => exportHreyfingarFile(recordsDataArray, 'csv')}
                  onGetExcel={() =>
                    exportHreyfingarFile(recordsDataArray, 'xlsx')
                  }
                />
              </Box>
            </GridColumn>
          </GridRow>
          <Hidden print={true}>
            <Box marginTop={[1, 1, 2, 2, 5]}>
              <Filter
                variant="popover"
                align="left"
                reverse
                labelClear={formatMessage(m.clearFilter)}
                labelClearAll={formatMessage(m.clearAllFilters)}
                labelOpen={formatMessage(m.openFilter)}
                labelClose={formatMessage(m.closeFilter)}
                popoverFlip={false}
                filterInput={
                  <FilterInput
                    placeholder={formatMessage(m.searchPlaceholder)}
                    name="finance-transaction-input"
                    value={q}
                    onChange={(e) => setQ(e)}
                    backgroundColor="blue"
                  />
                }
                onFilterClear={clearAllFilters}
              >
                <FilterMultiChoice
                  labelClear={formatMessage(m.clearSelected)}
                  singleExpand={true}
                  onChange={({ selected }) => {
                    setDropdownSelect(selected)
                  }}
                  onClear={() => {
                    setAllChargeTypes()
                  }}
                  categories={[
                    {
                      id: 'flokkur',
                      label: formatMessage(m.transactionsLabel),
                      selected: dropdownSelect ? [...dropdownSelect] : [],
                      filters: chargeTypeSelect,
                      inline: false,
                      singleOption: false,
                    },
                  ]}
                />
                <Box className={styles.dateFilter} paddingX={3}>
                  <Box
                    borderBottomWidth="standard"
                    borderColor="blue200"
                    width="full"
                  />
                  <Box marginTop={1}>
                    <Accordion
                      dividerOnBottom={false}
                      dividerOnTop={false}
                      singleExpand={false}
                    >
                      <AccordionItem
                        key="date-accordion-item"
                        id="date-accordion-item"
                        label={formatMessage(m.datesLabel)}
                        labelColor="blue400"
                        labelUse="h5"
                        labelVariant="h5"
                        iconVariant="small"
                      >
                        <Box
                          className={cn(styles.accordionBox, {
                            [styles.openCal]: openCal?.top,
                            [styles.openLowerCal]: openCal?.lower,
                          })}
                          display="flex"
                          flexDirection="column"
                        >
                          <DatePicker
                            label={formatMessage(m.datepickerFromLabel)}
                            placeholderText={formatMessage(m.datepickLabel)}
                            locale="is"
                            backgroundColor="blue"
                            size="xs"
                            handleChange={(d) => setFromDate(d)}
                            handleOpenCalendar={() =>
                              setOpenCal({ top: true, lower: false })
                            }
                            handleCloseCalendar={() =>
                              setOpenCal(defaultCalState)
                            }
                            selected={fromDate}
                          />
                          <Box marginTop={3}>
                            <DatePicker
                              label={formatMessage(m.datepickerToLabel)}
                              placeholderText={formatMessage(m.datepickLabel)}
                              handleOpenCalendar={() =>
                                setOpenCal({ top: false, lower: true })
                              }
                              handleCloseCalendar={() =>
                                setOpenCal(defaultCalState)
                              }
                              locale="is"
                              backgroundColor="blue"
                              size="xs"
                              handleChange={(d) => setToDate(d)}
                              selected={toDate}
                            />
                          </Box>
                        </Box>
                      </AccordionItem>
                    </Accordion>
                  </Box>
                </Box>
              </Filter>
            </Box>
          </Hidden>

          <Box marginTop={2}>
            {(error || chargeTypeDataError) && (
              <AlertBanner
                description={formatMessage(m.errorFetch)}
                variant="error"
              />
            )}
            {(loading || chargeTypeDataLoading || !called) &&
              !chargeTypesEmpty &&
              !chargeTypeDataError &&
              !error && (
                <Box padding={3}>
                  <SkeletonLoader space={1} height={40} repeat={5} />
                </Box>
              )}
            {((recordsDataArray.length === 0 && called && !loading && !error) ||
              chargeTypesEmpty) && (
              <AlertBanner
                description={formatMessage(m.noResultsTryAgain)}
                variant="warning"
              />
            )}
            {recordsDataArray.length > 0 ? (
              <FinanceTransactionsTable recordsArray={recordsDataArray} />
            ) : null}
          </Box>
        </Stack>
      </Box>
    </DynamicWrapper>
  )
}

export default FinanceTransactions
