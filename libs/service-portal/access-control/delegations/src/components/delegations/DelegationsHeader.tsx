import { useHistory } from 'react-router-dom'

import {
  Box,
  Button,
  Select,
  SkeletonLoader,
  Input,
} from '@island.is/island-ui/core'
import { m, ServicePortalPath } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import * as styles from './DelegationsHeader.css'
import { useDomains, DomainOption } from '../../hooks/useDomains'

interface DelegationsHeaderProps {
  domainName?: string | null
  onDomainChange(domainOption: DomainOption): void
  onSearchChange(val: string): void
}

export const DelegationsHeader = ({
  onDomainChange,
  onSearchChange,
}: DelegationsHeaderProps) => {
  const { formatMessage } = useLocale()
  const history = useHistory()
  const {
    options,
    selectedOption,
    loading,
    updateDomain,
    name: domainName,
  } = useDomains()

  const onClickHandler = () => {
    const query = new URLSearchParams()

    if (domainName) {
      query.append('domain', domainName)
    }

    const queryString = query.toString()

    const url = `${ServicePortalPath.AccessControlDelegationsGrant}${
      queryString ? `?${queryString}` : ''
    }`

    history.push(url)
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.selectContainer}>
        {loading ? (
          <SkeletonLoader height={71} />
        ) : (
          <Select
            label={formatMessage(m.accessControl)}
            size="xs"
            name="domain"
            backgroundColor="blue"
            id="domain"
            noOptionsMessage={formatMessage({
              id: 'sp.access-control-delegations:no-option',
              defaultMessage: 'Enginn valmöguleiki',
            })}
            options={options}
            value={selectedOption}
            defaultValue={selectedOption}
            onChange={(option) => {
              const opt = option as DomainOption

              if (opt) {
                updateDomain(opt)
                onDomainChange(opt)
              }
            }}
            placeholder={formatMessage({
              id: 'sp.access-control-delegations:choose-domain',
              defaultMessage: 'Veldu kerfi',
            })}
          />
        )}
      </Box>
      <Box className={styles.searchContainer}>
        <Input
          size="xs"
          type="text"
          placeholder={formatMessage({
            id: 'sp.access-control-delegations:search-placeholder',
            defaultMessage: 'Leita eftir nafni eða kt.',
          })}
          backgroundColor="blue"
          name="search"
          onChange={(e) => onSearchChange(e.target.value)}
          icon="search"
        />
      </Box>
      <Box className={styles.buttonContainer}>
        <Button onClick={onClickHandler} size="small" fluid>
          {formatMessage({
            id: 'sp.access-control-delegations:new-delegation',
            defaultMessage: 'Nýtt umboð',
          })}
        </Button>
      </Box>
    </Box>
  )
}
