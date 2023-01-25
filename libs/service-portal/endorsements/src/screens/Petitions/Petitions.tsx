import format from 'date-fns/format'
import { Link } from 'react-router-dom'

import { Box, Bullet, BulletList, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, ServicePortalPath } from '@island.is/service-portal/core'

import { m } from '../../lib/messages'
import {
  PaginatedEndorsementListResponse,
  PaginatedEndorsementResponse,
} from '../../types/schema'
import { useGetListsUserSigned, useListsUserOwns } from '../queries'
import { ActionCard } from '@island.is/service-portal/core'

const formatDate = (date: string) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy')
  } catch {
    return date
  }
}

const Petitions = () => {
  const { formatMessage } = useLocale()
  const getPetitionListsUserOwns = useListsUserOwns()
  const getPetitionListsUserSigned = useGetListsUserSigned()

  const ownedLists = (getPetitionListsUserOwns as PaginatedEndorsementListResponse)
    .data
  const signedLists = (getPetitionListsUserSigned as PaginatedEndorsementResponse)
    .data

  //finding signed lists that are open and signed lists that are closed
  const openSignedLists = signedLists?.filter((list) => {
    return (
      new Date(list.endorsementList?.openedDate) <= new Date() &&
      new Date() <= new Date(list.endorsementList?.closedDate)
    )
  })

  const closedSignedLists = signedLists?.filter((list) => {
    return new Date() >= new Date(list.endorsementList?.closedDate)
  })

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader title={m.petition.introTitle} intro={m.petition.intro} />

      <Box padding="gutter">
        <BulletList type="ul">
          <Bullet>{formatMessage(m.petition.bullet1)}</Bullet>
          <Bullet>{formatMessage(m.petition.bullet2)}</Bullet>
          <Bullet>{formatMessage(m.petition.bullet3)}</Bullet>
        </BulletList>
      </Box>

      <Box marginTop={5} marginBottom={7}>
        {ownedLists && ownedLists.length > 0 && (
          <>
            <Text as="p" variant="h3" marginBottom={2}>
              {formatMessage(m.petition.petitionListsIown)}
            </Text>
            <Stack space={4}>
              {ownedLists.map((list: any) => {
                return (
                  <Link
                    style={{ textDecoration: 'none' }}
                    key={list.id}
                    state={{ type: 'edit', listId: list.id }}
                    to={ServicePortalPath.PetitionList.replace(
                      ':listId',
                      list.id,
                    )}
                  >
                    <ActionCard
                      backgroundColor="blue"
                      heading={list.title}
                      text={
                        formatMessage(m.petition.listPeriod) +
                        ' ' +
                        formatDate(list.openedDate) +
                        ' - ' +
                        formatDate(list.closedDate)
                      }
                      cta={{
                        label: formatMessage(m.petition.editList),
                        variant: 'text',
                        icon: 'arrowForward',
                      }}
                    />
                  </Link>
                )
              })}
            </Stack>
          </>
        )}
      </Box>

      <Box marginTop={4}>
        {openSignedLists && openSignedLists.length > 0 && (
          <>
            <Text as="p" variant="h3" marginBottom={2}>
              {formatMessage(m.petition.petitionListsSignedByMe)}
            </Text>
            <Stack space={4}>
              {openSignedLists.map((list: any) => {
                return (
                  <Link
                    style={{ textDecoration: 'none' }}
                    key={list.id}
                    state={{
                      listId: list.endorsementList?.id,
                    }}
                    to={ServicePortalPath.PetitionList.replace(
                      ':listId',
                      list.id,
                    )}
                  >
                    <ActionCard
                      backgroundColor="white"
                      heading={list.endorsementList?.title}
                      text={
                        formatMessage(m.petition.listPeriod) +
                        ' ' +
                        formatDate(list.endorsementList.openedDate) +
                        ' - ' +
                        formatDate(list.endorsementList.closedDate)
                      }
                      cta={{
                        label: formatMessage(m.petition.viewList),
                        variant: 'text',
                        icon: 'arrowForward',
                      }}
                    />
                  </Link>
                )
              })}
            </Stack>
          </>
        )}
      </Box>

      <Box marginTop={4}>
        {closedSignedLists && closedSignedLists.length > 0 && (
          <>
            <Text as="p" variant="h3" marginBottom={2}>
              {formatMessage(m.petition.closedListsSignedByMe)}
            </Text>
            <Stack space={4}>
              {closedSignedLists.map((list: any) => {
                return (
                  <Link
                    style={{ textDecoration: 'none' }}
                    key={list.id}
                    state={{
                      listId: list.endorsementList?.id,
                    }}
                    to={ServicePortalPath.PetitionList.replace(
                      ':listId',
                      list.id,
                    )}
                  >
                    <ActionCard
                      backgroundColor="red"
                      heading={list.endorsementList?.title}
                      text={
                        formatMessage(m.petition.listPeriod) +
                        ' ' +
                        formatDate(list.endorsementList.openedDate) +
                        ' - ' +
                        formatDate(list.endorsementList.closedDate)
                      }
                      cta={{
                        label: formatMessage(m.petition.viewList),
                        variant: 'text',
                        icon: 'arrowForward',
                      }}
                    />
                  </Link>
                )
              })}
            </Stack>
          </>
        )}
      </Box>
    </Box>
  )
}

export default Petitions
