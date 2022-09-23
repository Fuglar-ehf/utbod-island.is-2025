import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  getUserType = 'getUserType',
}

export const YES = 'yes'
export const NO = 'no'
export const GREATER = 'greater'
export const LESS = 'less'
export const TOTAL = 'total'
export const ELECTIONLIMIT = 550000
export const CARETAKERLIMIT = 300000
export const INPUTCHANGEINTERVAL = 300
export const UPDATE_ELECTION_ACTION = 'updateCurrentElection'

export enum USERTYPE {
  INDIVIDUAL = '150000000',
  PARTY = '150000001',
  CEMETRY = '150000002',
}

export const INDIVIDUAL = 'individual'
export const PARTY = 'party'
export const CEMETRY = 'cemetery'

// input ids
export const INDIVIDUALOPERATIONIDS = {
  incomePrefix: 'individualIncome',
  expensePrefix: 'individualExpense',
  corporateDonations: 'individualIncome.corporateDonations',
  individualDonations: 'individualIncome.individualDonations',
  personalDonations: 'individualIncome.personalDonations',
  otherIncome: 'individualIncome.otherIncome',
  capitalIncome: 'individualIncome.capitalIncome',
  electionOffice: 'individualExpense.electionOffice',
  advertisements: 'individualExpense.advertisements',
  travelCost: 'individualExpense.travelCost',
  otherCost: 'individualExpense.otherCost',
  capitalCost: 'individualExpense.capitalCost',
  totalIncome: 'individualIncome.total',
  totalExpense: 'individualExpense.total',
}

export const PARTYOPERATIONIDS = {
  incomePrefix: 'partyIncome',
  expensePrefix: 'partyExpense',
  publicDonations: 'partyIncome.publicDonations',
  partyDonations: 'partyIncome.partyDonations',
  municipalityDonations: 'partyIncome.municipalityDonations',
  corporateDonations: 'partyIncome.corporateDonations',
  individualDonations: 'partyIncome.individualDonations',
  capitalIncome: 'partyIncome.capitalIncome',
  otherIncome: 'partyIncome.otherIncome',
  totalIncome: 'partyIncome.total',
  electionOffice: 'partyExpense.electionOffice',
  otherCost: 'partyExpense.otherCost',
  capitalCost: 'partyExpense.capitalCost',
  totalExpense: 'partyExpense.total',
}

export const CEMETRYOPERATIONIDS = {
  prefixIncome: 'cemetryIncome',
  prefixExpense: 'cemetryExpense',
  applicationType: 'cemetryIncome.applicationType',
  caretaking: 'cemetryIncome.caretaking',
  graveIncome: 'cemetryIncome.graveIncome',
  cemetryFundDonations: 'cemetryIncome.cemetryFundDonations',
  capitalIncome: 'cemetryIncome.capitalIncome',
  otherIncome: 'cemetryIncome.otherIncome',
  totalIncome: 'cemetryIncome.total',
  totalOperation: 'cemetryRunningCost.totalOperation',
  totalExpense: 'cemetryExpense.total',
  payroll: 'cemetryExpense.payroll',
  funeralCost: 'cemetryExpense.funeralCost',
  chapelExpense: 'cemetryExpense.chapelExpense',
  cemeteryFundExpense: 'cemetryExpense.cemeteryFundExpense',
  donationsToOther: 'cemetryExpense.donationsToOther',
  otherOperationCost: 'cemetryExpense.otherOperationCost',
  writtenOffExpense: 'cemetryExpense.writtenOffExpense',
}

export const CAPITALNUMBERS = {
  capitalPrefix: 'capitalNumbers',
  capitalIncome: 'capitalNumbers.capitalIncome',
  capitalCost: 'capitalNumbers.capitalCost',
  total: 'capitalNumbers.total',
}

export const CEMETRYCARETAKER = {
  caretaking: 'cemetryCaretaker.caretaking',
  nationalId: 'cemetryCaretaker.nationalId',
  name: 'cemetryCaretaker.name',
  role: 'cemetryCaretaker.role',
}

export const ABOUTIDS = {
  operatingYear: 'conditionalAbout.operatingYear',
  applicationType: 'conditionalAbout.applicationType',
  selectElection: 'election.selectElection',
  electionName: 'election.electionName',
  incomeLimit: 'election.incomeLimit',
}

export const OPERATINGCOST = {
  total: 'operatingCost.total',
}

export const EQUITIESANDLIABILITIESIDS = {
  assetPrefix: 'asset',
  tangible: 'asset.tangible',
  current: 'asset.current',
  assetTotal: 'asset.total',
  liabilityPrefix: 'liability',
  longTerm: 'liability.longTerm',
  shortTerm: 'liability.shortTerm',
  asset: 'liability.asset',
  totalLiability: 'liability.total',
  equityPrefix: 'equity',
  totalEquity: 'equity.totalEquity',
  totalCash: 'equity.total',
}

export const CEMETRYEQUITIESANDLIABILITIESIDS = {
  assetPrefix: 'cemetryAsset',
  liabilityPrefix: 'cemetryLiability',
  equityPrefix: 'cemetryEquity',
  tangible: 'cemetryAsset.tangible',
  current: 'cemetryAsset.current',
  assetTotal: 'cemetryAsset.total',
  longTerm: 'cemetryLiability.longTerm',
  shortTerm: 'cemetryLiability.shortTerm',
  liabilityTotal: 'cemetryLiability.total',
  newYearEquity: 'cemetryEquity.newYearEquity',
  reevaluatePrice: 'cemetryEquity.reevaluatePrice',
  reevaluateOther: 'cemetryEquity.reevaluateOther',
  operationResult: 'cemetryEquity.operationResult',
  equityTotal: 'cemetryEquity.total',
}
