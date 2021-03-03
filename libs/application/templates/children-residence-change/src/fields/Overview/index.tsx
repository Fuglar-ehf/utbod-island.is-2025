import React, { useEffect, useReducer } from 'react'
import { useIntl } from 'react-intl'
import { useMutation, useLazyQuery } from '@apollo/client'
import { FieldBaseProps, PdfTypes } from '@island.is/application/core'
import { Box, Text, AlertMessage, Button } from '@island.is/island-ui/core'
import {
  CREATE_PDF_PRESIGNED_URL,
  REQUEST_FILE_SIGNATURE,
  UPLOAD_SIGNED_FILE,
  GET_PRESIGNED_URL,
} from '@island.is/application/graphql'
import {
  extractParentFromApplication,
  extractChildrenFromApplication,
  extractAnswersFromApplication,
  constructParentAddressString,
  extractApplicantFromApplication,
} from '../../lib/utils'
import * as m from '../../lib/messages'
import { ApplicationStates } from '../../lib/ChildrenResidenceChangeTemplate'
import { DescriptionText } from '../components'
import {
  fileSignatureReducer,
  initialFileSignatureState,
  FileSignatureActionTypes,
  FileSignatureStatus,
} from './fileSignatureReducer'
import SignatureModal from './SignatureModal'

const Overview = ({ application, setBeforeSubmitCallback }: FieldBaseProps) => {
  const [fileSignatureState, dispatchFileSignature] = useReducer(
    fileSignatureReducer,
    initialFileSignatureState,
  )
  const applicant = extractApplicantFromApplication(application)
  const parent = extractParentFromApplication(application)
  const parentAddress = constructParentAddressString(parent)
  const children = extractChildrenFromApplication(application)
  const answers = extractAnswersFromApplication(application)
  const { formatMessage } = useIntl()
  const pdfType = PdfTypes.CHILDREN_RESIDENCE_CHANGE

  const [
    createPdfPresignedUrl,
    { loading: createLoadingUrl, data: createResponse },
  ] = useMutation(CREATE_PDF_PRESIGNED_URL)

  const [
    getPresignedUrl,
    { data: getResponse, loading: getLoadingUrl },
  ] = useLazyQuery(GET_PRESIGNED_URL)

  const [
    requestFileSignature,
    { data: requestFileSignatureData },
  ] = useMutation(REQUEST_FILE_SIGNATURE)

  const [uploadSignedFile] = useMutation(UPLOAD_SIGNED_FILE)

  useEffect(() => {
    const input = {
      variables: {
        input: {
          id: application.id,
          type: pdfType,
        },
      },
    }

    application.state === ApplicationStates.DRAFT
      ? createPdfPresignedUrl(input)
      : getPresignedUrl(input)
  }, [
    application.id,
    createPdfPresignedUrl,
    getPresignedUrl,
    application.state,
    pdfType,
  ])

  const pdfUrl =
    createResponse?.createPdfPresignedUrl?.url ||
    getResponse?.getPresignedUrl?.url

  setBeforeSubmitCallback &&
    setBeforeSubmitCallback(async () => {
      if (!pdfUrl) {
        return [false, 'no pdf url']
      }
      dispatchFileSignature({ type: FileSignatureActionTypes.REQUEST })
      const documentToken = await requestFileSignature({
        variables: {
          input: {
            id: application.id,
            type: pdfType,
          },
        },
      })
        .then((response) => {
          return response.data?.requestFileSignature?.documentToken
        })
        .catch((error) => {
          dispatchFileSignature({
            type: FileSignatureActionTypes.ERROR,
            status: FileSignatureStatus.REQUEST_ERROR,
            error: '500',
          })
          throw new Error(`Request signature error ${JSON.stringify(error)}`)
        })
      if (documentToken) {
        dispatchFileSignature({ type: FileSignatureActionTypes.UPLOAD })
        const success = await uploadSignedFile({
          variables: {
            input: {
              id: application.id,
              documentToken: documentToken,
              type: pdfType,
            },
          },
        })
          .then(() => {
            return true
          })
          .catch((error) => {
            dispatchFileSignature({
              type: FileSignatureActionTypes.ERROR,
              status: FileSignatureStatus.UPLOAD_ERROR,
              error: '500',
            })
            throw new Error(`Upload signed pdf error ${JSON.stringify(error)}`)
          })

        if (success) {
          dispatchFileSignature({ type: FileSignatureActionTypes.SUCCESS })
          return [true, null]
        }
      }
      return [false, 'Failed to update application']
    })

  const controlCode =
    requestFileSignatureData?.requestFileSignature?.controlCode
  return (
    <>
      <SignatureModal
        controlCode={controlCode}
        onClose={() =>
          dispatchFileSignature({
            type: FileSignatureActionTypes.RESET,
          })
        }
        modalOpen={fileSignatureState.modalOpen}
        signatureStatus={fileSignatureState.status}
      />
      <AlertMessage
        type="info"
        title={formatMessage(m.contract.alert.title)}
        message={formatMessage(m.contract.alert.message)}
      />
      <Box marginTop={5}>
        <DescriptionText
          text={m.contract.general.description}
          format={{ otherParent: parent.name }}
        />
      </Box>
      <Box marginTop={5}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.contract.labels.childName, {
            count: children.length,
          })}
        </Text>
        {children.map((child) => (
          <Text key={child.name}>{child.name}</Text>
        ))}
      </Box>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={2}>
          {formatMessage(m.contract.labels.otherParentContactInformation)}
        </Text>
        <Text>{formatMessage(m.otherParent.inputs.emailLabel)}</Text>
        <Text fontWeight="medium" marginBottom={2}>
          {answers.contactInformation.email}
        </Text>
        <Text>{formatMessage(m.otherParent.inputs.phoneNumberLabel)}</Text>
        <Text fontWeight="medium">
          {answers.contactInformation.phoneNumber}
        </Text>
      </Box>
      {answers.reason && (
        <Box marginTop={4}>
          <Text variant="h4" marginBottom={1}>
            {formatMessage(m.reason.input.label)}
          </Text>
          <Text>{answers.reason}</Text>
        </Box>
      )}
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.contract.labels.currentResidence, {
            count: children.length,
          })}
        </Text>
        <Text>{applicant?.fullName}</Text>
        <Text>{applicant?.legalResidence}</Text>
      </Box>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.contract.labels.newResidence, {
            count: children.length,
          })}
        </Text>
        <Text>{parent?.name}</Text>
        <Text fontWeight="light">{parentAddress}</Text>
      </Box>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.duration.general.sectionTitle)}
        </Text>
        <Text>
          {answers.selectedDuration.length > 1
            ? answers.selectedDuration[1]
            : formatMessage(m.duration.permanentInput.label)}
        </Text>
      </Box>
      <Box marginTop={4}>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(m.interview.general.sectionTitle)}
        </Text>
        <Text>
          {formatMessage(m.interview[answers.interview].overviewText)}
        </Text>
      </Box>
      <Box marginTop={5} marginBottom={3}>
        <Button
          colorScheme="default"
          icon="open"
          iconType="outline"
          onClick={() => window.open(pdfUrl, '_blank')}
          preTextIconType="filled"
          size="default"
          type="button"
          variant="ghost"
          loading={createLoadingUrl || getLoadingUrl}
          disabled={!pdfUrl}
        >
          {formatMessage(m.contract.pdfButton.label)}
        </Button>
      </Box>
    </>
  )
}

export default Overview
