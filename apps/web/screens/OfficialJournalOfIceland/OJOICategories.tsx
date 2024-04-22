import { useCallback, useEffect, useMemo, useState } from 'react'
import { Locale } from 'locale'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  Divider,
  Inline,
  Input,
  LinkV2,
  Select,
  Stack,
  Table as T,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { debounceTime } from '@island.is/shared/constants'
import { getThemeConfig } from '@island.is/web/components'
import {
  ContentLanguage,
  OfficialJournalOfIcelandAdvertCategory,
  OfficialJournalOfIcelandAdvertEntity,
  OfficialJournalOfIcelandAdvertMainCategory,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryOfficialJournalOfIcelandCategoriesArgs,
  QueryOfficialJournalOfIcelandDepartmentsArgs,
  QueryOfficialJournalOfIcelandMainCategoriesArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  baseUrl,
  categoriesUrl,
  emptyOption,
  EntityOption,
  findValueOption,
  mapEntityToOptions,
  OJOIWrapper,
  removeEmptyFromObject,
  searchUrl,
  sortCategories,
  splitArrayIntoGroups,
} from '../../components/OfficialJournalOfIceland'
import { Screen } from '../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../queries'
import {
  CATEGORIES_QUERY,
  DEPARTMENTS_QUERY,
  MAIN_CATEGORIES_QUERY,
} from '../queries/OfficialJournalOfIceland'

type MalaflokkarType = Array<{
  letter: string
  categories: EntityOption[]
}>

const initialState = {
  q: '',
  stafur: '',
  deild: '',
  yfirflokkur: '',
}

const OJOICategoriesPage: Screen<OJOICategoriesProps> = ({
  mainCategories,
  categories,
  departments,
  organizationPage,
  organization,
  locale,
}) => {
  const router = useRouter()
  const { linkResolver } = useLinkResolver()
  useContentfulId(organizationPage?.id)

  const organizationNamespace = useMemo(() => {
    return JSON.parse(organization?.namespace?.fields || '{}')
  }, [organization?.namespace?.fields])

  const o = useNamespace(organizationNamespace)

  const [searchState, setSearchState] = useState(initialState)

  const categoriesOptions = mapEntityToOptions(categories)

  const sortedCategories = useMemo(() => {
    return sortCategories(categoriesOptions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesOptions])

  const filterCategories = useCallback(
    (initial?: boolean) => {
      const filtered: MalaflokkarType = []
      sortedCategories.forEach((cat) => {
        const letter = cat.label.slice(0, 1).toUpperCase()

        const qMatch =
          !initial && searchState.q
            ? cat.label.toLowerCase().includes(searchState.q.toLowerCase())
            : true
        const letterMatch =
          !initial && searchState.stafur
            ? searchState.stafur.split('').includes(letter)
            : true
        const deildMatch =
          !initial && searchState.deild
            ? cat.department === searchState.deild
            : true
        const flokkurMatch =
          !initial && searchState.yfirflokkur
            ? cat.mainCategory === searchState.yfirflokkur
            : true

        if (qMatch && letterMatch && deildMatch && flokkurMatch) {
          if (!filtered.find((f) => f.letter === letter)) {
            filtered.push({ letter, categories: [cat] })
          } else {
            filtered.find((f) => f.letter === letter)?.categories.push(cat)
          }
        }
      })

      return filtered
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [searchState, sortedCategories],
  )

  const initialCategories = useMemo(() => {
    return filterCategories(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedCategories])

  const [activeCategories, setCategories] = useState(initialCategories)

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search)
    setSearchState({
      q: searchParams.get('q') ?? '',
      stafur: searchParams.get('stafur') ?? '',
      deild: searchParams.get('deild') ?? '',
      yfirflokkur: searchParams.get('yfirflokkur') ?? '',
    })
  }, [])

  useEffect(() => {
    if (
      searchState.q ||
      searchState.stafur ||
      searchState.deild ||
      searchState.yfirflokkur
    ) {
      setCategories(filterCategories())
    } else {
      setCategories(initialCategories)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState])

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: organizationPage?.title ?? '',
      href: linkResolver(
        'organizationpage',
        [organizationPage?.slug ?? ''],
        locale,
      ).href,
    },
    {
      title: 'Málaflokkar',
    },
  ]

  const updateSearchParams = useMemo(() => {
    return debounce((state: Record<string, string>) => {
      router.replace(
        categoriesUrl,
        {
          query: removeEmptyFromObject(state),
        },
        { shallow: true },
      )
    }, debounceTime.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateSearchState = (key: string, value: string) => {
    const newState = {
      ...searchState,
      [key]: value,
    }
    setSearchState(newState)
    updateSearchParams(newState)
  }

  const toggleLetter = (letter: string) => {
    let letters = searchState.stafur.split('')
    if (letters.includes(letter)) {
      letters = letters.filter((l) => l !== letter)
    } else {
      letters.push(letter)
    }
    updateSearchState('stafur', letters.join(''))
  }

  const resetFilter = () => {
    setSearchState(initialState)
    updateSearchParams(initialState)
  }

  const departmentsOptions = mapEntityToOptions(departments)
  const mainCategoriesOptions = mapEntityToOptions(mainCategories)

  return (
    <OJOIWrapper
      pageTitle={o('categoriesTitle', 'Málaflokkar Stjórnartíðinda')}
      pageDescription={organizationPage?.description}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      organizationPage={organizationPage!}
      pageFeaturedImage={organizationPage?.featuredImage ?? undefined}
      goBackUrl={baseUrl}
      sidebarContent={
        <Box
          component="form"
          background="blue100"
          padding={[2, 2, 3]}
          borderRadius="large"
          action={categoriesUrl}
        >
          <Stack space={[1, 1, 2]}>
            <Text variant="h4">Leit</Text>

            <Input
              name="q"
              placeholder={o('categoriesSearchPlaceholder', 'Leit í flokkum')}
              size="xs"
              value={searchState.q}
              onChange={(e) => updateSearchState('q', e.target.value)}
            />

            <Divider weight={'blueberry200'} />

            <Box display="flex" justifyContent={'spaceBetween'}>
              <Text variant="h4">{o('categoriesFilterTitle', 'Síun')}</Text>
              <Button
                type="button"
                as="button"
                variant="text"
                onClick={resetFilter}
                size="small"
              >
                {o('categoriesClearFilter', 'Hreinsa síun')}
              </Button>
            </Box>

            <Select
              name="deild"
              label={o('categoriesDepartmentLabel', 'Deild')}
              size="xs"
              placeholder={o('categoriesDepartmentPlaceholder', 'Veldu deild')}
              options={[
                { ...emptyOption('Allar deildir') },
                ...departmentsOptions,
              ]}
              isClearable
              value={findValueOption(departmentsOptions, searchState.deild)}
              onChange={(v) => updateSearchState('deild', v?.value ?? '')}
            />

            <Select
              name="yfirflokkur"
              label={o('categoriesMainCategoryLabel', 'Yfirflokkur')}
              size="xs"
              placeholder={o(
                'categoriesMainCategoryPlaceholder',
                'Veldu yfirflokk',
              )}
              options={[
                { ...emptyOption('Allir flokkar') },
                ...mainCategoriesOptions,
              ]}
              isClearable
              value={findValueOption(
                mainCategoriesOptions,
                searchState.yfirflokkur,
              )}
              onChange={(v) => updateSearchState('yfirflokkur', v?.value ?? '')}
            />
          </Stack>
        </Box>
      }
      breadcrumbItems={breadcrumbItems}
    >
      <Stack space={[3, 4, 6]}>
        <Inline space={1}>
          {initialCategories.map((c) => (
            <Tag
              key={c.letter}
              active={searchState.stafur.includes(c.letter)}
              onClick={() => {
                toggleLetter(c.letter)
              }}
              variant={
                searchState.stafur.includes(c.letter)
                  ? 'blue'
                  : !activeCategories.find((cat) => cat.letter === c.letter)
                  ? 'disabled'
                  : 'white'
              }
              outlined={searchState.stafur.includes(c.letter) ? false : true}
            >
              {'\u00A0'}
              {c.letter}
              {'\u00A0'}
            </Tag>
          ))}
        </Inline>
        {activeCategories.length === 0 ? (
          <p>
            {o(
              'categoriesNotFoundMessage',
              'Ekkert fannst fyrir þessi leitarskilyrði',
            )}
          </p>
        ) : (
          activeCategories.map((c) => {
            const groups = splitArrayIntoGroups(c.categories, 3)
            return (
              <T.Table key={c.letter}>
                <T.Head>
                  <T.Row>
                    <T.HeadData colSpan={3}>{c.letter}</T.HeadData>
                  </T.Row>
                </T.Head>
                <T.Body>
                  {groups.map((group) => (
                    <T.Row key={group[0].label}>
                      {group.map((cat) => (
                        <T.Data key={cat.label}>
                          <LinkV2
                            color="blue400"
                            underline={'normal'}
                            underlineVisibility="always"
                            href={`${searchUrl}?malaflokkur=${cat.value}`}
                          >
                            {cat.label}
                          </LinkV2>
                        </T.Data>
                      ))}
                    </T.Row>
                  ))}
                </T.Body>
              </T.Table>
            )
          })
        )}
      </Stack>
    </OJOIWrapper>
  )
}

interface OJOICategoriesProps {
  mainCategories?: OfficialJournalOfIcelandAdvertMainCategory[]
  categories?: Array<OfficialJournalOfIcelandAdvertCategory>
  departments?: Array<OfficialJournalOfIcelandAdvertEntity>
  organizationPage?: Query['getOrganizationPage']
  organization?: Query['getOrganization']
  namespace: Record<string, string>
  locale: Locale
}

const OJOICategories: Screen<OJOICategoriesProps> = ({
  mainCategories,
  departments,
  categories,
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
  return (
    <OJOICategoriesPage
      mainCategories={mainCategories}
      categories={categories}
      departments={departments}
      namespace={namespace}
      organizationPage={organizationPage}
      organization={organization}
      locale={locale}
    />
  )
}

OJOICategories.getProps = async ({ apolloClient, locale }) => {
  const organizationSlug = 'stjornartidindi'

  const [
    {
      data: { officialJournalOfIcelandMainCategories },
    },
    {
      data: { officialJournalOfIcelandCategories },
    },
    {
      data: { officialJournalOfIcelandDepartments },
    },
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganization },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryOfficialJournalOfIcelandMainCategoriesArgs>({
      query: MAIN_CATEGORIES_QUERY,
      variables: {
        params: {
          search: '',
        },
      },
    }),
    apolloClient.query<Query, QueryOfficialJournalOfIcelandCategoriesArgs>({
      query: CATEGORIES_QUERY,
      variables: {
        params: {
          search: '',
        },
      },
    }),
    apolloClient.query<Query, QueryOfficialJournalOfIcelandDepartmentsArgs>({
      query: DEPARTMENTS_QUERY,
      variables: {
        params: {
          search: '',
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OrganizationPages',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables?.data?.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationPage && !getOrganization?.hasALandingPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    mainCategories: officialJournalOfIcelandMainCategories?.mainCategories,
    categories: officialJournalOfIcelandCategories?.categories,
    departments: officialJournalOfIcelandDepartments?.departments,
    organizationPage: getOrganizationPage,
    organization: getOrganization,
    namespace,
    locale: locale as Locale,
    showSearchInHeader: false,
    ...getThemeConfig(
      getOrganizationPage?.theme ?? 'landing_page',
      getOrganization ?? getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(OJOICategories)
