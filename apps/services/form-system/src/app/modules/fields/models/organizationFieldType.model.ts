import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Organization } from '../../organizations/models/organization.model'
import { FieldType } from './fieldType.model'
import { CreationOptional } from 'sequelize'

@Table({ tableName: 'organization_field_type' })
export class OrganizationFieldType extends Model<OrganizationFieldType> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified!: CreationOptional<Date>

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'organization_id',
  })
  organizationId!: string

  @ForeignKey(() => FieldType)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'field_type_id',
  })
  fieldTypeId!: string
}
