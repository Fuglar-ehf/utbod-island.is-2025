import { useQuery } from '@apollo/client'
import {
  EmptyList,
  Heading,
  ListButton, TopLine
} from '@ui'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Animated, FlatList,
  Image, RefreshControl,
  View
} from 'react-native'
import {
  NavigationFunctionComponent
} from 'react-native-navigation'
import illustrationSrc from '../../assets/illustrations/le-company-s3.png'
import { BottomTabsIndicator } from '../../components/bottom-tabs-indicator/bottom-tabs-indicator'
import { client } from '../../graphql/client'
import { IArticleSearchResults } from '../../graphql/fragments/search.fragment'
import { ListApplicationsResponse, LIST_APPLICATIONS_QUERY } from '../../graphql/queries/list-applications.query'
import { LIST_SEARCH_QUERY } from '../../graphql/queries/list-search.query'
import { useActiveTabItemPress } from '../../hooks/use-active-tab-item-press'
import { useThemedNavigationOptions } from '../../hooks/use-themed-navigation-options'
import { openBrowser } from '../../lib/rn-island'
import { getRightButtons } from '../../utils/get-main-root'
import { testIDs } from '../../utils/test-ids'
import { ApplicationsModule } from '../home/applications-module'

const {
  useNavigationOptions,
  getNavigationOptions,
} = useThemedNavigationOptions(
  (theme, intl, initialized) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'applications.title' }),
      },
      searchBar: {
        visible: false,
      },
      rightButtons: initialized ? getRightButtons({ theme } as any) : [],
    },
    bottomTab: {
      iconColor: theme.color.blue400,
      text: initialized
        ? intl.formatMessage({ id: 'applications.bottomTabText' })
        : '',
    },
  }),
  {
    topBar: {
      largeTitle: {
        visible: true,
      },
      scrollEdgeAppearance: {
        active: true,
        noBorder: true,
      },
    },
    bottomTab: {
      testID: testIDs.TABBAR_TAB_APPLICATION,
      iconInsets: {
        bottom: -4,
      },
      icon: require('../../assets/icons/tabbar-application.png'),
      selectedIcon: require('../../assets/icons/tabbar-application-selected.png'),
    },
  },
)

export const ApplicationsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const SEARCH_QUERY_SIZE = 100
  const SEARCH_QUERY_TYPE = 'webArticle'
  const CONTENTFUL_FILTER = 'umsokn';
  const QUERY_STRING_DEFAULT = '*'

  const flatListRef = useRef<FlatList>(null)
  const [loading, setLoading] = useState(false)
  const intl = useIntl()
  const [items, setItems] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current

  const input = {
    queryString: QUERY_STRING_DEFAULT,
    types: [SEARCH_QUERY_TYPE],
    contentfulTags: [CONTENTFUL_FILTER],
    size: SEARCH_QUERY_SIZE,
    page: 1,
  }

  const res = useQuery(LIST_SEARCH_QUERY, {
    client,
    variables: {
      input,
    },
  })

  const applicationsRes = useQuery<ListApplicationsResponse>(
    LIST_APPLICATIONS_QUERY,
    { client },
  )

  useEffect(() => {
    if (!res.loading && res.data) {
      setItems([...res?.data?.searchResults?.items || []].sort((a: IArticleSearchResults, b: IArticleSearchResults) => a.title.localeCompare(b.title)) as any);
    }
  }, [res.data, res.loading])

  const renderItem = useCallback(({ item }) => {
    if (item.type === 'skeleton') {
      return (
        <ListButton title="skeleton" isLoading />
      )
    }

    if (item.type === 'empty') {
      return (
        <View style={{ marginTop: 80, paddingHorizontal: 16 }}>
          <EmptyList
            title={intl.formatMessage({ id: 'applications.emptyListTitle' })}
            description={intl.formatMessage({
              id: 'applications.emptyListDescription',
            })}
            image={<Image source={illustrationSrc} style={{ width: 176, height: 134, resizeMode: 'contain' }} />}
          />
        </View>
      )
    }

    return (
      <ListButton
        key={item.id}
        title={item.title}
        onPress={() =>
          openBrowser(`http://island.is/${item.slug}`, componentId)
        }
      />
    )
  }, [])

  useActiveTabItemPress(3, () => {
    flatListRef.current?.scrollToOffset({
      offset: -150,
      animated: true,
    })
  })

  const keyExtractor = useCallback((item: IArticleSearchResults) => item.id, [])

  const isFirstLoad = !res.data
  const isError = !!res.error
  const isLoading = res.loading
  const isEmpty = (items ?? []).length === 0
  const isSkeltonView = isLoading && isFirstLoad && !isError
  const isEmptyView = !loading && isEmpty

  const emptyItem = [{ id: '0', type: 'empty' }]
  const skeletonItems = Array.from({ length: 8 }).map((_, id) => ({
    id,
    type: 'skeleton',
  }))

  return (
    <>

      <Animated.FlatList
        ref={flatListRef}
        testID={testIDs.SCREEN_APPLICATIONS}
        scrollEventThrottle={16}
        scrollToOverflowEnabled={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
          },
        )}
        keyExtractor={keyExtractor}
        keyboardDismissMode="on-drag"
        data={isSkeltonView ? skeletonItems : isEmptyView ? emptyItem : items}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
          <ApplicationsModule
            applications={applicationsRes.data?.applicationApplications ?? []}
            loading={applicationsRes.loading}
            componentId={componentId}
            hideAction={true}
          />
          <View style={{ paddingHorizontal: 16 }}>
            <Heading>
              {intl.formatMessage({ id: 'home.allApplications' })}
            </Heading>
          </View>
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              setLoading(true)
              try {
                res
                  ?.refetch?.()
                  ?.then(() => {
                    setLoading(false)
                  })
                  .catch((err) => {
                    setLoading(false)
                  })
              } catch (err) {
                // noop
                setLoading(false)
              }
            }}
          />
        }
      />
      <BottomTabsIndicator index={3} total={5} />
      <TopLine scrollY={scrollY} />
    </>
  )
}

ApplicationsScreen.options = getNavigationOptions
