import { HtmlDocument } from './HTMLDocument'
import { PdfDocWithModal } from './PdfDocument'
import { UrlDocument } from './UrlDocment'
import NoPDF from '../NoPDF/NoPDF'
import { messages } from '../../utils/messages'
import { ActiveDocumentType } from '../../lib/types'
import { useLocale } from '@island.is/localization'
import { customUrl } from '../../utils/customUrlHandler'

const parseDocmentType = (document: ActiveDocumentType) => {
  const doc = document.document
  const overviewUrl = document.downloadUrl

  if (doc.html && doc.html.length > 0) {
    return 'html'
  }
  if (doc.content && doc.content.length > 0) {
    return 'pdf'
  }
  if ((doc.url && doc.url.length > 0) || overviewUrl) {
    return 'url'
  }
  return 'unknown'
}

type DocumentRendererProps = {
  document: ActiveDocumentType
}

export const DocumentRenderer: React.FC<DocumentRendererProps> = ({
  document,
}) => {
  const { formatMessage } = useLocale()
  const type = parseDocmentType(document)

  if (type === 'unknown') return <NoPDF text={formatMessage(messages.error)} />

  if (type === 'html') {
    return <HtmlDocument html={document.document.html} />
  }

  if (type === 'pdf') {
    return <PdfDocWithModal document={document} />
  }

  if (type === 'url') {
    const docUrl = customUrl(document)

    return <UrlDocument url={docUrl} />
  }

  return <NoPDF />
}
