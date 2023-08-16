import { FC, ReactElement } from 'react'
import { Box, DropdownMenu } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import * as styles from './styles.css'
import { m } from '../../lib/messages'
import { downloadCSV } from './downloadCSV'
import {
  EndorsementList,
  PaginatedEndorsementResponse,
} from '@island.is/api/schema'
import MyPdfDocument from './MyPdfDocument'
import { usePDF } from '@react-pdf/renderer'
import { formatDate } from '../../lib/utils/utils'

interface Props {
  petition: EndorsementList
  petitionSigners: PaginatedEndorsementResponse
  petitionId: string
  onGetCSV: () => void
  dropdownItems?: {
    href?: string
    onClick?: () => void
    title: string
    render?: (
      element: ReactElement,
      index: number,
      className: string,
    ) => ReactElement
  }[]
}

export const getCSV = async (data: any[], fileName: string) => {
  const name = `${fileName}`
  const dataArray = data.map((item: any) => [
    formatDate(item.created) ?? '',
    item.meta.fullName ?? '',
    item.meta.locality ?? '',
  ])

  await downloadCSV(name, ['Dagsetning', 'Nafn', 'Sveitarfélag'], dataArray)
}

export const ExportList: FC<React.PropsWithChildren<Props>> = ({
  petition,
  petitionSigners,
  petitionId,
  onGetCSV,
  dropdownItems = [],
}) => {
  const { formatMessage } = useLocale()

  const [document] = usePDF({
    document: (
      <MyPdfDocument petition={petition} petitionSigners={petitionSigners} />
    ),
  })

  if (document.error) {
    console.warn(document.error)
  }

  return (
    <Box className={styles.buttonWrapper}>
      <DropdownMenu
        icon="download"
        iconType="outline"
        menuLabel={formatMessage(m.downloadPetitions)}
        items={[
          {
            title: formatMessage(m.asPdf),
            render: () => (
              <a
                key={petitionId}
                href={document.url ?? ''}
                download={'Undirskriftalisti.pdf'}
                className={styles.menuItem}
              >
                {formatMessage(m.asPdf)}
              </a>
            ),
          },
          {
            onClick: () => onGetCSV(),
            title: formatMessage(m.asCsv),
          },
          ...dropdownItems,
        ]}
        title={formatMessage(m.downloadPetitions)}
      />
    </Box>
  )
}
