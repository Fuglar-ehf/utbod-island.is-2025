import { FC } from 'react'
import FocusLock from 'react-focus-lock'
import { LoadModal, m } from '@island.is/service-portal/core'
import { Box, Text, GridColumn, GridRow } from '@island.is/island-ui/core'
import { DocumentsV2Category } from '@island.is/api/schema'
import { useLocale, useNamespaces } from '@island.is/localization'
import { DocumentRenderer } from '../DocumentRenderer/DocumentRendererV2'
import { DocumentHeader } from '../../components/DocumentHeader/DocumentHeaderV2'
import { DocumentActionBar } from '../../components/DocumentActionBar/DocumentActionBarV2'
import { useDocumentContext } from '../../screens/Overview/DocumentContext'
import * as styles from './OverviewDisplay.css'

interface Props {
  onPressBack: () => void
  activeBookmark: boolean
  loading?: boolean
  category?: DocumentsV2Category
}

export const MobileOverview: FC<Props> = ({
  onPressBack,
  activeBookmark,
  category,
  loading,
}) => {
  useNamespaces('sp.documents')
  const { formatMessage } = useLocale()
  const { activeDocument } = useDocumentContext()

  if (loading) {
    return <LoadModal />
  }

  if (!activeDocument) {
    return null
  }

  return (
    <GridRow>
      <GridColumn span="12/12" position="relative">
        <FocusLock autoFocus={false}>
          <Box className={styles.modalBase}>
            <Box className={styles.modalHeader}>
              <DocumentActionBar
                onGoBack={onPressBack}
                bookmarked={activeBookmark}
              />
            </Box>
            <Box className={styles.modalContent}>
              <DocumentHeader
                avatar={activeDocument.img}
                sender={activeDocument.sender}
                date={activeDocument.date}
                category={category}
                subject={formatMessage(m.activeDocumentOpenAriaLabel, {
                  subject: activeDocument.subject,
                })}
              />
              <Text variant="h3" as="h3" marginBottom={3}>
                {activeDocument?.subject}
              </Text>
              {<DocumentRenderer doc={activeDocument} />}
            </Box>
          </Box>
        </FocusLock>
      </GridColumn>
    </GridRow>
  )
}

export default MobileOverview
