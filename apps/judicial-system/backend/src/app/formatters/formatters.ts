import {
  capitalize,
  formatAccusedByGender,
  formatDate,
  formatNationalId,
  formatCustodyRestrictions,
  laws,
  formatGender,
  isFalsy,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseGender,
} from '@island.is/judicial-system/types'

export function formatProsecutorDemands(
  accusedNationalId: string,
  accusedName: string,
  court: string,
  alternativeTravelBan: boolean,
  requestedCustodyEndDate: Date,
  isolation: boolean,
  isExtension: boolean,
  previousDecision: CaseDecision,
): string {
  return `Þess er krafist að ${accusedName}, kt. ${formatNationalId(
    accusedNationalId,
  )}, sæti${
    isExtension && previousDecision === CaseDecision.ACCEPTING
      ? ' áframhaldandi'
      : ''
  } gæsluvarðhaldi${
    alternativeTravelBan
      ? `,${
          isExtension &&
          previousDecision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
            ? ' áframhaldandi'
            : ''
        } farbanni til vara,`
      : ''
  } með úrskurði ${court?.replace(
    'Héraðsdómur',
    'Héraðsdóms',
  )}, til ${formatDate(requestedCustodyEndDate, 'PPPPp')
    ?.replace('dagur,', 'dagsins')
    ?.replace(' kl.', ', kl.')}${
    isolation
      ? ', og verði gert að sæta einangrun á meðan á varðhaldi stendur'
      : ''
  }.`
}

function custodyProvisionsOrder(p: CaseCustodyProvisions) {
  switch (p) {
    case CaseCustodyProvisions._95_1_A:
      return 0
    case CaseCustodyProvisions._95_1_B:
      return 1
    case CaseCustodyProvisions._95_1_C:
      return 2
    case CaseCustodyProvisions._95_1_D:
      return 3
    case CaseCustodyProvisions._95_2:
      return 4
    case CaseCustodyProvisions._99_1_B:
      return 5
    case CaseCustodyProvisions._100_1:
      return 6
    default:
      return 999
  }
}

function custodyProvisionsCompare(
  p1: CaseCustodyProvisions,
  p2: CaseCustodyProvisions,
) {
  const o1 = custodyProvisionsOrder(p1)
  const o2 = custodyProvisionsOrder(p2)

  return o1 < o2 ? -1 : o1 > o2 ? 1 : 0
}

export function formatCustodyProvisions(
  custodyProvisions: CaseCustodyProvisions[],
): string {
  return custodyProvisions
    ?.sort((p1, p2) => custodyProvisionsCompare(p1, p2))
    .reduce((s, l) => `${s}${laws[l]}\n`, '')
    .slice(0, -1)
}

export function formatCourtCaseNumber(
  court: string,
  courtCaseNumber: string,
): string {
  return `Málsnúmer ${court?.replace(
    'Héraðsdómur',
    'Héraðsdóms',
  )} ${courtCaseNumber}`
}

export function formatConclusion(
  accusedNationalId: string,
  accusedName: string,
  accusedGender: CaseGender,
  decision: CaseDecision,
  custodyEndDate: Date,
  isolation: boolean,
  isExtension: boolean,
  previousDecision: CaseDecision,
): string {
  return decision === CaseDecision.REJECTING
    ? `Kröfu um að ${formatAccusedByGender(
        accusedGender,
      )}, ${accusedName}, kt. ${formatNationalId(accusedNationalId)}, sæti${
        isExtension && previousDecision === CaseDecision.ACCEPTING
          ? ' áframhaldandi'
          : ''
      } gæsluvarðhaldi er hafnað.`
    : `${capitalize(
        formatAccusedByGender(accusedGender),
      )}, ${accusedName}, kt. ${formatNationalId(
        accusedNationalId,
      )}, skal sæta ${
        decision === CaseDecision.ACCEPTING
          ? `${
              isExtension && previousDecision === CaseDecision.ACCEPTING
                ? 'áframhaldandi '
                : ''
            }gæsluvarðhaldi`
          : `${
              isExtension &&
              previousDecision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                ? 'áframhaldandi '
                : ''
            }farbanni`
      }, þó ekki lengur en til ${formatDate(custodyEndDate, 'PPPPp')
        ?.replace('dagur,', 'dagsins')
        ?.replace(' kl.', ', kl.')}.${
        decision === CaseDecision.ACCEPTING && isolation
          ? ` ${capitalize(
              formatAccusedByGender(accusedGender),
            )} skal sæta einangrun á meðan á gæsluvarðhaldinu stendur.`
          : ''
      }`
}

export function formatAppeal(
  appealDecision: CaseAppealDecision,
  stakeholder: string,
  includeBullet = true,
): string {
  switch (appealDecision) {
    case CaseAppealDecision.APPEAL:
      return `${
        includeBullet ? '  \u2022  ' : ''
      }${stakeholder} kærir úrskurðinn.`
    case CaseAppealDecision.ACCEPT:
      return `${
        includeBullet ? '  \u2022  ' : ''
      }${stakeholder} unir úrskurðinum.`
    case CaseAppealDecision.POSTPONE:
      return `${
        includeBullet ? '  \u2022  ' : ''
      }${stakeholder} tekur sér lögboðinn frest.`
  }
}

export function formatCourtHeadsUpSmsNotification(
  prosecutorName: string,
  arrestDate: Date,
  requestedCourtDate: Date,
): string {
  // Prosecutor
  const prosecutorText = ` Ákærandi: ${prosecutorName || 'Ekki skráður'}.`

  // Arrest date
  const arrestDateText = arrestDate
    ? ` Viðkomandi handtekinn ${formatDate(arrestDate, 'Pp').replace(
        ' ',
        ', kl. ',
      )}.`
    : ''

  // Court date
  const requestedCourtDateText = requestedCourtDate
    ? ` ÓE fyrirtöku ${formatDate(requestedCourtDate, 'Pp').replace(
        ' ',
        ', eftir kl. ',
      )}.`
    : ''

  return `Ný gæsluvarðhaldskrafa í vinnslu.${prosecutorText}${arrestDateText}${requestedCourtDateText}`
}

export function formatCourtReadyForCourtSmsNotification(
  prosecutorName: string,
  court: string,
) {
  // Prosecutor
  const prosecutorText = ` Ákærandi: ${prosecutorName || 'Ekki skráður'}.`

  // Court
  const courtText = ` Dómstóll: ${court || 'Ekki skráður'}.`

  return `Gæsluvarðhaldskrafa tilbúin til afgreiðslu.${prosecutorText}${courtText}`
}

export function formatProsecutorCourtDateEmailNotification(
  court: string,
  courtDate: Date,
  courtRoom: string,
  defenderName: string,
): string {
  const courtDateText = formatDate(courtDate, 'PPPp')?.replace(' kl.', ', kl.')
  const defenderText = defenderName
    ? `Verjandi sakbornings: ${defenderName}`
    : 'Verjandi sakbornings hefur ekki verið skráður'

  return `${court} hefur staðfest fyrirtökutíma fyrir gæsluvarðhaldskröfu.<br /><br />Fyrirtaka mun fara fram ${courtDateText}.<br /><br />Dómsalur: ${courtRoom}.<br /><br />${defenderText}.`
}

export function formatPrisonCourtDateEmailNotification(
  prosecutorOffice: string,
  court: string,
  courtDate: Date,
  accusedName: string,
  accusedGender: CaseGender,
  requestedCustodyEndDate: Date,
  isolation: boolean,
  defenderName: string,
  isExtension: boolean,
): string {
  const courtText = court?.replace('dómur', 'dóms')
  const courtDateText = formatDate(courtDate, 'PPPPp')
    ?.replace('dagur', 'daginn')
    ?.replace(' kl.', ', kl.')
  const requestedCustodyEndDateText = formatDate(
    requestedCustodyEndDate,
    'PPPPp',
  )
    ?.replace('dagur', 'dagsins')
    ?.replace(' kl.', ', kl.')
  const requestText = `Nafn sakbornings: ${accusedName}.<br /><br />Kyn sakbornings: ${formatGender(
    accusedGender,
  )}.<br /><br />Krafist er gæsluvarðhalds til ${requestedCustodyEndDateText}.`
  const isolationText = isolation
    ? 'Farið er fram á einangrun.'
    : 'Ekki er farið fram á einangrun.'
  const defenderText = defenderName
    ? `Verjandi sakbornings: ${defenderName}`
    : 'Verjandi sakbornings hefur ekki verið skráður'

  return `${prosecutorOffice} hefur sent kröfu um ${
    isExtension ? 'áframhaldandi ' : ''
  }gæsluvarðhald til ${courtText} og verður málið tekið fyrir ${courtDateText}.<br /><br />${requestText}<br /><br />${isolationText}<br /><br />${defenderText}.`
}

export function formatDefenderCourtDateEmailNotification(
  accusedNationalId: string,
  accusedName: string,
  court: string,
  courtDate: Date,
  courtRoom: string,
): string {
  return `${court} hefur staðfest fyrirtökutíma fyrir gæsluvarðhaldskröfu.<br /><br />Fyrirtaka mun fara fram ${formatDate(
    courtDate,
    'PPPPp',
  )
    ?.replace('dagur', 'daginn')
    ?.replace(
      ' kl.',
      ', kl.',
    )}.<br /><br />Dómsalur: ${courtRoom}.<br /><br />Sakborningur: ${accusedName}, kt. ${formatNationalId(
    accusedNationalId,
  )}.<br /><br />Dómstóllinn hefur skráð þig sem verjanda sakbornings.`
}

export function formatCourtDateNotificationCondition(
  courtDate: Date,
  defenderEmail: string,
): string {
  return `courtDate=${formatDate(
    courtDate,
    'Pp',
  )},defenderEmail=${defenderEmail}`
}

export function formatPrisonRulingEmailNotification(
  accusedNationalId: string,
  accusedName: string,
  accusedGender: CaseGender,
  court: string,
  prosecutorName: string,
  courtDate: Date,
  defenderName: string,
  decision: CaseDecision,
  custodyEndDate: Date,
  custodyRestrictions: CaseCustodyRestrictions[],
  accusedAppealDecision: CaseAppealDecision,
  prosecutorAppealDecision: CaseAppealDecision,
  judgeName: string,
  judgeTitle: string,
  isExtension: boolean,
  previousDecision: CaseDecision,
): string {
  return `<strong>Úrskurður um gæsluvarðhald</strong><br /><br />${court}, ${formatDate(
    courtDate,
    'PPP',
  )}.<br /><br />Ákærandi: ${prosecutorName}.<br />Verjandi: ${
    isFalsy(defenderName) ? 'Hefur ekki verið skráður' : defenderName
  }.<br /><br /><strong>Úrskurðarorð</strong><br /><br />${formatConclusion(
    accusedNationalId,
    accusedName,
    accusedGender,
    decision,
    custodyEndDate,
    custodyRestrictions.includes(CaseCustodyRestrictions.ISOLATION),
    isExtension,
    previousDecision,
  )}<br /><br /><strong>Ákvörðun um kæru</strong><br />${formatAppeal(
    accusedAppealDecision,
    capitalize(formatAccusedByGender(accusedGender)),
    false,
  )}<br />${formatAppeal(prosecutorAppealDecision, 'Sækjandi', false)}${
    decision === CaseDecision.ACCEPTING
      ? `<br /><br /><strong>Tilhögun gæsluvarðhalds</strong><br />${formatCustodyRestrictions(
          accusedGender,
          custodyRestrictions,
        )}`
      : ''
  }<br /><br />${judgeName} ${judgeTitle}`
}

export function formatCourtRevokedSmsNotification(
  prosecutorName: string,
  requestedCourtDate: Date,
  courtDate: Date,
) {
  // Prosecutor
  const prosecutorText = ` Ákærandi: ${prosecutorName || 'Ekki skráður'}.`

  // Court date
  const courtDateText = courtDate
    ? ` Fyrirtökutími: ${formatDate(courtDate, 'Pp').replace(' ', ', kl. ')}.`
    : requestedCourtDate
    ? ` ÓVE fyrirtöku ${formatDate(requestedCourtDate, 'Pp').replace(
        ' ',
        ', eftir kl. ',
      )}.`
    : ''

  return `Gæsluvarðhaldskrafa afturkölluð.${prosecutorText}${courtDateText}`
}

export function formatPrisonRevokedEmailNotification(
  prosecutorOffice: string,
  court: string,
  courtDate: Date,
  accusedName: string,
  defenderName: string,
  isExtension: boolean,
): string {
  const courtText = court?.replace('dómur', 'dóms')
  const courtDateText = formatDate(courtDate, 'PPPPp')
    ?.replace('dagur', 'daginn')
    ?.replace(' kl.', ', kl.')
  const accusedNameText = `Nafn sakbornings: ${accusedName}.`
  const defenderText = defenderName
    ? `Verjandi sakbornings: ${defenderName}`
    : 'Verjandi sakbornings hefur ekki verið skráður'

  return `${prosecutorOffice} hefur afturkallað kröfu um ${
    isExtension ? 'áframhaldandi ' : ''
  }gæsluvarðhald sem send var til ${courtText} og taka átti fyrir ${courtDateText}.<br /><br />${accusedNameText}<br /><br />${defenderText}.`
}

export function formatDefenderRevokedEmailNotification(
  accusedNationalId: string,
  accusedName: string,
  court: string,
  courtDate: Date,
): string {
  const courtText = court?.replace('dómur', 'dómi')
  const courtDateText = formatDate(courtDate, 'PPPPp')
    ?.replace('dagur', 'daginn')
    ?.replace(' kl.', ', kl.')

  return `Gæsluvarðhaldskrafa sem taka átti fyrir hjá ${courtText} ${courtDateText}, hefur verið afturkölluð.<br /><br />Sakborningur: ${accusedName}, kt. ${formatNationalId(
    accusedNationalId,
  )}.<br /><br />Dómstóllinn hafði skráð þig sem verjanda sakbornings.`
}

export function stripHtmlTags(html: string): string {
  return html.replace(/(?:<br \/>)/g, '\n').replace(/(?:<\/?strong>)/g, '')
}
