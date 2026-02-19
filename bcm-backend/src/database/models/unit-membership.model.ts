import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { Unit } from './unit.model';
import { Member } from './member.model';

/**
 * UnitMembership model - Junction table for unit-member relationships
 * Members can belong to multiple units simultaneously
 */
@Table({ tableName: 'unit_memberships' })
export class UnitMembership extends Model<UnitMembership> {
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
    field: 'unit_id',
    references: {
      model: 'units',
      key: 'id',
    },
  })
  unitId: string;

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
    type: DataType.STRING,
    allowNull: true,
    field: 'exit_reason',
  })
  exitReason: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  // Associations for sequelize-typescript to detect foreign keys
  @BelongsTo(() => Unit, 'unitId')
  unit: Unit;

  @BelongsTo(() => Member, 'memberId')
  member: Member;
}

