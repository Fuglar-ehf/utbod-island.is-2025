import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty } from '@nestjs/swagger'

import {
  CaseState,
  CaseCustodyProvisions,
  CaseAppealDecision,
  CaseCustodyRestrictions,
} from '@island.is/judicial-system/types'

import { User } from '../../user'
import { Notification } from './notification.model'

@Table({
  tableName: 'case',
  timestamps: true,
})
export class Case extends Model<Case> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id: string

  @CreatedAt
  @ApiProperty()
  created: Date

  @UpdatedAt
  @ApiProperty()
  modified: Date

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseState),
    defaultValue: CaseState.DRAFT,
  })
  @ApiProperty({ enum: CaseState })
  state: CaseState

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  policeCaseNumber: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  accusedNationalId: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accusedName: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  accusedAddress: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  court: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  arrestDate: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  requestedCourtDate: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  requestedCustodyEndDate: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Lagaákvæði sem brot varða við
  lawsBroken: string

  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyProvisions),
  })
  @ApiProperty({ enum: CaseCustodyProvisions, isArray: true })
  // Lagaákvæði sem krafan byggir á
  custodyProvisions: CaseCustodyProvisions[]

  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyRestrictions),
  })
  @ApiProperty({ enum: CaseCustodyRestrictions, isArray: true })
  // Takmarkanir á gæslu
  requestedCustodyRestrictions: CaseCustodyRestrictions[]

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Málsatvik rakin
  caseFacts: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Lagarök
  legalArguments: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Athugasemdir til dómara
  comments: string

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  prosecutorId: string

  @BelongsTo(() => User, 'prosecutorId')
  @ApiProperty({ type: User })
  prosecutor: User

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Málsnúmer héraðsdóms
  courtCaseNumber: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtDate: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  courtRoom: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  defenderName: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  defenderEmail: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtStartTime: Date

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  courtEndTime: Date

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Viðstaddir og hlutverk þeirra
  courtAttendees: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Krafa lögreglu
  policeDemands: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Afstaða kærða
  accusedPlea: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Málflutningsræður
  litigationPresentations: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Niðurstaða úrskurðar
  ruling: string

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  @ApiProperty()
  // Hafna kröfu
  rejecting: boolean

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  custodyEndDate: Date

  @Column({
    type: DataType.ARRAY(DataType.ENUM),
    allowNull: true,
    values: Object.values(CaseCustodyRestrictions),
  })
  @ApiProperty({ enum: CaseCustodyRestrictions, isArray: true })
  // Takmarkanir á gæslu
  custodyRestrictions: CaseCustodyRestrictions[]

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealDecision),
  })
  @ApiProperty({ enum: CaseAppealDecision })
  // Ákvörðun um kæru kærða
  accusedAppealDecision: CaseAppealDecision

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Yfirlýsing um kæru
  accusedAppealAnnouncement: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseAppealDecision),
  })
  @ApiProperty({ enum: CaseAppealDecision })
  // Ákvörðun um kæru sækjanda
  prosecutorAppealDecision: CaseAppealDecision

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  // Yfirlýsing um kæru
  prosecutorAppealAnnouncement: string

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ApiProperty()
  judgeId: string

  @BelongsTo(() => User, 'judgeId')
  @ApiProperty({ type: User })
  judge: User

  @HasMany(() => Notification)
  @ApiProperty({ type: Notification, isArray: true })
  notifications: Notification[]
}
