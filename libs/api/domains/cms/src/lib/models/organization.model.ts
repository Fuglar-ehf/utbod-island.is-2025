import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IOrganization } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { OrganizationTag, mapOrganizationTag } from './organizationTag.model'

@ObjectType()
export class Organization {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  shortTitle?: string

  @Field({ nullable: true })
  description?: string

  @Field()
  slug!: string

  @Field(() => [OrganizationTag])
  tag?: Array<OrganizationTag>

  @Field({ nullable: true })
  logo?: Image | null

  @Field({ nullable: true })
  link?: string
}

export const mapOrganization = ({
  fields,
  sys,
}: IOrganization): Organization => ({
  id: sys.id,
  title: fields.title ?? '',
  shortTitle: fields.shortTitle ?? '',
  description: fields.description ?? '',
  slug: fields.slug ?? '',
  tag: (fields.tag ?? []).map(mapOrganizationTag),
  logo: fields.logo ? mapImage(fields.logo) : null,
  link: fields.link ?? '',
})
