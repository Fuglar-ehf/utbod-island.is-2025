import React, { FC } from 'react'

import { Box, ContentBlock, AlertMessage } from '@island.is/island-ui/core'
import {
  Application,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { useQualityPhoto } from './hooks/useQualityPhoto'

interface QualityPhotoData {
  qualityPhoto: string | null
  application: Application
}

const Photo: FC<QualityPhotoData> = ({
  qualityPhoto,
  application,
}: QualityPhotoData) => {
  const { formatMessage } = useLocale()

  if (!qualityPhoto) {
    return null
  }

  const src = qualityPhoto
  return (
    <img
      alt={formatText(m.qualityPhotoAltText, application, formatMessage) || ''}
      src={src}
      id="myimage"
    />
  )
}

const QualityPhoto: FC<FieldBaseProps> = ({ application }) => {
  const { qualityPhoto, loading, error } = useQualityPhoto(application)
  // TODO: skeleton load when image is loading
  const { formatMessage } = useLocale()
  const img = Photo({ qualityPhoto, application })
  return (
    <Box marginBottom={3}>
      {qualityPhoto ? (
        <Box marginTop={4} style={{ width: '191px', height: '242px' }}>
          {img}
        </Box>
      ) : (
        <Box marginTop={2}>
          <ContentBlock>
            <AlertMessage
              type="warning"
              title={formatText(
                m.qualityPhotoWarningTitle,
                application,
                formatMessage,
              )}
              message={formatText(
                m.qualityPhotoWarningDescription,
                application,
                formatMessage,
              )}
            />
          </ContentBlock>
        </Box>
      )}
    </Box>
  )
}

export { QualityPhoto }
