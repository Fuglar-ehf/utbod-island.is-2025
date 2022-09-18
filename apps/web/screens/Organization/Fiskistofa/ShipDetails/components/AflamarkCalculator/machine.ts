import { ApolloClient } from '@apollo/client'
import initApollo from '@island.is/web/graphql/client'
import {
  CatchQuotaCategory,
  ExtendedCatchQuotaCategory,
  ExtendedShipStatusInformation,
  MutationUpdateShipStatusForTimePeriodArgs,
  QueryGetShipStatusForTimePeriodArgs,
  QuotaType,
  Ship,
  ShipStatusInformation,
  MutationUpdateShipQuotaStatusForTimePeriodArgs,
  QuotaStatus,
} from '@island.is/web/graphql/schema'
import { createMachine, assign } from 'xstate'
import { GET_QUOTA_TYPES_FOR_TIME_PERIOD } from '../QuotaTypeSelect/queries'
import {
  GET_SHIP_STATUS_FOR_TIME_PERIOD,
  UPDATE_SHIP_QUOTA_STATUS_FOR_TIME_PERIOD,
  UPDATE_SHIP_STATUS_FOR_TIME_PERIOD,
} from './queries'

type ContextData = {
  shipInformation?: Ship
  catchQuotaCategories?: Array<
    Omit<CatchQuotaCategory | ExtendedCatchQuotaCategory, '__typename'> & {
      timestamp?: number
    }
  >
}

/** Mutates a category list by sorting it an name ascending order */
const orderCategories = (categories: ContextData['catchQuotaCategories']) => {
  // Ascending order by name
  categories.sort((a, b) => a.name.localeCompare(b.name))

  // If there's a timestamp we want to use that to order the categories
  categories.sort((a, b) => {
    if (!a.timestamp && !b.timestamp) return 0
    if (a.timestamp && !b.timestamp) return -1
    if (!a.timestamp && b.timestamp) return 1
    return b.timestamp - a.timestamp
  })

  // Place the cod value category at the front if it exists
  const codValueIndex = categories.findIndex((c) => c.id === 0)
  if (codValueIndex > 0) {
    const [codValue] = categories.splice(codValueIndex, 1)
    categories.unshift(codValue)
  }
}

interface QuotaData {
  id: number
  totalCatchQuota?: number
  quotaShare?: number
  nextYearQuota?: number
  nextYearFromQuota?: number
  allocatedCatchQuota?: number
}

interface Context {
  data: ContextData | null
  initialData: ContextData | null
  updatedData: ContextData | null
  quotaData: QuotaData[]
  quotaTypes: QuotaType[]
  selectedQuotaTypes: QuotaType[]
  errorOccured: boolean
  apolloClient: ApolloClient<object> | null
}

type GET_DATA_EVENT = {
  type: 'GET_DATA'
  variables: QueryGetShipStatusForTimePeriodArgs
}

type UPDATE_GENERAL_DATA_EVENT = {
  type: 'UPDATE_GENERAL_DATA'
  variables: MutationUpdateShipStatusForTimePeriodArgs
}

type UPDATE_QUOTA_DATA_EVENT = {
  type: 'UPDATE_QUOTA_DATA'
  variables: MutationUpdateShipQuotaStatusForTimePeriodArgs
}

type ADD_CATEGORY_EVENT = {
  type: 'ADD_CATEGORY'
  category: { label: string; value: number }
}

type REMOVE_CATEGORY_EVENT = {
  type: 'REMOVE_CATEGORY'
  categoryId: number
}

type REMOVE_ALL_CATEGORIES_EVENT = {
  type: 'REMOVE_ALL_CATEGORIES'
}

type Event =
  | GET_DATA_EVENT
  | UPDATE_GENERAL_DATA_EVENT
  | UPDATE_QUOTA_DATA_EVENT
  | ADD_CATEGORY_EVENT
  | REMOVE_CATEGORY_EVENT
  | REMOVE_ALL_CATEGORIES_EVENT

type State =
  | { value: 'idle'; context: Context }
  | { value: 'getting general data'; context: Context }
  | { value: 'updating general data'; context: Context }
  | { value: 'updating quota data'; context: Context }
  | { value: 'error'; context: Context }

export const machine = createMachine<Context, Event, State>(
  {
    id: 'Deilistofna Calculator',
    context: {
      data: null,
      initialData: null,
      updatedData: null,
      quotaData: [],
      quotaTypes: [],
      selectedQuotaTypes: [],
      errorOccured: false,
      apolloClient: initApollo({}),
    },
    initial: 'idle',
    states: {
      idle: {
        on: {
          GET_DATA: 'getting data',
          UPDATE_GENERAL_DATA: 'updating general data',
          UPDATE_QUOTA_DATA: 'updating quota data',
          REMOVE_ALL_CATEGORIES: {
            actions: assign((context) => {
              const selectedQuotaTypesIds = context.selectedQuotaTypes.map(
                (qt) => qt.id,
              )
              const categories = context.data.catchQuotaCategories.filter(
                (c) => !selectedQuotaTypesIds.includes(c.id),
              )
              return {
                selectedQuotaTypes: [],
                quotaTypes: context.quotaTypes
                  .concat(context.selectedQuotaTypes)
                  .sort((a, b) => a.name.localeCompare(b.name)),
                data: { ...context.data, catchQuotaCategories: categories },
              }
            }),
          },
          REMOVE_CATEGORY: {
            actions: assign((context, event) => {
              const quotaTypes = [...context.quotaTypes]

              const category = context.selectedQuotaTypes.find(
                (qt) => qt.id === event.categoryId,
              )

              // Move the selected quota type category back into the quota type array
              if (
                category &&
                !quotaTypes.map((qt) => qt.id).includes(category.id)
              ) {
                quotaTypes.push(category)
                quotaTypes.sort((a, b) => a.name.localeCompare(b.name))
              }

              return {
                data: {
                  ...context.data,
                  catchQuotaCategories: context.data.catchQuotaCategories.filter(
                    (c) => c.id !== event.categoryId,
                  ),
                },
                quotaTypes,
                selectedQuotaTypes: context.selectedQuotaTypes.filter(
                  (qt) => qt.id !== event.categoryId,
                ),
              }
            }),
          },
          ADD_CATEGORY: {
            actions: assign((context, event) => {
              const categories = context.data.catchQuotaCategories

              categories.push({
                name: event.category.label,
                id: event.category.value,
                allocation: 0,
                betweenShips: 0,
                betweenYears: 0,
                catch: 0,
                catchQuota: 0,
                displacement: 0,
                excessCatch: 0,
                newStatus: 0,
                nextYear: 0,
                specialAlloction: 0,
                status: 0,
                unused: 0,
                timestamp: Date.now(), // Also store a timestamp for when the category got added by the user
              })

              orderCategories(categories)

              return {
                data: context.data,
                quotaTypes: context.quotaTypes.filter(
                  (qt) => qt.id !== event.category.value,
                ),
                selectedQuotaTypes: context.selectedQuotaTypes.concat({
                  name: event.category.label,
                  id: event.category.value,
                  from: '',
                  to: '',
                }),
              }
            }),
          },
        },
      },
      'getting data': {
        invoke: {
          src: 'getData',
          onDone: {
            actions: assign((_context, event) => ({
              ...event.data,
              errorOccured: false,
            })),
            target: 'idle',
          },
          onError: {
            actions: assign(() => ({ errorOccured: true })),
            target: 'error',
          },
        },
      },
      'updating general data': {
        invoke: {
          src: 'updateGeneralData',
          onDone: {
            target: 'idle',
            actions: assign((_context, event) => ({
              ...event.data,
              errorOccured: false,
            })),
          },
          onError: {
            target: 'error',
            actions: assign(() => ({ errorOccured: true })),
          },
        },
      },
      'updating quota data': {
        invoke: {
          src: 'updateQuotaData',
          onDone: {
            target: 'idle',
            actions: assign((_context, event) => ({
              ...event.data,
              errorOccured: false,
            })),
          },
          onError: {
            target: 'error',
            actions: assign((context, event) => {
              console.log(event)
              return { errorOccured: true }
            }),
          },
        },
      },
      error: {
        on: {
          GET_DATA: 'getting data',
          UPDATE_GENERAL_DATA: 'updating general data',
          UPDATE_QUOTA_DATA: 'updating quota data',
        },
      },
    },
  },
  {
    services: {
      getData: async (context, event: GET_DATA_EVENT) => {
        const [
          {
            data: { getShipStatusForTimePeriod },
          },
          {
            data: { getQuotaTypesForTimePeriod },
          },
        ] = await Promise.all([
          context.apolloClient.query<{
            getShipStatusForTimePeriod: ExtendedShipStatusInformation
          }>({
            query: GET_SHIP_STATUS_FOR_TIME_PERIOD,
            variables: event.variables,
            fetchPolicy: 'no-cache',
          }),
          context.apolloClient.query<{
            getQuotaTypesForTimePeriod: QuotaType[]
          }>({
            query: GET_QUOTA_TYPES_FOR_TIME_PERIOD,
            variables: {
              input: {
                timePeriod: event.variables.input.timePeriod,
              },
            },
          }),
        ])

        orderCategories(getShipStatusForTimePeriod.catchQuotaCategories)

        const categoryIds = getShipStatusForTimePeriod.catchQuotaCategories.map(
          (c) => c.id,
        )

        // Remove all quota types that are already in the category list
        const quotaTypes = getQuotaTypesForTimePeriod.filter(
          (qt) => !categoryIds.includes(qt.id),
        )
        // Order the types in ascending name order
        quotaTypes.sort((a, b) => a.name.localeCompare(b.name))

        const quotaData = []

        for (const category of getShipStatusForTimePeriod.catchQuotaCategories) {
          quotaData.push({
            id: category.id,
            totalCatchQuota: category.totalCatchQuota,
            quotaShare: category.quotaShare,
            nextYearQuota: category.nextYearQuota,
            nextYearFromQuota: category.nextYearFromQuota,
          })
        }

        return {
          data: getShipStatusForTimePeriod,
          initialData: getShipStatusForTimePeriod,
          quotaTypes,
          selectedQuotaTypes: [],
          quotaData,
        }
      },
      updateGeneralData: async (context, event: UPDATE_GENERAL_DATA_EVENT) => {
        const {
          data: { updateShipStatusForTimePeriod },
        } = await context.apolloClient.query<{
          updateShipStatusForTimePeriod: ShipStatusInformation
        }>({
          query: UPDATE_SHIP_STATUS_FOR_TIME_PERIOD,
          variables: event.variables,
          fetchPolicy: 'no-cache',
        })
        const categories: ContextData['catchQuotaCategories'] = []
        // We want to keep the ordering of the categories the user has added
        for (const category of context.data.catchQuotaCategories) {
          const categoryFromServer = updateShipStatusForTimePeriod.catchQuotaCategories.find(
            (c) => c.id === category.id,
          )
          if (categoryFromServer) {
            categories.push({
              ...categoryFromServer,
              timestamp: category.timestamp,
            })
          } else {
            categories.push(category)
          }
        }
        orderCategories(categories)
        updateShipStatusForTimePeriod.catchQuotaCategories = categories
        return {
          data: updateShipStatusForTimePeriod,
          updatedData: updateShipStatusForTimePeriod,
        }
      },
      updateQuotaData: async (context, event: UPDATE_QUOTA_DATA_EVENT) => {
        const {
          data: { updateShipQuotaStatusForTimePeriod },
        } = await context.apolloClient.mutate<{
          updateShipQuotaStatusForTimePeriod: QuotaStatus
        }>({
          mutation: UPDATE_SHIP_QUOTA_STATUS_FOR_TIME_PERIOD,
          variables: event.variables,
        })

        const data = {
          ...context.data,
        }

        const serverQuotaData = updateShipQuotaStatusForTimePeriod

        data.catchQuotaCategories = data.catchQuotaCategories.map(
          (category) => {
            if (category.id === serverQuotaData.id) {
              return {
                ...category,
                unused: serverQuotaData.unused,
                newStatus: serverQuotaData.newStatus,
                quotaShare: serverQuotaData.quotaShare,
                totalCatchQuota: serverQuotaData.totalCatchQuota,
                nextYearFromQuota: serverQuotaData.nextYearFromQuota,
                nextYearQuota: serverQuotaData.nextYearQuota,
              }
            }
            return category
          },
        )

        const quotaData = context.quotaData.map((qd) => {
          if (qd.id === serverQuotaData.id) {
            return {
              id: serverQuotaData.id,
              totalCatchQuota: serverQuotaData.totalCatchQuota,
              quotaShare: serverQuotaData.quotaShare,
              nextYearQuota: serverQuotaData.nextYearQuota,
              nextYearFromQuota: serverQuotaData.nextYearFromQuota,
              allocatedCatchQuota: serverQuotaData.allocatedCatchQuota,
            }
          }
          return qd
        })

        return {
          data,
          quotaData,
        }
      },
    },
  },
)
