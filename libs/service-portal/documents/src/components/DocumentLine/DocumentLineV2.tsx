import cn from 'classnames'
import format from 'date-fns/format'
import { FC, useEffect, useRef, useState } from 'react'

import {
  DocumentV2,
  DocumentV2Actions,
  DocumentV2Content,
} from '@island.is/api/schema'
import { Box, Text, LoadingDots, Icon } from '@island.is/island-ui/core'
import { dateFormat } from '@island.is/shared/constants'
import { ConfirmationModal, m } from '@island.is/service-portal/core'
import * as styles from './DocumentLine.css'
import { useLocale } from '@island.is/localization'
import { messages } from '../../utils/messages'
import AvatarImage from './AvatarImage'
import {
  matchPath,
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom'
import { DocumentsPaths } from '../../lib/paths'
import { FavAndStash } from '../FavAndStash/FavAndStash'
import { useIsChildFocusedorHovered } from '../../hooks/useIsChildFocused'
import { useGetDocumentInboxLineV2LazyQuery } from '../../screens/Overview/Overview.generated'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import { useDocumentList } from '../../hooks/useDocumentList'
import { useMailAction } from '../../hooks/useMailActionV2'
import UrgentTag from '../UrgentTag/UrgentTag'

interface Props {
  documentLine: DocumentV2
  img?: string
  setSelectLine?: (id: string) => void
  active: boolean
  asFrame?: boolean
  includeTopBorder?: boolean
  selected?: boolean
  bookmarked?: boolean
}

export const DocumentLine: FC<Props> = ({
  documentLine,
  img,
  setSelectLine,
  active,
  asFrame,
  includeTopBorder,
  bookmarked,
  selected,
}) => {
  const [hasFocusOrHover, setHasFocusOrHover] = useState(false)
  const [hasAvatarFocus, setHasAvatarFocus] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const location = useLocation()
  const date = format(new Date(documentLine.publicationDate), dateFormat.is)
  const { id } = useParams<{
    id: string
  }>()
  const isUrgent = true //documentLine.isUrgent

  const {
    submitMailAction,
    loading: postLoading,
    archiveSuccess,
    bookmarkSuccess,
  } = useMailAction()

  const { activeArchive, fetchObject, refetch } = useDocumentList()

  const {
    setActiveDocument,
    setDocumentDisplayError,
    setDocLoading,
    setLocalRead,
    localRead,
  } = useDocumentContext()

  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }
  const wrapperRef = useRef(null)
  const avatarRef = useRef(null)

  const isFocused = useIsChildFocusedorHovered(wrapperRef)
  const isAvatarFocused = useIsChildFocusedorHovered(avatarRef)

  useEffect(() => {
    setHasFocusOrHover(isFocused)
  }, [isFocused])

  useEffect(() => {
    setHasAvatarFocus(isAvatarFocused)
  }, [isAvatarFocused])

  const displayPdf = (
    content?: DocumentV2Content,
    actions?: Array<DocumentV2Actions>,
  ) => {
    setActiveDocument({
      document: {
        type: content?.type,
        value: content?.value,
      },
      id: documentLine.id,
      sender: documentLine.sender?.name ?? '',
      subject: documentLine.subject,
      senderNatReg: documentLine.sender?.id ?? '',
      downloadUrl: documentLine.downloadUrl ?? '',
      date: date,
      img,
      categoryId: documentLine.categoryId ?? undefined,
      actions: actions,
    })
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const [getDocument, { loading: fileLoading }] =
    useGetDocumentInboxLineV2LazyQuery({
      variables: {
        input: {
          id: documentLine.id,
          provider: documentLine.sender?.name ?? 'unknown',
        },
      },
      fetchPolicy: 'no-cache',
      onCompleted: (data) => {
        if (asFrame) {
          navigate(
            DocumentsPaths.ElectronicDocumentSingle.replace(
              ':id',
              documentLine.id,
            ),
          )
        } else {
          const docContent = data?.documentV2?.content
          const actions = data?.documentV2?.actions ?? undefined
          if (docContent) {
            displayPdf(docContent, actions)
            setDocumentDisplayError(undefined)
            setLocalRead([...localRead, documentLine.id])
          } else {
            setDocumentDisplayError(formatMessage(messages.documentErrorLoad))
          }
        }
      },
      onError: () => {
        setDocumentDisplayError(
          formatMessage(messages.documentFetchError, {
            senderName: documentLine.sender?.name ?? '',
          }),
        )
      },
    })

  useEffect(() => {
    if (id === documentLine.id) {
      getDocument()
    }
  }, [id, documentLine, getDocument])

  useEffect(() => {
    setDocLoading(fileLoading)
  }, [fileLoading, setDocLoading])

  const onLineClick = async () => {
    const pathName = location.pathname
    const match = matchPath(
      {
        path: DocumentsPaths.ElectronicDocumentSingle,
      },
      pathName,
    )
    if (match?.params?.id && match?.params?.id !== documentLine?.id) {
      navigate(DocumentsPaths.ElectronicDocumentsRoot, { replace: true })
    }
    if (isUrgent) {
      toggleModal()
    } else {
      getDocument()
    }
  }

  const unread = !documentLine.opened && !localRead.includes(documentLine.id)
  const isBookmarked = bookmarked || bookmarkSuccess

  return (
    <Box className={styles.wrapper} ref={wrapperRef}>
      <Box
        display="flex"
        position="relative"
        borderColor="blue200"
        borderBottomWidth="standard"
        borderTopWidth={includeTopBorder ? 'standard' : undefined}
        paddingX={2}
        paddingTop="p2"
        paddingBottom={isUrgent ? 'p1' : 'p2'}
        width="full"
        className={cn(styles.docline, {
          [styles.active]: active,
          [styles.unread]: unread,
        })}
      >
        <div ref={avatarRef} className={styles.avatar}>
          <AvatarImage
            img={img}
            onClick={(e) => {
              e.stopPropagation()
              if (documentLine.id && setSelectLine) {
                setSelectLine(documentLine.id)
              }
            }}
            avatar={
              (hasAvatarFocus || selected) && !asFrame ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  background={selected ? 'blue400' : 'blue300'}
                  borderRadius="circle"
                  className={styles.checkCircle}
                >
                  <Icon icon="checkmark" color="white" type="filled" />
                </Box>
              ) : undefined
            }
            background={
              hasAvatarFocus
                ? asFrame
                  ? 'white'
                  : 'blue200'
                : documentLine.opened
                ? 'blue100'
                : 'white'
            }
          />
        </div>
        <Box
          width="full"
          display="flex"
          flexDirection="column"
          paddingLeft={2}
          minWidth={0}
        >
          {active && <div className={styles.fakeBorder} />}
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <Text variant="medium" truncate>
              {documentLine.sender?.name ?? ''}
            </Text>
            <Text variant="medium">{date}</Text>
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="spaceBetween">
            <button
              onClick={async () => onLineClick()}
              aria-label={formatMessage(m.openDocumentAriaLabel, {
                subject: documentLine.subject,
              })}
              type="button"
              id={active ? `button-${documentLine.id}` : undefined}
              className={styles.docLineButton}
            >
              <Text
                fontWeight={unread ? 'medium' : 'regular'}
                color="blue400"
                truncate
              >
                {documentLine.subject}
              </Text>
            </button>

            <Box display="flex" alignItems="center">
              {(postLoading || fileLoading) && (
                <Box display="flex" alignItems="center">
                  <LoadingDots single />
                </Box>
              )}
              {(hasFocusOrHover || isBookmarked) &&
                !postLoading &&
                !fileLoading &&
                !asFrame && (
                  <FavAndStash
                    bookmarked={isBookmarked}
                    onFav={
                      isBookmarked || hasFocusOrHover
                        ? async (e) => {
                            e.stopPropagation()
                            await submitMailAction(
                              isBookmarked ? 'unbookmark' : 'bookmark',
                              documentLine.id,
                            )
                            refetch(fetchObject)
                          }
                        : undefined
                    }
                  />
                )}
              {isUrgent && <UrgentTag />}
            </Box>
          </Box>
        </Box>
      </Box>
      {isModalVisible && (
        <ConfirmationModal
          onSubmit={() => {
            setModalVisible(false)
            getDocument()
          }}
          onCancel={() => setModalVisible(false)}
          onClose={toggleModal}
          loading={false}
          modalText={formatMessage(m.acknowledgeText, {
            arg: documentLine.sender.name,
          })}
          redirectPath={''}
        />
      )}
    </Box>
  )
}

export default DocumentLine
