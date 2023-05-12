import { setItem } from '../../utils/helpers/localStorage'
import { useDebounce } from '../../hooks'
import { Input } from '@island.is/island-ui/core'
import { BaseSyntheticEvent, useState } from 'react'
import { AdviceFilter, CaseFilter } from '../../types/interfaces'

interface Props {
  filters?: CaseFilter | AdviceFilter
  setFilters?: (arr: CaseFilter | AdviceFilter) => void
  searchValue?: string
  setSearchValue?: (str: string) => void
  name: string
  localStorageId?: string
  label?: string
  isSubscriptions?: boolean
  isDisabled?: boolean
}

export const DebouncedSearch = ({
  filters,
  setFilters,
  searchValue,
  setSearchValue,
  name,
  localStorageId,
  label = 'Leit',
  isSubscriptions,
  isDisabled,
}: Props) => {
  const [value, setValue] = useState(
    isSubscriptions ? searchValue : filters?.searchQuery,
  )

  const debouncedHandleSearch = useDebounce(() => {
    if (isSubscriptions) {
      setSearchValue(value)
    } else {
      const filtersCopy = { ...filters }
      filtersCopy.searchQuery = value
      filtersCopy.pageNumber = 0
      setItem({ key: localStorageId, value: filtersCopy })
      setFilters(filtersCopy)
    }
  }, 500)

  const onChange = (e: BaseSyntheticEvent) => {
    const searchValue = e.target.value
    setValue(searchValue)
    debouncedHandleSearch()
  }

  return (
    <Input
      name={name}
      label={label}
      size="xs"
      placeholder={
        isSubscriptions
          ? 'Leitaðu að máli, stofnun eða málefnasviði'
          : 'Að hverju ertu að leita?'
      }
      value={value}
      onChange={onChange}
      disabled={isDisabled}
    />
  )
}

export default DebouncedSearch
