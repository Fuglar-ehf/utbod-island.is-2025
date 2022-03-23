import { Field, ID, ObjectType } from '@nestjs/graphql'
import { DataStatus } from './types/dataStatus.enum'

@ObjectType()
export class UserProfile {
  @Field(() => ID)
  nationalId?: string

  @Field(() => String, { nullable: true })
  mobilePhoneNumber?: string

  @Field(() => String, { nullable: true })
  locale?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => Boolean)
  emailVerified!: boolean

  @Field(() => Boolean)
  mobilePhoneNumberVerified!: boolean

  @Field(() => Boolean)
  documentNotifications!: boolean

  @Field(() => String, { nullable: true })
  emailStatus?: string

  @Field(() => String, { nullable: true })
  mobileStatus?: string

  @Field(() => Date, { nullable: true })
  modified?: Date

  // Temporary merge with islyklar service
  @Field(() => Boolean, { nullable: true })
  canNudge?: boolean

  @Field(() => String, { nullable: true })
  bankInfo?: string
}
