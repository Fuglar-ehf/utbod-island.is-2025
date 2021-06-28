import { Field, ObjectType } from '@nestjs/graphql'
import { CustomerRecordsItem } from './customerRecordsItem.model'

@ObjectType()
export class CustomerRecords {
  @Field(() => [CustomerRecordsItem])
  records!: CustomerRecordsItem[]
}
