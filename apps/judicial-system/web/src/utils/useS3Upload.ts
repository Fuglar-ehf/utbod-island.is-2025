import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import { UploadFile } from '@island.is/island-ui/core'
import {
  CreateFileMutation,
  CreatePresignedPostMutation,
  DeleteFileMutation,
} from '@island.is/judicial-system-web/graphql'
import { Case, PresignedPost } from '@island.is/judicial-system/types'

export const useS3Upload = (workingCase?: Case) => {
  const [files, _setFiles] = useState<UploadFile[]>([])
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>()
  const filesRef = useRef<UploadFile[]>(files)

  useEffect(() => {
    const uploadCaseFiles = workingCase?.files?.map((caseFile) => {
      const uploadCaseFile = caseFile as UploadFile
      uploadCaseFile.status = 'done'
      return uploadCaseFile
    })

    setFiles(uploadCaseFiles || [])
  }, [workingCase])

  const [createPresignedPostMutation] = useMutation(CreatePresignedPostMutation)
  const [createFileMutation] = useMutation(CreateFileMutation)
  const [deleteFileMutation] = useMutation(DeleteFileMutation)

  // File upload spesific functions
  const createPresignedPost = async (
    filename: string,
  ): Promise<PresignedPost> => {
    const { data: presignedPostData } = await createPresignedPostMutation({
      variables: { input: { caseId: workingCase?.id, fileName: filename } },
    })

    return presignedPostData?.createPresignedPost
  }

  const createFormData = (
    presignedPost: PresignedPost,
    file: UploadFile,
  ): FormData => {
    const formData = new FormData()
    Object.keys(presignedPost.fields).forEach((key) =>
      formData.append(key, presignedPost.fields[key]),
    )
    formData.append('file', file as File)

    return formData
  }

  const uploadToS3 = (file: UploadFile, presignedPost: PresignedPost) => {
    const request = new XMLHttpRequest()
    request.withCredentials = true
    request.responseType = 'json'

    request.upload.addEventListener('progress', (evt) => {
      if (evt.lengthComputable) {
        file.percent = (evt.loaded / evt.total) * 100
        file.status = 'uploading'

        updateFile(file)
      }
    })

    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) {
        addFileToCase(file)
      } else {
        file.status = 'error'
        updateFile(file)
        setUploadErrorMessage(
          'Ekki tókst að hlaða upp öllum skránum. Vinsamlega reynið aftur',
        )
      }
    })

    request.open('POST', presignedPost.url)
    request.send(createFormData(presignedPost, file))
  }

  // Utils
  /**
   * Sets ref and state value
   * @param files Files to set to state.
   */
  const setFiles = (files: UploadFile[]) => {
    filesRef.current = files
    _setFiles(files)
  }

  /**
   * Updates a file if it's in files and adds it to the end of files if not.
   * @param file The file to update.
   */
  const updateFile = (file: UploadFile) => {
    /**
     * Use the filesRef value instead of the files state value because
     *
     * 1. The process to update state is asynchronous therfore we can't trust
     * that we always have the correct state in this function.
     * 2. We are updating state in the event handlers in the uploadToS3 function
     * and the listener belongs to the initial render and is not updated on
     * subsequent rerenders.
     * (source: https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559)
     */
    const newFiles = [...filesRef.current]

    const updatedFiles = newFiles.map((newFile) => {
      return newFile.id === file.id ? file : newFile
    })

    setFiles(updatedFiles)
  }

  const removeFileFromState = (file: UploadFile) => {
    const newFiles = [...files]

    if (newFiles.includes(file)) {
      setFiles(newFiles.filter((fileInFiles) => fileInFiles !== file))
    }
  }

  /**
   * Insert file in database and update state.
   * @param file The file to add to case.
   */
  const addFileToCase = async (file: UploadFile) => {
    if (workingCase && file.size && file.key) {
      await createFileMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            key: file.key,
            size: file.size,
          },
        },
      })
        .then((res) => {
          file.id = res.data.createFile.id
          file.status = 'done'
          updateFile(file)
        })
        .catch((reason) => {
          // TODO: Log to sentry
          setUploadErrorMessage(
            'Upp kom óvænt kerfisvilla. Vinsamlegast reynið aftur.',
          )
          console.log(reason)
        })
    }
  }

  // Event handlers
  const onChange = (newFiles: File[], isRetry?: boolean) => {
    setUploadErrorMessage(undefined)
    const newUploadFiles = newFiles as UploadFile[]

    if (!isRetry) {
      setFiles([...newUploadFiles, ...files])
    }

    newUploadFiles.forEach(async (file) => {
      const presignedPost = await createPresignedPost(file.name).catch(() =>
        setUploadErrorMessage(
          'Upp kom óvænt kerfisvilla. Vinsamlegast reynið aftur.',
        ),
      )

      if (!presignedPost) {
        return
      }

      file.key = presignedPost.fields.key
      updateFile(file)

      uploadToS3(file, presignedPost)
    })
  }

  const onRemove = (file: UploadFile) => {
    setUploadErrorMessage(undefined)

    if (workingCase) {
      deleteFileMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            id: file.id,
          },
        },
      })
        .then((res) => {
          if (!res.errors) {
            removeFileFromState(file)
          } else {
            // TODO: handle failure
            console.log(res.errors)
          }
        })
        .catch((res) => {
          // TODO: Log to Sentry and display an error message.
          console.log(res.graphQLErrors)
          setUploadErrorMessage(
            'Upp kom óvænt kerfisvilla. Vinsamlegast reynið aftur.',
          )
        })
    }
  }

  const onRetry = (file: UploadFile) => {
    setUploadErrorMessage(undefined)
    onChange([file as File], true)
  }

  return { files, uploadErrorMessage, onChange, onRemove, onRetry }
}
