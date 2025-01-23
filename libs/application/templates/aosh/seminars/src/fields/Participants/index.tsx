import { Controller, useFormContext } from 'react-hook-form'
import {
  AlertMessage,
  Box,
  Button,
  InputFileUpload,
  UploadFile,
} from '@island.is/island-ui/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import { FC, useCallback, useState } from 'react'
import { FILE_SIZE_LIMIT } from '../../lib/constants'
import { parse } from 'csv-parse'
import { CSVError, FileUploadStatus, Participant } from '../../shared/types'
import { participants as participantMessages } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { DescriptionFormField } from '@island.is/application/ui-fields'
import { validateFields } from '../../utils'
import { useLazyAreIndividualsValid } from '../../hooks/useLazyAreIndividualsValid'
import { getValueViaPath } from '@island.is/application/core'

interface IndexableObject {
  [index: number]: Array<string>
}
const predefinedHeaders: IndexableObject = {
  0: ['nafn', 'name'],
  1: ['kennitala', 'ssn'],
  2: ['netfang', 'email'],
  3: ['sími', 'phone'],
}

const parseDataToParticipantList = (csvInput: string): Participant | null => {
  const values = csvInput.split(';')
  const hasNoEmptyValues =
    !!values[0] && !!values[1] && !!values[2] && !!values[3]
  if (!hasNoEmptyValues) {
    return null
  }
  const nationalIdWithoutHyphen = values[1].replace('-', '')
  return {
    name: values[0],
    nationalId: nationalIdWithoutHyphen,
    email: values[2],
    phoneNumber: values[3],
    disabled: 'false',
  }
}

const checkHeaders = (headers: string): boolean => {
  const values = headers.split(';')
  let validHeaders = true
  values.forEach((value, index) => {
    if (!predefinedHeaders[index].includes(value)) {
      validHeaders = false
    }
  })

  return validHeaders
}

export const Participants: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  error,
  application,
}) => {
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const [fileState, setFileState] = useState<Array<UploadFile>>([])
  const [participantList, setParticipantList] = useState<Array<Participant>>([])
  const [foundNotValid, setFoundNotValid] = useState<boolean>(false)
  const [csvInputError, setCsvInputError] = useState<Array<CSVError>>([])
  const courseID =
    getValueViaPath<string>(application.answers, 'initialQuery', '') ?? ''
  const getAreIndividualsValid = useLazyAreIndividualsValid()
  const getIsCompanyValidCallback = useCallback(
    async (nationalIds: string[]) => {
      const { data } = await getAreIndividualsValid({
        courseID,
        nationalIds,
      })
      return data
    },
    [getAreIndividualsValid],
  )

  const changeFile = (props: Array<UploadFile>) => {
    const reader = new FileReader()
    reader.onload = function (e) {
      if (typeof reader.result !== 'string') {
        setValue('participantCsvError', true)
        throw new TypeError(
          `Expected reader.result to be a string, but got ${
            reader.result === null ? 'null' : typeof reader.result
          }.`,
        )
      }
      const csvData = reader.result
      parse(csvData, async (err, data) => {
        if (err) {
          rejectFile()
          return
        }
        const headers = data.shift()
        const validHeaders = checkHeaders(headers[0])
        if (!validHeaders) {
          rejectFile()
          return
        }
        const errorListFromAnswers: Array<CSVError> = []
        const answerValue: Array<Participant> = data.map(
          (value: Array<string>, index: number) => {
            const participantList = parseDataToParticipantList(value[0])
            if (participantList === null) {
              setValue('participantCsvError', true)
              return []
            } else {
              const errorMessages = validateFields(value[0])
              if (errorMessages.length > 0) {
                errorListFromAnswers.push({
                  itemIndex: index,
                  errorList: errorMessages,
                })
              }
              return participantList
            }
          },
        )
        const response = await getIsCompanyValidCallback(
          answerValue.map((x) => x.nationalId),
        )
        const hasDisabledParticipant = response?.areIndividualsValid?.find(
          (x) => x.mayTakeCourse === false,
        )
        if (hasDisabledParticipant) {
          setValue('participantValidityError', true)
          setFoundNotValid(true)
        }
        if (errorListFromAnswers.length > 0) {
          setCsvInputError(errorListFromAnswers)
        } else {
          setCsvInputError([])
          const fileWithSuccessStatus: UploadFile = props[0]
          Object.assign(fileWithSuccessStatus, {
            status: FileUploadStatus.done,
          })
          const finalAnswerValue = answerValue.map<Participant>((x) => {
            const participantInRes = response?.areIndividualsValid?.find(
              (z) => z.nationalID === x.nationalId,
            )
            return {
              ...x,
              disabled: (!participantInRes?.mayTakeCourse).toString(),
            }
          })
          setValue('participantCsvError', false)
          setFileState([fileWithSuccessStatus])
          setParticipantList(finalAnswerValue)
          setValue('participantList', finalAnswerValue)
        }
      })
    }
    reader.readAsText(props[0] as unknown as Blob)
    return
  }

  const removeFile = () => {
    setFileState([])
  }

  const rejectFile = () => {
    setValue('participantCsvError', true)
    return
  }

  const csvFile = `data:text/csv;charset=utf-8,nafn;kennitala;netfang;sími`

  const onCsvButtonClick = () => {
    const encodeUri = encodeURI(csvFile)
    const a = document.createElement('a')
    a.setAttribute('href', encodeUri)
    a.setAttribute('target', '_blank')
    a.setAttribute('download', 'csv_template.csv')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const removeInvalidParticipants = () => {
    const validParticipants = participantList.filter(
      (x) => x.disabled === 'false',
    )
    setValue('participantList', validParticipants)
    setParticipantList(validParticipants)
    setValue('participantValidityError', false)
    setFoundNotValid(false)
  }

  return (
    <Box>
      {foundNotValid && (
        <Box display="flex" justifyContent="flexEnd" marginTop={2}>
          <Button
            onClick={removeInvalidParticipants}
            variant="ghost"
            size="default"
            icon="trash"
            iconType="outline"
            colorScheme="destructive"
          >
            {formatMessage(
              participantMessages.labels.removeInvalidParticipantsButtonText,
            )}
          </Button>
        </Box>
      )}
      <Box marginTop={2}>
        {DescriptionFormField({
          application: application,
          showFieldName: true,
          field: {
            id: 'title',
            title: participantMessages.labels.csvDescription,
            titleVariant: 'h5',
            type: FieldTypes.DESCRIPTION,
            component: FieldComponents.DESCRIPTION,
            children: undefined,
          },
        })}
      </Box>
      <Box marginTop={1} marginBottom={4}>
        <Button
          onClick={onCsvButtonClick}
          variant="text"
          size="small"
          icon="download"
          iconType="outline"
        >
          {formatMessage(participantMessages.labels.csvButtonText)}
        </Button>
      </Box>

      <Controller
        name="csv-upload-participants"
        render={() => (
          <InputFileUpload
            applicationId={application.id}
            fileList={fileState}
            header={formatMessage(participantMessages.labels.uploadHeader)}
            buttonLabel={formatMessage(participantMessages.labels.uploadButton)}
            onChange={(e) => changeFile(e)}
            onRemove={() => removeFile()}
            onUploadRejection={rejectFile}
            errorMessage={error}
            multiple={false}
            accept={['text/csv']}
            maxSize={FILE_SIZE_LIMIT}
          />
        )}
      />

      {csvInputError.length > 0 &&
        csvInputError.map((csvError: CSVError) => {
          let messageString = `${formatMessage(
            participantMessages.labels.csvErrorLabel,
          )} ${csvError.itemIndex + 1}`
          csvError.errorList.forEach((errorString) => {
            messageString = messageString.concat(
              ' ',
              formatMessage(errorString),
            )
          })
          return <AlertMessage type="error" message={messageString} />
        })}
    </Box>
  )
}
