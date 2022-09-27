import React, { useState } from 'react'
import { useIntl, IntlShape } from 'react-intl'

import { Input, Box } from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system/types'
import { caseResubmitModal as m } from '@island.is/judicial-system-web/messages'

import { Modal } from '..'

interface Props {
  workingCase: Case
  isLoading: boolean
  onClose: () => void
  onContinue: (explanation: string) => void
}
export function getCaseResubmittedText(
  formatMessage: IntlShape['formatMessage'],
  workingCase: Case,
) {
  return formatMessage(m.text, {
    sendRequestToDefender: Boolean(
      workingCase.sendRequestToDefender && workingCase.courtDate,
    ),
  })
}

const CaseResubmitModal: React.FC<Props> = ({
  workingCase,
  isLoading,
  onClose,
  onContinue,
}) => {
  const { formatMessage } = useIntl()
  const [explanation, setExplanation] = useState('')
  return (
    <Modal
      title={formatMessage(m.heading)}
      text={getCaseResubmittedText(formatMessage, workingCase)}
      handleClose={onClose}
      primaryButtonText={formatMessage(m.primaryButtonText)}
      secondaryButtonText={formatMessage(m.secondaryButtonText)}
      handleSecondaryButtonClick={onClose}
      handlePrimaryButtonClick={() => {
        if (explanation) {
          onContinue(explanation)
        }
      }}
      isPrimaryButtonLoading={isLoading}
      isPrimaryButtonDisabled={!explanation}
    >
      <Box marginBottom={10}>
        <Input
          name="caseResentExplanation"
          label={formatMessage(m.input.label)}
          placeholder={formatMessage(m.input.placeholder)}
          onChange={(evt) => setExplanation(evt.target.value)}
          textarea
          rows={7}
        />
      </Box>
    </Modal>
  )
}

export default CaseResubmitModal
