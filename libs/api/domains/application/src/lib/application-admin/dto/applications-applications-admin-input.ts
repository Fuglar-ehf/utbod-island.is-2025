import { Field, InputType, PartialType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
class FiltersAdminInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  typeId?: string[]

  @Field(() => [String], { nullable: true })
  @IsOptional()
  status?: string[]
}

@InputType()
export class ApplicationApplicationsAdminInput extends PartialType(
  FiltersAdminInput,
) {
  @Field(() => String)
  nationalId!: string
}
