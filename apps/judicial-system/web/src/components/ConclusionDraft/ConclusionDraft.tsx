import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { isRestrictionCase } from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import {
  Decision,
  RulingInput,
} from '@island.is/judicial-system-web/src/components'

import { ruling as m } from '@island.is/judicial-system-web/messages'

import { useCase } from '../../utils/hooks'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
}

const ConclusionDraft: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { formatMessage } = useIntl()
  const { setAndSendCaseToServer } = useCase()

  return (
    <>
      <Box marginBottom={2}>
        <Text>
          Hér er hægt að skrifa drög að niðurstöðu í málinu. Endanlegur
          frágangur niðurstöðu og úrskurðar fer fram í þinghaldi. Athugið að
          drögin vistast sjálfkrafa.
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h3">Úrskurður</Text>
      </Box>
      <Box marginBottom={3}>
        <Decision
          workingCase={workingCase}
          acceptedLabelText={
            isRestrictionCase(workingCase.type)
              ? formatMessage(
                  m.restrictionCases.sections.decision.acceptLabel,
                  {
                    caseType: formatMessage(
                      m.restrictionCases.sections.decision.caseType,
                      {
                        caseType: workingCase.type,
                      },
                    ),
                  },
                )
              : formatMessage(
                  m.investigationCases.sections.decision.acceptLabel,
                )
          }
          rejectedLabelText={
            isRestrictionCase(workingCase.type)
              ? formatMessage(
                  m.restrictionCases.sections.decision.rejectLabel,
                  {
                    caseType: formatMessage(
                      m.restrictionCases.sections.decision.caseType,
                      {
                        caseType: workingCase.type,
                      },
                    ),
                  },
                )
              : formatMessage(
                  m.investigationCases.sections.decision.rejectLabel,
                )
          }
          partiallyAcceptedLabelText={`${
            isRestrictionCase(workingCase.type)
              ? formatMessage(
                  m.restrictionCases.sections.decision.partiallyAcceptLabel,
                  {
                    caseType: formatMessage(
                      m.restrictionCases.sections.decision.caseType,
                      {
                        caseType: workingCase.type,
                      },
                    ),
                  },
                )
              : formatMessage(
                  m.investigationCases.sections.decision.partiallyAcceptLabel,
                )
          }`}
          dismissLabelText={
            isRestrictionCase(workingCase.type)
              ? formatMessage(
                  m.restrictionCases.sections.decision.dismissLabel,
                  {
                    caseType: formatMessage(
                      m.restrictionCases.sections.decision.caseType,
                      {
                        caseType: workingCase.type,
                      },
                    ),
                  },
                )
              : formatMessage(
                  m.investigationCases.sections.decision.dismissLabel,
                )
          }
          acceptingAlternativeTravelBanLabelText={formatMessage(
            m.restrictionCases.sections.decision
              .acceptingAlternativeTravelBanLabel,
            {
              caseType: formatMessage(
                m.restrictionCases.sections.decision.caseType,
                {
                  caseType: workingCase.type,
                },
              ),
            },
          )}
          onChange={(decision) => {
            setAndSendCaseToServer(
              [{ decision, force: true }],
              workingCase,
              setWorkingCase,
            )
          }}
        />
      </Box>
      <Box marginBottom={3}>
        <Text variant="h3">Drög að niðurstöðu</Text>
      </Box>
      <RulingInput
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        rows={12}
      />
    </>
  )
}

export default ConclusionDraft
