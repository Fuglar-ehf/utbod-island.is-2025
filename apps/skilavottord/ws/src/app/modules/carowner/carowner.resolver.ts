import { HttpException } from '@nestjs/common'
import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import { Carowner } from './models'
import { CarownerService } from './models/carowner.service'
import { DeregisterCarInput } from './models/dto'
import { Authorize } from '../auth'

console.log('---Starting Resolver for Carowner  - before Authorize---')
@Resolver(() => Carowner)
export class CarownerResolver {
  carownerService: CarownerService

  constructor() {
    this.carownerService = new CarownerService()
  }
  @Authorize()
  //query b {getUserByNationalId(nationalId: "2222222222"){name, mobile}}
  //getCarownerByNationalId(@Args('nationalId') nid: string): Carowner {
  @Query(() => Carowner)
  getVehiclesForNationalId(@Args('nationalId') nid: string): Carowner {
    return this.carownerService.getVehiclesForNationalId(nid)
  }

  @Mutation((returns) => Boolean)
  deregisterCar(
    @Args('deregisterCarInput') dereginput: DeregisterCarInput,
  ): boolean {
    if (dereginput.permno === '1') {
      throw new HttpException("can't derigiesterCar", 400)
    }
    return true
  }

  @Mutation((returns) => Boolean)
  requestPayment(
    @Args('permno') permno: string,
    @Args('nationalid') nationalid: string,
  ): boolean {
    //this.carownerService.getRestTest()
    if (permno === '1') {
      throw new HttpException(
        'requestPayment error! nationalId:' + nationalid,
        400,
      )
    }
    return true
  }
}
