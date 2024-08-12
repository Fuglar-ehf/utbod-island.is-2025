import { ApiProperty } from '@nestjs/swagger'
import { CreationOptional, NonAttribute } from 'sequelize'
import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { Organization } from '../../organizations/models/organization.model'
import { Field } from './field.model'

@Table({ tableName: 'field_type' })
export class FieldType extends Model<FieldType> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  @ApiProperty()
  type!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  @ApiProperty({ type: LanguageType })
  description!: LanguageType

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  isCommon!: boolean

  @HasMany(() => Field)
  fields?: Field[]

  @BelongsToMany(() => Organization, {
    through: 'organization_field_type',
    foreignKey: 'field_type_id',
    otherKey: 'organization_id',
  })
  organizations?: NonAttribute<Organization[]>
}
