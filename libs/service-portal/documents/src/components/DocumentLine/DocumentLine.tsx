import cn from 'classnames'
import format from 'date-fns/format'
import { FC, useEffect, useRef, useState } from 'react'

import {
  Document,
  DocumentDetails,
  GetDocumentListInput,
} from '@island.is/api/schema'
import { Box, Text, LoadingDots, Icon } from '@island.is/island-ui/core'
import { dateFormat } from '@island.is/shared/constants'
import { m } from '@island.is/service-portal/core'
import * as styles from './DocumentLine.css'
import { gql, useLazyQuery } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { messages } from '../../utils/messages'
import AvatarImage from './AvatarImage'
import { useNavigate, useParams } from 'react-router-dom'
import { DocumentsPaths } from '../../lib/paths'
import { FavAndStash } from '../FavAndStash'
import { useSubmitMailAction } from '../../utils/useSubmitMailAction'
import { useIsChildFocusedorHovered } from '../../hooks/useIsChildFocused'
import { ActiveDocumentType } from '../../lib/types'

interface Props {
  documentLine: Document
  img?: string
  onClick?: (doc: ActiveDocumentType) => void
  onError?: (error?: string) => void
  onLoading?: (loading: boolean) => void
  setSelectLine?: (id: string) => void
  refetchInboxItems?: (input?: GetDocumentListInput) => void
  active: boolean
  asFrame?: boolean
  includeTopBorder?: boolean
  selected?: boolean
  bookmarked?: boolean
  archived?: boolean
}

const GET_DOCUMENT_BY_ID = gql`
  query getDocumentInboxLineQuery($input: GetDocumentInput!) {
    getDocument(input: $input) {
      html
      content
      url
    }
  }
`
export const DocumentLine: FC<Props> = ({
  documentLine,
  img,
  onClick,
  onError,
  onLoading,
  setSelectLine,
  refetchInboxItems,
  active,
  asFrame,
  includeTopBorder,
  bookmarked,
  archived,
  selected,
}) => {
  const [hasFocusOrHover, setHasFocusOrHover] = useState(false)
  const [hasAvatarFocus, setHasAvatarFocus] = useState(false)
  const { formatMessage } = useLocale()
  const navigate = useNavigate()
  const date = format(new Date(documentLine.date), dateFormat.is)
  const { id } = useParams<{
    id: string
  }>()

  const {
    submitMailAction,
    archiveSuccess,
    bookmarkSuccess,
    loading: postLoading,
  } = useSubmitMailAction({ messageId: documentLine.id })

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

  useEffect(() => {
    if (id === documentLine.id) {
      onLineClick()
    }
  }, [id, documentLine])

  const displayPdf = (docContent?: DocumentDetails) => {
    if (onClick) {
      onClick({
        document:
          docContent || (getFileByIdData?.getDocument as DocumentDetails),
        id: documentLine.id,
        sender: documentLine.senderName,
        subject: documentLine.subject,
        senderNatReg: documentLine.senderNatReg,
        downloadUrl: documentLine.url,
        date: date,
        img,
        categoryId: documentLine.categoryId ?? undefined,
      })
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  const [getDocument, { data: getFileByIdData, loading: fileLoading }] =
    useLazyQuery(GET_DOCUMENT_BY_ID, {
      variables: {
        input: {
          id: documentLine.id,
        },
      },
      fetchPolicy: 'no-cache',
      onCompleted: (data) => {
        const docContent = data?.getDocument
        if (asFrame) {
          navigate(
            DocumentsPaths.ElectronicDocumentSingle.replace(
              ':id',
              documentLine.id,
            ),
          )
        } else {
          displayPdf(docContent)
          if (onError) {
            onError(undefined)
          }
        }
      },
      onError: () => {
        if (onError) {
          onError(
            formatMessage(messages.documentFetchError, {
              senderName: documentLine.senderName,
            }),
          )
        }
      },
    })

  useEffect(() => {
    if (onLoading) {
      onLoading(fileLoading)
    }
  }, [fileLoading])

  const onLineClick = async () => {
    if (documentLine?.id) {
      navigate(
        DocumentsPaths.ElectronicDocumentSingle.replace(
          ':id',
          documentLine?.id,
        ),
        { replace: true },
      )
    } else {
      navigate(DocumentsPaths.ElectronicDocumentsRoot, { replace: true })
    }

    getFileByIdData
      ? displayPdf()
      : await getDocument({
          variables: { input: { id: documentLine.id } },
        })
  }

  const unread = !documentLine.opened
  const isBookmarked = bookmarked || bookmarkSuccess
  const isArchived = archived || archiveSuccess

  return (
    <Box className={styles.wrapper} ref={wrapperRef}>
      <Box
        display="flex"
        position="relative"
        borderColor="blue200"
        borderBottomWidth="standard"
        borderTopWidth={includeTopBorder ? 'standard' : undefined}
        paddingX={2}
        width="full"
        className={cn(styles.docline, {
          [styles.active]: active,
          [styles.unread]: unread,
        })}
      >
        <div ref={avatarRef}>
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
            <Text variant="small" truncate>
              {documentLine.senderName}
            </Text>
            <Text variant="small">{date}</Text>
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
            {(hasFocusOrHover || isBookmarked || isArchived) &&
              !postLoading &&
              !asFrame && (
                <FavAndStash
                  bookmarked={isBookmarked}
                  archived={isArchived}
                  onFav={
                    isBookmarked || hasFocusOrHover
                      ? async (e) => {
                          e.stopPropagation()
                          await submitMailAction(
                            isBookmarked ? 'unbookmark' : 'bookmark',
                          )
                          if (refetchInboxItems) {
                            refetchInboxItems()
                          }
                        }
                      : undefined
                  }
                  onStash={
                    isArchived || hasFocusOrHover
                      ? async (e) => {
                          e.stopPropagation()
                          await submitMailAction(
                            isArchived ? 'unarchive' : 'archive',
                          )
                          if (refetchInboxItems) {
                            refetchInboxItems()
                          }
                        }
                      : undefined
                  }
                />
              )}
            {(postLoading || (asFrame && fileLoading)) && (
              <Box display="flex" alignItems="center">
                <LoadingDots single />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default DocumentLine
