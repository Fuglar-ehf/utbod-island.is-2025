import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IMailingListSignup } from '../generated/contentfulTypes'
import { SystemMetadata } from '../types'

@ObjectType()
export class MailingListSignupSlice {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field({ nullable: true })
  description: string

  @Field()
  inputLabel: string

  @Field()
  buttonText: string
}

export const mapMailingListSignup = ({
  fields,
  sys,
}: IMailingListSignup): SystemMetadata<MailingListSignupSlice> => ({
  typename: 'MailingListSignupSlice',
  id: sys.id,
  title: fields.title ?? '',
  description: fields.description ?? '',
  inputLabel: fields.inputLabel ?? '',
  buttonText: fields.buttonText ?? '',
})
