import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Box,
  Text,
  Input,
  ActionCard,
  Pagination,
} from '@island.is/island-ui/core'
import { ServicePortalPath } from '@island.is/service-portal/core'
import { OrganisationPreview } from './DocumentProviders'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

interface Props {
  organisationsPreview: OrganisationPreview[]
}

const PAGE_SIZE = 4

export const DocumentProvidersSearch = ({ organisationsPreview }: Props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const history = useHistory()
  const { formatMessage } = useLocale()
  const [searchResults, setSearchResults] = useState(organisationsPreview)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const filtered = organisationsPreview.filter((org) => {
      return org.name.toLowerCase().includes(searchTerm.toLowerCase())
    })
    setSearchResults(filtered)

    const lastPage = Math.ceil(filtered.length / PAGE_SIZE)
    if (lastPage === 0) {
      setPage(1)
    } else if (page > lastPage) {
      setPage(lastPage)
    }
  }, [searchTerm, organisationsPreview, page])

  const handleChange = (value: string) => {
    setSearchTerm(value)
  }

  const totalPages = Math.max(Math.ceil(searchResults.length / PAGE_SIZE), 1)
  return (
    <Box>
      <Input
        placeholder={formatMessage(m.documentProvidersSearchPlaceholder)}
        name="searchProviders"
        backgroundColor="blue"
        icon="search"
        value={searchTerm}
        onChange={(e) => {
          handleChange(e.target.value)
        }}
      />
      {searchResults && (
        <Box marginY={3}>
          <Box marginBottom={2}>
            <Text variant="h3" as="h3">
              {`${searchResults.length} ${formatMessage(
                m.documentProvidersNumberOfSearchResultsFoundMessage,
              )}`}
            </Text>
          </Box>
          {searchResults
            .slice(PAGE_SIZE * (page - 1), PAGE_SIZE * page)
            .map(({ name, id, nationalId }) => (
              <Box marginBottom={2} key={id}>
                <ActionCard
                  heading={name}
                  cta={{
                    label: formatMessage(
                      m.documentProvidersSearchResultsActionCardLabel,
                    ),
                    variant: 'secondary',
                    onClick: () => {
                      history.push({
                        pathname: ServicePortalPath.DocumentProviderDocumentProvidersSingle.replace(
                          ':nationalId',
                          nationalId,
                        ),
                        state: {
                          id,
                          name,
                        },
                      })
                    },
                  }}
                />
              </Box>
            ))}
        </Box>
      )}
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
  )
}
