import { Strategy } from 'passport-jwt'
import { Request } from 'express'

import { Injectable, Inject } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/judicial-system/consts'
import { User } from '@island.is/judicial-system/types'

import { Credentials } from './auth.types'
import environment from './environment'

const { jwtSecret } = environment

const cookieExtractor = (req: Request) => {
  if (req && req.cookies) {
    return req.cookies[ACCESS_TOKEN_COOKIE_NAME]
  }

  if (req && req.headers['cookie']) {
    const cookie: string = req.headers['cookie'] as string
    const match = cookie.match(
      new RegExp(
        '(?:^|;)\\s?' + ACCESS_TOKEN_COOKIE_NAME + '=(.*?)(?:;|$)',
        'i',
      ),
    )

    return match && unescape(match[1])
  }

  return undefined
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    })
  }

  validate(req: Request, { csrfToken, user }: Credentials): User | undefined {
    if (csrfToken && `Bearer ${csrfToken}` !== req.headers['authorization']) {
      this.logger.error('invalid csrf token')
      return undefined
    }

    return user
  }
}
