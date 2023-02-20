import {
  buildSection,
  buildMultiField,
  buildAlertMessageField,
  buildExpandableDescriptionField,
  buildMessageWithLinkButtonField,
  buildLinkField,
  coreMessages,
} from '@island.is/application/core'
import { FormText } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { StaticText } from 'static-text'
import { conclusion } from './messages'

type props = {
  alertTitle: MessageDescriptor
  alertMessage?: MessageDescriptor
  expandableHeader: MessageDescriptor
  expandableIntro?: MessageDescriptor
  expandableDescription: StaticText
  s3FileKey?: FormText
  link?: string
  buttonText?: MessageDescriptor
}

/**
 * Creates a form conclusion section for applications
 * so the developer doesn't have to write the same code over and over again.
 *
 * @param  alertTitle  Title of the green alert message.
 * @param  alertMessage The message inside the green alert box.
 * @param  expandableHeader Header of the expandable description section.
 * @param  expandableIntro Intro text of the expandable description section.
 * @param  expandableDescription Markdown code for the expandable description section, most applications use bulletpoints.
 * @param  s3FileKey The key of file in s3.
 * @param  link Link that user can click on.
 * @param  buttonText The text of the button that links to a url
 */
export const formConclusionSection = (props: props) =>
  buildSection({
    id: 'uiForms.conclusionSection',
    title: conclusion.information.sectionTitle,
    children: [
      buildMultiField({
        id: 'uiForms.conclusionMultifield',
        title: conclusion.information.formTitle,
        children: [
          buildLinkField({
            id: 'uiForms.complaintLink',
            title: props.buttonText ?? '',
            s3key: props.s3FileKey ?? '',
            link: props.link ?? '',
            condition: () => {
              return props.buttonText !== undefined
            },
          }),
          buildAlertMessageField({
            id: 'uiForms.conclusionAlert',
            title: props.alertTitle,
            alertType: 'success',
            message: props.alertMessage,
          }),
          buildExpandableDescriptionField({
            id: 'uiForms.conclusionBullet',
            title: props.expandableHeader,
            introText: props.expandableIntro,
            description: props.expandableDescription,
            startExpanded: true,
          }),
          buildMessageWithLinkButtonField({
            id: 'uiForms.conclusionGoToServicePortal',
            title: '',
            url: '/minarsidur/umsoknir',
            buttonTitle: coreMessages.openServicePortalButtonTitle,
            message: coreMessages.openServicePortalMessageText,
          }),
        ],
      }),
    ],
  })
