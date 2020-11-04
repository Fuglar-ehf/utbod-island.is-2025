import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Client } from './client.model'

@Table({
  tableName: 'client_redirect_uri',
  indexes: [
    {
      fields: ['client_id', 'redirect_uri'],
    },
  ],
})
export class ClientRedirectUri extends Model<ClientRedirectUri> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ForeignKey(() => Client)
  @ApiProperty()
  clientId: string

  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  redirectUri: string
}
