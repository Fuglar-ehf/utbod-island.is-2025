import React, { FC, useState } from 'react'
import { formatText, getValueViaPath } from '@island.is/application/core'
import {
  AlertMessage,
  Box,
  InputFileUpload,
  Stack,
  UploadFile,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  FieldDescription,
  RadioController,
} from '@island.is/shared/form-fields'
import { YES, NO } from '../../constants'
import { ReviewFieldProps, StatusTypes } from '../../types'
import InfoMessage from '../InfoMessage/InfoMessage'
import TextWithTooltip from '../TextWithTooltip/TextWithTooltip'

import { m } from '../../forms/messages'

const StatusAndChildren: FC<ReviewFieldProps> = ({
  application,
  isEditable,
  field,
}) => {
  const { formatMessage } = useLocale()

  const [status, setStatus] = useState(
    getValueViaPath(application.answers, 'status') as StatusTypes,
  )

  const [children, setChildren] = useState(
    getValueViaPath(application.answers, 'children') as string,
  )

  const [fileList, setFileList] = useState(
    getValueViaPath(application.answers, 'confirmationOfStudies') || [],
  )

  return (
    <Stack space={2}>
      <Stack space={2}>
        <FieldDescription
          description={formatText(
            m.statusDescription,
            application,
            formatMessage,
          )}
        />
        <RadioController
          id={'status'}
          name={'status'}
          disabled={!isEditable}
          largeButtons={true}
          split={'1/2'}
          onSelect={(value) => setStatus(value as StatusTypes)}
          options={[
            {
              label: m.statusEmployed.defaultMessage,
              value: StatusTypes.EMPLOYED,
              tooltip: formatText(
                m.statusEmployedInformation,
                application,
                formatMessage,
              ),
            },
            {
              label: m.statusStudent.defaultMessage,
              value: StatusTypes.STUDENT,
              tooltip: formatText(
                m.statusStudentInformation,
                application,
                formatMessage,
              ),
            },
            {
              label: formatText(m.statusPensioner, application, formatMessage),
              value: StatusTypes.PENSIONER,
              tooltip: formatText(
                m.statusPensionerInformation,
                application,
                formatMessage,
              ),
            },
            {
              label: m.statusOther.defaultMessage,
              value: StatusTypes.OTHER,
              tooltip: formatText(
                m.statusOtherInformation,
                application,
                formatMessage,
              ),
            },
          ]}
        />
      </Stack>
      {status === StatusTypes.STUDENT && (
        <Box paddingBottom={2}>
          <Stack space={2}>
            <TextWithTooltip
              field={field}
              application={application}
              title={formatText(
                m.confirmationOfStudies,
                application,
                formatMessage,
              )}
              description={formatText(
                m.confirmationOfStudiesTooltip,
                application,
                formatMessage,
              )}
            />
            <InputFileUpload
              id="confirmationOfStudies"
              disabled={!isEditable}
              header={formatText(
                m.fileUploadHeader,
                application,
                formatMessage,
              )}
              description={formatText(
                m.fileUploadDescription,
                application,
                formatMessage,
              )}
              buttonLabel={formatText(
                m.fileUploadButton,
                application,
                formatMessage,
              )}
              fileList={fileList as UploadFile[]}
              /* TODO!! implement file upload/removal logic */
              onRemove={(fileToRemove) => console.log(fileToRemove)}
              onChange={(newFiles) =>
                setFileList([...(fileList as UploadFile[]), ...newFiles])
              }
            />
          </Stack>
        </Box>
      )}
      <Stack space={2}>
        <FieldDescription
          description={formatText(
            m.childrenDescription,
            application,
            formatMessage,
          )}
        />
        <RadioController
          id={'children'}
          name={'children'}
          disabled={!isEditable}
          defaultValue={
            getValueViaPath(application.answers, 'children') as string[]
          }
          onSelect={(value) => setChildren(value as string)}
          largeButtons={true}
          split={'1/2'}
          options={[
            {
              label: formatText(m.noOptionLabel, application, formatMessage),
              value: NO,
            },
            {
              label: formatText(m.yesOptionLabel, application, formatMessage),
              value: YES,
            },
          ]}
        />
        {children === YES && (
          <InfoMessage application={application} field={field} />
        )}
      </Stack>
    </Stack>
  )
}

export default StatusAndChildren
