import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'

import { environment } from '../../../environments'
import { HttpRequest } from '../../app.types'
import { getUserFromContext } from '../../lib'
const { airlineApiKeys } = environment

const AUTH_TYPE = 'bearer'

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('backend custom authguard')
    console.log(context)
    const user = getUserFromContext(context)
    const request = context.switchToHttp().getRequest<HttpRequest>()

    if (!user) {
      throw new UnauthorizedException()
    }

    if(user.role === 'user') {

    }
    if(user.role === 'developer') {

    }
    if(user.role === 'admin'){
      
    }

    return this.hasValidApiKey(request)
  }



  // canActivate(context: ExecutionContext): boolean {
  //   console.log('can activate backend')
  //   const user = getUserFromContext(context)
  //   const request = context.switchToHttp().getRequest<HttpRequest>()

  //   if (!user) {
  //     throw new UnauthorizedException()
  //   }
    
  //   return this.hasValidApiKey(request)
  // }

  getAuthorization(headers: HttpRequest['headers']): string | null {
    const { authorization } = headers
    if (!authorization) {
      return null
    }

    if (typeof authorization === 'string') {
      return authorization
    }
    return authorization[0]
  }

  hasValidApiKey(request: HttpRequest): boolean {
    const authorization = this.getAuthorization(request.headers)
    if (!authorization) {
      return false
    }

    if (!authorization.toLowerCase().startsWith(AUTH_TYPE)) {
      return false
    }

    const apiKey = authorization.slice(AUTH_TYPE.length + 1)
    if (!apiKey) {
      return false
    }

    const airline = Object.keys(airlineApiKeys).find(
      (airline: string) => airlineApiKeys[airline] === apiKey,
    )
    if (!airline) {
      return false
    }

    request.airline = airline
    return true
  }
}
