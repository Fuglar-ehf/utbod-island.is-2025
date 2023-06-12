import React from 'react'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { api } from '@island.is/judicial-system-web/src/services'

import * as styles from './PdfButton.css'

interface Props {
  caseId: string
  title: string
  pdfType?:
    | 'ruling'
    | 'caseFilesRecord'
    | 'courtRecord'
    | 'request'
    | 'custodyNotice'
    | 'limitedAccess/ruling'
    | 'limitedAccess/courtRecord'
    | 'limitedAccess/request'
    | 'indictment'
  disabled?: boolean
  renderAs?: 'button' | 'row'
  handleClick?: () => void
  policeCaseNumber?: string // Only used if pdfType is caseFilesRecord
}

const PdfButton: React.FC<Props> = ({
  caseId,
  title,
  pdfType,
  disabled,
  renderAs = 'button',
  children,
  handleClick, // Overwrites the default onClick handler
  policeCaseNumber,
}) => {
  const handlePdfClick = async () => {
    const newPdfType =
      pdfType === 'caseFilesRecord' ? `${pdfType}/${policeCaseNumber}` : pdfType
    const url = `${api.apiUrl}/api/case/${caseId}/${newPdfType}`

    window.open(url, '_blank')
  }

  return renderAs === 'button' ? (
    <Button
      data-testid={`${pdfType || ''}PDFButton`}
      variant="ghost"
      size="small"
      icon="open"
      iconType="outline"
      disabled={disabled}
      onClick={handleClick ? handleClick : pdfType ? handlePdfClick : undefined}
    >
      {title}
    </Button>
  ) : (
    <Box
      data-testid={`${pdfType || ''}PDFButton`}
      className={`${styles.pdfRow} ${disabled ? '' : styles.cursor}`}
      onClick={() => {
        if (disabled) {
          return
        }

        if (handleClick) {
          return handleClick()
        }

        if (pdfType) {
          return handlePdfClick()
        }
      }}
    >
      <Text color="blue400" variant="h4">
        {title}
      </Text>
      {children}
    </Box>
  )
}

export default PdfButton
