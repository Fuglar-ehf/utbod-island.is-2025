import { Injectable, Inject } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'

//import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/skilavottord/consts'
import { ACCESS_TOKEN_COOKIE_NAME } from '@island.is/skilavottord/consts'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { environment } from '../../../environments'
import { Credentials } from './auth.types'

const cookieExtractor = (req) => {
  if (req && req.cookies) {
    return req.cookies[ACCESS_TOKEN_COOKIE_NAME]
  }
  return null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: environment.auth.jwtSecret,
      passReqToCallback: true,
    })
  }

  validate(req: Request, { csrfToken, user }: Credentials) {
    this.logger.error(csrfToken)
    this.logger.error(`Bearer ${csrfToken}`)
    this.logger.error(req.headers['authorization'])
    this.logger.error(user.mobile)
    this.logger.error(user.name)
    this.logger.error(user.nationalId)
    //    this.logger.error(CurrentUser.name)
    if (csrfToken && `Bearer ${csrfToken}` !== req.headers['authorization']) {
      //    if ( 0 ) {
      this.logger.error('invalid csrf token -')
      return null
    }

    return user
  }
}
