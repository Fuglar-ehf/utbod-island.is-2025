export enum Area {
  case = 'Mál',
  institution = 'Stofnanir',
  policyArea = 'Málefnasvið',
}

export enum SortOptions {
  aToZ = 'Stafrófsröð',
  latest = 'Nýjast efst',
  oldest = 'Elst efst',
}

export enum SortOptionsAdvices {
  oldest = 'Elst efst',
  latest = 'Nýjast efst',
}

export enum CaseStatusFilterOptions {
  forReview = 'Til umsagnar',
  resultsInProgress = 'Niðurstöður í vinnslu',
  resultsPublished = 'Niðurstöður birtar',
}

export enum CaseTypesFilterOptions {
  draftBill = 'Drög að frumvarpi til laga',
  draftRegulation = 'Drög að reglugerð',
  draftPolicy = 'Drög að stefnu',
  positionAndOptions = 'Stöðumat og valkostir',
  other = 'Annað',
}

export enum CaseSortOptions {
  lastUpdated = 'Síðast uppfært',
  latestCases = 'Nýjast',
  adviceDeadline = 'Frestur að renna út',
}

export enum CaseSubscriptionType {
  AllChanges = 'Allar breytingar',
  StatusChanges = 'Breytingar á stöðu',
}

export enum SubscriptionType {
  AllChanges = 'Ný mál og breytingar',
  StatusChanges = 'Breytingar á stöðu',
  OnlyNew = 'Einungis ný mál',
}

export enum SubscriptionTypeKey {
  'Ný mál og breytingar' = 'AllChanges',
  'Breytingar á stöðu' = 'StatusChanges',
  'Einungis ný mál' = 'OnlyNew',
}
export enum SubscriptionDescriptionKey {
  'Ný mál og breytingar' = 'Tilkynningar um ný mál, breyttan umsagnarfrest, umsagnarfrest sem er að renna út og birtingu niðurstaðna',
  'Breytingar á stöðu' = 'StatusChanges',
  'Einungis ný mál' = 'Tilkynningar um ný mál',
}
