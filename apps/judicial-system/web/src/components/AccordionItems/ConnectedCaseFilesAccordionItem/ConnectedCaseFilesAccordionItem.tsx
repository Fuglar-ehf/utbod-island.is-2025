import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Accordion, AccordionItem } from '@island.is/island-ui/core'
import { IndictmentCaseFilesList } from '@island.is/judicial-system-web/src/components'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './ConnectedCaseFilesAccordionItem.strings'

interface Props {
  connectedCaseParentId: string
  connectedCase: Case
}

const ConnectedCaseFilesAccordionItem: FC<Props> = ({
  connectedCaseParentId,
  connectedCase,
}) => {
  const { formatMessage } = useIntl()
  const { caseFiles, courtCaseNumber } = connectedCase

  if (!courtCaseNumber || !caseFiles || caseFiles.length < 1) {
    return null
  }

  return (
    <Accordion>
      <AccordionItem
        id="connectedCaseFiles"
        labelVariant="h3"
        label={formatMessage(strings.heading, {
          caseNumber: connectedCase.courtCaseNumber,
        })}
      >
        <IndictmentCaseFilesList
          workingCase={connectedCase}
          displayHeading={false}
          connectedCaseParentId={connectedCaseParentId}
        />
      </AccordionItem>
    </Accordion>
  )
}

export default ConnectedCaseFilesAccordionItem
