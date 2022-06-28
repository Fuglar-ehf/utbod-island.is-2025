import { gql, useLazyQuery } from '@apollo/client'
import format from 'date-fns/format'
import sub from 'date-fns/sub'
import React, { FC, useEffect, useState } from 'react'

import {
  Accordion,
  AccordionItem,
  AlertBanner,
  Box,
  Button,
  DatePicker,
  Filter,
  FilterInput,
  GridColumn,
  GridRow,
  Hidden,
  Pagination,
  SkeletonLoader,
  Stack,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  amountFormat,
  formSubmit,
  m,
  tableStyles,
} from '@island.is/service-portal/core'
import { dateFormat } from '@island.is/shared/constants'

import { billsFilter } from '../../utils/simpleFilter'
import { DocumentsListItemTypes } from './DocumentScreen.types'
import * as styles from '../../screens/Finance.css'

const ITEMS_ON_PAGE = 20

interface Props {
  title: string
  intro: string
  listPath: string
  defaultDateRangeMonths?: number
}

const getFinanceDocumentsListQuery = gql`
  query getFinanceDocumentsListQuery($input: GetDocumentsListInput!) {
    getDocumentsList(input: $input) {
      downloadServiceURL
      documentsList {
        id
        date
        type
        note
        sender
        dateOpen
        amount
      }
    }
  }
`

const DocumentScreen: FC<Props> = ({
  title,
  intro,
  listPath,
  defaultDateRangeMonths = 3,
}) => {
  const { formatMessage } = useLocale()

  const [page, setPage] = useState(1)
  const [fromDate, setFromDate] = useState<Date>()
  const [toDate, setToDate] = useState<Date>()
  const [q, setQ] = useState<string>('')
  const backInTheDay = sub(new Date(), {
    months: defaultDateRangeMonths,
  })

  const [loadDocumentsList, { data, loading, called, error }] = useLazyQuery(
    getFinanceDocumentsListQuery,
  )

  const billsDataArray: DocumentsListItemTypes[] =
    (data?.getDocumentsList?.documentsList &&
      billsFilter(data.getDocumentsList.documentsList, q)) ||
    []

  const totalPages =
    billsDataArray.length > ITEMS_ON_PAGE
      ? Math.ceil(billsDataArray.length / ITEMS_ON_PAGE)
      : 0

  function clearAllFilters() {
    setFromDate(backInTheDay)
    setToDate(new Date())
    setQ('')
  }

  useEffect(() => {
    if (toDate && fromDate) {
      loadDocumentsList({
        variables: {
          input: {
            dayFrom: format(fromDate, 'yyyy-MM-dd'),
            dayTo: format(toDate, 'yyyy-MM-dd'),
            listPath: listPath,
          },
        },
      })
    }
  }, [toDate, fromDate])

  useEffect(() => {
    setFromDate(backInTheDay)
    setToDate(new Date())
  }, [])

  return (
    <Box marginBottom={[6, 6, 10]}>
      <Stack space={2}>
        <Text variant="h3" as="h1">
          {title}
        </Text>
        <GridRow marginBottom={4}>
          <GridColumn span={['12/12', '8/12']}>
            <Text variant="default">{intro}</Text>
          </GridColumn>
        </GridRow>
        <GridRow>
          <Box display="flex" printHidden padding={0}>
            <GridColumn>
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
            </GridColumn>
          </Box>
        </GridRow>
        <Hidden print={true}>
          <Box marginTop={[1, 1, 2, 4]}>
            <Filter
              resultCount={0}
              variant="popover"
              align="left"
              reverse
              labelClear={formatMessage(m.clearFilter)}
              labelClearAll={formatMessage(m.clearAllFilters)}
              labelOpen={formatMessage(m.openFilter)}
              labelClose={formatMessage(m.closeFilter)}
              filterInput={
                <FilterInput
                  placeholder={formatMessage(m.searchPlaceholder)}
                  name="rafraen-skjol-input"
                  value={q}
                  onChange={(e) => setQ(e)}
                  backgroundColor="blue"
                />
              }
              onFilterClear={clearAllFilters}
            >
              <Box className={styles.dateFilterSingle} paddingX={3}>
                <Box width="full" />
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
                        className={styles.accordionBoxSingle}
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
                          selected={fromDate}
                        />
                        <Box marginTop={3}>
                          <DatePicker
                            label={formatMessage(m.datepickerToLabel)}
                            placeholderText={formatMessage(m.datepickLabel)}
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
          {error && (
            <AlertBanner
              description={formatMessage(m.errorFetch)}
              variant="error"
            />
          )}
          {!called && !loading && (
            <AlertBanner
              description={formatMessage(m.datesForResults)}
              variant="info"
            />
          )}
          {loading && (
            <Box padding={3}>
              <SkeletonLoader space={1} height={40} repeat={5} />
            </Box>
          )}
          {billsDataArray.length === 0 && called && !loading && !error && (
            <AlertBanner
              description={formatMessage(m.noResultsTryAgain)}
              variant="warning"
            />
          )}
          {billsDataArray.length > 0 ? (
            <T.Table>
              <T.Head>
                <T.Row>
                  <T.HeadData style={tableStyles}>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(m.date)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData style={tableStyles}>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(m.transactionType)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData style={tableStyles}>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(m.performingOrganization)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData box={{ textAlign: 'right' }} style={tableStyles}>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(m.amount)}
                    </Text>
                  </T.HeadData>
                  <T.HeadData style={tableStyles}>
                    <Text variant="medium" fontWeight="semiBold">
                      {formatMessage(m.explanationNote)}
                    </Text>
                  </T.HeadData>
                </T.Row>
              </T.Head>
              <T.Body>
                {billsDataArray
                  .slice(ITEMS_ON_PAGE * (page - 1), ITEMS_ON_PAGE * page)
                  .map((listItem) => (
                    <T.Row key={listItem.id}>
                      <T.Data style={tableStyles}>
                        <Text variant="medium">
                          {format(new Date(listItem.date), dateFormat.is)}
                        </Text>
                      </T.Data>
                      <T.Data
                        box={{ position: 'relative' }}
                        style={tableStyles}
                      >
                        <Button
                          variant="text"
                          size="medium"
                          onClick={() =>
                            formSubmit(
                              `${data?.getDocumentsList?.downloadServiceURL}${listItem.id}`,
                            )
                          }
                        >
                          {listItem.type}
                        </Button>
                      </T.Data>
                      <T.Data style={tableStyles}>
                        <Text variant="medium">{listItem.sender}</Text>
                      </T.Data>
                      <T.Data box={{ textAlign: 'right' }} style={tableStyles}>
                        <Text variant="medium">
                          {amountFormat(listItem.amount)}
                        </Text>
                      </T.Data>
                      <T.Data style={tableStyles}>
                        <Text variant="medium">{listItem.note}</Text>
                      </T.Data>
                    </T.Row>
                  ))}
              </T.Body>
            </T.Table>
          ) : null}
          {totalPages > 0 ? (
            <Box paddingTop={8}>
              <Pagination
                page={page}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <Box
                    cursor="pointer"
                    className={className}
                    onClick={() => setPage(page)}
                  >
                    {children}
                  </Box>
                )}
              />
            </Box>
          ) : null}
        </Box>
      </Stack>
    </Box>
  )
}

export default DocumentScreen
