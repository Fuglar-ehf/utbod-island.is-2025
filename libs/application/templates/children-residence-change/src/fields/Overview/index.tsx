import React, { useEffect, useReducer } from 'react'
import { useIntl } from 'react-intl'
import { useMutation, useLazyQuery, ApolloError } from '@apollo/client'
import { PdfTypes } from '@island.is/application/core'
import { Box, Button } from '@island.is/island-ui/core'
import {
  CREATE_PDF_PRESIGNED_URL,
  REQUEST_FILE_SIGNATURE,
  UPLOAD_SIGNED_FILE,
  GET_PRESIGNED_URL,
} from '@island.is/application/graphql'
import { getSelectedChildrenFromExternalData } from '../../lib/utils'
import * as m from '../../lib/messages'
import { ApplicationStates, Roles } from '../../lib/constants'
import { ContractOverview, DescriptionText } from '../components'
import {
  fileSignatureReducer,
  initialFileSignatureState,
  FileSignatureActionTypes,
  FileSignatureStatus,
} from './fileSignatureReducer'
import SignatureModal from './SignatureModal'
import { CRCFieldBaseProps } from '../../types'
import * as style from '../Shared.treat'

const Overview = ({
  application,
  setBeforeSubmitCallback,
}: CRCFieldBaseProps) => {
  const { answers, externalData } = application
  const [fileSignatureState, dispatchFileSignature] = useReducer(
    fileSignatureReducer,
    initialFileSignatureState,
  )
  const applicant = externalData.nationalRegistry.data
  const children = getSelectedChildrenFromExternalData(
    applicant.children,
    answers.selectedChildren,
  )
  const parentB = children[0].otherParent

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
        .catch((error: ApolloError) => {
          dispatchFileSignature({
            type: FileSignatureActionTypes.ERROR,
            status: FileSignatureStatus.REQUEST_ERROR,
            error: error.graphQLErrors[0].extensions?.code ?? 500,
          })
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
          .catch((error: ApolloError) => {
            dispatchFileSignature({
              type: FileSignatureActionTypes.ERROR,
              status: FileSignatureStatus.UPLOAD_ERROR,
              error: error.graphQLErrors[0].extensions?.code ?? 500,
            })
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
    <Box className={style.descriptionOffset}>
      <SignatureModal
        controlCode={controlCode}
        onClose={() =>
          dispatchFileSignature({
            type: FileSignatureActionTypes.CLOSE_MODAL,
          })
        }
        fileSignatureState={fileSignatureState}
      />
      <Box>
        {application.state === 'draft' ? (
          <DescriptionText
            text={m.contract.general.description}
            format={{
              otherParent: parentB.fullName,
            }}
          />
        ) : (
          <DescriptionText
            text={m.contract.general.parentBDescription}
            format={{
              otherParent: applicant.fullName,
            }}
          />
        )}
      </Box>
      <Box marginTop={4}>
        <ContractOverview application={application} />
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
    </Box>
  )
}

export default Overview
