import { IsString, IsOptional } from 'class-validator'

import { ApiPropertyOptional } from '@nestjs/swagger'

import { Gender } from '@island.is/judicial-system/types'

export class UpdateDefendantDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly nationalId?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly name?: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ enum: Gender })
  readonly gender?: Gender

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly address?: string
}
