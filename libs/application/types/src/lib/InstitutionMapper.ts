import { ApplicationTypes } from './ApplicationTypes'
import { InstitutionTypes } from './InstitutionTypes'
import { InstitutionNationalIds } from './InstitutionNationalIds'

export const institutionMapper = {
  [ApplicationTypes.EXAMPLE]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.PASSPORT]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
  },
  [ApplicationTypes.PASSPORT_ANNULMENT]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
  },
  [ApplicationTypes.DRIVING_LEARNERS_PERMIT]: {
    nationalId: InstitutionNationalIds.RIKISLOGREGLUSTJORI,
    slug: InstitutionTypes.RIKISLOGREGLUSTJORI,
  },
  [ApplicationTypes.DRIVING_LICENSE]: {
    nationalId: InstitutionNationalIds.RIKISLOGREGLUSTJORI,
    slug: InstitutionTypes.RIKISLOGREGLUSTJORI,
  },
  [ApplicationTypes.DRIVING_ASSESSMENT_APPROVAL]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
  },
  [ApplicationTypes.PARENTAL_LEAVE]: {
    nationalId: InstitutionNationalIds.VINNUMALASTOFNUN,
    slug: InstitutionTypes.VINNUMALASTOFNUN,
  },
  [ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.HEALTH_INSURANCE]: {
    nationalId: InstitutionNationalIds.SJUKRATRYGGINGAR_ISLANDS,
    slug: InstitutionTypes.SJUKRATRYGGINGAR_ISLANDS,
  },
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
  },
  [ApplicationTypes.CHILDREN_RESIDENCE_CHANGE_V2]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
  },
  [ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT]: {
    nationalId: InstitutionNationalIds.PERSONUVERND,
    slug: InstitutionTypes.PERSONUVERND,
  },
  [ApplicationTypes.LOGIN_SERVICE]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.INSTITUTION_COLLABORATION]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.INHERITANCE_REPORT]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
  },
  [ApplicationTypes.FUNDING_GOVERNMENT_PROJECTS]: {
    nationalId: InstitutionNationalIds.FJARMALA_EFNAHAGSRADUNEYTID,
    slug: InstitutionTypes.FJARMALA_EFNAHAGSRADUNEYTID,
  },
  [ApplicationTypes.PUBLIC_DEBT_PAYMENT_PLAN]: {
    nationalId: InstitutionNationalIds.INNHEIMTUMADUR,
    slug: InstitutionTypes.INNHEIMTUMADUR,
  },
  [ApplicationTypes.COMPLAINTS_TO_ALTHINGI_OMBUDSMAN]: {
    nationalId: InstitutionNationalIds.UMBODSMADUR_ALTHINGIS,
    slug: InstitutionTypes.UMBODSMADUR_ALTHINGIS,
  },
  [ApplicationTypes.ACCIDENT_NOTIFICATION]: {
    nationalId: InstitutionNationalIds.SJUKRATRYGGINGAR_ISLANDS,
    slug: InstitutionTypes.SJUKRATRYGGINGAR_ISLANDS,
  },
  [ApplicationTypes.EUROPEAN_HEALTH_INSURANCE_CARD]: {
    nationalId: InstitutionNationalIds.SJUKRATRYGGINGAR_ISLANDS,
    slug: InstitutionTypes.SJUKRATRYGGINGAR_ISLANDS,
  },
  [ApplicationTypes.GENERAL_PETITION]: {
    nationalId: InstitutionNationalIds.THJODSKRA,
    slug: InstitutionTypes.THJODSKRA,
  },
  [ApplicationTypes.GENERAL_FISHING_LICENSE]: {
    nationalId: InstitutionNationalIds.FISKISTOFA,
    slug: InstitutionTypes.FISKISTOFA,
  },
  [ApplicationTypes.P_SIGN]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
  },
  [ApplicationTypes.CRIMINAL_RECORD]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
  },
  [ApplicationTypes.FINANCIAL_AID]: {
    nationalId: InstitutionNationalIds.SAMBAND_SVEITARFELAGA,
    slug: InstitutionTypes.SAMBAND_SVEITARFELAGA,
  },
  [ApplicationTypes.DRIVING_INSTRUCTOR_REGISTRATIONS]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
  },
  [ApplicationTypes.EXAMPLE_PAYMENT]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.DRIVING_SCHOOL_CONFIRMATION]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
  },
  [ApplicationTypes.MORTGAGE_CERTIFICATE]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
  },
  [ApplicationTypes.NO_DEBT_CERTIFICATE]: {
    nationalId: InstitutionNationalIds.FJARSYSLA_RIKISINS,
    slug: InstitutionTypes.FJARSYSLA_RIKISINS,
  },
  [ApplicationTypes.FINANCIAL_STATEMENTS_INAO]: {
    nationalId: InstitutionNationalIds.RIKISENDURSKODUN,
    slug: InstitutionTypes.RIKISENDURSKODUN,
  },
  [ApplicationTypes.ANNOUNCEMENT_OF_DEATH]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
  },
  [ApplicationTypes.OPERATING_LICENSE]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
  },
  [ApplicationTypes.MARRIAGE_CONDITIONS]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
  },
  [ApplicationTypes.ESTATE]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
  },
  [ApplicationTypes.DRIVING_LICENSE_DUPLICATE]: {
    nationalId: InstitutionNationalIds.RIKISLOGREGLUSTJORI,
    slug: InstitutionTypes.RIKISLOGREGLUSTJORI,
  },
  [ApplicationTypes.ANONYMITY_IN_VEHICLE_REGISTRY]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
  },
  [ApplicationTypes.CHANGE_CO_OWNER_OF_VEHICLE]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
  },
  [ApplicationTypes.CHANGE_OPERATOR_OF_VEHICLE]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
  },
  [ApplicationTypes.DIGITAL_TACHOGRAPH_COMPANY_CARD]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
  },
  [ApplicationTypes.DIGITAL_TACHOGRAPH_DRIVERS_CARD]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
  },
  [ApplicationTypes.DIGITAL_TACHOGRAPH_WORKSHOP_CARD]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
  },
  [ApplicationTypes.LICENSE_PLATE_RENEWAL]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
  },
  [ApplicationTypes.ORDER_VEHICLE_LICENSE_PLATE]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
  },
  [ApplicationTypes.ORDER_VEHICLE_REGISTRATION_CERTIFICATE]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
  },
  [ApplicationTypes.TRANSFER_OF_VEHICLE_OWNERSHIP]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
  },
  [ApplicationTypes.DRIVING_LICENSE_BOOK_UPDATE_INSTRUCTOR]: {
    nationalId: InstitutionNationalIds.SAMGONGUSTOFA,
    slug: InstitutionTypes.SAMGONGUSTOFA,
  },
  [ApplicationTypes.ALCOHOL_TAX_REDEMPTION]: {
    nationalId: InstitutionNationalIds.STAFRAENT_ISLAND,
    slug: InstitutionTypes.STAFRAENT_ISLAND,
  },
  [ApplicationTypes.OLD_AGE_PENSION]: {
    nationalId: InstitutionNationalIds.TRYGGINGASTOFNUN,
    slug: InstitutionTypes.TRYGGINGASTOFNUN,
  },
  [ApplicationTypes.HOUSEHOLD_SUPPLEMENT]: {
    nationalId: InstitutionNationalIds.TRYGGINGASTOFNUN,
    slug: InstitutionTypes.TRYGGINGASTOFNUN,
  },
  [ApplicationTypes.CAR_RECYCLING]: {
    nationalId: InstitutionNationalIds.URVINNSLUSJODUR,
    slug: InstitutionTypes.URVINNSLUSJODUR,
  },
  [ApplicationTypes.SIGNATURE_LIST_CREATION]: {
    nationalId: InstitutionNationalIds.THJODSKRA,
    slug: InstitutionTypes.THJODSKRA,
  },
  [ApplicationTypes.SIGNATURE_LIST_SIGNING]: {
    nationalId: InstitutionNationalIds.THJODSKRA,
    slug: InstitutionTypes.THJODSKRA,
  },
  [ApplicationTypes.CITIZENSHIP]: {
    nationalId: InstitutionNationalIds.UTLENDINGASTOFNUN,
    slug: InstitutionTypes.UTLENDINGASTOFNUN,
  },
  [ApplicationTypes.ENERGY_FUNDS]: {
    nationalId: InstitutionNationalIds.ORKUSTOFNUN,
    slug: InstitutionTypes.ORKUSTOFNUN,
  },
  [ApplicationTypes.HEALTHCARE_LICENSE_CERTIFICATE]: {
    nationalId: InstitutionNationalIds.EMBAETTI_LANDLAEKNIS,
    slug: InstitutionTypes.EMBAETTI_LANDLAEKNIS,
  },
  [ApplicationTypes.HEALTHCARE_WORK_PERMIT]: {
    nationalId: InstitutionNationalIds.EMBAETTI_LANDLAEKNIS,
    slug: InstitutionTypes.EMBAETTI_LANDLAEKNIS,
  },
  [ApplicationTypes.TRANSFER_OF_MACHINE_OWNERSHIP]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
  },
  [ApplicationTypes.ADDITIONAL_SUPPORT_FOR_THE_ELDERLY]: {
    nationalId: InstitutionNationalIds.TRYGGINGASTOFNUN,
    slug: InstitutionTypes.TRYGGINGASTOFNUN,
  },
  [ApplicationTypes.PENSION_SUPPLEMENT]: {
    nationalId: InstitutionNationalIds.TRYGGINGASTOFNUN,
    slug: InstitutionTypes.TRYGGINGASTOFNUN,
  },
  [ApplicationTypes.CHANGE_MACHINE_SUPERVISOR]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
  },
  [ApplicationTypes.HOME_SUPPORT]: {
    nationalId: InstitutionNationalIds.SAMBAND_SVEITARFELAGA,
    slug: InstitutionTypes.SAMBAND_SVEITARFELAGA,
  },
  [ApplicationTypes.UNIVERSITY]: {
    nationalId: InstitutionNationalIds.HASKOLARADUNEYTI,
    slug: InstitutionTypes.HASKOLARADUNEYTI,
  },
  [ApplicationTypes.DEREGISTER_MACHINE]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
  },
  [ApplicationTypes.GRINDAVIK_HOUSING_BUYOUT]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
  },
  [ApplicationTypes.REQUEST_INSPECTION_FOR_MACHINE]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
  },
  [ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND]: {
    nationalId: InstitutionNationalIds.DOMSMALA_RADUNEYTID,
    slug: InstitutionTypes.DOMSMALARADUNEYTID,
  },
  [ApplicationTypes.ID_CARD]: {
    nationalId: InstitutionNationalIds.SYSLUMENN,
    slug: InstitutionTypes.SYSLUMENN,
  },
  [ApplicationTypes.HEALTH_INSURANCE_DECLARATION]: {
    nationalId: InstitutionNationalIds.SJUKRATRYGGINGAR_ISLANDS,
    slug: InstitutionTypes.SJUKRATRYGGINGAR_ISLANDS,
  },
  [ApplicationTypes.STREET_REGISTRATION]: {
    nationalId: InstitutionNationalIds.VINNUEFTIRLITID,
    slug: InstitutionTypes.VINNUEFTIRLITID,
  },
  [ApplicationTypes.NEW_PRIMARY_SCHOOL]: {
    nationalId: InstitutionNationalIds.MIDSTOD_MENNTUNAR_SKOLATHJONUSTU,
    slug: InstitutionTypes.MIDSTOD_MENNTUNAR_SKOLATHJONUSTU,
  },
}
