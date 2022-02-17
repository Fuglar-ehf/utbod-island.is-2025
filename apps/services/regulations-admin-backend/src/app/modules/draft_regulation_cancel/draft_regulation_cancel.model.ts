import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import { DraftRegulationModel } from '../draft_regulation'

import { ISODate, RegName } from '@island.is/regulations'
import { DraftRegulationCancelId } from '@island.is/regulations/admin'

@Table({
  tableName: 'draft_regulation_cancel',
})
export class DraftRegulationCancelModel extends Model<DraftRegulationCancelModel> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: DraftRegulationCancelId

  @ForeignKey(() => DraftRegulationModel)
  @Column({
    type: DataType.UUID,
  })
  @ApiProperty()
  changing_id!: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  regulation!: RegName

  @Column({
    type: DataType.DATEONLY,
  })
  @ApiProperty()
  date!: ISODate
}
