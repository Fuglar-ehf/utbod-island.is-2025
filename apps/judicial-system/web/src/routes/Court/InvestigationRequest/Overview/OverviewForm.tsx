import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'

import { Accordion, Box, Button, Text } from '@island.is/island-ui/core'
import {
  FormContentContainer,
  FormFooter,
  InfoCard,
  PdfButton,
} from '@island.is/judicial-system-web/src/components'
import {
  capitalize,
  caseTypes,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { core, requestCourtDate } from '@island.is/judicial-system-web/messages'
import CaseFilesAccordionItem from '@island.is/judicial-system-web/src/components/AccordionItems/CaseFilesAccordionItem/CaseFilesAccordionItem'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system/consts'

import DraftConclusionModal from '../../SharedComponents/DraftConclusionModal/DraftConclusionModal'
import * as styles from './Overview.css'
import {
  UploadState,
  useCourtUpload,
} from '@island.is/judicial-system-web/src/utils/hooks/useCourtUpload'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  isLoading: boolean
  isCaseUpToDate: boolean
}

const OverviewForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading, isCaseUpToDate } = props
  const [isDraftingConclusion, setIsDraftingConclusion] = useState<boolean>()

  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const { uploadState } = useCourtUpload(workingCase, setWorkingCase)

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Yfirlit kröfu um rannsóknarheimild
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <InfoCard
            data={[
              {
                title: formatMessage(core.policeCaseNumber),
                value: workingCase.policeCaseNumber,
              },
              {
                title: formatMessage(core.prosecutor),
                value: `${
                  workingCase.creatingProsecutor?.institution?.name ??
                  'Ekki skráð'
                }`,
              },
              {
                title: formatMessage(requestCourtDate.heading),
                value: `${capitalize(
                  formatDate(workingCase.requestedCourtDate, 'PPPP', true) ??
                    '',
                )} eftir kl. ${formatDate(
                  workingCase.requestedCourtDate,
                  Constants.TIME_FORMAT,
                )}`,
              },
              {
                title: formatMessage(core.prosecutorPerson),
                value: workingCase.prosecutor?.name,
              },
              {
                title: formatMessage(core.caseType),
                value: capitalize(caseTypes[workingCase.type]),
              },
            ]}
            defendants={workingCase.defendants ?? []}
            defender={{
              name: workingCase.defenderName ?? '',
              email: workingCase.defenderEmail,
              phoneNumber: workingCase.defenderPhoneNumber,
              defenderIsSpokesperson: workingCase.defenderIsSpokesperson,
            }}
          />
        </Box>
        <>
          {workingCase.description && (
            <Box marginBottom={5}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Efni kröfu
                </Text>
              </Box>
              <Text>{workingCase.description}</Text>
            </Box>
          )}
          <Box marginBottom={5} data-testid="demands">
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Dómkröfur
              </Text>
            </Box>
            <Text>{workingCase.demands}</Text>
          </Box>
          <Box className={styles.infoSection}>
            <Box marginBottom={5}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Lagaákvæði sem brot varða við
                </Text>
              </Box>
              <Text>{workingCase.lawsBroken}</Text>
            </Box>
            <Box marginBottom={5}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Lagaákvæði sem krafan er byggð á
                </Text>
              </Box>
              <Text>{workingCase.legalBasis}</Text>
            </Box>
          </Box>
          {(workingCase.caseFacts || workingCase.legalArguments) && (
            <div className={styles.infoSection}>
              <Box marginBottom={1}>
                <Text variant="h3" as="h2">
                  Greinargerð um málsatvik og lagarök
                </Text>
              </Box>
              {workingCase.caseFacts && (
                <Box marginBottom={2}>
                  <Box marginBottom={2}>
                    <Text variant="eyebrow" color="blue400">
                      Málsatvik
                    </Text>
                  </Box>
                  <Text whiteSpace="breakSpaces">{workingCase.caseFacts}</Text>
                </Box>
              )}
              {workingCase.legalArguments && (
                <Box marginBottom={2}>
                  <Box marginBottom={2}>
                    <Text variant="eyebrow" color="blue400">
                      Lagarök
                    </Text>
                  </Box>
                  <Text whiteSpace="breakSpaces">
                    {workingCase.legalArguments}
                  </Text>
                </Box>
              )}
            </div>
          )}
          {(workingCase.comments || workingCase.caseFilesComments) && (
            <div className={styles.infoSection}>
              <Box marginBottom={2}>
                <Text variant="h3" as="h2">
                  Athugasemdir
                </Text>
              </Box>
              {workingCase.comments && (
                <Box marginBottom={workingCase.caseFilesComments ? 3 : 0}>
                  <Box marginBottom={1}>
                    <Text variant="h4" as="h3" color="blue400">
                      Athugasemdir vegna málsmeðferðar
                    </Text>
                  </Box>
                  <Text whiteSpace="breakSpaces">{workingCase.comments}</Text>
                </Box>
              )}
              {workingCase.caseFilesComments && (
                <>
                  <Box marginBottom={1}>
                    <Text variant="h4" as="h3" color="blue400">
                      Athugasemdir vegna rannsóknargagna
                    </Text>
                  </Box>
                  <Text whiteSpace="breakSpaces">
                    {workingCase.caseFilesComments}
                  </Text>
                </>
              )}
            </div>
          )}
          {user && (
            <Box marginBottom={5}>
              <Accordion>
                <CaseFilesAccordionItem
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                  user={user}
                />
              </Accordion>
            </Box>
          )}
          <Box marginBottom={10}>
            <Box marginBottom={3}>
              <PdfButton
                caseId={workingCase.id}
                title={formatMessage(core.pdfButtonRequest)}
                pdfType="request"
              />
            </Box>
            <Button
              variant="ghost"
              icon="pencil"
              size="small"
              onClick={() => setIsDraftingConclusion(true)}
            >
              Skrifa drög að niðurstöðu
            </Button>
          </Box>
          <DraftConclusionModal
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            isCaseUpToDate={isCaseUpToDate}
            isDraftingConclusion={isDraftingConclusion}
            setIsDraftingConclusion={setIsDraftingConclusion}
          />
        </>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.IC_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoading}
          nextUrl={`${Constants.IC_COURT_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          nextIsDisabled={uploadState === UploadState.UPLOADING}
        />
      </FormContentContainer>
    </>
  )
}

export default OverviewForm
