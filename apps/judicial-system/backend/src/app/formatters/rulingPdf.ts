import PDFDocument from 'pdfkit'
import streamBuffers from 'stream-buffers'

import {
  AccusedPleaDecision,
  CaseAppealDecision,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system/types'
import {
  capitalize,
  formatDate,
  formatCustodyRestrictions,
  formatAlternativeTravelBanRestrictions,
  NounCases,
  formatAccusedByGender,
  formatProsecutorDemands,
} from '@island.is/judicial-system/formatters'

import { environment } from '../../environments'
import { Case } from '../modules/case/models'
import { formatAppeal, formatConclusion } from './formatters'
import { setPageNumbers } from './pdfHelpers'
import { writeFile } from './writeFile'

export async function getRulingPdfAsString(
  existingCase: Case,
): Promise<string> {
  const doc = new PDFDocument({
    size: 'A4',
    margins: {
      top: 40,
      bottom: 60,
      left: 50,
      right: 50,
    },
    bufferPages: true,
  })

  if (doc.info) {
    doc.info['Title'] = 'Úrskurður'
  }

  const stream = doc.pipe(new streamBuffers.WritableStreamBuffer())
  doc
    .font('Helvetica-Bold')
    .fontSize(26)
    .lineGap(8)
    .text('Þingbók', { align: 'center' })
    .font('Helvetica')
    .fontSize(18)
    .text(existingCase.court?.name, { align: 'center' })
    .fontSize(12)
    .lineGap(30)
    .text(
      `Mál nr. ${existingCase.courtCaseNumber} - LÖKE nr. ${existingCase.policeCaseNumber}`,
      { align: 'center' },
    )
    .text(
      `Þann ${formatDate(existingCase.courtStartDate, 'PPP')} heldur ${
        existingCase.judge.name
      } ${existingCase.judge.title} dómþing. Fyrir er tekið mál nr. ${
        existingCase.courtCaseNumber
      }. Þinghald hefst kl. ${formatDate(existingCase.courtStartDate, 'p')}.`,
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .lineGap(8)
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Viðstaddir')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.courtAttendees, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Krafa lögreglu')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.policeDemands, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Dómskjöl')
    .font('Helvetica')
    .fontSize(12)
    .text('Krafa lögreglu þingmerkt nr. 1.', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text('Rannsóknargögn málsins liggja frammi.', {
      lineGap: 6,
      paragraphGap: 4,
    })

  existingCase.courtDocuments?.forEach((courttDocument, index) =>
    doc.text(`${courttDocument} þingmerkt nr. ${index + 2}.`, {
      lineGap: 6,
      paragraphGap: 4,
    }),
  )

  doc
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text(
      `Réttindi ${formatAccusedByGender(
        existingCase.accusedGender,
        NounCases.GENITIVE,
      )}`,
    )
    .font('Helvetica')
    .fontSize(12)
    .text(
      'Sakborningi er bent á að honum sé óskylt að svara spurningum er varða brot það sem honum er gefið að sök, sbr. 2. mgr. 113. gr. laga nr. 88/2008. Sakborningur er enn fremur áminntur um sannsögli kjósi hann að tjá sig um sakarefnið, sbr. 1. mgr. 114. gr. sömu laga.',
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text(
      `Afstaða ${formatAccusedByGender(
        existingCase.accusedGender,
        NounCases.GENITIVE,
      )}`,
    )
    .font('Helvetica')
    .fontSize(12)
    .text(
      `${
        existingCase.accusedPleaDecision === AccusedPleaDecision.ACCEPT
          ? `Kærði samþykkir kröfuna. `
          : existingCase.accusedPleaDecision === AccusedPleaDecision.REJECT
          ? `Kærði hafnar kröfunni. `
          : ''
      }${existingCase.accusedPleaAnnouncement || ''}`,
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Málflutningur')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.litigationPresentations, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .lineGap(40)
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(26)
    .lineGap(16)
    .text('Úrskurður', { align: 'center' })
    .fontSize(14)
    .lineGap(8)
    .text('Krafa lögreglu')
    .font('Helvetica')
    .fontSize(12)
    .text(
      formatProsecutorDemands(
        existingCase.type,
        existingCase.accusedNationalId,
        existingCase.accusedName,
        existingCase.court?.name,
        existingCase.requestedCustodyEndDate,
        existingCase.requestedCustodyRestrictions?.includes(
          CaseCustodyRestrictions.ISOLATION,
        ),
        existingCase.parentCase !== null,
        existingCase.parentCase?.decision,
      ),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )

  if (existingCase.otherDemands?.length > 0) {
    doc.text(' ').text(existingCase.otherDemands, {
      lineGap: 6,
      paragraphGap: 0,
    })
  }

  doc
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Málsatvik')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.caseFacts, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Lagarök')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.legalArguments, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Niðurstaða')
    .font('Helvetica')
    .fontSize(12)
    .text(existingCase.ruling, {
      lineGap: 6,
      paragraphGap: 0,
    })
    .lineGap(40)
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Úrskurðarorð', { align: 'center' })
    .font('Helvetica')
    .fontSize(12)
    .text(
      formatConclusion(
        existingCase.type,
        existingCase.accusedNationalId,
        existingCase.accusedName,
        existingCase.accusedGender,
        existingCase.decision,
        existingCase.custodyEndDate,
        existingCase.type === CaseType.CUSTODY &&
          existingCase.custodyRestrictions?.includes(
            CaseCustodyRestrictions.ISOLATION,
          ),
        existingCase.parentCase !== null,
        existingCase.parentCase?.decision,
        existingCase.isolationTo,
      ),
      {
        lineGap: 6,
        paragraphGap: 0,
      },
    )
  if (existingCase.additionToConclusion) {
    doc.text(' ').text(existingCase.additionToConclusion, {
      lineGap: 6,
      paragraphGap: 0,
    })
  }

  doc
    .text(' ')
    .font('Helvetica-Bold')
    .text(
      `${existingCase.judge?.name || 'Dómari hefur ekki verið skráður'} ${
        existingCase.judge?.title || ''
      }`,
      {
        align: 'center',
        paragraphGap: 0,
      },
    )
    .text(' ')
    .font('Helvetica')
    .text('Úrskurðarorðið er lesið í heyranda hljóði fyrir viðstadda.', {
      lineGap: 6,
      paragraphGap: 0,
    })
    .text(' ')
    .font('Helvetica-Bold')
    .fontSize(14)
    .lineGap(8)
    .text('Ákvörðun um kæru')
    .font('Helvetica')
    .fontSize(12)
    .text(
      'Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð þennan til Landsréttar innan þriggja sólarhringa.',
      {
        lineGap: 6,
        paragraphGap: 4,
      },
    )
    .font('Helvetica-Bold')
    .lineGap(6)
    .text(
      formatAppeal(
        existingCase.accusedAppealDecision,
        capitalize(formatAccusedByGender(existingCase.accusedGender)),
      ),
    )
    .text(formatAppeal(existingCase.prosecutorAppealDecision, 'Sækjandi'))

  if (existingCase.accusedAppealDecision === CaseAppealDecision.APPEAL) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text(
        `Yfirlýsing um kæru ${formatAccusedByGender(
          existingCase.accusedGender,
          NounCases.GENITIVE,
        )}`,
      )
      .font('Helvetica')
      .fontSize(12)
      .text(existingCase.accusedAppealAnnouncement, {
        lineGap: 6,
        paragraphGap: 0,
      })
  }

  if (existingCase.prosecutorAppealDecision === CaseAppealDecision.APPEAL) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text('Yfirlýsing um kæru sækjanda')
      .font('Helvetica')
      .fontSize(12)
      .text(existingCase.prosecutorAppealAnnouncement, {
        lineGap: 6,
        paragraphGap: 0,
      })
  }

  if (
    existingCase.type === CaseType.CUSTODY &&
    existingCase.decision === CaseDecision.ACCEPTING
  ) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text('Tilhögun gæsluvarðhalds')
      .font('Helvetica')
      .fontSize(12)
      .text(
        formatCustodyRestrictions(
          existingCase.accusedGender,
          existingCase.custodyRestrictions,
        ),
        {
          lineGap: 6,
          paragraphGap: 0,
        },
      )
      .text(' ')
      .text(
        'Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að bera atriði er lúta að framkvæmd gæsluvarðhaldsins undir dómara.',
        {
          lineGap: 6,
          paragraphGap: 0,
        },
      )
  }

  if (
    (existingCase.type === CaseType.CUSTODY &&
      existingCase.decision ===
        CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN) ||
    (existingCase.type === CaseType.TRAVEL_BAN &&
      existingCase.decision === CaseDecision.ACCEPTING)
  ) {
    doc
      .text(' ')
      .font('Helvetica-Bold')
      .fontSize(14)
      .lineGap(8)
      .text('Tilhögun farbanns')
      .font('Helvetica')
      .fontSize(12)
      .text(
        formatAlternativeTravelBanRestrictions(
          existingCase.accusedGender,
          existingCase.custodyRestrictions,
          existingCase.otherRestrictions,
        ),
        {
          lineGap: 6,
          paragraphGap: 0,
        },
      )
      .text(' ')
      .text(
        'Dómari bendir sakborningi/umboðsaðila á að honum sé heimilt að bera atriði er lúta að framkvæmd farbannsins undir dómara.',
        {
          lineGap: 6,
          paragraphGap: 0,
        },
      )
  }

  doc
    .lineGap(20)
    .text(' ')
    .text(
      existingCase.courtEndTime
        ? `Þinghaldi lauk kl. ${formatDate(existingCase.courtEndTime, 'p')}.`
        : 'Þinghaldi er ekki lokið.',
    )

  setPageNumbers(doc)

  doc.end()

  // wait for the writing to finish

  const pdf = await new Promise<string>(function (resolve) {
    stream.on('finish', () => {
      resolve(stream.getContentsAsString('binary') as string)
    })
  })

  if (!environment.production) {
    writeFile(`${existingCase.id}-ruling.pdf`, pdf)
  }

  return pdf
}
