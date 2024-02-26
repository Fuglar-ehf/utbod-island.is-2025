import { HTMLText } from '@island.is/regulations-tools/types'
import {
  CommitteeSignatureState,
  RegularSignatureState,
} from '../../../lib/types'
import is from 'date-fns/locale/is'
import en from 'date-fns/locale/en-US'
import format from 'date-fns/format'

type RegularSignatureTemplateParams = {
  signatureGroups?: RegularSignatureState
  additionalSignature?: string
  locale?: 'is' | 'en'
}

type CommitteeSignatureTemplateParams = {
  signature?: CommitteeSignatureState
  additionalSignature?: string
  locale?: 'is' | 'en'
}

const signatureTemplate = (
  name?: string,
  after?: string,
  above?: string,
  below?: string,
) => {
  if (!name) return ''
  return `
  <div class="signature">
    ${above ? `<p class="signature__above">${above}</p>` : ''}
    <div class="signature__nameWrapper">
      <p class="signature__name">${name}
        ${after ? `<span class="signature__after">${after}</span>` : ''}
      </p>
      ${below ? `<p class="signature__below">${below}</p>` : ''}
    </div>
  </div>
  `
}

const additionalTemplate = (additional?: string) => {
  if (!additional) return ''

  return `<p class="signature__additional">${additional}</p>`
}

const titleTemplate = (title?: string, date?: string, locale = 'is') => {
  if (!title && !date) return ''

  return `
  <p class="signature__title">${title}${title && date ? ', ' : ''}${
    date
      ? format(new Date(date), 'dd. MMMM yyyy', {
          locale: locale === 'is' ? is : en,
        })
      : ''
  }</p>`
}

export const regularSignatureTemplate = ({
  signatureGroups,
  additionalSignature,
  locale = 'is',
}: RegularSignatureTemplateParams): HTMLText => {
  const results = signatureGroups
    ?.map((signatureGroup) => {
      const className =
        signatureGroup?.members?.length === 1
          ? 'signatures single'
          : signatureGroup?.members?.length === 2
          ? 'signatures double'
          : signatureGroup?.members?.length === 3
          ? 'signatures triple'
          : 'signatures'

      return `
      <div class="signature__group">
          ${titleTemplate(
            signatureGroup.institution,
            signatureGroup.date,
            locale,
          )}
          <div class="${className}">
            ${signatureGroup?.members
              ?.map((s) => signatureTemplate(s.name, s.after, s.above, s.below))
              .join('')}
          </div>
        </div>`
    })

    .join('')

  return additionalSignature
    ? ((results + additionalTemplate(additionalSignature)) as HTMLText)
    : (results as HTMLText)
}

export const committeeSignatureTemplate = ({
  signature,
  additionalSignature,
  locale = 'is',
}: CommitteeSignatureTemplateParams): HTMLText => {
  const className =
    signature?.members?.length === 1
      ? 'signatures single'
      : signature?.members?.length === 2
      ? 'signatures double'
      : signature?.members?.length === 3
      ? 'signatures triple'
      : 'signatures'

  const html = `
  <div class="signature__group">
    ${titleTemplate(signature?.institution, signature?.date, locale)}
    <div class="signatures single chairman">
      ${signatureTemplate(
        signature?.chairman.name,
        signature?.chairman.after,
        signature?.chairman.above,
        signature?.chairman.below,
      )}
    </div>
    <div class="${className}">
      ${signature?.members
        ?.map((s) => signatureTemplate(s.name, '', '', s.below))
        .join('')}
    </div>
  </div>
  `

  return additionalSignature
    ? ((html + additionalTemplate(additionalSignature)) as HTMLText)
    : (html as HTMLText)
}
