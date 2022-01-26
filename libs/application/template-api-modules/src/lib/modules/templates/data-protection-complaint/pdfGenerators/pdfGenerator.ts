import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'
import { PdfConstants } from './constants'

type generatePdfBody<T> = (dto: T, doc: PDFKit.PDFDocument) => void

export async function generatePdf<T>(
  dto: T,
  generatePdfBody: generatePdfBody<T>,
): Promise<Buffer> {
  const doc = new PDFDocument({
    margins: {
      top: PdfConstants.VERTICAL_MARGIN,
      bottom: PdfConstants.VERTICAL_MARGIN,
      left: PdfConstants.HORIZONTAL_MARGIN,
      right: PdfConstants.HORIZONTAL_MARGIN,
    },
  })
  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())

  generatePdfBody(dto, doc)

  const pdfBuffer = await new Promise<Buffer>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContents() as Buffer)
    })
  })
  return pdfBuffer
}
