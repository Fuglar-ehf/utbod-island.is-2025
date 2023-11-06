import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

@Table({
  tableName: 'university',
})
export class University extends Model {
  @ApiProperty({
    description: 'University ID',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id!: string

  @ApiProperty({
    description: 'University national ID',
    example: '123456-7890',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nationalId!: string

  @ApiProperty({
    description: 'Contentful key for university',
    example: 'UniversityOfIceland',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  contentfulKey!: string

  @ApiProperty({
    type: String,
  })
  @CreatedAt
  readonly created!: Date

  @ApiProperty({
    type: String,
  })
  @UpdatedAt
  readonly modified!: Date
}
