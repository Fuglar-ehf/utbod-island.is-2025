export enum Features {
  // Integrate auth-api with user-profile-api.
  userProfileClaims = 'shouldAuthApiReturnUserProfileClaims',

  // Shows delegation picker in Identity Server and the Service Portal.
  delegationsEnabled = 'identityserverDelegationsEnabled',

  // Toggles the different kinds of delegations.
  customDelegations = 'isServicePortalAccessControlModuleEnabled',
  companyDelegations = 'identityserverCompanyDelegations',
  legalGuardianDelegations = 'identityserverLegalGuardianDelegations',
  personalRepresentativeDelegations = 'identityserverPersonalRepresentative',

  // Application visibility flags
  exampleApplication = 'isExampleApplicationEnabled',
  accidentNotification = 'isAccidentNotificationEnabled',
  announcementOfDeath = 'isAnnouncementOfDeathEnabled',
  noDebtCertificate = 'applicationTemplateNoDebtCertificateEnabled',
  drivingInstructorRegistrations = 'isDrivingInstructorRegistrationsEnabled',
  drivingSchoolConfirmations = 'isDrivingSchoolConfirmationsEnabled',
  passportApplication = 'isPassportApplicationEnabled',
  financialStatementInao = 'financialStatementInao',
  operatingLicense = 'isApplicationOperatingLicenseEnabled',
  marriageConditions = 'isMarriageConditionsApplicationEnabled',

  // Application System Delegations active
  applicationSystemDelegations = 'applicationSystemDelegations',
}

export enum ServerSideFeature {
  testing = 'do-not-remove-for-testing-only',
  drivingLicense = 'driving-license-use-v1-endpoint-for-v2-comms',
}
