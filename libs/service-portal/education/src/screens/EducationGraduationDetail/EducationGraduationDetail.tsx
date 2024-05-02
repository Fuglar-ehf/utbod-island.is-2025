import { defineMessage } from 'react-intl'

import { UniversityCareersUniversityId } from '@island.is/api/schema'
import {
  AlertMessage,
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { formatNationalId } from '@island.is/portals/core'
import { Problem } from '@island.is/react-spa/shared'
import {
  IntroHeader,
  UserInfoLine,
  formSubmit,
  formatDate,
  m,
} from '@island.is/service-portal/core'
import { useParams } from 'react-router-dom'
import {
  mapSlugToContentfulSlug,
  mapSlugToUniversity,
} from '../../utils/mapUniversitySlug'
import { useStudentTrackQuery } from './EducationGraduationDetail.generated'
type UseParams = {
  id: string
  uni: string
}

export const EducationGraduationDetail = () => {
  useNamespaces('sp.education-graduation')
  const { id, uni } = useParams() as UseParams
  const { formatMessage, lang } = useLocale()

  const { data, loading, error } = useStudentTrackQuery({
    variables: {
      input: {
        trackNumber: parseInt(id),
        locale: lang,
        universityId:
          mapSlugToUniversity(uni) ??
          UniversityCareersUniversityId.UNIVERSITY_OF_ICELAND,
      },
    },
  })

  const studentInfo = data?.universityCareersStudentTrack?.transcript
  const text = data?.universityCareersStudentTrack?.metadata
  const files = data?.universityCareersStudentTrack?.files
  const downloadServiceURL =
    data?.universityCareersStudentTrack?.downloadServiceURL

  const graduationDate = studentInfo
    ? formatDate(studentInfo?.graduationDate)
    : undefined

  const filesAvailable = (files?.length ?? 0) > 0

  return (
    <Box marginBottom={[6, 6, 10]}>
      <IntroHeader
        title={m.educationGraduation}
        intro={text?.description || ''}
        serviceProviderSlug={mapSlugToContentfulSlug(uni) ?? 'haskoli-islands'}
      />
      <GridRow marginBottom={[1, 1, 1, 3]}>
        <GridColumn span="12/12">
          <Box
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="flexStart"
            printHidden
          >
            {files &&
              filesAvailable &&
              downloadServiceURL &&
              files.map((item, index) => {
                const shortOrgId =
                  data.universityCareersStudentTrack?.transcript?.institution
                    ?.shortId
                return (
                  <Box
                    key={`education-graduation-button-${index}`}
                    paddingRight={2}
                    marginBottom={[1, 1, 1, 0]}
                  >
                    <Button
                      variant="utility"
                      size="small"
                      icon="document"
                      iconType="outline"
                      onClick={() =>
                        formSubmit(
                          `${downloadServiceURL}${item.locale}/${
                            shortOrgId ?? uni
                          }/${studentInfo?.trackNumber}`,
                        )
                      }
                    >
                      {item.displayName}
                    </Button>
                  </Box>
                )
              })}
            {!filesAvailable && !loading && (
              <Box width="full">
                <AlertMessage
                  type="warning"
                  title={formatMessage(m.noTranscriptForDownload)}
                  message={text?.unconfirmedData}
                />
              </Box>
            )}
          </Box>
        </GridColumn>
      </GridRow>
      {error && !loading && <Problem error={error} noBorder={false} />}

      {!loading && !error && !studentInfo && (
        <Box marginTop={8}>
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noData)}
            message={formatMessage(m.noDataFoundDetail)}
            imgSrc="./assets/images/sofa.svg"
          />
        </Box>
      )}
      {!error && (loading || studentInfo) && (
        <>
          <Stack space={1}>
            <UserInfoLine
              title={formatMessage(m.overview)}
              label={m.fullName}
              loading={loading}
              content={studentInfo?.name}
              translate="no"
            />
            <Divider />
            <UserInfoLine
              label={m.date}
              loading={loading}
              content={graduationDate}
            />
            <Divider />
            <UserInfoLine
              label={defineMessage({
                id: 'sp.education-graduation:education-grad-detail-degree',
                defaultMessage: 'Gráða',
              })}
              loading={loading}
              content={formatNationalId(studentInfo?.degree ?? '')}
            />
            <Divider />
            <UserInfoLine
              label={defineMessage({
                id: 'sp.education-graduation:education-grad-detail-program',
                defaultMessage: 'Námsleið',
              })}
              loading={loading}
              content={formatNationalId(studentInfo?.studyProgram ?? '')}
            />
            <Divider />
            <UserInfoLine
              label={defineMessage({
                id: 'sp.education-graduation:education-grad-detail-faculty',
                defaultMessage: 'Deild',
              })}
              loading={loading}
              content={formatNationalId(studentInfo?.faculty ?? '')}
            />
            <Divider />
            <UserInfoLine
              label={defineMessage({
                id: 'sp.education-graduation:education-grad-detail-school',
                defaultMessage: 'Svið',
              })}
              loading={loading}
              content={formatNationalId(studentInfo?.school ?? '')}
            />
            <Divider />
            <UserInfoLine
              label={defineMessage({
                id: 'sp.education-graduation:education-grad-detail-instutution',
                defaultMessage: 'Stofnun',
              })}
              loading={loading}
              content={formatNationalId(
                studentInfo?.institution?.displayName ?? '',
              )}
            />
            <Divider />
          </Stack>
          <Box marginTop={5}>
            <Text variant="small">{text?.footer}</Text>
          </Box>
        </>
      )}
    </Box>
  )
}

export default EducationGraduationDetail
