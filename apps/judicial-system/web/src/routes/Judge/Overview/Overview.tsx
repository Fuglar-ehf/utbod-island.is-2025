import React, { useContext, useEffect, useState } from 'react'
import {
  Box,
  Text,
  Accordion,
  AccordionItem,
  Input,
} from '@island.is/island-ui/core'
import {
  formatDate,
  capitalize,
  formatCustodyRestrictions,
  laws,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import { isNextDisabled, updateState } from '../../../utils/stepHelper'
import { FormFooter } from '../../../shared-components/FormFooter'
import { useParams } from 'react-router-dom'
import * as api from '../../../api'
import { validate } from '../../../utils/validate'
import useWorkingCase from '../../../utils/hooks/useWorkingCase'
import * as Constants from '../../../utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { CaseCustodyProvisions } from '@island.is/judicial-system/types'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'

export const JudgeOverview: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [
    courtCaseNumberErrorMessage,
    setCourtCaseNumberErrorMessage,
  ] = useState('')
  const [workingCase, setWorkingCase] = useWorkingCase()
  const uContext = useContext(userContext)

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    let mounted = true

    const getCurrentCase = async () => {
      const currentCase = await api.getCaseById(id)
      window.localStorage.setItem(
        'workingCase',
        JSON.stringify(currentCase.case),
      )

      if (mounted && !workingCase) {
        setWorkingCase(currentCase.case)
      }
    }

    if (id) {
      getCurrentCase()
    }

    return () => {
      mounted = false
    }
  }, [id, workingCase, setWorkingCase])

  return workingCase ? (
    <PageLayout activeSection={1} activeSubSection={0}>
      <Box marginBottom={10}>
        <Text as="h1" variant="h1">
          Yfirlit kröfu
        </Text>
      </Box>
      <Box component="section" marginBottom={8}>
        <Box marginBottom={2}>
          <Text as="h3" variant="h3">
            Málsnúmer héraðsdóms
          </Text>
        </Box>
        <Box marginBottom={1}>
          <Input
            data-testid="courtCaseNumber"
            name="courtCaseNumber"
            label="Slá inn málsnúmer"
            placeholder="R-X/ÁÁÁÁ"
            defaultValue={workingCase?.courtCaseNumber}
            errorMessage={courtCaseNumberErrorMessage}
            hasError={courtCaseNumberErrorMessage !== ''}
            onBlur={(evt) => {
              updateState(
                workingCase,
                'courtCaseNumber',
                evt.target.value,
                setWorkingCase,
              )

              const validateField = validate(evt.target.value, 'empty')

              if (validateField.isValid) {
                api.saveCase(
                  workingCase.id,
                  parseString('courtCaseNumber', evt.target.value),
                )
              } else {
                setCourtCaseNumberErrorMessage(validateField.errorMessage)
              }
            }}
            onFocus={() => setCourtCaseNumberErrorMessage('')}
            required
          />
        </Box>
        <Box>
          <Text
            variant="small"
            fontWeight="semiBold"
          >{`LÖKE málsnr. ${workingCase?.policeCaseNumber}`}</Text>
        </Box>
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={1}>
          <Text variant="eyebrow" color="blue400">
            Kennitala
          </Text>
        </Box>
        <Text variant="h3">
          {formatNationalId(workingCase?.accusedNationalId)}
        </Text>
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={1}>
          <Text variant="eyebrow" color="blue400">
            Fullt nafn
          </Text>
        </Box>
        <Text variant="h3">{workingCase?.accusedName}</Text>
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={1}>
          <Text variant="eyebrow" color="blue400">
            Lögheimili/dvalarstaður
          </Text>
        </Box>
        <Text variant="h3">{workingCase?.accusedAddress}</Text>
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={1}>
          <Text variant="eyebrow" color="blue400">
            Dómstóll
          </Text>
        </Box>
        <Text variant="h3">{workingCase?.court}</Text>
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={1}>
          <Text variant="eyebrow" color="blue400">
            Tími handtöku
          </Text>
        </Box>
        <Text variant="h3">
          {workingCase?.arrestDate &&
            `${capitalize(
              formatDate(workingCase?.arrestDate, 'PPPP'),
            )} kl. ${formatDate(workingCase?.arrestDate, TIME_FORMAT)}`}
        </Text>
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={1}>
          <Text variant="eyebrow" color="blue400">
            Ósk um fyrirtökudag og tíma
          </Text>
        </Box>
        <Text variant="h3">
          {`${capitalize(
            formatDate(workingCase?.requestedCourtDate, 'PPPP'),
          )} kl. ${formatDate(workingCase?.requestedCourtDate, TIME_FORMAT)}`}
        </Text>
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={1}>
          <Text variant="eyebrow" color="blue400">
            Ákærandi
          </Text>
        </Box>
        <Text variant="h3">
          {workingCase?.prosecutor
            ? `${workingCase?.prosecutor.name}, ${workingCase?.prosecutor.title}`
            : `${uContext?.user?.name}, ${uContext?.user?.title}`}
        </Text>
      </Box>
      <Box component="section" marginBottom={5}>
        <Accordion singleExpand={false}>
          <AccordionItem
            id="id_1"
            label="Dómkröfur"
            startExpanded
            labelVariant="h3"
          >
            <Text variant="intro">
              Gæsluvarðhald til
              <strong>
                {workingCase?.requestedCustodyEndDate &&
                  ` ${formatDate(
                    workingCase?.requestedCustodyEndDate,
                    'PPP',
                  )} kl. ${formatDate(
                    workingCase.requestedCustodyEndDate,
                    TIME_FORMAT,
                  )}`}
              </strong>
            </Text>
          </AccordionItem>
          <AccordionItem
            id="id_2"
            label="Lagaákvæði"
            startExpanded
            labelVariant="h3"
          >
            <Box marginBottom={2}>
              <Box marginBottom={2}>
                <Text as="h4" variant="h4">
                  Lagaákvæði sem brot varða við
                </Text>
              </Box>
              <Text variant="intro">{workingCase?.lawsBroken}</Text>
            </Box>
            <Box marginBottom={2}>
              <Box marginBottom={2}>
                <Text as="h4" variant="h4">
                  Lagaákvæði sem krafan er byggð á
                </Text>
              </Box>
              {workingCase?.custodyProvisions.map(
                (custodyProvision: CaseCustodyProvisions, index) => {
                  return (
                    <div key={index}>
                      <Text variant="intro">{laws[custodyProvision]}</Text>
                    </div>
                  )
                },
              )}
            </Box>
          </AccordionItem>
          <AccordionItem
            id="id_3"
            label="Takmarkanir á gæslu"
            startExpanded
            labelVariant="h3"
          >
            <Text variant="intro">
              {formatCustodyRestrictions(
                workingCase.requestedCustodyRestrictions,
              )}
            </Text>
          </AccordionItem>
          <AccordionItem
            id="id_4"
            label="Greinagerð um málsatvik og lagarök"
            startExpanded
            labelVariant="h3"
          >
            {workingCase?.caseFacts && (
              <Box marginBottom={2}>
                <Box marginBottom={2}>
                  <Text variant="h5">Málsatvik rakin</Text>
                </Box>
                <Text variant="intro">{workingCase?.caseFacts}</Text>
              </Box>
            )}
            {workingCase?.witnessAccounts && (
              <Box marginBottom={2}>
                <Box marginBottom={2}>
                  <Text variant="h5">Framburður</Text>
                </Box>
                <Text variant="intro">{workingCase?.witnessAccounts}</Text>
              </Box>
            )}
            {workingCase?.investigationProgress && (
              <Box marginBottom={2}>
                <Box marginBottom={2}>
                  <Text variant="h5">Staða rannsóknar og næstu skref</Text>
                </Box>
                <Text variant="intro">
                  {workingCase?.investigationProgress}
                </Text>
              </Box>
            )}
            {workingCase?.legalArguments && (
              <Box marginBottom={2}>
                <Box marginBottom={2}>
                  <Text variant="h5">Lagarök</Text>
                </Box>
                <Text variant="intro">{workingCase?.legalArguments}</Text>
              </Box>
            )}
          </AccordionItem>
          <AccordionItem
            id="id_5"
            label="Skilaboð til dómara"
            startExpanded
            labelVariant="h3"
          >
            <Text variant="intro">{workingCase?.comments}</Text>
          </AccordionItem>
        </Accordion>
      </Box>
      <FormFooter
        nextUrl={Constants.COURT_DOCUMENT_ROUTE}
        nextIsDisabled={isNextDisabled([
          { value: workingCase.courtCaseNumber, validations: ['empty'] },
        ])}
      />
    </PageLayout>
  ) : null
}

export default JudgeOverview
