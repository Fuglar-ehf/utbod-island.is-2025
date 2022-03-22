import React, { FC, useEffect, useState } from 'react'
import { Box } from '../Box/Box'
import type { Document, Page, Outline, pdfjs } from 'react-pdf'
import * as styles from './PdfViewer.css'
import { Pagination } from '../Pagination/Pagination'
import { LoadingDots } from '../LoadingDots/LoadingDots'
import { AlertMessage } from '../AlertMessage/AlertMessage'
import cn from 'classnames'

export interface PdfViewerProps {
  file: string
  renderMode?: 'svg' | 'canvas'
  showAllPages?: boolean
}
interface PdfProps {
  numPages: number
}

interface IPdfLib {
  default: any
  pdfjs: typeof pdfjs
  Document: typeof Document
  Page: typeof Page
  Outline: typeof Outline
}

export const PdfViewer: FC<PdfViewerProps> = ({
  file,
  renderMode = 'svg',
  showAllPages = false,
}) => {
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfLib, setPdfLib] = useState<IPdfLib>()
  const [pdfLibError, setPdfLibError] = useState<any>()

  useEffect(() => {
    import('react-pdf')
      .then((pdf) => {
        pdf.pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdf.pdfjs.version}/pdf.worker.min.js`
        setPdfLib(pdf)
      })
      .catch((e) => {
        setPdfLibError(e)
      })
  }, [])

  const onDocumentLoadSuccess = ({ numPages }: PdfProps) => {
    setNumPages(numPages)
  }

  const loadingView = () => {
    return (
      <Box height="full" display="flex" justifyContent="center">
        <LoadingDots large />
      </Box>
    )
  }

  if (pdfLibError) {
    return (
      <AlertMessage
        type="error"
        title="Villa kom upp við að birta skjal, reyndu aftur síðar."
      />
    )
  }

  if (pdfLib) {
    return (
      <>
        <pdfLib.Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          renderMode={renderMode}
          className={styles.pdfViewer}
          loading={() => loadingView()}
        >
          {showAllPages ? (
            [...Array(numPages)].map((x, page) => (
              <pdfLib.Page key={`page_${page + 1}`} pageNumber={page + 1} />
            ))
          ) : (
            <pdfLib.Page pageNumber={pageNumber} />
          )}
        </pdfLib.Document>

        <Box
          marginTop={2}
          marginBottom={4}
          className={cn({
            [`${styles.displayNone}`]: showAllPages,
          })}
        >
          <Pagination
            page={pageNumber}
            renderLink={(page, className, children) => (
              <Box
                cursor="pointer"
                className={className}
                onClick={() => setPageNumber(page)}
              >
                {children}
              </Box>
            )}
            totalPages={numPages}
          />
        </Box>
      </>
    )
  }

  return loadingView()
}
