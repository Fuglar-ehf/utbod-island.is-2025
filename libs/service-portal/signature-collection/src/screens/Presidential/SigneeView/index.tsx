import {
  ActionCard,
  AlertMessage,
  Box,
  Button,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { EmptyState, IntroHeader } from '@island.is/service-portal/core'
import { useGetListsForUser, useGetSignedList } from '../../../hooks'
import format from 'date-fns/format'
import { Skeleton } from '../../../skeletons'
import { useAuth } from '@island.is/auth/react'
import { sortAlpha } from '@island.is/shared/utils'
import { m } from '../../../lib/messages'
import SignedList from '../SignedList'
import { SignatureCollection } from '../../../types/schema'

const SigneeView = ({
  currentCollection,
}: {
  currentCollection: SignatureCollection
}) => {
  useNamespaces('sp.signatureCollection')
  const { userInfo: user } = useAuth()

  const { formatMessage } = useLocale()
  const { signedLists, loadingSignedLists } = useGetSignedList()
  const { listsForUser, loadingUserLists } = useGetListsForUser(
    currentCollection?.id,
  )

  return (
    <Box>
      {!user?.profile.actor && !loadingSignedLists && !loadingUserLists ? (
        <Box>
          {currentCollection?.isActive && (
            <Button
              icon="open"
              iconType="outline"
              onClick={() =>
                window.open(
                  `${document.location.origin}/umsoknir/medmaelasofnun/`,
                )
              }
              size="small"
            >
              {formatMessage(m.createListButton)}
            </Button>
          )}
          {listsForUser.length === 0 && signedLists.length === 0 && (
            <Box marginTop={10}>
              <EmptyState
                title={m.noCollectionIsActive}
                description={m.noCollectionIsActiveDescription}
              />
            </Box>
          )}
          <Box marginTop={[2, 7]}>
            {/* Signed list */}
            <SignedList />

            {/* Other available lists */}
            <Box marginTop={[5, 10]}>
              {listsForUser.length > 0 && (
                <Text marginBottom={2}>
                  {formatMessage(m.mySigneeListsByAreaHeader)}
                </Text>
              )}

              <Stack space={3}>
                {listsForUser?.sort(sortAlpha('title')).map((list) => {
                  return (
                    <ActionCard
                      key={list.id}
                      backgroundColor="white"
                      heading={list.title}
                      eyebrow={
                        formatMessage(m.endTime) +
                        ' ' +
                        format(new Date(list.endTime), 'dd.MM.yyyy')
                      }
                      text={formatMessage(m.collectionTitle)}
                      cta={
                        new Date(list.endTime) > new Date() && !list.maxReached
                          ? {
                              label: formatMessage(m.signList),
                              variant: 'text',
                              icon: 'arrowForward',
                              disabled: !!signedLists.length,
                              onClick: () => {
                                window.open(
                                  `${document.location.origin}${list.slug}`,
                                )
                              },
                            }
                          : undefined
                      }
                      tag={
                        new Date(list.endTime) < new Date()
                          ? {
                              label: formatMessage(m.collectionClosed),
                              variant: 'red',
                              outlined: true,
                            }
                          : list.maxReached
                          ? {
                              label: formatMessage(m.collectionMaxReached),
                              variant: 'red',
                              outlined: true,
                            }
                          : undefined
                      }
                    />
                  )
                })}
              </Stack>
            </Box>
          </Box>
        </Box>
      ) : user?.profile.actor ? (
        <AlertMessage
          type="warning"
          title={formatMessage(m.actorNoAccessTitle)}
          message={m.actorNoAccessDescription.defaultMessage}
        />
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default SigneeView
