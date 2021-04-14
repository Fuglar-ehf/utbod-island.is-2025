import React, { FC } from 'react'

import { useLocale } from '@island.is/localization'

import { FieldBaseProps } from '@island.is/application/core'
import { Box, Button, Text } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'

import { parentalLeaveFormMessages } from '../../lib/messages'

import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { useMutation } from '@apollo/client'
import { States as ApplicationStates } from '../../lib/ParentalLeaveTemplate'
import { handleSubmitError } from '../../parentalLeaveClientUtils'

const EditsRequireAction: FC<FieldBaseProps> = ({ application, refetch }) => {
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleSubmitError(e.message, formatMessage),
    },
  )

  const onSubmit = async (eventName: string) => {
    const res = await submitApplication({
      variables: {
        input: {
          id: application.id,
          event: eventName,
          answers: application.answers,
        },
      },
    })

    if (res?.data) {
      // Takes them to the next state (which loads the relevant form)
      refetch?.()
    }
  }

  const { formatMessage } = useLocale()

  const descKey =
    application.state === ApplicationStates.EMPLOYER_EDITS_ACTION
      ? parentalLeaveFormMessages.editFlow.editsNotApprovedEmployerDesc
      : parentalLeaveFormMessages.editFlow.editsNotApprovedVMLSTDesc

  return (
    <Box>
      <Box>
        <FieldDescription description={formatMessage(descKey)} />
      </Box>
      <Box marginTop={10}>
        <Text variant="h3" marginTop={4}>
          {formatMessage(
            parentalLeaveFormMessages.editFlow.editsNotApprovedCTA,
          )}
        </Text>
        <Box marginTop={4}>
          <Button
            colorScheme="destructive"
            iconType="filled"
            size="small"
            type="button"
            variant="text"
            loading={loadingSubmit}
            disabled={loadingSubmit}
            onClick={() => onSubmit('ABORT')}
          >
            {formatMessage(
              parentalLeaveFormMessages.editFlow.editsNotApprovedDiscardButton,
            )}
          </Button>
          <Box display="inlineBlock" marginLeft={2}>
            <Button
              colorScheme="default"
              iconType="filled"
              size="small"
              type="button"
              variant="primary"
              loading={loadingSubmit}
              disabled={loadingSubmit}
              onClick={() => onSubmit('MODIFY')}
            >
              {formatMessage(
                parentalLeaveFormMessages.editFlow.editsNotApprovedEditButton,
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default EditsRequireAction
