import { ArrOfValueAndLabel, CaseFilter } from '../../types/interfaces'
import {
  AsyncSearch,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'

interface SearchAndFilterProps {
  PolicyAreas: Array<ArrOfValueAndLabel>
  defaultPolicyAreas: Array<number>
  Institutions: Array<ArrOfValueAndLabel>
  defaultInstitutions: Array<number>
  filters: CaseFilter
  setFilters: (arr: CaseFilter) => void
}

const SearchAndFilter = ({
  PolicyAreas,
  defaultPolicyAreas,
  Institutions,
  defaultInstitutions,
  filters,
  setFilters,
}: SearchAndFilterProps) => {
  const options = []

  const onChangeSearch = (value: string) => {
    const filtersCopy = { ...filters }
    filtersCopy.searchQuery = value
    setFilters(filtersCopy)
  }

  const onChange = (e, isInstitutions: boolean) => {
    const filtersCopy = { ...filters }
    if (isInstitutions) {
      filtersCopy.institutions = e ? [parseInt(e.value)] : defaultInstitutions
    } else {
      filtersCopy.policyAreas = e ? [parseInt(e.value)] : defaultPolicyAreas
    }
    setFilters(filtersCopy)
  }

  return (
    <>
      <Hidden below="lg">
        <GridContainer>
          <Box paddingY={4}>
            <GridRow>
              <GridColumn span={['8/12', '8/12', '6/12', '6/12', '6/12']}>
                <Stack space="none">
                  <Text
                    lineHeight="sm"
                    variant="eyebrow"
                    color="blue400"
                    paddingBottom="none"
                  >
                    Leit
                  </Text>
                  <div style={{ marginBottom: '6px' }} />
                  <AsyncSearch
                    label="Leit"
                    size="medium"
                    options={options}
                    placeholder="Að hverju ertu að leita?"
                    initialInputValue={filters.searchQuery}
                    inputValue={filters.searchQuery}
                    onInputValueChange={(value) => onChangeSearch(value)}
                  />
                </Stack>
              </GridColumn>
              <GridColumn span={['2/12', '2/12', '3/12', '3/12', '3/12']}>
                <Select
                  isSearchable
                  size="xs"
                  label="Málefnasvið"
                  name="policyAreas"
                  noOptionsMessage="Ekkert málefnasvið"
                  options={[...PolicyAreas].sort((a, b) =>
                    a.label.localeCompare(b.label),
                  )}
                  placeholder="Veldu málefnasvið"
                  onChange={(e) => onChange(e, false)}
                  isClearable
                  value={
                    filters.policyAreas.length === 1 &&
                    [...PolicyAreas].filter(
                      (item) => parseInt(item.value) === filters.policyAreas[0],
                    )
                  }
                />
              </GridColumn>
              <GridColumn span={['2/12', '2/12', '3/12', '3/12', '3/12']}>
                <Select
                  isSearchable
                  size="xs"
                  label="Stofnun"
                  name="institutions"
                  noOptionsMessage="Enginn stofnun"
                  options={[...Institutions].sort((a, b) =>
                    a.label.localeCompare(b.label),
                  )}
                  placeholder="Veldu stofnun"
                  onChange={(e) => onChange(e, true)}
                  value={
                    filters.institutions.length === 1 &&
                    [...Institutions].filter(
                      (item) =>
                        parseInt(item.value) === filters.institutions[0],
                    )
                  }
                  isClearable
                />
              </GridColumn>
            </GridRow>
          </Box>
        </GridContainer>
      </Hidden>
      <Hidden above={'md'}>
        <GridContainer>
          <Box paddingY={4}>
            <AsyncSearch
              colored
              label="Leit"
              size="medium"
              options={options}
              placeholder="Að hverju ertu að leita?"
              initialInputValue={filters.searchQuery}
              inputValue={filters.searchQuery}
              onInputValueChange={(value) => onChangeSearch(value)}
            />
          </Box>
        </GridContainer>
      </Hidden>
    </>
  )
}

export default SearchAndFilter
