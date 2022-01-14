import * as faker from 'faker'

import {
  EnhancedFetchTestEnv,
  fakeResponse,
  setupTestEnv,
} from '../../test/setup'

import { Request } from './nodeFetch'

const testUrl = 'http://localhost/test'

describe('EnhancedFetch', () => {
  let env: EnhancedFetchTestEnv

  beforeEach(() => {
    env = setupTestEnv()
  })

  it('adds request timeout', async () => {
    // Arrange
    const timeout = 500
    env = setupTestEnv({ timeout })

    // Act
    await env.enhancedFetch(testUrl)

    // Assert
    expect(env.fetch).toHaveBeenCalledWith(
      testUrl,
      expect.objectContaining({ timeout }),
    )
  })

  it('adds authentication header', async () => {
    // Arrange
    const mockUser = {
      nationalId: faker.helpers.replaceSymbolWithNumber('##########'),
      scope: [],
      authorization: faker.random.word(),
      client: faker.random.word(),
    }

    // Act
    await env.enhancedFetch(testUrl, { auth: mockUser })

    // Assert
    expect(env.fetch).toHaveBeenCalled()
    const request = new Request(
      env.fetch.mock.calls[0][0],
      env.fetch.mock.calls[0][1],
    )
    expect(request.headers.get('authorization')).toEqual(mockUser.authorization)
  })

  it('logs arbitrary errors', async () => {
    // Arrange
    env.fetch.mockRejectedValue(new Error('Test error'))

    // Act
    await env.enhancedFetch(testUrl).catch(() => null)

    // Assert
    expect(env.logger.log).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({
        message: expect.stringContaining('Test error'),
        url: testUrl,
      }),
    )
  })

  it('logs server response errors', async () => {
    // Arrange
    env.fetch.mockResolvedValue(
      fakeResponse('Error', {
        status: 500,
        statusText: 'Server Test Error',
      }),
    )

    // Act
    await env.enhancedFetch(testUrl).catch(() => null)

    // Assert
    expect(env.logger.log).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({
        message: expect.stringContaining('Request failed with status code 500'),
        url: testUrl,
        status: 500,
        statusText: 'Server Test Error',
      }),
    )
  })

  it('supports response problem spec', async () => {
    // Arrange
    env.fetch.mockResolvedValue(
      fakeResponse('{"title": "Problem", "type": "my-problem"}', {
        status: 500,
        statusText: 'Server Test Error',
        headers: {
          'Content-Type': 'application/problem+json',
        },
      }),
    )
    const problem = { title: 'Problem', type: 'my-problem' }

    // Act
    const error = await env.enhancedFetch(testUrl).catch((error) => error)

    // Assert
    expect(error).toMatchObject({ problem })
    expect(env.logger.log).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({ problem }),
    )
  })

  it('can optionally log json body', async () => {
    // Arrange
    env = setupTestEnv({ logErrorResponseBody: true })
    env.fetch.mockResolvedValue(
      fakeResponse('{"yo": "error"}', {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    // Act
    const error = await env.enhancedFetch(testUrl).catch((error) => error)

    // Assert
    expect(error).toMatchObject({ body: { yo: 'error' } })
    expect(env.logger.log).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({ body: { yo: 'error' } }),
    )
  })

  it('can optionally log text body', async () => {
    // Arrange
    env = setupTestEnv({ logErrorResponseBody: true })
    env.fetch.mockResolvedValue(fakeResponse('My Error', { status: 500 }))

    // Act
    const error = await env.enhancedFetch(testUrl).catch((error) => error)

    // Assert
    expect(error).toMatchObject({ body: 'My Error' })
    expect(env.logger.log).toHaveBeenCalledWith(
      'error',
      expect.objectContaining({ body: 'My Error' }),
    )
  })

  it('opens circuit after enough 500 errors', async () => {
    // Arrange
    env.fetch.mockResolvedValue(fakeResponse('Error', { status: 500 }))
    await env.enhancedFetch(testUrl).catch(() => null)

    // Act
    const promise = env.enhancedFetch(testUrl)

    // Assert
    await expect(promise).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Breaker is open"`,
    )
    expect(env.fetch).toHaveBeenCalledTimes(1)
  })

  it('does not open circuit for 400 responses', async () => {
    // Arrange
    env.fetch.mockResolvedValue(fakeResponse('Error', { status: 400 }))
    await env.enhancedFetch(testUrl).catch(() => null)

    // Act
    const promise = env.enhancedFetch(testUrl)

    // Assert
    await expect(promise).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Request failed with status code 400"`,
    )
    expect(env.fetch).toHaveBeenCalledTimes(2)
  })

  it('can be configured to open circuit for 400 errors', async () => {
    // Arrange
    env = setupTestEnv({ treat400ResponsesAsErrors: true })
    env.fetch.mockResolvedValue(fakeResponse('Error', { status: 400 }))
    await env.enhancedFetch(testUrl).catch(() => null)

    // Act
    const promise = env.enhancedFetch(testUrl)

    // Assert
    await expect(promise).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Breaker is open"`,
    )
    expect(env.fetch).toHaveBeenCalledTimes(1)
  })
})
