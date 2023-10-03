import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalDrugsBills')
export class DrugsBills {
  @Field(() => ID, { nullable: true })
  id?: number | null

  @Field(() => Date, { nullable: true })
  date?: Date | null

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => Number, { nullable: true })
  totalCopaymentAmount?: number | null

  @Field(() => Number, { nullable: true })
  totalCustomerAmount?: number | null

  @Field(() => Number, { nullable: true })
  totalInsuranceAmount?: number | null

  @Field(() => Number, { nullable: true })
  totalCalculatedForPaymentStepAmount?: number | null
}
