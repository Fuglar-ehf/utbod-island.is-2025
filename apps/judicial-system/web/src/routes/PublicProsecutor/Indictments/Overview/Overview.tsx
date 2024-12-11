import { useCallback, useContext, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Option, Select, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  BlueBoxWithDate,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  IndictmentCaseFilesList,
  // IndictmentsLawsBrokenAccordionItem, NOTE: Temporarily hidden while list of laws broken is not complete
  InfoCardClosedIndictment,
  Modal,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  // useIndictmentsLawsBroken, NOTE: Temporarily hidden while list of laws broken is not complete
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { useProsecutorSelectionUsersQuery } from '@island.is/judicial-system-web/src/components/ProsecutorSelection/prosecutorSelectionUsers.generated'
import { CaseIndictmentRulingDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './Overview.strings'
type VisibleModal = 'REVIEWER_ASSIGNED'

export const Overview = () => {
  const router = useRouter()
  const { formatMessage: fm } = useIntl()
  const { user } = useContext(UserContext)
  const { updateCase } = useCase()
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const [selectedIndictmentReviewer, setSelectedIndictmentReviewer] =
    useState<Option<string> | null>()
  const [modalVisible, setModalVisible] = useState<VisibleModal>()
  // const lawsBroken = useIndictmentsLawsBroken(workingCase) NOTE: Temporarily hidden while list of laws broken is not complete

  const assignReviewer = async () => {
    if (!selectedIndictmentReviewer) {
      return
    }
    const updatedCase = await updateCase(workingCase.id, {
      indictmentReviewerId: selectedIndictmentReviewer.value,
    })
    if (!updatedCase) {
      return
    }

    setModalVisible('REVIEWER_ASSIGNED')
  }

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )

  const { data, loading } = useProsecutorSelectionUsersQuery({
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const publicProsecutors = useMemo(() => {
    if (!data?.users || !user) {
      return []
    }
    return data.users.reduce(
      (acc: { label: string; value: string }[], prosecutor) => {
        if (prosecutor.institution?.id === user?.institution?.id) {
          acc.push({
            label: prosecutor.name ?? '',
            value: prosecutor.id,
          })
        }
        return acc
      },
      [],
    )
  }, [data?.users, user])

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={true}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={fm(titles.shared.closedCaseOverview, {
          courtCaseNumber: workingCase.courtCaseNumber,
        })}
      />
      <FormContentContainer>
        <PageTitle>{fm(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        {workingCase.defendants?.map((defendant) => (
          <Box component="section" marginBottom={5} key={defendant.id}>
            <BlueBoxWithDate defendant={defendant} icon="calendar" />
          </Box>
        ))}
        <Box component="section" marginBottom={5}>
          <InfoCardClosedIndictment displaySentToPrisonAdminDate={false} />
        </Box>
        {/* 
        NOTE: Temporarily hidden while list of laws broken is not complete in
        indictment cases
        
        {lawsBroken.size > 0 && (
          <Box marginBottom={5}>
            <IndictmentsLawsBrokenAccordionItem workingCase={workingCase} />
          </Box>
        )} */}
        <Box component="section" marginBottom={5}>
          <IndictmentCaseFilesList workingCase={workingCase} />
        </Box>
        <Box marginBottom={5}>
          <SectionHeading
            title={fm(strings.reviewerTitle)}
            description={
              <Text variant="eyebrow">
                {fm(strings.reviewerSubtitle, {
                  isFine:
                    workingCase.indictmentRulingDecision ===
                    CaseIndictmentRulingDecision.FINE,
                  indictmentAppealDeadline: formatDate(
                    workingCase.indictmentAppealDeadline,
                  ),
                  appealDeadlineIsInThePast:
                    workingCase.indictmentVerdictAppealDeadlineExpired,
                })}
              </Text>
            }
          />
          <BlueBox>
            <Select
              name="reviewer"
              label={fm(strings.reviewerLabel)}
              placeholder={fm(strings.reviewerPlaceholder)}
              value={
                selectedIndictmentReviewer
                  ? selectedIndictmentReviewer
                  : workingCase.indictmentReviewer
                  ? {
                      label: workingCase.indictmentReviewer.name || '',
                      value: workingCase.indictmentReviewer.id,
                    }
                  : undefined
              }
              options={publicProsecutors}
              onChange={(value) => {
                setSelectedIndictmentReviewer(value as Option<string>)
              }}
              isDisabled={loading}
              required
            />
          </BlueBox>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={constants.CASES_ROUTE}
          nextIsLoading={isLoadingWorkingCase}
          nextIsDisabled={
            !selectedIndictmentReviewer ||
            selectedIndictmentReviewer.value ===
              workingCase.indictmentReviewer?.id ||
            isLoadingWorkingCase
          }
          onNextButtonClick={assignReviewer}
          nextButtonText={fm(core.continue)}
        />
      </FormContentContainer>
      {modalVisible === 'REVIEWER_ASSIGNED' && (
        <Modal
          title={fm(strings.reviewerAssignedModalTitle)}
          text={fm(strings.reviewerAssignedModalText, {
            caseNumber: workingCase.courtCaseNumber,
            reviewer: selectedIndictmentReviewer?.label,
          })}
          secondaryButtonText={fm(core.back)}
          onSecondaryButtonClick={() => router.push(constants.CASES_ROUTE)}
        />
      )}
    </PageLayout>
  )
}

export default Overview
