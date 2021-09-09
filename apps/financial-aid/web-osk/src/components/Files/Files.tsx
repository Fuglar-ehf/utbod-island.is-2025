import React, { useEffect, useContext } from 'react'
import { Text, InputFileUpload, UploadFile } from '@island.is/island-ui/core'

import {
  ContentContainer,
  FileUploadContainer,
} from '@island.is/financial-aid-web/osk/src/components'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import { useFileUpload } from '@island.is/financial-aid-web/osksrc/utils/useFileUpload'
import { UploadFileType } from '@island.is/financial-aid/shared'

interface Props {
  header: string
  uploadFiles: UploadFile[]
  fileKey: UploadFileType
}

const Files = ({ header, uploadFiles, fileKey }: Props) => {
  const { form, updateForm } = useContext(FormContext)

  const {
    files,
    uploadErrorMessage,
    onChange,
    onRemove,
    onRetry,
  } = useFileUpload(uploadFiles)

  useEffect(() => {
    const formFiles = files.filter((f) => f.status === 'done')

    updateForm({ ...form, [fileKey]: formFiles })
  }, [files])

  return (
    <FileUploadContainer>
      <InputFileUpload
        fileList={files}
        header={header}
        description="Tekið er við öllum hefðbundnum skráargerðum"
        buttonLabel="Bættu við gögnum"
        showFileSize={true}
        errorMessage={uploadErrorMessage}
        onChange={onChange}
        onRemove={onRemove}
        onRetry={onRetry}
      />
    </FileUploadContainer>
  )
}

export default Files
