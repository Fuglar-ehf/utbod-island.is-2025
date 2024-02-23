import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  AlertBanner,
  CaseFilesAccordionItem,
  Conclusion,
  conclusion,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCard,
  PageHeader,
  PageLayout,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { NameAndEmail } from '@island.is/judicial-system-web/src/components/InfoCard/InfoCard'
import { useAppealAlertBanner } from '@island.is/judicial-system-web/src/utils/hooks'
import { shouldUseAppealWithdrawnRoutes } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { titleForCase } from '@island.is/judicial-system-web/src/utils/titleForCase/titleForCase'

import CaseFilesOverview from '../components/CaseFilesOverview/CaseFilesOverview'
import CaseOverviewHeader from '../components/CaseOverviewHeader/CaseOverviewHeader'
import { overview as strings } from './Overview.strings'

const CourtOfAppealOverview: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { title, description, isLoadingAppealBanner } =
    useAppealAlertBanner(workingCase)
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { user } = useContext(UserContext)

  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

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
        onNavigationTo={handleNavigationTo}
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
                          workingCase.registrar.email,
                        ),
                      },
                    ]
                  : []),
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
          <CaseFilesOverview />
        </FormContentContainer>
        <FormContentContainer isFooter>
          <FormFooter
            previousUrl={constants.COURT_OF_APPEAL_CASES_ROUTE}
            onNextButtonClick={() =>
              handleNavigationTo(
                shouldUseAppealWithdrawnRoutes(workingCase)
                  ? constants.COURT_OF_APPEAL_CASE_WITHDRAWN_ROUTE
                  : constants.COURT_OF_APPEAL_CASE_ROUTE,
              )
            }
            nextButtonIcon="arrowForward"
          />
        </FormContentContainer>
      </PageLayout>
    </>
  )
}

export default CourtOfAppealOverview
