import { InputType, Field } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType('DocumentInput')
export class DocumentInput {
  @Field()
  @IsString()
  readonly id!: string

  @Field({ nullable: true, description: 'Optional. For logging only.' })
  @IsOptional()
  @IsString()
  readonly provider?: string

  @Field({ defaultValue: 10 })
  readonly pageSize!: number
}
