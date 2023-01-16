import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { PlateOrderingApi } from '../../gen/fetch/apis'
import { DeliveryStation, PlateOrder } from './vehiclePlateOrderingClient.types'

@Injectable()
export class VehiclePlateOrderingClient {
  constructor(private readonly plateOrderingApi: PlateOrderingApi) {}

  private plateOrderingApiWithAuth(auth: Auth) {
    return this.plateOrderingApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getDeliveryStations(
    auth: User,
  ): Promise<Array<DeliveryStation>> {
    const result = await this.plateOrderingApiWithAuth(
      auth,
    ).deliverystationsGet({
      apiVersion: '1.0',
      apiVersion2: '1.0',
    })

    return result.map((item) => ({
      name: item.name,
      type: item.stationType || '',
      code: item.stationCode || '',
    }))
  }

  public async orderPlates(auth: User, plateOrder: PlateOrder): Promise<void> {
    await this.plateOrderingApiWithAuth(auth).orderplatesPost({
      apiVersion: '1.0',
      apiVersion2: '1.0',
      postOrderPlatesModel: {
        permno: plateOrder.permno,
        frontType: plateOrder.frontType,
        rearType: plateOrder.rearType,
        stationToDeliverTo: plateOrder.deliveryStationCode || '',
        stationType: plateOrder.deliveryStationType || '',
        expressOrder: plateOrder.expressOrder,
      },
    })
  }
}
