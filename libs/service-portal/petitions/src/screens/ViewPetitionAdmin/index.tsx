import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Input,
  Stack,
  DialogPrompt,
  toast,
  AlertMessage,
  DatePicker,
} from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import { LockList, UnlockList, UpdateList } from '../queries'

import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import PetitionsTable from '../PetitionsTable'
import { EndorsementList } from '../../types/schema'
import { useMutation } from '@apollo/client'
import Skeleton from '../Skeletons/SkeletonAdmin'
import {
  useGetSinglePetition,
  useGetSinglePetitionEndorsements,
} from '../hooks'

const ViewPetitionAdmin = () => {
  const { formatMessage } = useLocale()
  const location: any = useLocation()
  const { petitionData, refetchSinglePetition } = useGetSinglePetition(
    location.state?.listId,
  )
  const petition = petitionData as EndorsementList
  const { petitionEndorsements } = useGetSinglePetitionEndorsements(
    location.state?.listId,
  )

  const [title, setTitle] = useState(petition?.title)
  const [description, setDescription] = useState(petition?.description)
  const [closedDate, setClosedDate] = useState(petition?.closedDate)
  const [openedDate, setOpenedDate] = useState(petition?.openedDate)

  useEffect(() => {
    setTitle(petition?.title)
    setDescription(petition?.description)
    setClosedDate(petition?.closedDate)
    setOpenedDate(petition?.openedDate)
  }, [petition])

  const [lockList] = useMutation(LockList, {
    onCompleted: () => {
      refetchSinglePetition()
    },
  })

  const [unlockList] = useMutation(UnlockList, {
    onCompleted: () => {
      refetchSinglePetition()
    },
  })

  const [updateList] = useMutation(UpdateList, {
    onCompleted: () => {
      refetchSinglePetition()
    },
  })

  const onLockList = async () => {
    const success = await lockList({
      variables: {
        input: {
          listId: location.state?.listId,
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.toastError))
    })

    if (success) {
      toast.success(formatMessage(m.toastSuccess))
    }
  }

  const onUnlockList = async () => {
    const success = await unlockList({
      variables: {
        input: {
          listId: location.state?.listId,
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.toastError))
    })

    if (success) {
      toast.success(formatMessage(m.toastSuccess))
    }
  }

  const onUpdateList = async () => {
    const success = await updateList({
      variables: {
        input: {
          listId: location.state?.listId,
          endorsementList: {
            title: title,
            description: description,
            closedDate: closedDate,
            openedDate: openedDate,
          },
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.toastError))
    })

    if (success) {
      toast.success(formatMessage(m.toastSuccess))
    }
  }

  return (
    <Box>
      {Object.entries(petition).length !== 0 ? (
        <Stack space={3}>
          {petition.adminLock && (
            <AlertMessage type="error" title={''} message="" />
          )}
          <Input
            name={title as string}
            value={title ?? ''}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            label={'Heiti lista'}
            size="xs"
          />
          <Input
            size="xs"
            name={description as string}
            value={description ?? ''}
            onChange={(e) => {
              setDescription(e.target.value)
            }}
            label={'Um lista'}
            textarea
            rows={10}
          />
          {closedDate && openedDate && (
            <Box display={['block', 'flex']} justifyContent="spaceBetween">
              <Box width="half" marginRight={[0, 2]}>
                <DatePicker
                  selected={new Date(openedDate)}
                  handleChange={(date) => setOpenedDate(date)}
                  label="Tímabil frá"
                  locale="is"
                  placeholderText="Veldu dagsetningu"
                  size="xs"
                />
              </Box>
              <Box width="half" marginLeft={[0, 2]} marginTop={[2, 0]}>
                <DatePicker
                  selected={new Date(closedDate)}
                  handleChange={(date) => setClosedDate(date)}
                  label="Tímabil til"
                  locale="is"
                  placeholderText="Veldu dagsetningu"
                  size="xs"
                />
              </Box>
            </Box>
          )}

          <Input
            size="xs"
            backgroundColor="blue"
            disabled
            name={petition?.ownerName ?? ''}
            value={petition?.ownerName ?? ''}
            label={formatMessage(m.listOwner)}
          />

          <Box
            display="flex"
            justifyContent="spaceBetween"
            marginTop={5}
            marginBottom={7}
          >
            {!petition.adminLock ? (
              <DialogPrompt
                baseId="demo_dialog"
                title={
                  '//Todo: add texts after moving this screen to admin system'
                }
                ariaLabel={''}
                disclosureElement={
                  <Button
                    icon="lockClosed"
                    iconType="outline"
                    colorScheme="destructive"
                  >
                    {'Loka lista'}
                  </Button>
                }
                onConfirm={() => onLockList()}
                buttonTextConfirm={'Já'}
                buttonTextCancel={'Nei'}
              />
            ) : (
              <DialogPrompt
                baseId="demo_dialog"
                title={
                  '//Todo: add texts after moving this screen to admin system'
                }
                ariaLabel={''}
                disclosureElement={
                  <Button icon="reload" iconType="outline">
                    {'Opna lista'}
                  </Button>
                }
                onConfirm={() => onUnlockList()}
                buttonTextConfirm={'Já'}
                buttonTextCancel={'Nei'}
              />
            )}
            <DialogPrompt
              baseId="demo_dialog"
              title={
                '//Todo: add texts after moving this screen to admin system'
              }
              ariaLabel={''}
              disclosureElement={
                <Button icon="checkmark" iconType="outline">
                  {'Uppfæra lista'}
                </Button>
              }
              onConfirm={() => onUpdateList()}
              buttonTextConfirm={'Já'}
              buttonTextCancel={'Nei'}
            />
          </Box>

          <PetitionsTable
            petitions={petitionEndorsements}
            listId={location.state?.listId}
            isViewTypeEdit={true}
          />
        </Stack>
      ) : (
        <Skeleton />
      )}
    </Box>
  )
}

export default ViewPetitionAdmin
