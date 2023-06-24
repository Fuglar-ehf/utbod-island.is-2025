import { z } from 'zod'
import startOfMonth from 'date-fns/startOfMonth'
import endOfDay from 'date-fns/endOfDay'
import parseDate from 'date-fns/parse'
import { validateSearchParams } from '@island.is/react-spa/shared'
import type { WrappedLoaderFn } from '@island.is/portals/core'
import { isValidDate } from '@island.is/shared/utils'
import { zfd } from 'zod-form-data'
import {
  AirDiscountSchemeFlightLegGender,
  AirDiscountSchemeFlightLegState,
} from '@island.is/api/schema'
import {
  FlightLegsDocument,
  FlightLegsQuery,
  FlightLegsQueryVariables,
} from './Overview.generated'

const TODAY = new Date()

export const transformDate = (val: string) => {
  if (isValidDate(new Date(val)) && val.indexOf('.') === 2) {
    return parseDate(val, 'dd.MM.yyyy', endOfDay(new Date()))
  }

  if (isValidDate(new Date(val))) {
    return val
  }

  return parseDate(val, 'dd.MM.yyyy', endOfDay(new Date()))
}

const schema = z.object({
  age: z
    .object({
      from: z.coerce.number().default(-1),
      to: z.coerce.number().default(1000),
    })
    .default({}),
  airline: z.string().optional(),
  flightLeg: z
    .object({
      from: z.string().default(''),
      to: z.string().default(''),
    })
    .optional(),
  gender: z.nativeEnum(AirDiscountSchemeFlightLegGender).optional(),
  isExplicit: z.coerce.boolean().default(false),
  nationalId: z.string().optional(),
  period: z
    .object({
      from: z
        .string()
        .transform(transformDate)
        .default(startOfMonth(TODAY).toISOString()),
      to: z
        .string()
        .transform(transformDate)
        .default(endOfDay(TODAY).toISOString()),
    })
    .default({}),
  postalCode: z.coerce.number().optional(),
  state: zfd.repeatable(z.array(z.nativeEnum(AirDiscountSchemeFlightLegState))),
})

export type FlightLegsFilters = z.infer<typeof schema>

export type OverviewLoaderReturnType = {
  flightLegs: FlightLegsQuery['airDiscountSchemeFlightLegs']
  filters: FlightLegsFilters
}

export const overviewLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ request }): Promise<OverviewLoaderReturnType> => {
    const input = validateSearchParams({ request, schema })

    const flightLegs = await client.query<
      FlightLegsQuery,
      FlightLegsQueryVariables
    >({
      query: FlightLegsDocument,
      variables: {
        input,
      },
    })

    if (flightLegs.error) {
      throw flightLegs.error
    }

    return {
      flightLegs: flightLegs.data?.airDiscountSchemeFlightLegs ?? [],
      filters: input,
    }
  }
}
