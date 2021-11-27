import CircuitBreaker from 'opossum'
import nodeFetch from 'node-fetch'
import { Cache } from 'cache-manager'
import { Logger } from 'winston'
import { logger as defaultLogger } from '@island.is/logging'
import { withTimeout } from './withTimeout'
import { FetchAPI, Request, Response } from './types'
import { withAuth } from './withAuth'
import { withErrors } from './withErrors'
import { withCircuitBreaker } from './withCircuitBreaker'
import {
  ClientCertificateOptions,
  withClientCertificate,
} from './withClientCertificate'
import { withCache, CacheConfig } from './withCache'

export interface EnhancedFetchOptions {
  // The name of this fetch function, used in logs and opossum stats.
  name: string

  // Configure caching.
  cache?: CacheConfig

  // Timeout for requests. Defaults to 10000ms. Can be disabled by passing false.
  timeout?: number | false

  // Disable or configure circuit breaker.
  circuitBreaker?: boolean | CircuitBreaker.Options

  // By default 400 responses are considered warnings and will not open the circuit.
  // This can be changed by passing `treat400ResponsesAsErrors: true`.
  // Either way they will be logged and thrown.
  treat400ResponsesAsErrors?: boolean

  // If true, will log error response body. Defaults to false.
  // Should only be used if error objects do not have sensitive information or PII.
  logErrorResponseBody?: boolean

  // Override logger.
  logger?: Logger

  // Override fetch function.
  fetch?: FetchAPI

  // Certificate for auth
  clientCertificate?: ClientCertificateOptions
}

function buildFetch(fetch = (nodeFetch as unknown) as FetchAPI) {
  const result = {
    fetch,
    wrap<T extends { fetch: FetchAPI }>(
      createFetch: (options: T) => FetchAPI,
      options: Omit<T, 'fetch'>,
    ) {
      result.fetch = createFetch({ ...options, fetch: result.fetch } as T)
      return result
    },
  }
  return result
}

/**
 * Creates a fetch function for resilient ops:
 *
 * - Includes circuit breaker logic. By default, if more than 50% of the
 *   requests from the last 10 seconds are misbehaving, we'll open the circuit.
 *   All future requests will be stopped to lower pressure on the remote server.
 *   Every 30 seconds we'll allow one request through. If it's successful, we'll
 *   close the circuit and let requests through again.
 *
 * - Includes request timeout logic. By default, throws an error if there is no
 *   response in 10 seconds.
 *
 * - Throws an error for non-200 responses. The error object includes details
 *   from the response, including a `problem` property if the response implements
 *   the [Problem Spec](https://datatracker.ietf.org/doc/html/rfc7807).
 *
 * - Logs circuit breaker events and failing requests
 *
 * - Optionally opens the circuit for 400 responses.
 *
 * - Optionally parses and logs error response bodies.
 *
 * This function (and it's error logic) is mostly compatible with "OpenAPI
 * Generator" clients. The only difference revolve around non-200 responses. It
 * throws an Error object instead of the response (all response properties are
 * copied to the Error object), and since these errors are thrown "inside" the
 * fetch call, any "post" middlewares will not be invoked for non-200 responses.
 */
export const createEnhancedFetch = (
  options: EnhancedFetchOptions,
): FetchAPI => {
  const {
    name,
    logger = defaultLogger,
    timeout = 10000,
    logErrorResponseBody = false,
    clientCertificate,
    cache,
  } = options
  const treat400ResponsesAsErrors = options.treat400ResponsesAsErrors === true
  const builder = buildFetch(options.fetch)

  if (clientCertificate) {
    builder.wrap(withClientCertificate, { clientCertificate })
  }

  if (cache) {
    builder.wrap(withCache, {
      ...cache,
      name,
      logger,
    })
  }

  if (timeout !== false) {
    builder.wrap(withTimeout, { timeout })
  }

  builder.wrap(withAuth, {})

  builder.wrap(withErrors, {
    logger,
    treat400ResponsesAsErrors,
    logErrorResponseBody,
  })

  if (options.circuitBreaker !== false) {
    const opossum =
      options.circuitBreaker === true ? {} : options.circuitBreaker ?? {}
    builder.wrap(withCircuitBreaker, {
      name,
      logger,
      treat400ResponsesAsErrors,
      opossum,
    })
  }

  return builder.fetch
}
