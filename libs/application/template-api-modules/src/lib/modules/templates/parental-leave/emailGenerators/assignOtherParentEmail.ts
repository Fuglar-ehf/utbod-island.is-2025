import { dedent } from 'ts-dedent'
import get from 'lodash/get'

import { AssignmentEmailTemplateGenerator } from '../../../../types'

export const generateAssignOtherParentApplicationEmail: AssignmentEmailTemplateGenerator = (
  props,
  assignLink,
) => {
  const {
    application,
    options: { locale },
  } = props

  const applicantEmail = get(application.answers, 'person.email')

  // TODO translate using locale
  const subject =
    locale === 'is'
      ? 'Yfirferð á umsókn um fæðingarorlof'
      : 'Request for review on paternity leave'
  const body =
    locale === 'is'
      ? dedent(`Góðan dag.

        Umsækjandi með kennitölu ${application.applicant} hefur skráð þig sem foreldri í umsókn sinni.
    
        Ef þú áttir von á þessum tölvupósti þá getur þú <a href="${assignLink}" target="_blank">smellt hér til þess að fara yfir umsóknina</a>.
    
        Með kveðju,
        Fæðingarorlofssjóðsjóður
      `)
      : dedent(`Hello.

        An application from applicant with national registry ${application.applicant} awaits your approval.

        To review, <a href="${assignLink}">click here</a>.

        Best regards,
        ReferenceTemplateInstitution`)

  return {
    from: {
      name: 'Devland.is',
      address: 'development@island.is',
    },
    to: [
      {
        name: '',
        address: applicantEmail as string,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
