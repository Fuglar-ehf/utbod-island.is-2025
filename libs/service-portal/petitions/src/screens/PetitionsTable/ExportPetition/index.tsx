import { FC, ReactElement } from 'react'
import { Box, DropdownMenu, Button } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import * as styles from './styles.css'
import { m } from '../../../lib/messages'
import { downloadCSV } from './downloadCSV'
import copyToClipboard from 'copy-to-clipboard'
import { toast } from 'react-toastify'

interface Props {
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
    item.created ?? '',
    item.meta.fullName ?? '',
  ])

  await downloadCSV(name, ['Dagsetning', 'Nafn'], dataArray)
}

const baseUrl = `${document.location.origin}/undirskriftalistar/`

const DropdownExport: FC<Props> = ({
  petitionId,
  onGetCSV,
  dropdownItems = [],
}) => {
  useNamespaces('sp.petitions')
  const { formatMessage } = useLocale()
  return (
    <Box className={styles.buttonWrapper} display="flex">
      <Box marginRight={2}>
        <Button
          onClick={() => {
            const copied = copyToClipboard(baseUrl + petitionId)
            if (!copied) {
              return toast.error(formatMessage(m.copyLinkError.defaultMessage))
            }
            toast.success(formatMessage(m.copyLinkSuccess.defaultMessage))
          }}
          variant="utility"
          icon="link"
        >
          {formatMessage(m.copyLinkToList)}
        </Button>
      </Box>
      <DropdownMenu
        icon="download"
        menuLabel={formatMessage(m.downloadPetitions)}
        items={[
          {
            onClick: () => onGetCSV(),
            title: 'Sem CSV',
          },
          ...dropdownItems,
        ]}
        title={formatMessage(m.downloadPetitions)}
      />
    </Box>
  )
}

export default DropdownExport
