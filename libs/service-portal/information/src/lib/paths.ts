export enum InformationPaths {
  MyInfoRoot = '/min-gogn',
  MyInfoRootOverview = '/min-gogn/yfirlit',
  Child = '/min-gogn/yfirlit/barn/:nationalId',
  FamilyMember = '/min-gogn/yfirlit/:nationalId',
  Spouse = '/min-gogn/yfirlit/maki/:nationalId',
  UserInfo = '/min-gogn/yfirlit/minar-upplysingar',
  Petitions = '/min-gogn/listar/',
  PetitionList = '/min-gogn/listar/:listId',
  PetitionListOwned = '/min-gogn/listar/minn-listi/:listId',
  Company = '/fyrirtaeki',
}
