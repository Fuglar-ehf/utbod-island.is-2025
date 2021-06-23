import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

import { ApplicationState } from '@island.is/financial-aid/shared'

export class UpdateApplicationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly state: ApplicationState
}
