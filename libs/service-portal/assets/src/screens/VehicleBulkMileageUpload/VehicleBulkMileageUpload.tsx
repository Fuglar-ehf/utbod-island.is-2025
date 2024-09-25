import {
  InputFileUpload,
  Box,
  Text,
  fileToObject,
  AlertMessage,
  Stack,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useEffect, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import {
  IntroHeader,
  LinkButton,
  SAMGONGUSTOFA_SLUG,
  m,
} from '@island.is/service-portal/core'
import {
  MileageRecord,
  parseCsvToMileageRecord,
} from '../../utils/parseCsvToMileage'
import { Problem } from '@island.is/react-spa/shared'
import { AssetsPaths } from '../../lib/paths'
import { useVehicleBulkMileagePostMutation } from './VehicleBulkMileageUpload.generated'
import VehicleBulkMileageFileDownloader from '../VehicleBulkMileage/VehicleBulkMileageFileDownloader'
import { vehicleMessage } from '../../lib/messages'

const VehicleBulkMileageUpload = () => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  const [vehicleBulkMileagePostMutation, { data, loading, error }] =
    useVehicleBulkMileagePostMutation()

  const [uploadedFile, setUploadedFile] = useState<File | null>()
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null,
  )

  const [requestGuid, setRequestGuid] = useState<string | null>()

  useEffect(() => {
    const id = data?.vehicleBulkMileagePost?.requestId
    if (id && id !== requestGuid) {
      setRequestGuid(id)
    }
  }, [data?.vehicleBulkMileagePost?.requestId])

  const postMileage = async (file: File) => {
    const records = await parseCsvToMileageRecord(file)
    console.log(records)
    if (!records.length) {
      setUploadErrorMessage('Engin gild kílómetrastaða fannst í skjali')
      return
    }
    vehicleBulkMileagePostMutation({
      variables: {
        input: {
          mileageData: records.map((r) => ({
            mileageNumber: r.mileage,
            vehicleId: r.vehicleId,
          })),
          originCode: 'ISLAND.IS',
        },
      },
    })
  }

  const handleOnInputFileUploadError = (files: FileRejection[]) =>
    setUploadErrorMessage(files[0].errors[0].message)

  const handleOnInputFileUploadRemove = () => setUploadedFile(null)

  const handleOnInputFileUploadChange = (files: File[]) => {
    const file = fileToObject(files[0])
    if (file.status === 'done' && file.originalFileObj instanceof File) {
      postMileage(file.originalFileObj)
    }
  }
  return (
    <Box>
      <IntroHeader
        title={m.vehiclesBulkMileageUpload}
        intro={m.vehiclesBulkMileageUploadDescription}
        serviceProviderSlug={SAMGONGUSTOFA_SLUG}
        serviceProviderTooltip={formatMessage(m.vehiclesTooltip)}
      >
        <Box marginTop={2}>
          <VehicleBulkMileageFileDownloader />
        </Box>
      </IntroHeader>

      <Stack space={2}>
        {error && <Problem error={error} noBorder={false} />}
        {data?.vehicleBulkMileagePost?.errorMessage && !loading && !error && (
          <AlertMessage
            type="warning"
            title={formatMessage(vehicleMessage.uploadFailed)}
            message={data.vehicleBulkMileagePost.errorMessage}
          />
        )}
        {data?.vehicleBulkMileagePost?.requestId &&
          !data?.vehicleBulkMileagePost?.errorMessage &&
          !loading &&
          !error && (
            <AlertMessage
              type="success"
              title={formatMessage(vehicleMessage.uploadSuccess)}
              message={
                <Box>
                  <Text variant="small">
                    {formatMessage(vehicleMessage.bulkMileageUploadStatus)}
                  </Text>
                  <Box marginTop="smallGutter">
                    <LinkButton
                      to={AssetsPaths.AssetsVehiclesBulkMileageJobDetail.replace(
                        ':id',
                        data?.vehicleBulkMileagePost?.requestId ?? '',
                      )}
                      text={formatMessage(vehicleMessage.openJob)}
                      variant="text"
                      icon="arrowForward"
                    />
                  </Box>
                </Box>
              }
            />
          )}
        <InputFileUpload
          fileList={uploadedFile ? [uploadedFile] : []}
          showFileSize
          header={formatMessage(vehicleMessage.dragFileToUpload)}
          description={formatMessage(vehicleMessage.fileUploadAcceptedTypes)}
          disabled={!!data?.vehicleBulkMileagePost?.errorMessage}
          buttonLabel={formatMessage(vehicleMessage.selectFileToUpload)}
          accept={['.csv', '.xls']}
          multiple={false}
          onRemove={handleOnInputFileUploadRemove}
          onChange={handleOnInputFileUploadChange}
          onUploadRejection={handleOnInputFileUploadError}
          errorMessage={uploadErrorMessage ?? undefined}
        />
      </Stack>
    </Box>
  )
}

export default VehicleBulkMileageUpload
