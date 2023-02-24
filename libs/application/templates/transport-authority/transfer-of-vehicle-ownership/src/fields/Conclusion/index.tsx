import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
} from '@island.is/application/types'
import {
  Box,
  AlertMessage,
  AccordionCard,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FC } from 'react'
import { conclusion } from '../../lib/messages'
import { CopyLink } from '@island.is/application/ui-components'
import { ApplicationConfigurations } from '@island.is/application/types'
import { MessageWithLinkButtonFormField } from '@island.is/application/ui-fields'
import { coreMessages } from '@island.is/application/core'

export const Conclusion: FC<FieldBaseProps> = (props) => {
  const { application } = props
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={2}>
      <Box marginBottom={5}>
        <AlertMessage
          type="success"
          title={formatMessage(conclusion.default.alertMessage)}
        />
      </Box>

      <AccordionCard
        id="conclustion-card"
        label={formatMessage(conclusion.default.accordionTitle)}
        startExpanded={true}
      >
        <Text>{formatMessage(conclusion.default.accordionText)}</Text>
      </AccordionCard>

      <Box marginTop={3}>
        <Text variant="h4">{formatMessage(conclusion.default.shareLink)}</Text>
        <Box marginTop={2}>
          <CopyLink
            linkUrl={`${document.location.origin}/umsoknir/${ApplicationConfigurations.TransferOfVehicleOwnership.slug}/${application.id}`}
            buttonTitle={formatMessage(conclusion.default.copyLink)}
          />
        </Box>
      </Box>

      <Box marginTop={3} marginBottom={5}>
        <MessageWithLinkButtonFormField
          application={application}
          field={{
            ...props.field,
            type: FieldTypes.MESSAGE_WITH_LINK_BUTTON_FIELD,
            component: FieldComponents.MESSAGE_WITH_LINK_BUTTON_FIELD,
            url: '/minarsidur/umsoknir',
            buttonTitle: coreMessages.openServicePortalButtonTitle,
            message: coreMessages.openServicePortalMessageText,
          }}
        />
      </Box>
    </Box>
  )
}
