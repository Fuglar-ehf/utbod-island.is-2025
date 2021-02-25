import React, { FC } from 'react'
import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { Accordion, AccordionItem, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../forms/messages'
import FormerInsurance from './FormerInsurance'
import StatusAndChildren from './StatusAndChildren'
import ContactInfo from './ContactInfo'
import ReviewAdditionalInfo from './ReviewAdditionalInfo'
import ReviewMissingInfo from './ReviewMissingInfo'
import { AdditionalInfoType, MissingInfoType } from '../../types'
import { YES } from '../../constants'

const Review: FC<FieldBaseProps> = ({ field, application }) => {
  const { formatMessage } = useLocale()

  const isEditable = field.id !== 'submittedData'
  const previousMissingInfo =
    (getValueViaPath(
      application.answers,
      'missingInfo',
    ) as MissingInfoType[]) || []

  const additionalInfo = getValueViaPath(
    application.answers,
    'additionalInfo',
  ) as AdditionalInfoType

  return (
    <Box marginBottom={[1, 1, 3]}>
      <Accordion singleExpand={false}>
        <AccordionItem
          id="id_1"
          label={formatText(m.applicantInfoSection, application, formatMessage)}
        >
          <ContactInfo
            application={application}
            field={field}
            isEditable={isEditable}
          />
        </AccordionItem>
        <AccordionItem
          id="id_2"
          label={formatText(m.statusAndChildren, application, formatMessage)}
        >
          <StatusAndChildren
            application={application}
            field={field}
            isEditable={isEditable}
          />
        </AccordionItem>
        <AccordionItem
          id="id_3"
          label={formatText(m.formerInsuranceTitle, application, formatMessage)}
        >
          <FormerInsurance
            application={application}
            field={field}
            isEditable={isEditable}
          />
        </AccordionItem>
      </Accordion>
    </Box>
  )
}

export default Review
