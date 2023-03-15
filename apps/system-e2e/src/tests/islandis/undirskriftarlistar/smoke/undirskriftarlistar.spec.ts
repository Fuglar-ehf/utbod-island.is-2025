import { test } from '@playwright/test'
import { urls } from '../../../../support/urls'

test.use({ baseURL: urls.islandisBaseUrl })

test.describe('Undirskriftarlistar', () => {
  for (const { testCase } of [
    { testCase: 'Breyta og Eyða undirskriftalista sem admin - TBD' },
    { testCase: 'Búa til undirskriftalista /umsoknir/undirskriftalisti/' },
    { testCase: 'Skoða undirskriftalista /minarsidur/min-gogn/listar' },
    { testCase: 'Skrifa undir undirskriftalista /medmaelendalistar' },
  ]) {
    test.skip(testCase, () => {
      return
    })
  }
})
