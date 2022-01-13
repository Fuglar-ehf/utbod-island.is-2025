import { Injectable } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'

import { Discount, User, Flight } from '@island.is/air-discount-scheme/types'
import { environment } from '../environments'

@Injectable()
class BackendAPI extends RESTDataSource {
  willSendRequest(req: RequestOptions) {
    req.headers.set('authorization', this.context.req.headers.authorization)
    req.headers.set('cookie', this.context.req.headers.cookie)
  }

  baseURL = `${environment.backendUrl}/api/private`

  getUserRelations(nationalId: string): Promise<User[]> {
    console.log('before redir to backend - user relations')
    return this.get(`users/${nationalId}/relations`)
  }

  getUserFlights(nationalId: string): Promise<Flight[]> {
    return this.get(`users/${nationalId}/flights`)
  }

  getFlightLegs(body: {}): Promise<Flight[]> {
    return this.post('flightLegs', body, { cacheOptions: { ttl: -1 } })
  }

  confirmInvoice(body: {}): Promise<Flight[]> {
    return this.post('flightLegs/confirmInvoice', body, {
      cacheOptions: { ttl: -1 },
    })
  }

  getDiscount(nationalId: string): Promise<Discount | null> {
    return this.get(`users/${nationalId}/discounts/current`)
  }

  createDiscount(nationalId: string): Promise<Discount> {
    return this.post(`users/${nationalId}/discounts`)
  }
}

export default BackendAPI
