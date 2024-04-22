import { useEffect, useMemo } from 'react'
import {
  Box,
  Stack,
  Pagination,
  Text,
  GridContainer,
  GridColumn,
  GridRow,
  SkeletonLoader,
  Checkbox,
} from '@island.is/island-ui/core'
import { useOrganizations } from '@island.is/service-portal/graphql'
import { GoBack, m, useScrollTopOnUpdate } from '@island.is/service-portal/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useLocation, useNavigate } from 'react-router-dom'
import { getOrganizationLogoUrl } from '@island.is/shared/utils'
import debounce from 'lodash/debounce'
import DocumentsFilter from '../../components/DocumentFilter/DocumentsFilterV2'
import DocumentLine from '../../components/DocumentLine/DocumentLineV2'
import { useKeyDown } from '../../hooks/useKeyDown'
import { FavAndStash } from '../../components/FavAndStash'
import { messages } from '../../utils/messages'
import DocumentDisplay from '../../components/OverviewDisplay/OverviewDocumentDisplayV2'
import { DocumentsPaths } from '../../lib/paths'
import { useDocumentContext } from './DocumentContext'
import { useDocumentFilters } from '../../hooks/useDocumentFilters'
import { pageSize, useDocumentList } from '../../hooks/useDocumentList'
import { useMailAction } from '../../hooks/useMailActionV2'
import * as styles from './Overview.css'

export const ServicePortalDocumentsV2 = () => {
  useNamespaces('sp.documents')
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const location = useLocation()

  const { data: organizations } = useOrganizations()

  const {
    selectedLines,
    activeDocument,
    filterValue,
    page,
    categoriesAvailable,
    sendersAvailable,
    docLoading,
    documentDisplayError,

    setSelectedLines,
    setActiveDocument,
    setFilterValue,
  } = useDocumentContext()

  const {
    loading,
    error,
    activeArchive,
    totalPages,
    filteredDocuments,
    totalCount,
  } = useDocumentList()

  const { handlePageChange, handleSearchChange } = useDocumentFilters()

  const { submitBatchAction, loading: batchActionLoading } = useMailAction()

  useScrollTopOnUpdate([page])

  useEffect(() => {
    if (location?.state?.doc) {
      setActiveDocument(location.state.doc)
    }
  }, [location?.state?.doc])

  useEffect(() => {
    return () => {
      debouncedResults.cancel()
    }
  })

  useKeyDown('Escape', () => {
    setActiveDocument(null)
    navigate(DocumentsPaths.ElectronicDocumentsRoot, {
      replace: true,
    })
  })

  const debouncedResults = useMemo(() => {
    return debounce(handleSearchChange, 500)
  }, [])

  const rowDirection = error ? 'column' : 'columnReverse'

  return (
    <GridContainer>
      <GridRow direction={[rowDirection, rowDirection, rowDirection, 'row']}>
        <GridColumn
          hiddenBelow={activeDocument?.document ? 'lg' : undefined}
          span={['12/12', '12/12', '12/12', '5/12']}
        >
          <Box marginBottom={2} printHidden marginY={3}>
            <Box
              className={styles.btn}
              display={'inlineFlex'}
              alignItems={'center'}
            >
              <GoBack display="inline" noUnderline marginBottom={0} />
              <Box
                borderRadius={'circle'}
                display={'inlineBlock'}
                marginY={0}
                marginX={1}
                className={styles.bullet}
              />
              <Text
                as="h1"
                variant="eyebrow"
                color="blue400"
                fontWeight="semiBold"
              >
                <button
                  onClick={() =>
                    navigate(DocumentsPaths.ElectronicDocumentsRoot, {
                      replace: true,
                    })
                  }
                >
                  {formatMessage(m.documents)}
                </button>
              </Text>
            </Box>
          </Box>
          <DocumentsFilter
            filterValue={filterValue}
            categories={categoriesAvailable}
            senders={sendersAvailable}
            debounceChange={debouncedResults}
            clearCategories={() =>
              setFilterValue((oldFilter) => ({
                ...oldFilter,
                activeCategories: [],
              }))
            }
            clearSenders={() =>
              setFilterValue((oldFilter) => ({
                ...oldFilter,
                activeSenders: [],
              }))
            }
            documentsLength={totalCount}
          />
          <Box marginTop={4}>
            <Box
              background="blue100"
              width="full"
              borderColor="blue200"
              borderBottomWidth="standard"
              display="flex"
              justifyContent="spaceBetween"
              padding={2}
            >
              <Box display="flex">
                <Box className={styles.checkboxWrap} marginRight={3}>
                  {!activeArchive && (
                    <Checkbox
                      name="checkbox-select-all"
                      checked={selectedLines.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allDocumentIds = filteredDocuments.map(
                            (item) => item.id,
                          )
                          setSelectedLines([...allDocumentIds])
                        } else {
                          setSelectedLines([])
                        }
                      }}
                    />
                  )}
                </Box>
                {selectedLines.length > 0 ? null : (
                  <Text variant="eyebrow">{formatMessage(m.info)}</Text>
                )}
              </Box>

              {selectedLines.length > 0 && !activeArchive ? (
                <FavAndStash
                  loading={batchActionLoading}
                  onStash={() => submitBatchAction('archive', selectedLines)}
                  onFav={() => submitBatchAction('bookmark', selectedLines)}
                  onRead={() => submitBatchAction('read', selectedLines)}
                />
              ) : (
                <Text variant="eyebrow">{formatMessage(m.date)}</Text>
              )}
            </Box>
            {loading && (
              <Box marginTop={2}>
                <SkeletonLoader
                  space={2}
                  repeat={pageSize}
                  display="block"
                  width="full"
                  height={57}
                />
              </Box>
            )}
            <Stack space={0}>
              {filteredDocuments.map((doc) => (
                <Box key={doc.id}>
                  <DocumentLine
                    img={
                      doc?.sender?.name
                        ? getOrganizationLogoUrl(
                            doc?.sender?.name,
                            organizations,
                            60,
                            'none',
                          )
                        : undefined
                    }
                    documentLine={doc}
                    active={doc.id === activeDocument?.id}
                    bookmarked={!!doc.bookmarked}
                    selected={selectedLines.includes(doc.id)}
                    setSelectLine={(docId) => {
                      if (selectedLines.includes(doc.id)) {
                        const filtered = selectedLines.filter(
                          (item) => item !== doc.id,
                        )
                        setSelectedLines([...filtered])
                      } else {
                        setSelectedLines([...selectedLines, docId])
                      }
                    }}
                  />
                </Box>
              ))}
              {totalPages ? (
                <Box paddingBottom={4} marginTop={4}>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    renderLink={(page, className, children) => (
                      <button
                        className={className}
                        onClick={handlePageChange.bind(null, page)}
                      >
                        {children}
                      </button>
                    )}
                  />
                </Box>
              ) : undefined}
            </Stack>
          </Box>
        </GridColumn>
        <GridColumn
          span={['12/12', '12/12', '12/12', '7/12']}
          position="relative"
        >
          <DocumentDisplay
            activeBookmark={
              !!filteredDocuments?.filter(
                (doc) => doc?.id === activeDocument?.id,
              )?.[0]?.bookmarked
            }
            category={categoriesAvailable.find(
              (i) => i.id === activeDocument?.categoryId,
            )}
            onPressBack={() => {
              setActiveDocument(null)
              navigate(DocumentsPaths.ElectronicDocumentsRoot, {
                replace: true,
              })
            }}
            error={{
              message: error
                ? formatMessage(messages.error)
                : documentDisplayError ?? undefined,
              code: error ? 'list' : 'single',
            }}
            loading={docLoading}
          />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ServicePortalDocumentsV2
