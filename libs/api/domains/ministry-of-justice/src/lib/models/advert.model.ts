import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum AdvertStatus {
  Active = 'Virk',
  Revoked = 'Afturkölluð',
  Draft = 'Drög',
  Old = 'Eldri auglýsing',
  Rejected = 'Hafnað',
  Waiting = 'Í bið',
  InProgress = 'Í vinnslu',
  Submitted = 'Innsend',
  ReadyForPublication = 'Tilbúin til útgáfu',
  Published = 'Útgefin',
  Unknown = 'Óþekkt',
}

registerEnumType(AdvertStatus, {
  name: 'MinistryOfJusticeAdvertStatus',
})

@ObjectType('MinistryOfJusticeAdvertEntity')
export class AdvertEntity {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  slug!: string
}

@ObjectType('MinistryOfJusticeAdvertDocument')
export class AdvertDocument {
  @Field(() => Boolean)
  isLegacy!: boolean

  @Field(() => String)
  html!: string | null

  @Field(() => String, { nullable: true })
  pdfUrl?: string | null
}

@ObjectType('MinistryOfJusticeAdvertPublicationNumber')
export class AdvertPublicationNumber {
  @Field(() => Int)
  number!: number

  @Field(() => Int)
  year!: number

  @Field(() => String)
  full!: string
}

@ObjectType('MinistryOfJusticeAdvertType')
export class AdvertType {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  slug!: string

  @Field(() => AdvertEntity)
  department!: AdvertEntity
}

@ObjectType('MinistryOfJusticeAdvert')
export class Advert {
  @Field(() => ID)
  id!: string

  @Field(() => AdvertEntity)
  department!: AdvertEntity

  @Field(() => AdvertType)
  type!: AdvertType

  @Field(() => String)
  subject?: string

  @Field(() => String)
  title!: string

  @Field(() => AdvertStatus)
  status!: AdvertStatus

  @Field(() => AdvertPublicationNumber)
  publicationNumber!: AdvertPublicationNumber | null

  @Field(() => String)
  createdDate!: string

  @Field(() => String)
  updatedDate!: string

  @Field(() => String)
  signatureDate!: string | null

  @Field(() => String)
  publicationDate!: string | null

  @Field(() => [AdvertEntity])
  categories!: AdvertEntity[]

  @Field(() => AdvertEntity)
  involvedParty!: AdvertEntity

  @Field(() => AdvertDocument)
  document!: AdvertDocument
}
