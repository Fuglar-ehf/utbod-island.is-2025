import CircuitBreaker from 'opossum'
import nodeFetch from 'node-fetch'
import { Logger } from 'winston'
import { logger as defaultLogger } from '@island.is/logging'
import { DogStatsD } from '@island.is/infra-metrics'
import { withTimeout } from './withTimeout'
import { withMetrics } from './withMetrics'
import { FetchAPI as NodeFetchAPI } from './nodeFetch'
import { EnhancedFetchAPI } from './types'
import { withAuth } from './withAuth'
import { AutoAuthOptions, withAutoAuth } from './withAutoAuth'
import { withErrorLog } from './withErrorLog'
import { withResponseErrors } from './withResponseErrors'
import { withCircuitBreaker } from './withCircuitBreaker'
import { AgentOptions, ClientCertificateOptions, withAgent } from './withAgent'
import { withCache } from './withCache/withCache'
import { CacheConfig } from './withCache/types'
import { buildFetch } from './buildFetch'

const DEFAULT_TIMEOUT = 1000 * 10 // seconds
const DEFAULT_FREE_SOCKET_TIMEOUT = 1000 * 10 // 10 seconds

export interface EnhancedFetchOptions {
  // The name of this fetch function, used in logs and opossum stats.
  name: string

  // Configure caching.
  cache?: CacheConfig

  // Timeout for requests. Defaults to 10000ms. Can be disabled by passing false.
  timeout?: number | false

  // Disable or configure circuit breaker.
  circuitBreaker?: boolean | CircuitBreaker.Options

  // Automatically get access token.
  autoAuth?: AutoAuthOptions

  /**
   * Specifies if user agent headers should be forwarded in the request (Real IP, User-Agent). Requires an Auth object
   * to be passed to the fetch function.
   */
  forwardAuthUserAgent?: boolean

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
  fetch?: NodeFetchAPI

  // Certificate for auth
  clientCertificate?: ClientCertificateOptions

  // Override configuration for the http agent. E.g. configure a client certificate.
  agentOptions?: AgentOptions

  // Configures keepAlive for requests. If false, never reuse connections. If true, reuse connection with a maximum
  // idle timeout of 10 seconds. If number, override the idle connection timeout. Defaults to true.
  keepAlive?: boolean | number

  // The client used to send metrics.
  metricsClient?: DogStatsD
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
 * - Includes response cache logic built on top of standard cache-control
 *   semantics. By default nothing is cached.
 *
 * - Supports our `User` and `Auth` objects. Adds authorization header to the
 *   request.
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
): EnhancedFetchAPI => {
  const {
    name,
    logger = defaultLogger,
    fetch = nodeFetch,
    timeout = DEFAULT_TIMEOUT,
    logErrorResponseBody = false,
    autoAuth,
    forwardAuthUserAgent = true,
    clientCertificate,
    agentOptions,
    keepAlive = true,
    cache,
    metricsClient = new DogStatsD({ prefix: `${options.name}.` }),
  } = options
  const treat400ResponsesAsErrors = options.treat400ResponsesAsErrors === true
  const freeSocketTimeout =
    typeof keepAlive === 'number' ? keepAlive : DEFAULT_FREE_SOCKET_TIMEOUT
  const builder = buildFetch(fetch)

  builder.wrap(withAgent, {
    clientCertificate,
    agentOptions,
    keepAlive: !!keepAlive,
    freeSocketTimeout,
  })

  if (timeout !== false) {
    builder.wrap(withTimeout, { timeout })
  }

  builder.wrap(withResponseErrors, { includeBody: logErrorResponseBody })

  if (autoAuth) {
    builder.wrap(withAutoAuth, {
      name,
      logger,
      options: autoAuth,
      rootFetch: fetch,
      cache,
    })
  }

  builder.wrap(withAuth, { forwardAuthUserAgent })

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

  if (cache) {
    builder.wrap(withCache, {
      ...cache,
      name,
      logger,
    })

    // Need to handle response errors again.
    builder.wrap(withResponseErrors, { includeBody: logErrorResponseBody })
  }

  if (metricsClient) {
    builder.wrap(withMetrics, { metricsClient })
  }

  builder.wrap(withErrorLog, {
    name,
    logger,
    treat400ResponsesAsErrors,
  })

  return builder.getFetch()
}
