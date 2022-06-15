import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  ReactElement,
  useReducer,
} from 'react'
import Downshift from 'downshift'
import { useMeasure } from 'react-use'
import { useRouter } from 'next/router'
import { useApolloClient } from '@apollo/client/react'
import {
  GET_SEARCH_RESULTS_QUERY,
  GET_SEARCH_AUTOCOMPLETE_TERM_QUERY,
} from '@island.is/web/screens/queries'
import {
  AsyncSearchInput,
  AsyncSearchSizes,
  Box,
  Text,
  Stack,
  Link,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  GetSearchResultsQuery,
  QuerySearchResultsArgs,
  ContentLanguage,
  QueryWebSearchAutocompleteArgs,
  AutocompleteTermResultsQuery,
  Article,
  SubArticle,
  SearchableContentTypes,
  LifeEventPage,
  News,
} from '@island.is/web/graphql/schema'

import * as styles from './SearchInput.css'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { TestSupport } from '@island.is/island-ui/utils'

const DEBOUNCE_TIMER = 150
const STACK_WIDTH = 400

type SearchState = {
  term: string
  results?: GetSearchResultsQuery['searchResults']
  suggestions: string[]
  prefix: string
  isLoading: boolean
}

const isEmpty = ({ results, suggestions }: SearchState): boolean =>
  suggestions?.length === 0 && (results?.total ?? 0) === 0

const initialSearchState: Readonly<SearchState> = {
  term: '',
  suggestions: [],
  prefix: '',
  isLoading: false,
}

const searchReducer = (state, action): SearchState => {
  switch (action.type) {
    case 'startLoading': {
      return { ...state, isLoading: true }
    }
    case 'suggestions': {
      return { ...state, suggestions: action.suggestions }
    }
    case 'searchResults': {
      return { ...state, results: action.results, isLoading: false }
    }
    case 'searchString': {
      return { ...state, term: action.term, prefix: action.prefix }
    }
    case 'reset': {
      return initialSearchState
    }
  }
}

const useSearch = (
  locale: Locale,
  term?: string,
  autocomplete?: boolean,
): SearchState => {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState)
  const client = useApolloClient()
  const timer = useRef(null)

  useEffect(() => {
    if (!autocomplete) {
      dispatch({
        type: 'reset',
      })
      return
    }
    if (term === '') {
      dispatch({
        type: 'reset',
      })
      return
    }

    dispatch({ type: 'startLoading' })

    const thisTimerId = (timer.current = setTimeout(async () => {
      client
        .query<GetSearchResultsQuery, QuerySearchResultsArgs>({
          query: GET_SEARCH_RESULTS_QUERY,
          variables: {
            query: {
              queryString: term.trim(),
              language: locale as ContentLanguage,
              types: [
                SearchableContentTypes['WebArticle'],
                SearchableContentTypes['WebSubArticle'],
                SearchableContentTypes['WebProjectPage'],
              ],
            },
          },
        })
        .then(({ data: { searchResults: results } }) => {
          dispatch({
            type: 'searchResults',
            results,
          })
        })

      // the api only completes single terms get only single terms
      const indexOfLastSpace = term.lastIndexOf(' ')
      const hasSpace = indexOfLastSpace !== -1
      const prefix = hasSpace ? term.slice(0, indexOfLastSpace) : ''
      const queryString = hasSpace ? term.slice(indexOfLastSpace) : term

      client
        .query<AutocompleteTermResultsQuery, QueryWebSearchAutocompleteArgs>({
          query: GET_SEARCH_AUTOCOMPLETE_TERM_QUERY,
          variables: {
            input: {
              singleTerm: queryString.trim(),
              language: locale as ContentLanguage,
              size: 10, // only show top X completions to prevent long list
            },
          },
        })
        .then(
          ({
            data: {
              webSearchAutocomplete: { completions: suggestions },
            },
          }) => {
            dispatch({
              type: 'suggestions',
              suggestions,
            })
          },
        )

      dispatch({
        type: 'searchString',
        term,
        prefix,
      })
    }, DEBOUNCE_TIMER))

    return () => clearTimeout(thisTimerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, locale, term, dispatch])

  return state
}

type SubmitType = {
  type: 'query' | 'link'
  string: string
}

const useSubmit = (locale: Locale, onRouting?: () => void) => {
  const Router = useRouter()
  const { linkResolver } = useLinkResolver()

  return useCallback(
    (item: SubmitType) => {
      Router.push({
        ...(item.type === 'query' && {
          pathname: linkResolver('search').href,
          query: { q: item.string },
        }),
        ...(item.type === 'link' && {
          pathname: item.string,
        }),
      }).then(() => {
        window.scrollTo(0, 0)
      })

      if (onRouting) {
        onRouting()
      }
    },
    [Router, linkResolver, onRouting],
  )
}

interface SearchInputProps {
  activeLocale: Locale
  initialInputValue?: string
  size?: AsyncSearchSizes
  autocomplete?: boolean
  autosuggest?: boolean
  openOnFocus?: boolean
  placeholder?: string
  white?: boolean
  colored?: boolean
  id?: string
  onRouting?: () => void
  skipContext?: boolean
  quickContentLabel?: string
}

export const SearchInput = forwardRef<
  HTMLInputElement,
  SearchInputProps & TestSupport
>(
  (
    {
      placeholder = '',
      activeLocale: locale,
      initialInputValue = '',
      openOnFocus = false,
      size = 'medium',
      white = false,
      colored = true,
      autocomplete = true,
      autosuggest = true,
      id = 'downshift',
      onRouting,
      skipContext,
      quickContentLabel,
      dataTestId,
    },
    ref,
  ) => {
    const [searchTerm, setSearchTerm] = useState(initialInputValue)
    const search = useSearch(locale, searchTerm, autocomplete)

    const onSubmit = useSubmit(locale)
    const [hasFocus, setHasFocus] = useState(false)
    const onBlur = useCallback(() => setHasFocus(false), [setHasFocus])
    const onFocus = useCallback(() => {
      setHasFocus(true)
    }, [setHasFocus])

    return (
      <Downshift<SubmitType>
        id={id}
        initialInputValue={initialInputValue}
        onChange={(item) => {
          if (!item?.string) {
            return false
          }

          if (item?.type === 'query') {
            return onSubmit({
              ...item,
              string: `${search.prefix} ${item.string}`.trim() || '',
            })
          }

          if (item?.type === 'link') {
            return onSubmit(item)
          }
        }}
        onInputValueChange={(q) => setSearchTerm(q)}
        itemToString={(item) => {
          if (item?.type === 'query') {
            return `${search.prefix ? search.prefix + ' ' : ''}${
              item.string
            }`.trim()
          }

          return ''
        }}
        stateReducer={(state, changes) => {
          // pressing tab when input is not empty should move focus to the
          // search icon, so we need to prevent downshift from closing on blur
          const shouldIgnore =
            changes.type === Downshift.stateChangeTypes.mouseUp ||
            (changes.type === Downshift.stateChangeTypes.blurInput &&
              state.inputValue !== '')

          return shouldIgnore ? {} : changes
        }}
      >
        {({
          highlightedIndex,
          isOpen,
          getRootProps,
          getInputProps,
          getItemProps,
          getMenuProps,
          openMenu,
          closeMenu,
          inputValue,
        }) => (
          <AsyncSearchInput
            ref={ref}
            white={white}
            hasFocus={hasFocus}
            loading={search.isLoading}
            dataTestId={dataTestId}
            skipContext={skipContext}
            rootProps={{
              'aria-controls': id + '-menu',
              ...getRootProps(),
            }}
            menuProps={{
              comp: 'div',
              ...getMenuProps(),
            }}
            buttonProps={{
              onClick: () => {
                if (!inputValue) {
                  return false
                }

                closeMenu()
                onSubmit({
                  type: 'query',
                  string: inputValue,
                })
              },
              onFocus,
              onBlur,
              'aria-label': locale === 'is' ? 'Leita' : 'Search',
            }}
            inputProps={getInputProps({
              inputSize: size,
              onFocus: () => {
                onFocus()
                if (openOnFocus) {
                  openMenu()
                }
              },
              onBlur,
              placeholder,
              colored,
              onKeyDown: (e) => {
                const v = e.currentTarget.value

                if (!v) {
                  return false
                }

                if (e.key === 'Enter' && highlightedIndex == null) {
                  e.currentTarget.blur()
                  closeMenu()
                  onSubmit({
                    type: 'query',
                    string: v,
                  })
                }
              },
            })}
          >
            {isOpen && !isEmpty(search) && (
              <Results
                quickContentLabel={quickContentLabel}
                search={search}
                highlightedIndex={highlightedIndex}
                getItemProps={getItemProps}
                autosuggest={autosuggest}
                onRouting={() => {
                  if (onRouting) {
                    onRouting()
                  }
                }}
              />
            )}
          </AsyncSearchInput>
        )}
      </Downshift>
    )
  },
)

type ResultsProps = {
  search: SearchState
  highlightedIndex: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItemProps: any
  autosuggest: boolean
  onRouting?: () => void
  quickContentLabel?: string
}

const Results = ({
  search,
  highlightedIndex,
  getItemProps,
  autosuggest,
  onRouting,
  quickContentLabel = 'Beint að efninu',
}: ResultsProps) => {
  const { linkResolver } = useLinkResolver()

  if (!search.term) {
    const suggestions = search.suggestions.map((suggestion, i) => (
      <div key={suggestion} {...getItemProps({ item: suggestion })}>
        <Text color={i === highlightedIndex ? 'blue400' : 'dark400'}>
          {suggestion}
        </Text>
      </div>
    ))

    return <CommonSearchTerms suggestions={suggestions} />
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      background="blue100"
      paddingY={2}
      paddingX={3}
    >
      <div className={styles.menuRow}>
        <Stack space={1}>
          {search.suggestions &&
            search.suggestions.map((suggestion, i) => {
              const suggestionHasTerm = suggestion.startsWith(search.term)
              const startOfString = suggestionHasTerm ? search.term : suggestion
              const endOfString = suggestionHasTerm
                ? suggestion.replace(search.term, '')
                : ''
              const { onClick, ...itemProps } = getItemProps({
                item: {
                  type: 'query',
                  string: suggestion,
                },
              })
              return (
                <div
                  key={suggestion}
                  {...itemProps}
                  className={styles.suggestion}
                  onClick={(e) => {
                    onClick(e)
                    onRouting()
                  }}
                >
                  <Text color={i === highlightedIndex ? 'blue400' : 'dark400'}>
                    {`${search.prefix} ${startOfString}`}
                    <strong>{endOfString}</strong>
                  </Text>
                </div>
              )
            })}
        </Stack>
      </div>{' '}
      {autosuggest && search.results && search.results.items.length > 0 && (
        <>
          <div className={styles.separatorHorizontal} />
          <div className={styles.menuRow}>
            <Stack space={2}>
              <Text variant="eyebrow" color="purple400">
                {quickContentLabel}
              </Text>
              {(search.results.items as Article[] &
                LifeEventPage[] &
                News[] &
                SubArticle[])
                .slice(0, 5)
                .map((item, i) => {
                  const { onClick, ...itemProps } = getItemProps({
                    item: {
                      type: 'link',
                      string: linkResolver(
                        item.__typename as LinkType,
                        item.slug.split('/'),
                      ).href,
                    },
                  })
                  return (
                    <Link
                      key={item.id}
                      {...itemProps}
                      onClick={(e) => {
                        onClick(e)
                        onRouting()
                      }}
                      color="blue400"
                      underline="normal"
                      dataTestId="search-result"
                      pureChildren
                      underlineVisibility={
                        search.suggestions.length + i === highlightedIndex
                          ? 'always'
                          : 'hover'
                      }
                      skipTab
                    >
                      {item.title}
                    </Link>
                  )
                })}
            </Stack>
          </div>
        </>
      )}
    </Box>
  )
}

const CommonSearchTerms = ({
  suggestions,
}: {
  suggestions: ReactElement[]
}) => {
  const [ref, { width }] = useMeasure()

  if (!suggestions.length) {
    return null
  }

  const splitAt = Math.min(suggestions.length / 2)
  const left = suggestions.slice(0, splitAt)
  const right = suggestions.slice(splitAt)

  return (
    <Box
      ref={ref}
      display="flex"
      background="blue100"
      paddingY={2}
      paddingX={3}
    >
      <div className={styles.menuColumn}>
        <Stack space={2}>
          <Box marginBottom={1}>
            <Text variant="eyebrow" color="blue400">
              Algeng leitarorð
            </Text>
          </Box>
          {width < STACK_WIDTH ? suggestions : left}
        </Stack>
      </div>
      {width > STACK_WIDTH - 1 ? (
        <>
          <div className={styles.separatorVertical} />
          <div className={styles.menuColumn}>
            <Stack space={2}>{right}</Stack>
          </div>
        </>
      ) : null}
    </Box>
  )
}

export default SearchInput
