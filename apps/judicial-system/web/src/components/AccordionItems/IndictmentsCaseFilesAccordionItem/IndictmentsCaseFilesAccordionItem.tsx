import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { uuid } from 'uuidv4'
import {
  animate,
  AnimatePresence,
  motion,
  MotionValue,
  Reorder,
  useDragControls,
  useMotionValue,
} from 'framer-motion'
import { useMutation } from '@apollo/client'

import {
  AccordionItem,
  Text,
  Box,
  Icon,
  AlertMessage,
} from '@island.is/island-ui/core'
import { CaseFile as TCaseFile } from '@island.is/judicial-system/types'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'
import { formatDate } from '@island.is/judicial-system/formatters'

import { indictmentsCaseFilesAccordionItem as m } from './IndictmentsCaseFilesAccordionItem.strings'
import * as styles from './IndictmentsCaseFilesAccordionItem.css'
import { UpdateFileMutation } from './UpdateFiles.gql'

interface Props {
  policeCaseNumber: string
  caseFiles: TCaseFile[]
  caseId: string
  shouldStartExpanded: boolean
}

interface CaseFileProps {
  caseFile: ReorderableItem
  index: number
  onReorder: (id?: string) => void
  onOpen: (id: string) => void
}

export interface ReorderableItem {
  id: string
  displayText: string
  isDivider: boolean
  created?: string
  chapter?: number
  orderWithinChapter?: number
}

interface UpdateFilesMutationResponse {
  caseFiles: TCaseFile[]
}

const useRaisedShadow = (value: MotionValue<number>) => {
  const inactiveShadow = '0px 0px 0px rgba(0,0,0,0.8)'
  const boxShadow = useMotionValue(inactiveShadow)

  useEffect(() => {
    let isActive = false
    value.onChange((latest) => {
      const wasActive = isActive
      if (latest !== 0) {
        isActive = true
        if (isActive !== wasActive) {
          animate(boxShadow, '5px 5px 10px rgba(0,0,0,0.3)')
        }
      } else {
        isActive = false
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow)
        }
      }
    })
  }, [value, boxShadow])

  return boxShadow
}

export const getFilePlacement = (fileId: string, files: ReorderableItem[]) => {
  let [chapter, orderWithinChapter]: [number | null, number | null] = [0, 0]
  let counter = 0
  const fileInFiles = files[files.findIndex((item) => item.id === fileId)]

  if (files.indexOf(fileInFiles) === -1) {
    return [null, null]
  }

  for (
    let i = files.indexOf(fileInFiles);
    files[i].chapter === undefined;
    i--
  ) {
    if (files[i - 1].isDivider) {
      chapter = null
      orderWithinChapter = null
      break
    }

    if (files[i - 1].chapter !== undefined) {
      chapter = files[i - 1].chapter || 0 // The "|| 0" part of this line is to silence a TS error
    }

    orderWithinChapter = counter++
  }

  return [chapter, orderWithinChapter]
}

export const getFilesBelowInChapter = (
  fileId: string,
  files: ReorderableItem[],
) => {
  const filesBelowInChapter: ReorderableItem[] = []
  const fileInFiles = files[files.findIndex((item) => item.id === fileId)]
  for (let i = files.indexOf(fileInFiles) + 1; i < files.length; i++) {
    if (files[i].chapter !== undefined || files[i].isDivider) {
      break
    }

    filesBelowInChapter.push(files[i])
  }

  return filesBelowInChapter
}

export const sortedFilesInChapter = (
  chapter: number,
  files: TCaseFile[],
): ReorderableItem[] => {
  return files
    .filter((file) => file.chapter === chapter)
    .map((file) => {
      return {
        id: file.id,
        displayText: file.name,
        isDivider: false,
        created: file.created,
        orderWithinChapter: file.orderWithinChapter,
      }
    })
    .sort((a, b) => {
      if (
        a.orderWithinChapter === undefined ||
        b.orderWithinChapter === undefined
      ) {
        return 0
      }

      return a.orderWithinChapter - b.orderWithinChapter
    })
}

const renderChapter = (chapter: number, name: string) => (
  <Box className={styles.chapterContainer} data-testid="chapter">
    <Box marginRight={3}>
      <Text variant="h4">{`${chapter + 1}.`}</Text>
    </Box>
    <Text variant="h4">{name}</Text>
  </Box>
)

const CaseFile: React.FC<CaseFileProps> = (props) => {
  const { caseFile, index, onReorder, onOpen } = props
  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const controls = useDragControls()
  const [isDragging, setIsDragging] = useState(false)

  return (
    <Reorder.Item
      value={caseFile}
      id={caseFile.id}
      style={{
        y,
        boxShadow,
        // Prevents text selection when dragging
        userSelect: isDragging ? 'none' : 'auto',
        // Hide the first item because we are rendering it outside the Reorder component
        display: index === 0 ? 'none' : 'block',
      }}
      className={styles.reorderItem}
      dragListener={false}
      dragControls={controls}
    >
      {caseFile.chapter !== undefined ? (
        renderChapter(caseFile.chapter, caseFile.displayText)
      ) : caseFile.isDivider ? (
        <Box marginBottom={2}>
          <Box marginBottom={1}>
            <Text variant="h4">{caseFile.displayText.split('|')[0]}</Text>
          </Box>
          <Text>{caseFile.displayText.split('|')[1]}</Text>
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="spaceBetween"
          alignItems="center"
          background="blue100"
          padding={2}
          onPointerUp={() => {
            setIsDragging(false)
            onReorder(caseFile.id)
          }}
        >
          <Box display="flex" alignItems="center">
            <Box
              data-testid="caseFileDragHandle"
              display="flex"
              marginRight={3}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              onPointerDown={(e) => {
                setIsDragging(true)
                controls.start(e)
              }}
            >
              <Icon icon="menu" color="blue400" />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              component="button"
              onClick={() => {
                if (caseFile.id) {
                  onOpen(caseFile.id)
                }
              }}
            >
              <Text variant="h5">{caseFile.displayText}</Text>
              <Box marginLeft={1}>
                <Icon icon="open" type="outline" size="small" />
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center">
            <Box display="flex" marginRight={3}>
              <Text variant="small">{formatDate(caseFile.created, 'P')}</Text>
            </Box>
            <button onClick={() => alert('not implemented')}>
              <Icon icon="pencil" color="blue400" />
            </button>
          </Box>
        </Box>
      )}
    </Reorder.Item>
  )
}

const IndictmentsCaseFilesAccordionItem: React.FC<Props> = (props) => {
  const { policeCaseNumber, caseFiles, caseId, shouldStartExpanded } = props
  const { formatMessage } = useIntl()
  const [updateFilesMutation] = useMutation<UpdateFilesMutationResponse>(
    UpdateFileMutation,
  )
  const { onOpen } = useFileList({ caseId })

  const [reorderableItems, setReorderableItems] = useState<ReorderableItem[]>([
    {
      id: uuid(),
      displayText: formatMessage(m.chapterIndictmentAndAccompanyingDocuments),
      chapter: 0,
      isDivider: false,
    },
    ...sortedFilesInChapter(0, caseFiles),
    {
      id: uuid(),
      displayText: formatMessage(m.chapterInvesitgationProcess),
      chapter: 1,
      isDivider: false,
    },
    ...sortedFilesInChapter(1, caseFiles),
    {
      id: uuid(),
      displayText: formatMessage(m.chapterWitnesses),
      chapter: 2,
      isDivider: false,
    },
    ...sortedFilesInChapter(2, caseFiles),
    {
      id: uuid(),
      displayText: formatMessage(m.chapterDefendant),
      chapter: 3,
      isDivider: false,
    },
    ...sortedFilesInChapter(3, caseFiles),
    {
      id: uuid(),
      displayText: formatMessage(m.chapterCaseFiles),
      chapter: 4,
      isDivider: false,
    },
    ...sortedFilesInChapter(4, caseFiles),
    {
      id: uuid(),
      displayText: formatMessage(m.chapterElectronicDocuments),
      chapter: 5,
      isDivider: false,
    },
    ...sortedFilesInChapter(5, caseFiles),
    {
      id: uuid(),
      displayText: `${formatMessage(m.unorderedFilesTitle)}|${formatMessage(
        m.unorderedFilesExplanation,
      )}`,
      isDivider: true,
    },
    ...caseFiles
      .filter(
        (caseFile) =>
          caseFile.chapter === null || caseFile.chapter === undefined,
      )
      .map((caseFile) => {
        return {
          displayText: caseFile.name,
          isDivider: false,
          created: caseFile.created,
          id: caseFile.id,
        }
      }),
  ])

  const handleReorder = (fileId?: string) => {
    if (!fileId) {
      return
    }

    const [chapter, orderWithinChapter] = getFilePlacement(
      fileId,
      reorderableItems,
    )
    const filesBelowInChapter = getFilesBelowInChapter(fileId, reorderableItems)

    // Do not update the order of files if the file is not in a chapter
    if (chapter === null || orderWithinChapter === null) {
      return
    }

    updateFilesMutation({
      variables: {
        input: {
          caseId,
          files: [
            {
              id: fileId,
              chapter,
              orderWithinChapter,
            },
            ...filesBelowInChapter.map((file, index) => {
              return {
                id: file.id,
                chapter,
                orderWithinChapter: orderWithinChapter + index + 1,
              }
            }),
          ],
        },
      },
    })
  }

  return (
    <AccordionItem
      id="IndictmentsCaseFilesAccordionItem"
      label={formatMessage(m.title, {
        policeCaseNumber,
      })}
      labelVariant="h3"
      startExpanded={shouldStartExpanded}
    >
      <Box marginBottom={3}>
        <Text>{formatMessage(m.explanation)}</Text>
      </Box>
      {/* 
      Render the first chapter here, outside the reorder group because 
      you should not be able to put a file above the first chapter.
       */}
      {renderChapter(
        0,
        formatMessage(m.chapterIndictmentAndAccompanyingDocuments),
      )}
      <Reorder.Group
        axis="y"
        values={reorderableItems}
        onReorder={setReorderableItems}
        className={styles.reorderGroup}
      >
        {reorderableItems.map((item, index) => {
          return (
            <Box key={item.id} marginBottom={2}>
              <CaseFile
                caseFile={item}
                index={index}
                onReorder={handleReorder}
                onOpen={onOpen}
              />
            </Box>
          )
        })}
      </Reorder.Group>
      <AnimatePresence>
        {reorderableItems[reorderableItems.length - 1].isDivider && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AlertMessage
              type="success"
              message={formatMessage(m.noCaseFiles)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AccordionItem>
  )
}

export default IndictmentsCaseFilesAccordionItem
