export enum HomeCircumstances {
  UNKNOWN = 'Unknown',
  WITHPARENTS = 'WithParents',
  WITHOTHERS = 'WithOthers',
  OWNPLACE = 'OwnPlace',
  REGISTEREDLEASE = 'RegisteredLease',
  OTHER = 'Other',
}

export enum Employment {
  WORKING = 'Working',
  UNEMPLOYED = 'Unemployed',
  CANNOTWORK = 'CannotWork',
  OTHER = 'Other',
}

export enum ApplicationState {
  NEW = 'New',
  INPROGRESS = 'InProgress',
  DATANEEDED = 'DataNeeded',
  REJECTED = 'Rejected',
  APPROVED = 'Approved',
}

export enum ApplicationStateUrl {
  NEW = 'New',
  INPROGRESS = 'InProgress',
  PROCESSED = 'Processed',
}

export enum ApplicationEventType {
  NEW = 'New',
  INPROGRESS = 'InProgress',
  DATANEEDED = 'DataNeeded',
  REJECTED = 'Rejected',
  APPROVED = 'Approved',
  STAFFCOMMENT = 'StaffComment',
  USERCOMMENT = 'UserComment',
  FILEUPLOAD = 'FileUpload',
}

export enum RolesRule {
  OSK = 'osk',
  VEITA = 'veita',
}

export enum ReturnUrl {
  APPLICATION = '/umsokn',
  MYPAGE = '/stada',
  ADMIN = '/nymal',
}

export enum FileType {
  TAXRETURN = 'TaxReturn',
  INCOME = 'Income',
  OTHER = 'Other',
}

export enum StaffRole {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
}
