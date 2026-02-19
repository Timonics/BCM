import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { Band } from './band.model';
import { Member } from './member.model';

/**
 * BandMembership model - Junction table for band-member relationships
 * Tracks when members join/leave bands and flags overgrown members
 */
@Table({ tableName: 'band_memberships' })
export class BandMembership extends Model<BandMembership> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'band_id',
    references: {
      model: 'bands',
      key: 'id',
    },
  })
  bandId: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'member_id',
    references: {
      model: 'members',
      key: 'id',
    },
  })
  memberId: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'start_date',
  })
  startDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'end_date',
  })
  endDate: Date;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_active',
  })
  isActive: boolean;

  @Column({
    type: DataType.ENUM('transfer', 'suspended', 'left'),
    allowNull: true,
    field: 'exit_reason',
  })
  exitReason: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'overgrown_flag',
  })
  overgrownFlag: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'overgrown_at',
  })
  overgrownAt: Date;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  // Associations for sequelize-typescript to detect foreign keys
  @BelongsTo(() => Band, 'bandId')
  band: Band;

  @BelongsTo(() => Member, 'memberId')
  member: Member;
}
