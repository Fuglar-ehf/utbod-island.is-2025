import {
  Box,
  Text,
  Table as T,
  Pagination,
  Icon,
  FilterInput,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../../lib/messages'
import { SignatureCollectionSignature as Signature } from '@island.is/api/schema'
import { pageSize } from '../../../lib/utils'
import SortSignees from './sortSignees'

const Signees = ({ numberOfSignatures }: { numberOfSignatures: number }) => {
  const { formatMessage } = useLocale()

  const { allSignees } = useLoaderData() as { allSignees: Signature[] }
  const [signees, setSignees] = useState(allSignees)

  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setSignees(allSignees)
  }, [allSignees])

  useEffect(() => {
    let filteredSignees: Signature[] = allSignees

    filteredSignees = filteredSignees.filter((s) => {
      return (
        s.signee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatNationalId(s.signee.nationalId).includes(searchTerm) ||
        s.signee.nationalId.includes(searchTerm)
      )
    })

    setPage(1)
    setSignees(filteredSignees)
  }, [searchTerm])

  return (
    <Box marginTop={7}>
      <Text variant="h3">{formatMessage(m.listSigneesHeader)}</Text>

      <GridRow marginTop={2} marginBottom={4}>
        <GridColumn span={['12/12', '12/12', '6/12']}>
          <FilterInput
            name="searchSignee"
            value={searchTerm}
            onChange={(v) => setSearchTerm(v)}
            placeholder={formatMessage(m.searchInListPlaceholder)}
            backgroundColor="white"
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '6/12']}>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="flexEnd"
            height="full"
            marginTop={[1, 1, 0]}
          >
            <SortSignees
              signees={signees}
              setSignees={setSignees}
              setPage={setPage}
            />
            {searchTerm.length > 0 && signees.length > 0
              ? signees.length > 0 && (
                  <Text variant="eyebrow" textAlign="right">
                    {formatMessage(m.uploadResultsHeader)}: {signees.length}
                  </Text>
                )
              : signees.length > 0 && (
                  <Text variant="eyebrow" textAlign="right">
                    {/* using numberOfSignatures coming from list info for true total number of signees */}
                    {formatMessage(m.totalListResults)}: {numberOfSignatures}
                  </Text>
                )}
          </Box>
        </GridColumn>
      </GridRow>

      {signees && signees.length > 0 ? (
        <Box marginTop={3}>
          <T.Table>
            <T.Head>
              <T.Row>
                <T.HeadData>{formatMessage(m.signeeDate)}</T.HeadData>
                <T.HeadData>{formatMessage(m.signeeName)}</T.HeadData>
                <T.HeadData>{formatMessage(m.signeeNationalId)}</T.HeadData>
                <T.HeadData>{formatMessage(m.signeeAddress)}</T.HeadData>
                <T.HeadData></T.HeadData>
              </T.Row>
            </T.Head>
            <T.Body>
              {signees
                .slice(pageSize * (page - 1), pageSize * page)
                .map((s) => {
                  return (
                    <T.Row key={s.id}>
                      <T.Data text={{ variant: 'medium' }}>
                        {format(new Date(s.created), 'dd.MM.yyyy HH:mm')}
                      </T.Data>
                      <T.Data text={{ variant: 'medium' }}>
                        {s.signee.name}
                      </T.Data>
                      <T.Data text={{ variant: 'medium' }}>
                        {formatNationalId(s.signee.nationalId)}
                      </T.Data>
                      <T.Data text={{ variant: 'medium' }}>
                        {s.signee.address}
                      </T.Data>
                      <T.Data>
                        {!s.isDigital && (
                          <Box display="flex">
                            <Text>{s.pageNumber}</Text>
                            <Box marginLeft={1}>
                              <Icon
                                icon="document"
                                type="outline"
                                color="blue400"
                              />
                            </Box>
                          </Box>
                        )}
                      </T.Data>
                    </T.Row>
                  )
                })}
            </T.Body>
          </T.Table>

          <Box marginTop={3}>
            <Pagination
              totalItems={signees.length}
              itemsPerPage={pageSize}
              page={page}
              renderLink={(page, className, children) => (
                <Box
                  cursor="pointer"
                  className={className}
                  onClick={() => setPage(page)}
                  component="button"
                >
                  {children}
                </Box>
              )}
            />
          </Box>
        </Box>
      ) : searchTerm.length > 0 ? (
        <Box display="flex">
          <Text>{formatMessage(m.noSigneesFoundBySearch)}</Text>
          <Box marginLeft={1}>
            <Text variant="h5">{searchTerm}</Text>
          </Box>
        </Box>
      ) : (
        <Text>{formatMessage(m.noSignees)}</Text>
      )}
    </Box>
  )
}

export default Signees
