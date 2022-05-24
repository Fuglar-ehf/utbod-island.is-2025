import React, { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
import { useIntl } from 'react-intl'

import {
  CaseDecision,
  CaseState,
  CaseTransition,
  CaseType,
  NotificationType,
  isInvestigationCase,
} from '@island.is/judicial-system/types'
import { Box, Text, toast } from '@island.is/island-ui/core'
import {
  icConfirmation,
  rcConfirmation,
  errors as errorMessages,
} from '@island.is/judicial-system-web/messages'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system/consts'
import { RulingSignatureConfirmationQuery } from '../../utils/mutations'
import { Modal } from '..'
import { useCase } from '../../utils/hooks'
import MarkdownWrapper from '../MarkdownWrapper/MarkdownWrapper'
import {
  RequestRulingSignatureMutationMutation,
  RulingSignatureConfirmationQueryQuery,
} from '../../graphql/schema'
import { RequestRulingSignatureMutation } from '../../utils/hooks/useCase/requestRulingSignatureGql'

const ControlCode: React.FC<{ controlCode?: string }> = ({ controlCode }) => {
  return (
    <>
      <Box marginBottom={2}>
        <Text variant="h2" color="blue400">
          {`Öryggistala: ${controlCode}`}
        </Text>
      </Box>
      <Text>
        Þetta er ekki pin-númerið. Staðfestu aðeins innskráningu ef sama
        öryggistala birtist í símanum þínum.
      </Text>
    </>
  )
}

interface SigningModalProps {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  requestRulingSignatureResponse?: RequestRulingSignatureMutationMutation['requestRulingSignature']
  onClose: () => void
}

export const useRequestRulingSignature = (
  caseId: string,
  onSuccess: () => void,
) => {
  const { formatMessage } = useIntl()

  const [
    requestRulingSignature,
    { loading: isRequestingRulingSignature, data, error },
  ] = useMutation<RequestRulingSignatureMutationMutation>(
    RequestRulingSignatureMutation,
    {
      variables: { input: { caseId } },
      onError: () => {
        toast.error(formatMessage(errorMessages.requestRulingSignature))
      },
      onCompleted: () => onSuccess(),
    },
  )

  if (!data && error) {
    return {
      requestRulingSignature,
      isRequestingRulingSignature: false,
      requestRulingSignatureResponse: undefined,
    }
  }

  return {
    requestRulingSignature,
    requestRulingSignatureResponse: data?.requestRulingSignature,
    isRequestingRulingSignature,
  }
}

const SigningModal: React.FC<SigningModalProps> = ({
  workingCase,
  setWorkingCase,
  requestRulingSignatureResponse,
  onClose,
}) => {
  const router = useRouter()
  const { formatMessage } = useIntl()

  const { transitionCase, sendNotification } = useCase()

  const { data } = useQuery<RulingSignatureConfirmationQueryQuery>(
    RulingSignatureConfirmationQuery,
    {
      variables: {
        input: {
          documentToken: requestRulingSignatureResponse?.documentToken,
          caseId: workingCase.id,
        },
      },
      fetchPolicy: 'no-cache',
    },
  )

  const commitDecision = useCallback(
    async (decision: CaseDecision | undefined) => {
      const transitioned = await transitionCase(
        workingCase,
        decision === CaseDecision.REJECTING
          ? CaseTransition.REJECT
          : decision === CaseDecision.DISMISSING
          ? CaseTransition.DISMISS
          : CaseTransition.ACCEPT,
        setWorkingCase,
      )

      if (transitioned) {
        sendNotification(workingCase.id, NotificationType.RULING)
      } else {
        // TODO: handle error
      }
    },
    [transitionCase, workingCase, setWorkingCase, sendNotification],
  )

  useEffect(() => {
    if (
      data?.rulingSignatureConfirmation?.documentSigned &&
      workingCase.state === CaseState.RECEIVED
    ) {
      commitDecision(workingCase.decision)
    }
  }, [
    data?.rulingSignatureConfirmation?.documentSigned,
    workingCase.state,
    workingCase.decision,
    commitDecision,
  ])

  const renderSuccessText = (caseType: CaseType): string => {
    return isInvestigationCase(caseType)
      ? formatMessage(icConfirmation.modal.text)
      : formatMessage(rcConfirmation.modal.rulingNotification.text, {
          summarySentToPrison:
            caseType === CaseType.CUSTODY ||
            caseType === CaseType.ADMISSION_TO_FACILITY
              ? 'yes'
              : 'no',
        })
  }

  return (
    <Modal
      title={
        !data?.rulingSignatureConfirmation
          ? 'Rafræn undirritun'
          : data.rulingSignatureConfirmation.documentSigned
          ? 'Úrskurður hefur verið staðfestur og undirritaður'
          : data.rulingSignatureConfirmation.code === 7023 // User cancelled
          ? 'Notandi hætti við undirritun'
          : 'Undirritun tókst ekki'
      }
      text={
        !data?.rulingSignatureConfirmation ? (
          <ControlCode
            controlCode={requestRulingSignatureResponse?.controlCode}
          />
        ) : data.rulingSignatureConfirmation.documentSigned ? (
          <MarkdownWrapper markdown={renderSuccessText(workingCase.type)} />
        ) : (
          'Vinsamlegast reynið aftur svo hægt sé að senda úrskurðinn með undirritun.'
        )
      }
      secondaryButtonText={
        !data?.rulingSignatureConfirmation
          ? undefined
          : data.rulingSignatureConfirmation.documentSigned
          ? 'Loka glugga'
          : 'Loka og reyna aftur'
      }
      primaryButtonText={
        data?.rulingSignatureConfirmation?.documentSigned
          ? 'Senda ábendingu'
          : ''
      }
      handlePrimaryButtonClick={() => {
        window.open(Constants.FEEDBACK_FORM_URL, '_blank')
        router.push(`${Constants.SIGNED_VERDICT_OVERVIEW}/${workingCase.id}`)
      }}
      handleSecondaryButtonClick={async () => {
        if (data?.rulingSignatureConfirmation?.documentSigned) {
          router.push(`${Constants.SIGNED_VERDICT_OVERVIEW}/${workingCase.id}`)
        } else {
          onClose()
        }
      }}
    />
  )
}

export default SigningModal
