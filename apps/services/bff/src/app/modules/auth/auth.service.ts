import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { CookieOptions, Request, Response } from 'express'
import { jwtDecode } from 'jwt-decode'

import { IdTokenClaims } from '@island.is/shared/types'
import { v4 as uuid } from 'uuid'
import { environment } from '../../../environment'
import { BffConfig } from '../../bff.config'
import { SESSION_COOKIE_NAME } from '../../constants/cookies'
import { FIVE_SECONDS_IN_MS } from '../../constants/time'
import { CryptoService } from '../../services/crypto.service'
import { PKCEService } from '../../services/pkce.service'
import {
  CreateErrorQueryStrArgs,
  createErrorQueryStr,
} from '../../utils/create-error-query-str'
import { validateUri } from '../../utils/validate-uri'
import { CacheService } from '../cache/cache.service'
import { IdsService } from '../ids/ids.service'
import { TokenResponse } from '../ids/ids.types'
import { CachedTokenResponse } from './auth.types'
import { CallbackLoginDto } from './dto/callback-login.dto'
import { CallbackLogoutDto } from './dto/callback-logout.dto'
import { LoginDto } from './dto/login.dto'
import { LogoutDto } from './dto/logout.dto'

@Injectable()
export class AuthService {
  private readonly baseUrl

  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,

    @Inject(BffConfig.KEY)
    private readonly config: ConfigType<typeof BffConfig>,

    private readonly pkceService: PKCEService,
    private readonly cacheService: CacheService,
    private readonly idsService: IdsService,
    private readonly cryptoService: CryptoService,
  ) {
    this.baseUrl = this.config.ids.issuer
  }

  private getCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: true,
      // The lax setting allows cookies to be sent on top-level navigations (such as redirects),
      // while still providing some protection against CSRF attacks.
      sameSite: 'lax',
      path: environment.keyPath,
    }
  }

  /**
   * Creates the client base URL with the path appended.
   */
  private createClientBaseUrl() {
    const baseUrl = new URL(this.config.clientBaseUrl)
    baseUrl.pathname = `${baseUrl.pathname}${environment.keyPath}`
      // Prevent potential issues with malformed URLs.
      .replace('//', '/')

    return baseUrl.toString()
  }

  /**
   * Redirects the user to the client base URL with an error query string.
   */
  private createClientBaseUrlWithError(args: CreateErrorQueryStrArgs) {
    return `${this.createClientBaseUrl()}?${createErrorQueryStr(args)}`
  }

  /**
   * Redirects the user to the client base URL with an error query string.
   */
  private redirectWithError(
    res: Response,
    args?: Partial<CreateErrorQueryStrArgs>,
  ) {
    const code = args?.code || 500
    const error = args?.error || 'Login failed!'

    return res.redirect(this.createClientBaseUrlWithError({ code, error }))
  }

  /**
   * Formats and updates the token cache with new token response data.
   */
  public async updateTokenCache(
    tokenResponse: TokenResponse,
  ): Promise<CachedTokenResponse> {
    const userProfile: IdTokenClaims = jwtDecode(tokenResponse.id_token)

    const value: CachedTokenResponse = {
      ...tokenResponse,
      // Encrypt the access and refresh tokens before saving them to the cache
      // to prevent unauthorized access to the tokens if cached service is compromised.
      encryptedAccessToken: this.cryptoService.encrypt(
        tokenResponse.access_token,
      ),
      encryptedRefreshToken: this.cryptoService.encrypt(
        tokenResponse.refresh_token,
      ),
      scopes: tokenResponse.scope.split(' '),
      userProfile,
      // Subtract 5 seconds from the token expiration time to account for latency.
      accessTokenExp:
        Date.now() + (tokenResponse.expires_in * 1000 - FIVE_SECONDS_IN_MS),
    }

    // Save the tokenResponse to the cache
    await this.cacheService.save({
      key: this.cacheService.createSessionKeyType('current', userProfile.sid),
      value,
      ttl: this.config.cacheUserProfileTTLms,
    })

    return value
  }

  /**
   * Revoke the refresh token on the identity server, since we have a new session.
   * We deliberately do not await this operation to make the login flow faster,
   * since this operation is not critical part to await.
   * We use .catch() to handle unhandled promise rejections.
   *
   * @param encryptedRefreshToken The encrypted refresh token to revoke
   */
  private revokeRefreshToken(encryptedRefreshToken: string) {
    this.idsService
      .revokeToken(encryptedRefreshToken, 'refresh_token')
      .catch((error) => {
        this.logger.warn('Failed to revoke refresh token:', error)
      })
  }

  /**
   * This method initiates the login flow.
   * It validates the target_link_uri and generates a unique session id, for a login attempt.
   * It also generates a code verifier and code challenge to enhance security.
   * The login attempt data is saved in the cache and a PAR request is made to the identity server.
   * The user is then redirected to the identity server login page.
   */
  async login({
    res,
    query: { target_link_uri: targetLinkUri, login_hint: loginHint, prompt },
  }: {
    res: Response
    query: LoginDto
  }) {
    // Validate targetLinkUri if it is provided
    if (
      targetLinkUri &&
      !validateUri(targetLinkUri, this.config.allowedRedirectUris)
    ) {
      this.logger.error('Invalid target_link_uri provided:', targetLinkUri)

      return this.redirectWithError(res, {
        code: 400,
      })
    }

    try {
      // Generate a unique session id to be used as a login attempt,
      // e.g. to store data in the cache with key 'attempt_sid' to be used in the callback login.
      const attemptLoginId = uuid()

      // Generate a code verifier and code challenge to enhance security
      const codeVerifier = await this.pkceService.generateCodeVerifier()
      const codeChallenge = await this.pkceService.generateCodeChallenge(
        codeVerifier,
      )

      await this.cacheService.save({
        key: this.cacheService.createSessionKeyType('attempt', attemptLoginId),
        value: {
          // Fallback if targetLinkUri is not provided
          originUrl: this.createClientBaseUrl(),
          // Code verifier to be used in the callback
          codeVerifier,
          targetLinkUri,
        },
        ttl: this.config.cacheLoginAttemptTTLms,
      })

      let searchParams: URLSearchParams

      if (this.config.parSupportEnabled) {
        const parResponse = await this.idsService.getPar({
          sid: attemptLoginId,
          codeChallenge,
          loginHint,
          prompt,
        })

        if (parResponse.type === 'error') {
          throw parResponse.data
        }

        searchParams = new URLSearchParams({
          request_uri: parResponse.data.request_uri,
          client_id: this.config.ids.clientId,
        })
      } else {
        searchParams = new URLSearchParams(
          this.idsService.getLoginSearchParams({
            sid: attemptLoginId,
            codeChallenge,
            loginHint,
            prompt,
          }),
        )
      }

      return res.redirect(
        `${this.baseUrl}/connect/authorize?${searchParams.toString()}`,
      )
    } catch (error) {
      this.logger.error('Login failed: ', error)

      return this.redirectWithError(res)
    }
  }

  /**
   * Callback for the login flow
   * This method is called from the identity server after the user has logged in
   * and the authorization code has been issued.
   * The authorization code is then exchanged for tokens.
   * We save the tokens and user information in the cache and create a session cookie.
   * We also clean up cache keys not being used anymore.
   * Finally, we redirect the user back to the original URL.
   */
  async callbackLogin({
    req,
    res,
    query,
  }: {
    req: Request
    res: Response
    query: CallbackLoginDto
  }) {
    const idsError = query.invalid_request

    // IDS might respond with an error if the request is missing a required parameter.
    if (idsError) {
      this.logger.error('Callback login IDS invalid request: ', idsError)

      return this.redirectWithError(res, {
        code: 500,
        error: idsError,
      })
    }

    // Validate query params
    if (!query.code || !query.state) {
      const missingParam = !query.code ? 'code' : 'state'
      this.logger.error(
        `Callback login failed: No query param "${missingParam}" provided.`,
      )

      return this.redirectWithError(res, {
        code: 400,
      })
    }

    try {
      // Get login attempt from cache
      const loginAttemptData = await this.cacheService.get<{
        targetLinkUri?: string
        codeVerifier: string
        originUrl: string
      }>(this.cacheService.createSessionKeyType('attempt', query.state))

      // Get tokens and user information from the authorization code
      const tokenResponse = await this.idsService.getTokens({
        code: query.code,
        codeVerifier: loginAttemptData.codeVerifier,
      })

      if (tokenResponse.type === 'error') {
        throw tokenResponse.data
      }

      const updatedTokenResponse = await this.updateTokenCache(
        tokenResponse.data,
      )

      // Clean up the login attempt from the cache since we have a successful login.
      this.cacheService
        .delete(this.cacheService.createSessionKeyType('attempt', query.state))
        .catch((err) => {
          this.logger.warn(err)
        })

      // Create session cookie with successful login session id
      res.cookie(
        SESSION_COOKIE_NAME,
        updatedTokenResponse.userProfile.sid,
        this.getCookieOptions(),
      )

      // Check if there is an old session cookie and clean up the cache
      const oldSessionCookie = req.cookies[SESSION_COOKIE_NAME]

      if (
        oldSessionCookie &&
        oldSessionCookie !== updatedTokenResponse.userProfile.sid
      ) {
        const oldSessionCacheKey = this.cacheService.createSessionKeyType(
          'current',
          oldSessionCookie,
        )

        const oldSessionData = await this.cacheService.get<CachedTokenResponse>(
          oldSessionCacheKey,
          // Do not throw an error if the key is not found
          false,
        )

        if (oldSessionData) {
          // Revoke the old session refresh token
          this.revokeRefreshToken(oldSessionData.encryptedRefreshToken)

          // Clean up the old session key from the cache.
          // Use catch() to handle unhandled promise rejections
          this.cacheService.delete(oldSessionCacheKey).catch((err) => {
            this.logger.warn(err)
          })
        }
      }

      return res.redirect(
        loginAttemptData.targetLinkUri || loginAttemptData.originUrl,
      )
    } catch (error) {
      this.logger.error('Callback login failed: ', error)

      return this.redirectWithError(res)
    }
  }

  /**
   * This method handles user logout. What it does:
   *
   * - Validates the session id in the query param and the session cookie
   * - Cleans up the cache and cookies
   * - Revokes the current session refresh token
   * - Redirects the user to the identity server end session endpoint
   */
  async logout({
    req,
    res,
    query,
  }: {
    req: Request
    res: Response
    query: LogoutDto
  }) {
    const sidCookie = req.cookies[SESSION_COOKIE_NAME]

    if (!sidCookie) {
      this.logger.error('Logout failed: No session cookie found')

      return res.redirect(this.config.logoutRedirectUri)
    }

    if (sidCookie !== query.sid) {
      this.logger.error(
        `Logout failed: Cookie sid "${sidCookie}" does not match the session id in query param "${query.sid}"`,
      )

      return this.redirectWithError(res, {
        code: 400,
        error: 'Logout failed!',
      })
    }

    const currentLoginCacheKey = this.cacheService.createSessionKeyType(
      'current',
      query.sid,
    )

    const cachedTokenResponse =
      await this.cacheService.get<CachedTokenResponse>(
        currentLoginCacheKey,
        // Do not throw an error if the key is not found
        false,
      )

    if (!cachedTokenResponse) {
      this.logger.error(
        `Logout failed: ${this.cacheService.createKeyError(
          currentLoginCacheKey,
        )}`,
      )

      return res.redirect(this.config.logoutRedirectUri)
    }

    /**
     * Clean up!
     *
     * - Revoke the refresh token on the identity server
     * - Delete the current login from the cache
     * - Clear the session cookie
     */
    res.clearCookie(SESSION_COOKIE_NAME, this.getCookieOptions())

    this.cacheService
      .delete(currentLoginCacheKey)
      // handle unhandled promise rejections
      .catch((err) => {
        this.logger.warn(err)
      })
    // Note! We deliberately do not await this operation to make the logout flow faster.
    this.revokeRefreshToken(cachedTokenResponse.encryptedRefreshToken)

    const searchParams = new URLSearchParams({
      id_token_hint: cachedTokenResponse.id_token,
      post_logout_redirect_uri: this.config.logoutRedirectUri,
    })

    return res.redirect(
      `${this.baseUrl}/connect/endsession?${searchParams.toString()}`,
    )
  }

  async callbackLogout(req: Request, body: CallbackLogoutDto) {
    this.logger.warn('callbackBackchannelLogout', JSON.stringify(body, null, 2))

    // TODO validate the token
    // clear the cache
    // https://openid.net/specs/openid-connect-backchannel-1_0.html
  }
}
