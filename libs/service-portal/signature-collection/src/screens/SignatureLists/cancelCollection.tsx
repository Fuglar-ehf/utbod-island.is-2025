import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '../../lib/messages'
import { Modal } from '@island.is/service-portal/core'
import { useState } from 'react'
import { useIsOwner } from '../hooks'
import { useMutation } from '@apollo/client'
import { SignatureCollectionSuccess } from '../../types/schema'
import { cancelCollectionMutation } from '../mutations'

const CancelCollection = ({ collectionId }: { collectionId: string }) => {
  useNamespaces('sp.signatureCollection')
  const { formatMessage } = useLocale()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { refetchIsOwner } = useIsOwner()
  const [cancelCollection] = useMutation<SignatureCollectionSuccess>(
    cancelCollectionMutation,
    {
      variables: { input: { id: collectionId } },
    },
  )

  const onUnSignList = async () => {
    setModalIsOpen(false)
    await cancelCollection().then(({ data }) => {
      if (
        (
          data as any as {
            signatureCollectionCancel: SignatureCollectionSuccess
          }
        ).signatureCollectionCancel.success
      ) {
        refetchIsOwner()
      } else {
        toast.error(formatMessage(m.cancelCollectionModalToastError))
      }
    })
  }

  return (
    <Box marginTop={10} display={'flex'} justifyContent={'center'}>
      <Modal
        id="cancelCollection"
        isVisible={modalIsOpen}
        toggleClose={false}
        initialVisibility={false}
        disclosure={
          <Button
            variant="ghost"
            size="small"
            onClick={() => setModalIsOpen(true)}
          >
            {formatMessage(m.cancelCollectionButton)}
          </Button>
        }
      >
        <Text variant="h1" paddingTop={5}>
          {formatMessage(m.cancelCollectionModalMessage)}
        </Text>
        <Box marginTop={10} display="flex" justifyContent="center">
          <Button onClick={() => onUnSignList()}>
            {formatMessage(m.cancelCollectionModalConfirmButton)}
          </Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default CancelCollection
