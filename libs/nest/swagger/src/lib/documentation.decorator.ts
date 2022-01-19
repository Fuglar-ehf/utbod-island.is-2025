import { applyDecorators, HttpCode } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiParamOptions,
  ApiQuery,
  ApiQueryOptions,
  ApiResponseMetadata,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { HttpProblemResponse } from '@island.is/nest/problem'

type ExtendedOmit<T, K extends keyof any> = {
  [P in keyof T as Exclude<P, K>]: T[P]
}

export interface Options {
  request?: {
    params?: Record<string, ExtendedOmit<ApiParamOptions, 'name'>>
    query?: Record<string, ExtendedOmit<ApiQueryOptions, 'name'>>
  }
  response: {
    status: 200 | 201 | 204
    type?: ApiResponseMetadata['type']
  }
  isAuthorized?: boolean
  description?: string
  summary?: string
}

const getResponseDecorators = (
  response: Options['response'],
): MethodDecorator[] => {
  switch (response.status) {
    case 200:
      return [ApiOkResponse(response)]
    case 201:
      return [
        ApiCreatedResponse(response),
        ApiConflictResponse({ type: HttpProblemResponse }),
      ]
    case 204:
      return [ApiNoContentResponse(response)]
    default:
      return []
  }
}

const getRequestDecorators = ({
  query = {},
  params = {},
}: Options['request'] = {}): MethodDecorator[] => {
  const queryKeys = Object.keys(query)
  const queryDecorators = queryKeys.map((name) =>
    ApiQuery({ name, ...query[name] }),
  )

  const paramsKeys = Object.keys(params)
  const defaultValue: MethodDecorator[] =
    paramsKeys.length > 0
      ? [ApiNotFoundResponse({ type: HttpProblemResponse })]
      : []
  const paramsDecorators = paramsKeys.reduce(
    (acc, name) => [...acc, ApiParam({ name, ...params[name] })],
    defaultValue,
  )

  return [...queryDecorators, ...paramsDecorators]
}

const getExtraDecorators = ({
  isAuthorized = true,
  description,
  summary,
}: Omit<Options, 'response' | 'request'>): MethodDecorator[] => {
  let decorators: MethodDecorator[] = []
  if (isAuthorized) {
    decorators = [
      ...decorators,
      ApiUnauthorizedResponse({ type: HttpProblemResponse }),
      ApiForbiddenResponse({ type: HttpProblemResponse }),
    ]
  }

  if (description || summary) {
    decorators = [...decorators, ApiOperation({ description, summary })]
  }

  return decorators
}

export const Documentation = ({
  response,
  request,
  ...extra
}: Options): MethodDecorator =>
  applyDecorators(
    /* BEGIN DEFAULT DECORATORS */
    HttpCode(response.status),
    ApiInternalServerErrorResponse({ type: HttpProblemResponse }),
    ApiBadRequestResponse({ type: HttpProblemResponse }),
    /* END DEFAULT DECORATORS */

    ...getResponseDecorators(response),
    ...getRequestDecorators(request),
    ...getExtraDecorators(extra),
  )
