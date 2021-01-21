import { useMutation, useQuery } from '@apollo/client'
import { Accordion, Box, Button, Tag, Text } from '@island.is/island-ui/core'
import {
  TIME_FORMAT,
  formatDate,
  getShortRestrictionByValue,
} from '@island.is/judicial-system/formatters'
import {
  Case,
  CaseCustodyRestrictions,
  CaseDecision,
  UserRole,
} from '@island.is/judicial-system/types'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CaseQuery } from '../../../graphql'
import CourtRecordAccordionItem from '../../../shared-components/CourtRecordAccordionItem/CourtRecordAccordionItem'
import { FormFooter } from '../../../shared-components/FormFooter'
import InfoCard from '../../../shared-components/InfoCard/InfoCard'
import { PageLayout } from '../../../shared-components/PageLayout/PageLayout'
import PoliceRequestAccordionItem from '../../../shared-components/PoliceRequestAccordionItem/PoliceRequestAccordionItem'
import RulingAccordionItem from '../../../shared-components/RulingAccordionItem/RulingAccordionItem'
import { getRestrictionTagVariant } from '../../../utils/stepHelper'
import { useHistory } from 'react-router-dom'
import * as Constants from '../../../utils/constants'
import { UserContext } from '../../../shared-components/UserProvider/UserProvider'
import { ExtendCaseMutation } from '@island.is/judicial-system-web/src/utils/mutations'
import PdfButton from '../../../shared-components/PdfButton/PdfButton'

interface CaseData {
  case?: Case
}

export const SignedVerdictOverview: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()

  const history = useHistory()
  const { id } = useParams<{ id: string }>()
  const { user } = useContext(UserContext)

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const [extendCaseMutation, { loading: isCreatingExtension }] = useMutation(
    ExtendCaseMutation,
  )

  useEffect(() => {
    document.title = 'Yfirlit staðfestrar kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  const handleNextButtonClick = async () => {
    if (workingCase?.childCase) {
      history.push(
        `${Constants.SINGLE_REQUEST_BASE_ROUTE}/${workingCase.childCase.id}`,
      )
    } else {
      const { data } = await extendCaseMutation({
        variables: {
          input: {
            id: workingCase?.id,
          },
        },
      })

      if (data) {
        history.push(
          `${Constants.SINGLE_REQUEST_BASE_ROUTE}/${data.extendCase.id}`,
        )
      }
    }
  }

  /**
   * We assume that the signed verdict page is only opened for
   * cases in state REJECTED or ACCEPTED.
   *
   * Based on the judge's decision the signed verdict page can
   * be in one of five states:
   *
   * 1. Rejected
   *    - state === REJECTED and decision === REJECTING
   * 2. Alternative travel ban accepted and the travel ban end date is in the past
   *    - state === ACCEPTED and decision === ACCEPTING_ALTERNATIVE_TRAVEL_BAN and custodyEndDate < today
   * 3. Accepted and the custody end date is in the past
   *    - state === ACCEPTED and decision === ACCEPTING and custodyEndDate < today
   * 5. Alternative travel ban accepted and the travel ban end date is not in the past
   *    - state === ACCEPTED and decision === ACCEPTING_ALTERNATIVE_TRAVEL_BAN and custodyEndDate > today
   * 3. Accepted and the custody end date is not in the past
   *    - state === ACCEPTED and decision === ACCEPTING and custodyEndDate > today
   */
  return (
    <PageLayout
      activeSection={2}
      isLoading={loading}
      notFound={data?.case === undefined}
      isCustodyEndDateInThePast={workingCase?.isCustodyEndDateInThePast}
      decision={data?.case?.decision}
    >
      {workingCase ? (
        <>
          <Box marginBottom={5}>
            <Box marginBottom={3}>
              <Button
                variant="text"
                preTextIcon="arrowBack"
                onClick={() => history.push(Constants.DETENTION_REQUESTS_ROUTE)}
              >
                Til baka
              </Button>
            </Box>
            <Box display="flex" justifyContent="spaceBetween">
              <Box>
                <Box marginBottom={1}>
                  <Text as="h1" variant="h1">
                    {/**
                     * If the case is not rejected it must be accepted because
                     * this screen is only rendered if the case is either accepted
                     * or rejected. Here we are first handling the case where a case
                     * is rejected, then the case where a case is accepted and the
                     * custody end date is in the past and then we assume that
                     * the case is accepted and the custody end date has not come yet.
                     * For accepted cases, we first handle the case where the judge
                     * decided only accept an alternative travel ban and finally we
                     * assume that the actual custody was accepted.
                     */}
                    {
                      workingCase.decision === CaseDecision.REJECTING
                        ? 'Kröfu hafnað'
                        : workingCase.isCustodyEndDateInThePast
                        ? workingCase.decision ===
                          CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                          ? 'Farbanni lokið'
                          : 'Gæsluvarðhaldi lokið' // ACCEPTING
                        : workingCase.decision ===
                          CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                        ? 'Farbann virkt'
                        : 'Gæsluvarðhald virkt' // ACCEPTING
                    }
                  </Text>
                </Box>
                <Text as="h5" variant="h5">
                  {workingCase.decision === CaseDecision.REJECTING
                    ? `Úrskurðað ${formatDate(
                        workingCase.courtEndTime,
                        'PPP',
                      )} kl. ${formatDate(
                        workingCase.courtEndTime,
                        TIME_FORMAT,
                      )}`
                    : workingCase.isCustodyEndDateInThePast
                    ? `${
                        workingCase.decision ===
                        CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                          ? 'Farbann'
                          : 'Gæsla' // ACCEPTING
                      } rann út ${formatDate(
                        workingCase.custodyEndDate,
                        'PPP',
                      )} kl. ${formatDate(
                        workingCase.custodyEndDate,
                        TIME_FORMAT,
                      )}`
                    : `${
                        workingCase.decision ===
                        CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                          ? 'Farbann'
                          : 'Gæsla' // ACCEPTING
                      } til ${formatDate(
                        workingCase.custodyEndDate,
                        'PPP',
                      )} kl. ${formatDate(
                        workingCase.custodyEndDate,
                        TIME_FORMAT,
                      )}`}
                </Text>
              </Box>
              <Box display="flex" flexDirection="column">
                {
                  // Custody restrictions
                  workingCase.decision === CaseDecision.ACCEPTING &&
                    workingCase.custodyRestrictions
                      ?.filter((restriction) =>
                        [
                          CaseCustodyRestrictions.ISOLATION,
                          CaseCustodyRestrictions.VISITAION,
                          CaseCustodyRestrictions.COMMUNICATION,
                          CaseCustodyRestrictions.MEDIA,
                        ].includes(restriction),
                      )
                      ?.map((custodyRestriction, index) => (
                        <Box marginTop={index > 0 ? 1 : 0} key={index}>
                          <Tag
                            variant={getRestrictionTagVariant(
                              custodyRestriction,
                            )}
                            outlined
                            disabled
                          >
                            {getShortRestrictionByValue(custodyRestriction)}
                          </Tag>
                        </Box>
                      ))
                }
                {
                  // Alternative travel ban restrictions
                  workingCase.decision ===
                    CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN &&
                    workingCase.custodyRestrictions
                      ?.filter((restriction) =>
                        [
                          CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
                          CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
                        ].includes(restriction),
                      )
                      ?.map((custodyRestriction, index) => (
                        <Box marginTop={index > 0 ? 1 : 0} key={index}>
                          <Tag
                            variant={getRestrictionTagVariant(
                              custodyRestriction,
                            )}
                            outlined
                            disabled
                          >
                            {getShortRestrictionByValue(custodyRestriction)}
                          </Tag>
                        </Box>
                      ))
                }
              </Box>
            </Box>
          </Box>
          <Box marginBottom={5}>
            <InfoCard
              data={[
                {
                  title: 'LÖKE málsnúmer',
                  value: workingCase.policeCaseNumber,
                },
                {
                  title: 'Málsnúmer héraðsdóms',
                  value: workingCase.courtCaseNumber,
                },
                { title: 'Embætti', value: 'Lögreglan á Höfuðborgarsvæðinu' },
                { title: 'Dómstóll', value: workingCase.court },
                { title: 'Ákærandi', value: workingCase.prosecutor?.name },
                { title: 'Dómari', value: workingCase.judge?.name },
              ]}
              accusedName={workingCase.accusedName}
              accusedNationalId={workingCase.accusedNationalId}
              accusedAddress={workingCase.accusedAddress}
              defender={{
                name: workingCase.defenderName || '',
                email: workingCase.defenderEmail,
              }}
            />
          </Box>
          <Box marginBottom={5}>
            <Accordion>
              <PoliceRequestAccordionItem workingCase={workingCase} />
              <CourtRecordAccordionItem workingCase={workingCase} />
              <RulingAccordionItem workingCase={workingCase} />
            </Accordion>
          </Box>
          <Box marginBottom={15}>
            <PdfButton caseId={workingCase.id} />
          </Box>
          <FormFooter
            hideNextButton={
              workingCase.decision === CaseDecision.REJECTING ||
              user?.role !== UserRole.PROSECUTOR
            }
            nextButtonText="Framlengja gæslu"
            onNextButtonClick={() => handleNextButtonClick()}
            nextIsLoading={isCreatingExtension}
          />
        </>
      ) : null}
    </PageLayout>
  )
}

export default SignedVerdictOverview
