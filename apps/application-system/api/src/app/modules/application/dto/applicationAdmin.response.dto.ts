import { ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsString } from 'class-validator'
import { BaseApplicationResponseDto } from './application.response.dto'

export class ApplicationListAdminResponseDto extends BaseApplicationResponseDto {
  @ApiPropertyOptional()
  @Expose()
  @IsString()
  applicantName?: string

  @ApiPropertyOptional()
  @Expose()
  @IsString()
  paymentStatus?: string

  constructor(partial: Partial<ApplicationListAdminResponseDto>) {
    super(partial)
    Object.assign(this, partial)
  }
}
