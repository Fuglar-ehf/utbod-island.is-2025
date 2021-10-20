import { Field, ObjectType, ID } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { EndorsementListTagsEnum } from '../enums/endorsementListTags.enum'
import { Endorsement } from './endorsement.model'
import { ValidationRule } from './validationRule.model'

@ObjectType()
export class EndorsementList {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description!: string | null

  @Field(() => Date)
  closedDate!: Date

  @Field(() => Date)
  openedDate!: Date

  @Field()
  adminLock!: boolean

  @Field(() => [EndorsementListTagsEnum])
  tags!: EndorsementListTagsEnum[]

  @Field(() => [ValidationRule])
  validationRules!: ValidationRule[]

  @Field()
  owner!: string

  @Field(() => graphqlTypeJson)
  meta!: object

  @Field()
  created!: string

  @Field()
  modified!: string
}
