import {
  AsyncSearchOption,
  Box,
  Breadcrumbs,
  Divider,
  GridContainer,
  ResponsiveSpace,
  Tabs,
  Text,
} from '@island.is/island-ui/core'
import TabContent from '../../components/Tab/TabContent'
import { useEffect, useState } from 'react'
import { Layout } from '../../components/Layout/Layout'
import { Cases, SubscriptionsArray, Types } from '../../utils/dummydata'
import {
  SubscriptionActionCard,
  ChosenSubscriptionCard,
} from '../../components/Card'
import { Area } from '../../types/enums'
import {
  ArrOfIdAndName,
  Case,
  SortTitle,
  SubscriptionArray,
} from '../../types/interfaces'

const Subscriptions = () => {
  // user logged in logic needed
  const [loggedIn, setLoggedIn] = useState(false)
  // const [subscriptionEmail, setSubscriptionEmail] = useState('')

  const [currentTab, setCurrentTab] = useState<string>('Mál')

  const [searchOptions, setSearchOptions] = useState<AsyncSearchOption[]>([])
  const [searchValue, setSearchValue] = useState<string>('')
  const settingSearchValue = (val: string) => setSearchValue(val)
  const [prevSearchValue, setPrevSearchValue] = useState<string>('')

  const [casesData, setCasesData] = useState<Array<Case>>(Cases)
  const Institutions = Object.entries(Types.institutions).map(([id, name]) => ({
    id,
    name,
  }))
  const [institutionsData, setInstitutionsData] = useState(
    Object.entries(Types.institutions).map(([id, name]) => ({
      id,
      name,
    })),
  )
  const PolicyAreas = Object.entries(Types.policyAreas).map(([id, name]) => ({
    id,
    name,
  }))
  const [policyAreasData, setPolicyAreasData] = useState(
    Object.entries(Types.policyAreas).map(([id, name]) => ({
      id,
      name,
    })),
  )
  const [subscriptionArray, setSubscriptionArray] = useState<SubscriptionArray>(
    SubscriptionsArray,
  )
  const settingSubscriptionArray = (newSubscriptionArray: SubscriptionArray) =>
    setSubscriptionArray(newSubscriptionArray)

  const [sortTitle, setSortTitle] = useState<SortTitle>({
    Mál: 'Nýjast efst',
    Stofnanir: 'Nýjast efst',
    Málefnasvið: 'Nýjast efst',
  })
  const settingSortTitle = (obj: SortTitle) => setSortTitle(obj)

  const paddingYBreadCrumbs = [3, 3, 3, 5] as ResponsiveSpace
  const paddingXContent = [0, 0, 0, 15] as ResponsiveSpace
  const paddingXTable = [0, 0, 0, 15] as ResponsiveSpace

  const clearAll = () => {
    setSearchOptions([])
    setCasesData(Cases)
    setInstitutionsData(Institutions)
    setPolicyAreasData(PolicyAreas)
  }

  useEffect(() => {
    if (searchValue == prevSearchValue) {
      return
    }
    if (!searchValue) {
      clearAll()
    } else {
      const filteredCases = Cases.filter(
        (item) =>
          item.name.includes(searchValue) ||
          item.caseNumber.includes(searchValue) ||
          item.institutionName.includes(searchValue) ||
          item.policyAreaName.includes(searchValue),
      )
      setCasesData(filteredCases)
      const filteredInstitutions = Institutions.filter((item) =>
        item.name.includes(searchValue),
      )
      setInstitutionsData(filteredInstitutions)
      const filteredPolicyAreas = PolicyAreas.filter((item) =>
        item.name.includes(searchValue),
      )
      setPolicyAreasData(filteredPolicyAreas)
      setPrevSearchValue(searchValue)
    }
  }, [searchValue, Institutions, PolicyAreas, prevSearchValue])

  const tabs = [
    {
      id: Area.case,
      label: Area.case,
      content: (
        <TabContent
          data={casesData}
          setData={(newData: Array<Case>) => setCasesData(newData)}
          currentTab={Area.case}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={settingSubscriptionArray}
          searchOptions={searchOptions}
          searchValue={searchValue}
          setSearchValue={settingSearchValue}
          searchPlaceholder={'Leitaðu að máli, stofnun eða málefnasviði'}
          sortTitle={sortTitle}
          setSortTitle={settingSortTitle}
        />
      ),
      disabled: false,
    },
    {
      id: Area.institution,
      label: Area.institution,
      content: (
        <TabContent
          data={institutionsData}
          setData={(newData: Array<ArrOfIdAndName>) =>
            setInstitutionsData(newData)
          }
          currentTab={Area.institution}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={settingSubscriptionArray}
          searchOptions={searchOptions}
          searchValue={searchValue}
          setSearchValue={settingSearchValue}
          searchPlaceholder={'Leitaðu að máli, stofnun eða málefnasviði'}
          sortTitle={sortTitle}
          setSortTitle={settingSortTitle}
        />
      ),
      disabled: false,
    },
    {
      id: Area.policyArea,
      label: Area.policyArea,
      content: (
        <TabContent
          data={policyAreasData}
          setData={(newData: Array<ArrOfIdAndName>) =>
            setPolicyAreasData(newData)
          }
          currentTab={Area.policyArea}
          subscriptionArray={subscriptionArray}
          setSubscriptionArray={settingSubscriptionArray}
          searchOptions={searchOptions}
          searchValue={searchValue}
          setSearchValue={settingSearchValue}
          searchPlaceholder={'Leitaðu að máli, stofnun eða málefnasviði'}
          sortTitle={sortTitle}
          setSortTitle={settingSortTitle}
        />
      ),
      disabled: false,
    },
  ]

  const subscriptionArrayIsEmpty = () => {
    if (
      subscriptionArray.caseIds.length === 0 &&
      subscriptionArray.institutionIds.length === 0 &&
      subscriptionArray.policyAreaIds.length === 0
    ) {
      return true
    }
    return false
  }

  return (
    <Layout>
      <Divider />
      <Box background="blue100">
        <GridContainer>
          <Box paddingY={paddingYBreadCrumbs}>
            <Breadcrumbs
              items={[
                { title: 'Samráðsgátt', href: '/samradsgatt' },
                { title: 'Mínar áskriftir ', href: '/samradsgatt/askriftir' },
                { title: currentTab },
              ]}
            />
          </Box>
          <Box paddingX={paddingXContent} paddingBottom={3}>
            <Text variant="h1" color="dark400">
              {'Áskriftir'}
            </Text>
          </Box>
          <Box paddingX={paddingXContent} paddingBottom={5}>
            <Text variant="default">
              {
                'Hér er hægt að skrá sig í áskrift að málum. Þú skráir þig inn á Ísland.is, \
                        hakar við einn eða fleiri flokka, velur hvort þú vilt tilkynningar um ný mál \
                        eða fleiri atriði og smellir á „Staðfesta“. ferð svo og staðfestir áskriftina \
                        í gegnum tölvupóstfangið sem þú varst að skrá.'
              }
            </Text>
            <Text variant="default" paddingTop={2}>
              {'Kerfið er uppfært einu sinni á sólarhring.'}
            </Text>
          </Box>
          <Box paddingX={paddingXTable} paddingBottom={2}>
            {loggedIn ? (
              <SubscriptionActionCard
                userIsLoggedIn={true}
                heading="Skrá áskrift"
                text="Skráðu netfang hérna og svo hefst staðfestingaferlið. Þú færð tölvupóst sem þú þarft að staðfesta til að áskriftin taki gildi."
                button={{
                  label: 'Skrá áskrift',
                  onClick: () => setLoggedIn(false),
                }}
                input={{
                  name: 'subscriptionEmail',
                  label: 'Netfang',
                  placeholder: 'Hér skal skrifa netfang',
                }}
              />
            ) : (
              <SubscriptionActionCard
                userIsLoggedIn={false}
                heading="Skrá áskrift"
                text="Þú verður að vera skráð(ur) inn til þess að geta skráð þig í áskrift."
                button={{
                  label: 'Skrá mig inn',
                  onClick: () => setLoggedIn(true),
                }}
              />
            )}
          </Box>
          {!subscriptionArrayIsEmpty() && (
            <Box paddingX={paddingXTable} paddingBottom={3}>
              <Text paddingBottom={1} variant="eyebrow">
                Valin mál
              </Text>
              {subscriptionArray.caseIds.length !== 0 &&
                subscriptionArray.caseIds.map((caseId) => {
                  const chosen = casesData
                    .filter((item) => caseId === item.id)
                    .map((filteredItem) => (
                      <ChosenSubscriptionCard
                        data={{
                          name: filteredItem.name,
                          caseNumber: filteredItem.caseNumber,
                          id: filteredItem.id.toString(),
                          area: Area.case,
                        }}
                        subscriptionArray={subscriptionArray}
                        setSubscriptionArray={settingSubscriptionArray}
                        key={`case-${caseId}`}
                      />
                    ))
                  return chosen
                })}
              {subscriptionArray.institutionIds.length !== 0 &&
                subscriptionArray.institutionIds.map((institutionId) => {
                  const chosen = institutionsData
                    .filter((item) => institutionId.toString() === item.id)
                    .map((filteredItem) => (
                      <ChosenSubscriptionCard
                        data={{
                          name: filteredItem.name,
                          id: filteredItem.id,
                          area: Area.institution,
                        }}
                        subscriptionArray={subscriptionArray}
                        setSubscriptionArray={settingSubscriptionArray}
                        key={`institution-${institutionId}`}
                      />
                    ))
                  return chosen
                })}
              {subscriptionArray.policyAreaIds.length !== 0 &&
                subscriptionArray.policyAreaIds.map((policyAreaId) => {
                  const chosen = policyAreasData
                    .filter((item) => policyAreaId.toString() === item.id)
                    .map((filteredItem) => (
                      <ChosenSubscriptionCard
                        data={{
                          name: filteredItem.name,
                          id: filteredItem.id,
                          area: Area.policyArea,
                        }}
                        subscriptionArray={subscriptionArray}
                        setSubscriptionArray={settingSubscriptionArray}
                        key={`policyArea-${policyAreaId}`}
                      />
                    ))
                  return chosen
                })}
            </Box>
          )}
        </GridContainer>
      </Box>
      <GridContainer>
        <Box paddingX={paddingXTable} paddingTop={3}>
          <Tabs
            selected={currentTab}
            onlyRenderSelectedTab={true}
            label="Veldu tegund áskrifta"
            tabs={tabs}
            contentBackground="transparent"
            onChange={(e) => setCurrentTab(e)}
          />
        </Box>
      </GridContainer>
    </Layout>
  )
}

export default Subscriptions
