import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

import { ClientType } from '../../../types'

export class AdminCreateClientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '@domain.is/client-id',
  })
  readonly clientId!: string

  @IsNotEmpty()
  @IsEnum(ClientType)
  @ApiProperty({
    example: 'spa',
    enum: ClientType,
    enumName: 'ClientType',
  })
  readonly clientType!: ClientType

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Client name',
  })
  readonly clientName!: string
}
