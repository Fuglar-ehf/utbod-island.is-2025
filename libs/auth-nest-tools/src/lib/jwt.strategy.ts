import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { passportJwtSecret } from 'jwks-rsa'
import type { AuthConfig } from './auth.module'
import { JwtPayload } from './jwt.payload'
import { Auth } from './auth'

const AUTH_BODY_FIELD_NAME = '__accessToken'
const JWKS_URI = '/.well-known/openid-configuration/jwks'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: AuthConfig) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: `${config.issuer}${JWKS_URI}`,
      }),

      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromBodyField(AUTH_BODY_FIELD_NAME),
      ]),
      audience: config.audience,
      issuer: config.issuer,
      algorithms: ['RS256'],
      ignoreExpiration: false,
      passReqToCallback: true,
    })
  }

  private parseScopes(scopes: undefined | string | string[]): string[] {
    if (scopes === undefined) {
      return []
    }
    if (typeof scopes === 'string') {
      return scopes.split(' ')
    }
    return scopes
  }

  async validate(request: Request, payload: JwtPayload): Promise<Auth> {
    return {
      nationalId: payload.nationalId,
      scope: this.parseScopes(payload.scope),
      client: payload.client_id,
      authorization: request.headers.authorization ?? '',
      actor: payload.act && {
        nationalId: payload.act.nationalId,
        scope: this.parseScopes(payload.act.scope),
      },
      ip: String(request.headers['x-real-ip']) ?? request.ip,
      userAgent: request.headers['user-agent'],
    }
  }
}
