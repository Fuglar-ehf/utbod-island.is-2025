import { Field, ObjectType, Int } from '@nestjs/graphql'
import { ListItem } from './listItem.model'

@ObjectType('FormSystemFieldSettings')
export class FieldSettings {
  @Field(() => Int, { nullable: true })
  minValue?: number

  @Field(() => Int, { nullable: true })
  maxValue?: number

  @Field(() => Int, { nullable: true })
  minLength?: number

  @Field(() => Int, { nullable: true })
  maxLength?: number

  @Field(() => Date, { nullable: true })
  minDate?: Date

  @Field(() => Date, { nullable: true })
  maxDate?: Date

  @Field(() => String, { nullable: true })
  minAmount?: string

  @Field(() => String, { nullable: true })
  maxAmount?: string

  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => Boolean, { nullable: true })
  hasLink?: boolean

  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => String, { nullable: true })
  buttonText?: string

  @Field(() => Boolean, { nullable: true })
  hasPropertyInput?: boolean

  @Field(() => Boolean, { nullable: true })
  hasPropertyList?: boolean

  @Field(() => [ListItem], { nullable: 'itemsAndList' })
  list?: ListItem[]

  @Field(() => String, { nullable: true })
  listType?: string

  @Field(() => String, { nullable: true })
  fileTypes?: string

  @Field(() => Int, { nullable: true })
  fileMaxSize?: number

  @Field(() => Int, { nullable: true })
  maxFiles?: number

  @Field(() => String, { nullable: true })
  timeInterval?: string
}
