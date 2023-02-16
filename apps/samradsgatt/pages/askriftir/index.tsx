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
import Cases from '../../utils/dummydata/api/Cases'
import SubscriptionArray from '../../utils/dummydata/api/User/Subscriptions'
import Types from '../../utils/dummydata/api/Types'
import SubscriptionActionCard from '../../components/Card/SubscriptionActionCard'
import ChosenSubscriptionCard from '../../components/Card/ChosenSubscriptionCard'

const Subscriptions = () => {
  // user logged in logic needed
  const [loggedIn, setLoggedIn] = useState(false)
  // const [subscriptionEmail, setSubscriptionEmail] = useState('')

  const [currentTab, setCurrentTab] = useState('Mál')

  const [searchOptions, setSearchOptions] = useState<AsyncSearchOption[]>([])
  const [searchValue, setSearchValue] = useState('')
  const settingSearchValue = (val) => setSearchValue(val)
  const [prevSearchValue, setPrevSearchValue] = useState('')

  const [casesData, setCasesData] = useState(Cases)
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
  const [subscriptionArray, setSubscriptionArray] = useState(SubscriptionArray)
  const settingSubscriptionArray = (newSubscriptionArray) =>
    setSubscriptionArray(newSubscriptionArray)

  const [sortTitle, setSortTitle] = useState({
    Mál: 'Nýjast efst',
    Stofnanir: 'Nýjast efst',
    Málefnasvið: 'Nýjast efst',
  })
  const settingSortTitle = (obj) => setSortTitle(obj)

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
      id: 'Mál',
      label: 'Mál',
      content: (
        <TabContent
          data={casesData}
          setData={(newData) => setCasesData(newData)}
          currentTab={'Mál'}
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
      id: 'Stofnanir',
      label: 'Stofnanir',
      content: (
        <TabContent
          data={institutionsData}
          setData={(newData) => setInstitutionsData(newData)}
          currentTab={'Stofnanir'}
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
      id: 'Málefnasvið',
      label: 'Málefnasvið',
      content: (
        <TabContent
          data={policyAreasData}
          setData={(newData) => setPolicyAreasData(newData)}
          currentTab={'Málefnasvið'}
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
                          id: filteredItem.id,
                          area: 'Mál',
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
                    .filter((item) => institutionId === item.id)
                    .map((filteredItem) => (
                      <ChosenSubscriptionCard
                        data={{
                          name: filteredItem.name,
                          id: filteredItem.id,
                          area: 'Stofnanir',
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
                    .filter((item) => policyAreaId === item.id)
                    .map((filteredItem) => (
                      <ChosenSubscriptionCard
                        data={{
                          name: filteredItem.name,
                          id: filteredItem.id,
                          area: 'Málefnasvið',
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
