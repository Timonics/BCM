import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { UnitMembership } from './unit-membership.model';
import { Department } from './department.model';

/**
 * Unit model - Represents church units (Teaching, Media, Welfare, etc.)
 * Units belong to a department; members belong to units.
 */
@Table({ tableName: 'units' })
export class Unit extends Model<Unit> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'department_id',
    references: {
      model: 'departments',
      key: 'id',
    },
  })
  @ForeignKey(() => Department)
  departmentId: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'founded_date',
  })
  foundedDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'meeting_schedule_day',
  })
  meetingScheduleDay: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'meeting_schedule_time',
  })
  meetingScheduleTime: string;

  @Default('active')
  @Column({
    type: DataType.ENUM('active', 'archived'),
    allowNull: false,
  })
  status: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @BelongsTo(() => Department, 'departmentId')
  department: Department;

  @HasMany(() => UnitMembership, 'unitId')
  memberships: UnitMembership[];
}

