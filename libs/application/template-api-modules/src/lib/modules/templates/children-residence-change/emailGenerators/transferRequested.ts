import { getSlugFromType } from '@island.is/application/core'
import { CRCApplication } from '@island.is/application/templates/children-residence-change'
import { EmailTemplateGenerator } from '../../../../types'
import { DistrictCommissionerLogoImg } from './consts'

export const transferRequestedEmail: EmailTemplateGenerator = (props) => {
  const application = (props.application as unknown) as CRCApplication
  const {
    options: { clientLocationOrigin, email },
  } = props
  const applicationSlug = getSlugFromType(application.typeId) as string
  const applicationLink = `${clientLocationOrigin}/${applicationSlug}/${application.id}`
  const subject = 'Umsókn um breytt lögheimili barns'
  const body = `
      <img src=${DistrictCommissionerLogoImg} height="78" width="246" />


        <h1>${subject}</h1>

        ${application.externalData.nationalRegistry.data.fullName} hefur óskað eftir að þú undirritir samning um breytt lögheimili barns og meðlag.

        Samningurinn er tilbúinn til rafrænnar undirritunar á Island.is.

        <a href=${applicationLink} target="_blank">Opna umsókn</a>.
      `

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: application.answers.counterParty.email,
      },
    ],
    subject,
    html: `<p>${body
      .split('')
      .map((c) => (c === '\n' ? `<br />\n` : c))
      .join('')}</p>`,
  }
}
