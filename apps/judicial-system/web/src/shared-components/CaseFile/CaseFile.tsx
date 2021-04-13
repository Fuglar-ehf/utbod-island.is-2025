import React from 'react'
import { Box, Tag, Text } from '@island.is/island-ui/core'
import BlueBox from '../BlueBox/BlueBox'
import { kb } from '../../utils/stepHelper'
import { formatDate, TIME_FORMAT } from '@island.is/judicial-system/formatters'
import isValid from 'date-fns/isValid'

import * as styles from './CaseFile.treat'

interface Props {
  fileId: string
  name: string
  size: number
  uploadedAt: string
  canOpenFiles?: boolean
  onOpen?: (id: string) => void
}

const CaseFile: React.FC<Props> = (props) => {
  const { fileId, name, size, uploadedAt, canOpenFiles = true, onOpen } = props

  const isValidUpdatedAtDate = isValid(new Date(uploadedAt))

  return (
    <BlueBox size="small">
      <div className={styles.CaseFileContainer}>
        <div className={styles.CaseFileNameContainer}>
          <div className={styles.CaseFileName}>
            <Text fontWeight="semiBold" truncate>
              {name}
            </Text>
          </div>
          <Text>{`(${kb(size)}KB)`}</Text>
        </div>
        <Box display="flex" alignItems="center">
          {isValidUpdatedAtDate && (
            <div className={styles.CaseFileCreatedContainer}>
              <Text variant="small">{`${formatDate(
                uploadedAt,
                'd.M.y',
              )} kl. ${formatDate(uploadedAt, TIME_FORMAT)}`}</Text>
            </div>
          )}
          {canOpenFiles && onOpen && (
            <Tag variant="darkerBlue" onClick={() => onOpen(fileId)}>
              Opna
            </Tag>
          )}
        </Box>
      </div>
    </BlueBox>
  )
}

export default CaseFile
