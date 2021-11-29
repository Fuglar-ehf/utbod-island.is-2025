import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ILink } from '../generated/contentfulTypes'

@ObjectType()
export class Link {
  @Field(() => ID)
  id!: string

  @Field()
  text!: string

  @Field()
  url!: string

  @Field({ nullable: true })
  intro?: string

  @Field(() => [String], { nullable: true })
  labels: string[] = []

  @Field()
  date!: string
}

export const mapLink = ({ sys, fields }: ILink): Link => {
  return {
    id: sys.id,
    text: fields?.text ?? '',
    url: fields?.url ?? '',
    intro: fields?.intro ?? '',
    labels: fields?.labels ?? [],
    date: fields?.date ?? '',
  }
}
