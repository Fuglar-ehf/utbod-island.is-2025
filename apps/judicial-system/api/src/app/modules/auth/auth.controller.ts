import { Entropy } from 'entropy-string'
import { CookieOptions, Request, Response } from 'express'
import { createHash, randomBytes } from 'crypto'

import { Controller, Get, Inject, Res, Query, Req } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import {
  CSRF_COOKIE_NAME,
  CODE_VERIFIER_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_NAME,
  EXPIRES_IN_MILLISECONDS,
  CASES_ROUTE,
  USERS_ROUTE,
  COURT_OF_APPEAL_CASES_ROUTE,
} from '@island.is/judicial-system/consts'
import { InstitutionType, UserRole } from '@island.is/judicial-system/types'
import { SharedAuthService } from '@island.is/judicial-system/auth'
import {
  AuditedAction,
  AuditTrailService,
} from '@island.is/judicial-system/audit-trail'

import { environment } from '../../../environments'
import { AuthUser, Cookie } from './auth.types'
import { AuthService } from './auth.service'
import { authModuleConfig } from './auth.config'

const REDIRECT_COOKIE_NAME = 'judicial-system.redirect'

const defaultCookieOptions: CookieOptions = {
  secure: environment.production,
  httpOnly: true,
  sameSite: 'lax',
}

const REDIRECT_COOKIE: Cookie = {
  name: REDIRECT_COOKIE_NAME,
  options: {
    ...defaultCookieOptions,
    sameSite: 'none',
  },
}

const ACCESS_TOKEN_COOKIE: Cookie = {
  name: ACCESS_TOKEN_COOKIE_NAME,
  options: defaultCookieOptions,
}

const CODE_VERIFIER_COOKIE: Cookie = {
  name: CODE_VERIFIER_COOKIE_NAME,
  options: {
    ...defaultCookieOptions,
  },
}
const CSRF_COOKIE: Cookie = {
  name: CSRF_COOKIE_NAME,
  options: {
    ...defaultCookieOptions,
    httpOnly: false,
  },
}

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly auditTrailService: AuditTrailService,
    private readonly authService: AuthService,
    private readonly sharedAuthService: SharedAuthService,

    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(authModuleConfig.KEY)
    private readonly config: ConfigType<typeof authModuleConfig>,
  ) {}

  @Get('login')
  login(
    @Res() res: Response,
    @Query('redirectRoute') redirectRoute: string,
    @Query('nationalId') nationalId: string,
  ) {
    this.logger.debug('Received login request')

    const { name, options } = REDIRECT_COOKIE

    res.clearCookie(name, options)
    res.clearCookie(CODE_VERIFIER_COOKIE.name, CODE_VERIFIER_COOKIE.options)

    // Local development
    if (this.config.allowAuthBypass && nationalId) {
      this.logger.debug(`Logging in using development mode`)

      return this.redirectAuthenticatedUser(
        {
          nationalId,
        },
        res,
        redirectRoute,
      )
    }

    const codeVerifier = randomBytes(32)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    const codeChallenge = createHash('sha256')
      .update(codeVerifier)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')

    const params = new URLSearchParams({
      response_type: 'code',
      scope: this.config.scope,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
    })

    const loginUrl = `${this.config.issuer}/login?ReturnUrl=/connect/authorize/callback?${params}`

    return res
      .cookie(name, { redirectRoute }, options)
      .cookie(
        CODE_VERIFIER_COOKIE.name,
        codeVerifier,
        CODE_VERIFIER_COOKIE.options,
      )
      .redirect(loginUrl)
  }

  @Get('callback/identity-server')
  async callback(
    @Query('code') code: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    this.logger.debug('Received callback request')

    const { redirectRoute } = req.cookies[REDIRECT_COOKIE_NAME] ?? {}
    const codeVerifier = req.cookies[CODE_VERIFIER_COOKIE.name]
    res.clearCookie(CODE_VERIFIER_COOKIE.name, CODE_VERIFIER_COOKIE.options)

    try {
      const idsTokens = await this.authService.fetchIdsToken(code, codeVerifier)
      const verifiedUserToken = await this.authService.verifyIdsToken(
        idsTokens.id_token,
      )

      if (verifiedUserToken) {
        this.logger.debug('Token verification successful')

        return this.redirectAuthenticatedUser(
          {
            nationalId: verifiedUserToken.nationalId,
          },
          res,
          redirectRoute,
          new Entropy({ bits: 128 }).string(),
        )
      }
    } catch (error) {
      this.logger.error('Authentication callback failed:', { error })
    }

    return res.redirect('/?villa=innskraning-ogild')
  }

  @Get('logout')
  logout(@Res() res: Response) {
    this.logger.debug('Received logout request')

    res.clearCookie(ACCESS_TOKEN_COOKIE.name, ACCESS_TOKEN_COOKIE.options)
    res.clearCookie(CSRF_COOKIE.name, CSRF_COOKIE.options)
    res.clearCookie(CODE_VERIFIER_COOKIE.name, CODE_VERIFIER_COOKIE.options)

    return res.json({ logout: true })
  }

  private async authorizeUser(
    authUser: AuthUser,
    csrfToken: string | undefined,
    requestedRedirectRoute: string,
  ) {
    const user = await this.authService.findUser(authUser.nationalId)

    if (user && this.authService.validateUser(user)) {
      return {
        userId: user.id,
        jwtToken: this.sharedAuthService.signJwt(user, csrfToken),
        redirectRoute: requestedRedirectRoute
          ? requestedRedirectRoute
          : user.role === UserRole.ADMIN
          ? USERS_ROUTE
          : user.institution?.type === InstitutionType.HIGH_COURT
          ? COURT_OF_APPEAL_CASES_ROUTE
          : CASES_ROUTE,
      }
    } else {
      const defender = await this.authService.findDefender(authUser.nationalId)

      if (defender && this.authService.validateUser(defender)) {
        return {
          userId: defender.id,
          jwtToken: this.sharedAuthService.signJwt(defender, csrfToken),
          redirectRoute: requestedRedirectRoute,
        }
      }
    }

    return undefined
  }

  private async redirectAuthenticatedUser(
    authUser: AuthUser,
    res: Response,
    requestedRedirectRoute: string,
    csrfToken?: string,
  ) {
    const authorization = await this.authorizeUser(
      authUser,
      csrfToken,
      requestedRedirectRoute,
    )

    if (!authorization) {
      this.logger.error('Blocking login attempt from an unauthorized user')

      return res.redirect('/?villa=innskraning-ekki-notandi')
    }

    const { userId, jwtToken, redirectRoute } = authorization

    this.auditTrailService.audit(
      userId,
      AuditedAction.LOGIN,
      res
        .cookie(
          CSRF_COOKIE.name,
          csrfToken as string,
          {
            ...CSRF_COOKIE.options,
            maxAge: EXPIRES_IN_MILLISECONDS,
          } as CookieOptions,
        )
        .cookie(ACCESS_TOKEN_COOKIE.name, jwtToken, {
          ...ACCESS_TOKEN_COOKIE.options,
          maxAge: EXPIRES_IN_MILLISECONDS,
        })
        .redirect(redirectRoute),
      userId,
    )
  }
}
