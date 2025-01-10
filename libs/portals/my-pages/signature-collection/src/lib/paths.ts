export enum SignatureCollectionPaths {
  RootPath = '/min-gogn/listar',
  GeneralPetitions = '/min-gogn/listar/undirskriftalistar',

  // Parliamentary
  SignatureCollectionParliamentaryLists = '/min-gogn/listar/althingis-medmaelasofnun',
  ViewParliamentaryList = '/min-gogn/listar/althingis-medmaelasofnun/:id',

  // Parliamentary - Company
  CompanySignatureCollectionParliamentaryLists = '/fyrirtaeki/listar/althingis-medmaelasofnun',
  CompanyViewParliamentaryList = '/fyrirtaeki/listar/althingis-medmaelasofnun/:id',

  // Presidential
  SignatureCollectionLists = '/min-gogn/listar/medmaelasofnun',
  ViewList = '/min-gogn/listar/medmaelasofnun/:id',
}
