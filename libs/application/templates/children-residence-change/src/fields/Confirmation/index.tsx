import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { confirmation, copyUrl } from '../../lib/messages'
import {
  CopyUrl,
  DescriptionText,
  BorderedAccordion,
  ContractOverview,
} from '../components'
import { CRCFieldBaseProps } from '../..'

const Confirmation = ({ application }: CRCFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers, externalData } = application

  return (
    <>
      <Box marginTop={3}>
        <DescriptionText
          text={confirmation.general.description}
          // In confirmation.general.description we render conditionally what message appears depending on what values are defined in the application answers counter party object.
          // The emailParagraph, phoneNumberParagraph and count that are passed to format to handle this logic.
          // We could have gone another route of defining three translations strings, one for each situation, but we were not sure what would be better for the translator.
          format={{
            emailParagraph: answers.counterParty.email
              ? formatMessage(
                  confirmation.general.description.paragraphs.email,
                  { email: answers.counterParty.email },
                )
              : '',
            phoneNumberParagraph: answers.counterParty.phoneNumber
              ? formatMessage(
                  confirmation.general.description.paragraphs.phoneNumber,
                  { phoneNumber: answers.counterParty.phoneNumber },
                )
              : '',
            count: [
              answers.counterParty.email,
              answers.counterParty.phoneNumber,
            ].filter((item) => item).length,
          }}
        />
      </Box>
      <Text variant="h4" marginTop={3}>
        {formatMessage(confirmation.nextSteps.title)}
      </Text>
      <Box marginTop={2}>
        <DescriptionText
          text={confirmation.nextSteps.description}
          format={{
            parentBName:
              externalData.nationalRegistry.data.children[0].otherParent
                .fullName,
          }}
        />
      </Box>
      <Box marginTop={4}>
        <CopyUrl
          title={formatMessage(copyUrl.title)}
          inputLabel={formatMessage(copyUrl.inputLabel)}
          buttonLabel={formatMessage(copyUrl.buttonLabel)}
          successMessage={formatMessage(copyUrl.successMessage)}
        />
      </Box>
      <Box marginTop={3}>
        <BorderedAccordion
          title={formatMessage(confirmation.contractOverview.accordionTitle)}
          id="id_1"
        >
          <ContractOverview application={application} />
        </BorderedAccordion>
      </Box>
      <Box marginTop={5}>
        <img
          src={
            'https://images.ctfassets.net/8k0h54kbe6bj/6UGl8bkfOwUDKYveXfKkh0/c09265b9301b0be52c678a7197a64154/crc-application-submitted.svg'
          }
          alt=""
        />
      </Box>
    </>
  )
}

export default Confirmation
