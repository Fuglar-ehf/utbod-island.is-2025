import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { IsObject } from 'class-validator'
import { GenericLicenseDataFieldType } from '../licenceService.type'
import graphqlTypeJson from 'graphql-type-json'

registerEnumType(GenericLicenseDataFieldType, {
  name: 'GenericLicenseDataFieldType',
  description: 'Possible types of data fields',
})

@ObjectType()
export class GenericLicenseDataField {
  @Field(() => GenericLicenseDataFieldType, {
    description: 'Type of data field',
  })
  type!: GenericLicenseDataFieldType

  @Field({ nullable: true, description: 'Name of data field' })
  name?: string

  @Field({ nullable: true, description: 'Label of data field' })
  label?: string

  @Field({ nullable: true, description: 'Value of data field' })
  value?: string

  @Field(() => [GenericLicenseDataField], {
    nullable: true,
    description: 'Name of data field',
  })
  fields?: GenericLicenseDataField[]
}

@ObjectType()
export class Payload {
  @Field(() => [GenericLicenseDataField], {
    description: 'Data parsed into a standard format',
  })
  data!: GenericLicenseDataField[]

  @Field(() => graphqlTypeJson, {
    nullable: true,
    description: 'Raw JSON data',
  })
  @IsObject()
  // eslint-disable-next-line @typescript-eslint/ban-types
  rawData?: object
}
