import { useMemo, useState } from 'react'
import sortBy from 'lodash/sortBy'
import {
  SkeletonLoader,
  Stack,
  AlertBanner,
  Box,
} from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'
import {
  AuthCustomDelegation,
  AuthDelegationDirection,
} from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '@island.is/portals/core'
import { AccessCard } from '../../access/AccessCard'
import { AccessDeleteModal } from '../../access/AccessDeleteModal/AccessDeleteModal'
import { DelegationsEmptyState } from '../DelegationsEmptyState'
import { DelegationsOutgoingHeader } from './DelegationsOutgoingHeader'
import { DomainOption, useDomains } from '../../../hooks/useDomains/useDomains'
import { ALL_DOMAINS } from '../../../constants/domain'
import { useAuthDelegationsOutgoingQuery } from './DelegationsOutgoing.generated'
import { AuthCustomDelegationOutgoing } from '../../../types/customDelegation'

export const DelegationsOutgoing = () => {
  const { formatMessage, lang = 'is' } = useLocale()
  const [searchValue, setSearchValue] = useState('')
  const [
    delegation,
    setDelegation,
  ] = useState<AuthCustomDelegationOutgoing | null>(null)
  const { name: domainName } = useDomains()

  const { data, loading, refetch, error } = useAuthDelegationsOutgoingQuery({
    variables: {
      input: {
        domain: domainName,
        direction: AuthDelegationDirection.outgoing,
      },
      lang,
    },
    skip: !domainName || !lang || !AuthDelegationDirection.outgoing,
    // Make sure that loading state is shown when refetching
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  })

  const delegations = useMemo(
    () =>
      sortBy(
        data?.authDelegations as AuthCustomDelegation[],
        (d) => d.to?.name,
      ) ?? [],
    [data?.authDelegations],
  )

  const onDomainChange = (option: DomainOption) => {
    // Select components only supports string or number values, there for we use
    // the const ALL_DOMAINS as a value for the all domains option.
    // The service takes null as a value for all domains.
    refetch({
      input: {
        domain: option.value === ALL_DOMAINS ? null : option.value,
      },
    })
  }

  const filteredDelegations = useMemo(() => {
    if (!searchValue) {
      return delegations
    }

    return delegations.filter((delegation) => {
      const searchValueLower = searchValue.toLowerCase()
      const name = delegation.to?.name.toLowerCase()
      const nationalId = delegation.to?.nationalId.toLowerCase()

      return (
        name?.includes(searchValueLower) || nationalId?.includes(searchValue)
      )
    })
  }, [searchValue, delegations])

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        rowGap={4}
        marginTop={[1, 1, 8]}
      >
        <DelegationsOutgoingHeader
          domainName={domainName}
          onDomainChange={onDomainChange}
          onSearchChange={setSearchValue}
        />
        <div>
          {loading ? (
            <SkeletonLoader width="100%" height={191} />
          ) : error && !delegations ? (
            <AlertBanner
              description={formatMessage(m.errorFetch)}
              variant="error"
            />
          ) : delegations.length === 0 ? (
            <DelegationsEmptyState />
          ) : (
            <Stack space={3}>
              {filteredDelegations.map(
                (delegation) =>
                  delegation.to && (
                    <AccessCard
                      key={delegation.id}
                      delegation={delegation}
                      onDelete={(delegation) => {
                        setDelegation(
                          delegation as AuthCustomDelegationOutgoing,
                        )
                      }}
                      variant="outgoing"
                    />
                  ),
              )}
            </Stack>
          )}
        </div>
      </Box>
      <AccessDeleteModal
        onClose={() => {
          setDelegation(null)
        }}
        onDelete={() => {
          setDelegation(null)
          refetch({
            input: {
              domain: domainName,
            },
          })
        }}
        isVisible={isDefined(delegation)}
        delegation={delegation as AuthCustomDelegation}
      />
    </>
  )
}
