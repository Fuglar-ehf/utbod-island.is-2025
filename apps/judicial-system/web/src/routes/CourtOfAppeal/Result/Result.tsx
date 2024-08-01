import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { AlertBanner, AlertMessage, Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  CaseFilesAccordionItem,
  Conclusion,
  conclusion,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCard,
  MarkdownWrapper,
  PageHeader,
  PageLayout,
  ReopenModal,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { NameAndEmail } from '@island.is/judicial-system-web/src/components/InfoCard/InfoCard'
import { useAppealAlertBanner } from '@island.is/judicial-system-web/src/utils/hooks'
import { sortByIcelandicAlphabet } from '@island.is/judicial-system-web/src/utils/sortHelper'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'

import CaseFilesOverview from '../components/CaseFilesOverview/CaseFilesOverview'
import CaseOverviewHeader from '../components/CaseOverviewHeader/CaseOverviewHeader'
import { result as strings } from './Result.strings'

type modalTypes = 'reopenCase' | 'none'

const CourtOfAppealResult = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [modalVisible, setModalVisible] = React.useState<modalTypes>('none')

  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const { title, description, isLoadingAppealBanner } =
    useAppealAlertBanner(workingCase)

  return (
    <>
      {!isLoadingAppealBanner && (
        <AlertBanner
          variant="warning"
          title={title}
          description={description}
        />
      )}
      <PageLayout
        workingCase={workingCase}
        isLoading={isLoadingWorkingCase}
        notFound={caseNotFound}
      >
        <PageHeader title={titleForCase(formatMessage, workingCase)} />
        <FormContentContainer>
          <CaseOverviewHeader
            alerts={
              workingCase.requestAppealRulingNotToBePublished
                ? [
                    {
                      message: formatMessage(
                        strings.requestAppealRulingNotToBePublished,
                      ),
                    },
                  ]
                : undefined
            }
          />

          {workingCase.appealRulingModifiedHistory && (
            <Box marginBottom={5}>
              <AlertMessage
                type="info"
                title={formatMessage(strings.rulingModifiedTitle)}
                message={
                  <MarkdownWrapper
                    markdown={workingCase.appealRulingModifiedHistory}
                    textProps={{ variant: 'small' }}
                  />
                }
              />
            </Box>
          )}
          <Box marginBottom={5}>
            <InfoCard
              defendants={
                workingCase.defendants
                  ? {
                      title: capitalize(
                        formatMessage(core.defendant, {
                          suffix:
                            workingCase.defendants.length > 1 ? 'ar' : 'i',
                        }),
                      ),
                      items: workingCase.defendants,
                    }
                  : undefined
              }
              defenders={[
                {
                  name: workingCase.defenderName ?? '',
                  defenderNationalId: workingCase.defenderNationalId,
                  sessionArrangement: workingCase.sessionArrangements,
                  email: workingCase.defenderEmail,
                  phoneNumber: workingCase.defenderPhoneNumber,
                },
              ]}
              data={[
                {
                  title: formatMessage(core.policeCaseNumber),
                  value: workingCase.policeCaseNumbers?.map((n) => (
                    <Text key={n}>{n}</Text>
                  )),
                },
                {
                  title: formatMessage(core.courtCaseNumber),
                  value: workingCase.courtCaseNumber,
                },
                {
                  title: formatMessage(core.prosecutor),
                  value: `${workingCase.prosecutorsOffice?.name}`,
                },
                {
                  title: formatMessage(core.court),
                  value: workingCase.court?.name,
                },
                {
                  title: formatMessage(core.prosecutorPerson),
                  value: NameAndEmail(
                    workingCase.prosecutor?.name,
                    workingCase.prosecutor?.email,
                  ),
                },
                {
                  title: formatMessage(core.judge),
                  value: NameAndEmail(
                    workingCase.judge?.name,
                    workingCase.judge?.email,
                  ),
                },
                ...(workingCase.registrar
                  ? [
                      {
                        title: formatMessage(core.registrar),
                        value: NameAndEmail(
                          workingCase.registrar?.name,
                          workingCase.registrar?.email,
                        ),
                      },
                    ]
                  : []),
              ]}
              courtOfAppealData={[
                {
                  title: formatMessage(core.appealCaseNumberHeading),
                  value: workingCase.appealCaseNumber,
                },
                {
                  title: formatMessage(core.appealAssistantHeading),
                  value: workingCase.appealAssistant?.name,
                },
                {
                  title: formatMessage(core.appealJudgesHeading),
                  value: (
                    <>
                      {sortByIcelandicAlphabet([
                        workingCase.appealJudge1?.name || '',
                        workingCase.appealJudge2?.name || '',
                        workingCase.appealJudge3?.name || '',
                      ]).map((judge, index) => (
                        <Text key={index}>{judge}</Text>
                      ))}
                    </>
                  ),
                },
              ]}
            />
          </Box>
          {user ? (
            <Box marginBottom={3}>
              <CaseFilesAccordionItem
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
                user={user}
              />
            </Box>
          ) : null}
          <Box marginBottom={6}>
            <Conclusion
              title={formatMessage(conclusion.title)}
              conclusionText={workingCase.conclusion}
              judgeName={workingCase.judge?.name}
            />
          </Box>
          <Box marginBottom={6}>
            <Conclusion
              title={formatMessage(conclusion.appealTitle)}
              conclusionText={workingCase.appealConclusion}
            />
          </Box>
          <CaseFilesOverview />
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={constants.COURT_OF_APPEAL_CASES_ROUTE}
            nextButtonText={formatMessage(strings.nextButtonText)}
            onNextButtonClick={() => setModalVisible('reopenCase')}
          />
        </FormContentContainer>
      </PageLayout>
      {modalVisible === 'reopenCase' && (
        <ReopenModal onClose={() => setModalVisible('none')} />
      )}
    </>
  )
}

export default CourtOfAppealResult
