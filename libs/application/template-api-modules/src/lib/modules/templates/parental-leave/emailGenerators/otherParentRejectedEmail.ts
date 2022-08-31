import get from 'lodash/get'

import { Message } from '@island.is/email-service'

import { ApplicationConfigurations } from '@island.is/application/types'

import { EmailTemplateGeneratorProps } from '../../../../types'
import { pathToAsset } from '../parental-leave.utils'
import { isRunningInProduction } from '../constants'

export type OtherParentRejectedEmail = (
  props: EmailTemplateGeneratorProps,
  senderName?: string,
  senderEmail?: string,
) => Message

// TODO handle translations
export const generateOtherParentRejected: OtherParentRejectedEmail = (
  props,
  senderName,
  senderEmail,
) => {
  const {
    application,
    options: { email, clientLocationOrigin },
  } = props

  const to =
    get(application.answers, 'applicant.email') ||
    get(application.externalData, 'userProfile.data.email')
  const subject = 'Beiðni þín um tilfærslu réttinda hafnað'

  return {
    from: {
      name: isRunningInProduction && senderName ? senderName : email.sender,
      address:
        isRunningInProduction && senderEmail ? senderEmail : email.address,
    },
    to: [
      {
        name: '',
        address: to as string,
      },
    ],
    subject,
    template: {
      title: subject,
      body: [
        {
          component: 'Image',
          context: {
            src: pathToAsset('logo.jpg'),
            alt: 'Vinnumálastofnun merki',
          },
        },
        {
          component: 'Image',
          context: {
            src: pathToAsset('reject.jpeg'),
            alt: 'Barn myndskreyting',
          },
        },
        { component: 'Heading', context: { copy: subject } },
        { component: 'Copy', context: { copy: 'Góðan dag / Good day,' } },
        {
          component: 'Copy',
          context: {
            copy:
              'Hitt foreldrið hefur hafnað beiðni þinni um yfirfærslu á réttindum. Þú þarft því að breyta umsókn þinni.',
          },
        },
        {
          component: 'Copy',
          context: {
            copy:
              'The other parent has denied your request to transfer rights. You therefore need to modify your application.',
          },
        },
        {
          component: 'Button',
          context: {
            copy: 'Opna umsókn',
            href: `${clientLocationOrigin}/${ApplicationConfigurations.ParentalLeave.slug}/${application.id}`,
          },
        },
      ],
    },
  }
}
