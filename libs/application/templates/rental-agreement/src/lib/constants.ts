import { StateLifeCycle } from '@island.is/application/types'

export const TRUE = 'true'
export const FALSE = 'false'

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  ONEACCEPTED = 'oneAccepted',
  TWOACCEPTED = 'twoAccepted',
  SIGNING = 'signing',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum Routes {
  LANDLORDINFORMATION = 'landlordInfo',
  TENANTINFORMATION = 'tenantInfo',
  PROPERTYINFORMATION = 'registerProperty.info',
  PROPERTYCATEGORY = 'registerProperty.category',
  SPECIALPROVISIONS = 'specialProvisions',
  CONDITION = 'condition',
  FIREPROTECTIONS = 'fireProtections',
  RENTALPERIOD = 'rentalPeriod',
  RENTALAMOUNT = 'rentalAmount',
  SECURITYDEPOSIT = 'securityDeposit',
  OTHERFEES = 'otherFees',
}
export const IS_REPRESENTATIVE = 'isRepresentative'

export enum AnswerOptions {
  YES = 'yes',
  NO = 'no',
}

export enum RentalHousingCategoryTypes {
  ENTIRE_HOME = 'entireHome',
  ROOM = 'room',
  COMMERCIAL = 'commercial',
}

export enum RentalHousingCategoryClass {
  GENERAL_MARKET = 'generalMarket',
  SPECIAL_GROUPS = 'specialGroups',
}

export enum RentalHousingCategoryClassGroup {
  STUDENT_HOUSING = 'studentHousing',
  SENIOR_CITIZEN_HOUSING = 'seniorCitizenHousing',
  COMMUNE = 'commune',
  HALFWAY_HOUSE = 'halfwayHouse',
  SOCIAL_HOUSING = 'socialHousing',
  INCOME_BASED_HOUSING = 'incomeBasedHousing',
  EMPLOYEE_HOUSING = 'employeeHousing',
}

export enum RentalHousingConditionInspector {
  CONTRACT_PARTIES = 'contractParties',
  INDEPENDENT_PARTY = 'independentParty',
}

export enum RentalAmountIndexTypes {
  CONSUMER_PRICE_INDEX = 'consumerPriceIndex',
  CONSTRUCTION_COST_INDEX = 'constructionCostIndex',
  WAGE_INDEX = 'wageIndex',
}

export enum RentalAmountPaymentDateOptions {
  FIRST_DAY = 'firstDay',
  LAST_DAY = 'lastDay',
  OTHER = 'other',
}

export enum SecurityDepositTypeOptions {
  BANK_GUARANTEE = 'bankGuarantee',
  CAPITAL = 'capital',
  THIRD_PARTY_GUARANTEE = 'thirdPartyGuarantee',
  INSURANCE_COMPANY = 'insuranceCompany',
  MUTUAL_FUND = 'mutualFund',
  OTHER = 'other',
}

export enum SecurityDepositAmountOptions {
  ONE_MONTH = '1 month',
  TWO_MONTHS = '2 months',
  THREE_MONTHS = '3 months',

  OTHER = 'other',
}

export enum RentOtherFeesPayeeOptions {
  LANDLORD = 'landlordPays',
  TENANT = 'tenantPays',
}

export const pruneAfterDays = (Days: number): StateLifeCycle => {
  return {
    shouldBeListed: false,
    shouldBePruned: true,
    whenToPrune: Days * 24 * 3600 * 1000,
  }
}

export enum UserRole {
  LANDLORD = 'landlord',
  TENANT = 'tenant',
}
