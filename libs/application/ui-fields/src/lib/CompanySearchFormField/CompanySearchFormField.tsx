import { gql, useLazyQuery } from '@apollo/client'
import {
  CompanySearchField,
  FieldBaseProps,
  formatText,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import debounce from 'lodash/debounce'
import React, { FC, useMemo, useState } from 'react'
import { CompanySearchItem } from './CompanySearchItem'
import kennitala from 'kennitala'
import { CompanySearchController } from '@island.is/shared/form-fields'

export const COMPANY_REGISTRY_COMPANIES = gql`
  query SearchCompanies($input: RskCompanyInfoSearchInput!) {
    companyRegistryCompanies(input: $input) {
      data {
        name
        nationalId
      }
    }
  }
`

const mockCompanies = [
  {
    status: '',
    nationalId: '6605101090',
    name: 'Málflutningsstofa Reykjavík ehf',
  },
  { status: '', nationalId: '6712061500', name: 'NóNó ehf.' },
  { status: '', nationalId: '6104080520', name: 'Orkuskólinn Reyst hf.' },
  { status: '', nationalId: '4612101470', name: 'Reyk Tour ehf.' },
  {
    status: '',
    nationalId: '5301992159',
    name: 'Reyk- og eldþéttingar ehf.',
  },
  { status: '', nationalId: '5208051170', name: 'Reyka ehf' },
  { status: '', nationalId: '4508140670', name: 'Reykavik Records ehf.' },
  { status: '', nationalId: '4102050250', name: 'Reykdalsfélagið' },
  { status: '', nationalId: '5806090310', name: 'Reykfiskur ehf.' },
  { status: '', nationalId: '6701120630', name: 'Reykfjörð ehf.' },
  { status: '', nationalId: '4801070710', name: 'Reykholt ehf.' },
  { status: '', nationalId: '5302694509', name: 'Reykholtskirkja' },
  { status: '', nationalId: '4905080310', name: 'Reykholtskirkjugarður' },
  { status: '', nationalId: '6010992179', name: 'Reykholtskórinn' },
  { status: '', nationalId: '4401800789', name: 'Reykholtslaug' },
  { status: '', nationalId: '6901181490', name: 'Reykholtsorka ehf.' },
  { status: '', nationalId: '5007790479', name: 'Reykholtsstaður' },
  { status: '', nationalId: '6408050210', name: 'Reykholtsstaður ehf.' },
  { status: '', nationalId: '4407872589', name: 'Reykhólahreppur' },
  { status: '', nationalId: '5302696049', name: 'Reykhólakirkja' },
  { status: '', nationalId: '5003200870', name: 'Reykhólar hses.' },
  { status: '', nationalId: '5906730489', name: 'Reykhólaskóli' },
  { status: '', nationalId: '5912081440', name: 'Reykhóll ehf' },
  { status: '', nationalId: '4607201920', name: 'Reykhóll-land ehf.' },
  { status: '', nationalId: '5705051220', name: 'Reykhús ehf.' },
  { status: '', nationalId: '5410090430', name: 'Reykhúsið Reykhólar ehf.' },
  { status: '', nationalId: '5012070390', name: 'Reykhúsið Útey ehf' },
  {
    status: '',
    nationalId: '6610131920',
    name: 'Reykir fasteignafélag ehf.',
  },
  {
    status: '',
    nationalId: '6206161410',
    name: 'Reykjaborg fjárfestingar ehf.',
  },
  { status: '', nationalId: '5811872549', name: 'Reykjabúið ehf.' },
  { status: '', nationalId: '5605140340', name: 'Reykjadalsfélagið slf.' },
  { status: '', nationalId: '6504171430', name: 'Reykjadalur ehf.' },
  { status: '', nationalId: '7105022420', name: 'Reykjaeignir ehf.' },
  { status: '', nationalId: '5302696559', name: 'Reykjafell ehf.' },
  { status: '', nationalId: '4511190440', name: 'Reykjafoss ehf.' },
  { status: '', nationalId: '6509032180', name: 'Reykjagarður hf.' },
  { status: '', nationalId: '6905012360', name: 'Reykjahlíð 10,húsfélag' },
  { status: '', nationalId: '5304992009', name: 'Reykjahlíð 12,húsfélag' },
  { status: '', nationalId: '6801110300', name: 'Reykjahlíð 14,húsfélag' },
  { status: '', nationalId: '4410871289', name: 'Reykjahlíð 8,húsfélag' },
  { status: '', nationalId: '4401691399', name: 'Reykjahlíðarskóli' },
  { status: '', nationalId: '5302696399', name: 'Reykjahlíðarsókn' },
  { status: '', nationalId: '5410140200', name: 'Reykjahvoll ehf.' },
  { status: '', nationalId: '6309151470', name: 'Reykjaháls ehf.' },
  { status: '', nationalId: '5312071220', name: 'Reykjahöfði ehf.' },
  { status: '', nationalId: '5302696129', name: 'Reykjakirkja' },
  { status: '', nationalId: '6905080600', name: 'Reykjakirkjugarður' },
  { status: '', nationalId: '6302002960', name: 'Reykjalaug ehf.' },
  { status: '', nationalId: '5712201480', name: 'Reykjalind ehf.' },
  {
    status: '',
    nationalId: '6104200790',
    name: 'Reykjalundur endurhæfing ehf.',
  },
]

interface Props extends FieldBaseProps {
  field: CompanySearchField
}

export const CompanySearchFormField: FC<Props> = ({ application, field }) => {
  const {
    id,
    title,
    placeholder,
    setLabelToDataSchema = true,
    useMockOptions = false,
  } = field
  const { formatMessage } = useLocale()

  const [searchQuery, setSearchQuery] = useState('')
  const [mockData, setMockData] = useState(mockCompanies)

  const [search, { loading, data }] = useLazyQuery(COMPANY_REGISTRY_COMPANIES)

  const defaultAnswer = { value: '', label: '' }
  const initialValue = (application.answers[id] || { ...defaultAnswer }) as {
    value: string
    label: string
  }

  const debouncer = useMemo(() => {
    return debounce(search, 0.5)
  }, [search])

  // Validations
  const noResultsFound =
    data?.companyRegistryCompanies?.data?.length === 0 &&
    !loading &&
    searchQuery.trim().length > 0
  const invalidNationalId =
    !kennitala.isValid(searchQuery) && !loading && searchQuery.length === 10

  const onInputChange = (inputValue: string) => {
    setSearchQuery(inputValue)
    if (useMockOptions) {
      let data = mockCompanies.filter(
        (x) =>
          x.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          x.nationalId.includes(inputValue),
      )
      if (!inputValue) {
        data = []
      }
      setMockData(data)
    } else
      debouncer({
        variables: {
          input: {
            searchTerm: inputValue,
            first: 100,
          },
        },
      })
  }

  const getSearchOptions = (
    query: string,
    response: { data: { name: string; nationalId: string }[] } = { data: [] },
  ) => {
    const { data } = response
    const options = data?.map(({ name, nationalId }) => ({
      label: name,
      value: nationalId,
      component: (props: any) => (
        <CompanySearchItem
          {...props}
          key={`${name}-${nationalId}`}
          name={name}
          nationalId={nationalId}
          query={query}
        />
      ),
    }))
    return options || []
  }

  return (
    <Box marginTop={[2, 4]}>
      <CompanySearchController
        invalidNationalIdError={invalidNationalId}
        noResultsFound={noResultsFound && !invalidNationalId}
        id={id}
        defaultValue={initialValue}
        name={id}
        label={formatText(title, application, formatMessage)}
        loading={loading}
        options={getSearchOptions(
          searchQuery,
          useMockOptions ? { data: mockData } : data?.companyRegistryCompanies,
        )}
        placeholder={
          placeholder !== undefined
            ? formatText(placeholder as string, application, formatMessage)
            : undefined
        }
        initialInputValue={initialValue.label}
        inputValue={searchQuery}
        colored
        onInputChange={onInputChange}
        setLabelToDataSchema={setLabelToDataSchema}
      />
    </Box>
  )
}
