import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsArray } from 'class-validator'
import { IsNationalId } from '@island.is/shared/nestjs'

export class BulkEndorsementDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNationalId({ each: true })
  nationalIds!: string[]
}
