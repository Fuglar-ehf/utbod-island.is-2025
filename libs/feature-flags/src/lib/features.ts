export enum Features {
  testing = 'do-not-remove-for-testing-only',
  // Integrate auth-api with user-profile-api.
  userProfileClaims = 'shouldAuthApiReturnUserProfileClaims',

  // Application visibility flags
  exampleApplication = 'isExampleApplicationEnabled',
  accidentNotification = 'isAccidentNotificationEnabled',
  announcementOfDeath = 'isAnnouncementOfDeathEnabled',
  noDebtCertificate = 'applicationTemplateNoDebtCertificateEnabled',
  drivingInstructorRegistrations = 'isDrivingInstructorRegistrationsEnabled',
  drivingSchoolConfirmations = 'isDrivingSchoolConfirmationsEnabled',
  generalPetition = 'isGeneralPetitionEnabled',
  passportApplication = 'isPassportApplicationEnabled',
  financialStatementInao = 'financialStatementInao',
  inheritanceReport = 'isInheritanceReportApplicationEnabled',
  operatingLicense = 'isApplicationOperatingLicenseEnabled',
  marriageConditions = 'isMarriageConditionsApplicationEnabled',
  estateApplication = 'isEstateApplicationEnabled',
  drivingLicenseDuplicate = 'isDrivingLicenseDuplicateEnabled',
  transportAuthorityAnonymityInVehicleRegistry = 'isTransportAuthorityAnonymityInVehicleRegistryEnabled',
  transportAuthorityChangeCoOwnerOfVehicle = 'isTransportAuthorityChangeCoOwnerOfVehicleEnabled',
  transportAuthorityChangeOperatorOfVehicle = 'isTransportAuthorityChangeOperatorOfVehicleEnabled',
  transportAuthorityDigitalTachographCompanyCard = 'isTransportAuthorityDigitalTachographCompanyCardEnabled',
  transportAuthorityDigitalTachographDriversCard = 'isTransportAuthorityDigitalTachographDriversCardEnabled',
  transportAuthorityDigitalTachographWorkshopCard = 'isTransportAuthorityDigitalTachographWorkshopCardEnabled',
  transportAuthorityOrderVehicleLicensePlate = 'isTransportAuthorityOrderVehicleLicensePlateEnabled',
  transportAuthorityOrderVehicleRegistrationCertificate = 'isTransportAuthorityOrderVehicleRegistrationCertificateEnabled',
  transportAuthorityTransferOfVehicleOwnership = 'isTransportAuthorityTransferOfVehicleOwnershipEnabled',
  drivingLicenseBookUpdateInstructor = 'isDrivingLicenseBookUpdateInstructorEnabled',
  alcoholTaxRedemption = 'isAlcoholTaxRedemptionEnabled',

  // Application System Delegations active
  applicationSystemDelegations = 'applicationSystemDelegations',

  // Service portal modules
  servicePortalPetitionsModule = 'isServicePortalPetitionsModuleEnabled',
  servicePortalDrivingLessonsBookModule = 'isServicePortalDrivingLessonsBookModuleEnabled',
  servicePortalAirDiscountModule = 'isServicePortalAirDiscountModuleEnabled',
  sessionHistory = 'sessionHistory',

  // Application delegation flags
  applicationTemplatePublicDeptPaymentPlanAllowDelegation = 'applicationTemplatePublicDeptPaymentPlanAllowDelegation',
  transportAuthorityTransferOfVehicleOwnershipDelegations = 'applicationTransportAuthorityTransferOfVehicleOwnershipDelegations',
  transportAuthorityChangeCoOwnerOfVehicleDelegations = 'applicationTransportAuthorityChangeCoOwnerOfVehicleDelegations',
  transportAuthorityChangeOperatorOfVehicleDelegations = 'applicationTransportAuthorityChangeOperatorOfVehicleDelegations',
  transportAuthorityOrderVehicleLicensePlateDelegations = 'applicationTransportAuthorityOrderVehicleLicensePlateDelegations',
  transportAuthorityOrderVehicleRegistrationCertificateDelegations = 'applicationTransportAuthorityOrderVehicleRegistrationCertificateDelegations',
  mortgageCertificateDelegations = 'applicationMortgageCertificateDelegations',
}

export enum ServerSideFeature {
  testing = 'do-not-remove-for-testing-only',
  drivingLicense = 'driving-license-use-v1-endpoint-for-v2-comms',
}
