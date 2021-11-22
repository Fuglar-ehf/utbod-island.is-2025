import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import {
  Footer,
  Files,
  ContentContainer,
} from '@island.is/financial-aid-web/osk/src/components'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useFileUpload } from '@island.is/financial-aid-web/osk/src/utils/hooks/useFileUpload'
import {
  Application,
  ApplicationEventType,
  ApplicationState,
  FileType,
  getCommentFromLatestEvent,
} from '@island.is/financial-aid/shared/lib'
import { useMutation } from '@apollo/client'
import {
  ApplicationEventMutation,
  ApplicationMutation,
} from '@island.is/financial-aid-web/osk/graphql/sharedGql'

import { AlertMessage, Box, Input, Text } from '@island.is/island-ui/core'

import { Routes } from '@island.is/financial-aid/shared/lib'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const FileUpload = () => {
  const { form, updateForm } = useContext(FormContext)
  const { myApplication, user } = useContext(AppContext)

  const fileComment = useMemo(() => {
    if (myApplication?.applicationEvents) {
      return getCommentFromLatestEvent(
        myApplication?.applicationEvents,
        ApplicationEventType.DATANEEDED,
      )
    }
  }, [myApplication])

  const router = useRouter()
  const { uploadStateFiles } = useFileUpload(form.otherFiles)

  const [error, setError] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [updateApplicationMutation] = useMutation<{ application: Application }>(
    ApplicationMutation,
  )

  const [createApplicationEventMutation] = useMutation(ApplicationEventMutation)

  useEffect(() => {
    if (error) {
      setError(false)
    }
  }, [form?.otherFiles])

  const sendFiles = async () => {
    setIsLoading(true)

    try {
      await uploadStateFiles(
        router.query.id as string,
        user?.spouse?.hasPartnerApplied ? FileType.SPOUSEFILES : FileType.OTHER,
      ).then(async () => {
        await updateApplicationMutation({
          variables: {
            input: {
              id: router.query.id,
              state: ApplicationState.INPROGRESS,
              event: ApplicationEventType.FILEUPLOAD,
            },
          },
        })

        updateForm({
          ...form,
          status: ApplicationState.INPROGRESS,
        })

        router.push(
          `${Routes.statusFileUploadSuccess(router.query.id as string)}`,
        )
      })
    } catch (e) {
      router.push(
        `${Routes.statusFileUploadFailure(router.query.id as string)}`,
      )
    }

    setIsLoading(false)
  }

  const sendUserComment = async () => {
    try {
      await createApplicationEventMutation({
        variables: {
          input: {
            applicationId: router.query.id,
            comment: form.fileUploadComment,
            eventType: ApplicationEventType.FILEUPLOAD,
          },
        },
      })
    } catch (e) {
      router.push(
        `${Routes.statusFileUploadFailure(router.query.id as string)}`,
      )
    }
  }

  return (
    <>
      <ContentContainer>
        <Text as="h1" variant="h2" marginBottom={[1, 1, 2]}>
          Senda inn gögn
        </Text>

        <Text marginBottom={[3, 3, 4]}>
          Hér getur þú sent okkur gögn ef vantar svo hægt sé að vinna þína
          umsókn.
        </Text>

        {fileComment?.comment && (
          <Box marginBottom={[3, 3, 5]}>
            <AlertMessage
              type="warning"
              title="Athugasemd frá vinnsluaðila"
              message={fileComment.comment}
            />
          </Box>
        )}
        <Files
          header="Senda inn gögn"
          fileKey="otherFiles"
          uploadFiles={form.otherFiles}
          hasError={error && form?.otherFiles.length <= 0}
        />

        <Text as="h2" variant="h3" marginBottom={[2, 2, 3]}>
          Viltu láta fylgja með athugasemd?
        </Text>

        <Box marginBottom={[4, 4, 10]}>
          <Input
            label="Athugasemd"
            name="fileUploadComment"
            value={form.fileUploadComment}
            placeholder="Skrifaðu hér"
            rows={7}
            textarea
            backgroundColor="blue"
            onChange={(event) => {
              updateForm({
                ...form,
                fileUploadComment: event.currentTarget.value,
              })
            }}
          />
        </Box>
      </ContentContainer>

      <Footer
        previousUrl={Routes.statusPage(router.query.id as string)}
        nextButtonText={'Senda gögn'}
        nextIsLoading={isLoading}
        onNextButtonClick={() => {
          if (form?.otherFiles.length <= 0 || router.query.id === undefined) {
            return setError(true)
          }
          Promise.all([sendFiles(), sendUserComment()])
        }}
      />
    </>
  )
}

export default FileUpload
