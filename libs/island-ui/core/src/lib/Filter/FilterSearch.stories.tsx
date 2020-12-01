import React, { useState } from 'react'
import { Checkbox } from '../Checkbox/Checkbox'
import { FilterGroup } from '../Filter/FilterGroup/FilterGroup'
import { Filter } from './FilterSearch'
import { theme } from '@island.is/island-ui/theme'

export default {
  title: 'Components/FilterSearch',
  component: Filter,
}

export const WithGroupedChildren = () => (
  <div>
    <Filter
      labelMobileButton="Search"
      labelMobileResultButton="View Results"
      labelMobileCloseButton="Filter"
    >
      <FilterGroup id="group1" label="Group number one">
        <Checkbox label="Include stuff" />
        <Checkbox
          label="Include and more stuff"
          tooltip="You never get to much stuff"
        />
      </FilterGroup>
      <FilterGroup id="group2" label="Group number two">
        <Checkbox label="I want animals" />
        <Checkbox label="I want material things" />
      </FilterGroup>
    </Filter>
  </div>
)

export const WithInputBox = () => {
  const [text, setText] = useState('')

  const onTextChange = (target) => {
    setText(target.value)
  }

  return (
    <div style={{ height: 400 }}>
      <Filter
        labelMobileButton="Search"
        labelMobileResultButton="View Results"
        labelMobileCloseButton="Filter"
        inputValues={{
          placeholder: 'Search',
          colored: false,
          isLoading: false,
          value: text,
          onChange: (event) => onTextChange(event.target.value),
        }}
      >
        <FilterGroup id="group1" label="Group number one">
          <Checkbox label="Include stuff" />
          <Checkbox
            label="Include and more stuff"
            tooltip="You never get to much stuff"
          />
        </FilterGroup>
        <FilterGroup id="group2" label="Group number two">
          <Checkbox label="I want animals" />
          <Checkbox label="I want material things" />
        </FilterGroup>
      </Filter>
    </div>
  )
}

export const WithInputClearButton = () => {
  const clearValues = () => {
    console.log('you, clear the values here')
  }

  return (
    <div style={{ height: 400 }}>
      <Filter
        labelMobileButton="Search"
        labelMobileResultButton="View Results"
        labelMobileCloseButton="Filter"
        clearValues={{
          text: 'Hreinsa',
          onClick: clearValues,
        }}
      >
        <FilterGroup id="group1" label="Group number one">
          <Checkbox label="Include stuff" />
          <Checkbox
            label="Include and more stuff"
            tooltip="You never get to much stuff"
          />
        </FilterGroup>
        <FilterGroup id="group2" label="Group number two">
          <Checkbox label="I want animals" />
          <Checkbox label="I want material things" />
        </FilterGroup>
      </Filter>
    </div>
  )
}

export const WithOnlyOneChild = () => (
  <div style={{ minHeight: 100 }}>
    <Filter
      labelMobileButton="Search"
      labelMobileResultButton="This button is displayed on top of all"
      labelMobileCloseButton="Filter"
    >
      <Checkbox label="Include stuff" />
    </Filter>
  </div>
)

export const DetailedExample = () => {
  const [searchString, setSearchString] = useState('')
  const [pricingFree, setPricingFree] = useState(false)
  const [pricingPaid, setPricingPaid] = useState(false)
  const [dataPublic, setDataPublic] = useState(false)
  const [dataPersonal, setDataPersonal] = useState(false)
  const [dataOfficial, setDataOfficial] = useState(false)
  const [dataHealth, setDataHealth] = useState(false)
  const [dataFinancial, setDataFinancial] = useState(false)
  const [typeRest, setTypeRest] = useState(false)
  const [typeSoap, setTypeSoap] = useState(false)

  const onSearchChange = function (inputValue: string) {
    setSearchString(inputValue)
  }

  const updateCategoryCheckBox = (target) => {
    const id: string = target.id
    switch (id) {
      case 'pricing-free':
        setPricingFree(target.checked)
        break
      case 'pricing-paid':
        setPricingPaid(target.checked)
        break
      case 'data-public':
        setDataPublic(target.checked)
        break
      case 'data-official':
        setDataOfficial(target.checked)
        break
      case 'data-personal':
        setDataPersonal(target.checked)
        break
      case 'data-health':
        setDataHealth(target.checked)
        break
      case 'data-financial':
        setDataFinancial(target.checked)
        break
      case 'type-rest':
        setTypeRest(target.checked)
        break
      case 'type-soap':
        setTypeSoap(target.checked)
        break
    }
  }

  const clearValues = () => {
    setSearchString('')
    setPricingFree(false)
    setPricingFree(false)
    setPricingPaid(false)
    setDataPublic(false)
    setDataOfficial(false)
    setDataPersonal(false)
    setDataHealth(false)
    setDataFinancial(false)
    setTypeRest(false)
    setTypeSoap(false)
  }

  return (
    <div style={{ height: 550, background: theme.color.blue100 }}>
      <Filter
        labelMobileButton="Sýna flokka"
        labelMobileCloseButton="Sía API vörulista"
        labelMobileResultButton={'Skoða niðurstöður'}
        inputValues={{
          placeholder: 'Search',
          colored: false,
          isLoading: false,
          value: searchString,
          onChange: (event) => onSearchChange(event.target.value),
        }}
        clearValues={{
          text: 'Hreinsa',
          onClick: clearValues,
        }}
      >
        <FilterGroup id="pricing_category" label="Pricing">
          <Checkbox
            id="pricing-free"
            name="pricing"
            label="Free"
            checked={pricingFree}
            onChange={({ target }) => {
              updateCategoryCheckBox(target)
            }}
          />
          <Checkbox
            id="pricing-paid"
            name="pricing"
            label="Paid"
            checked={pricingPaid}
            onChange={({ target }) => {
              updateCategoryCheckBox(target)
            }}
          />
        </FilterGroup>
        <FilterGroup id="data_category" label="Data">
          <Checkbox
            id="data-public"
            name="data"
            label="public"
            checked={dataPublic}
            onChange={({ target }) => {
              updateCategoryCheckBox(target)
            }}
          />
          <Checkbox
            id="data-official"
            name="data"
            label="Official"
            checked={dataOfficial}
            onChange={({ target }) => {
              updateCategoryCheckBox(target)
            }}
          />
          <Checkbox
            id="data-personal"
            name="data"
            label="Personal"
            checked={dataPersonal}
            onChange={({ target }) => {
              updateCategoryCheckBox(target)
            }}
          />
          <Checkbox
            id="data-health"
            name="data"
            label="Health"
            checked={dataHealth}
            onChange={({ target }) => {
              updateCategoryCheckBox(target)
            }}
          />
          <Checkbox
            id="data-financial"
            name="data"
            label="Financial"
            checked={dataFinancial}
            onChange={({ target }) => {
              updateCategoryCheckBox(target)
            }}
          />
        </FilterGroup>
        <FilterGroup id="type_category" label="Type">
          <Checkbox
            id="type-rest"
            name="type"
            label="Rest"
            checked={typeRest}
            onChange={({ target }) => {
              updateCategoryCheckBox(target)
            }}
          />
          <Checkbox
            id="type-soap"
            name="type"
            label="Soap"
            checked={typeSoap}
            onChange={({ target }) => {
              updateCategoryCheckBox(target)
            }}
          />
        </FilterGroup>
      </Filter>
    </div>
  )
}
