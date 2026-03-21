import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { AttendanceRecord } from './attendance-record.model';
import { User } from './user.model';

@Table({ tableName: 'attendance_sessions' })
export class AttendanceSession extends Model<AttendanceSession> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'title',
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    field: 'description',
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM,
    values: ['Physical', 'Virtual', 'Hybrid'],
    field: 'attendance_mode',
    allowNull: true,
  })
  attendanceMode: string;

  @Column({
    type: DataType.ENUM,
    field: 'session_type',
    values: [
      'General Service',
      'Band Meeting',
      'Unit Meeting',
      'Class Session',
      'Committee Meeting',
      'Special Program',
    ],
    allowNull: false,
  })
  sessionType: string;

  @Column({
    type: DataType.DATEONLY,
    field: 'session_date',
    allowNull: false,
  })
  sessionDate: Date;

  @Column({
    type: DataType.ENUM,
    field: 'marking_mode',
    values: ['Manual', 'Quick Count', 'Hybrid'],
    defaultValue: 'Hybrid',
    allowNull: false,
  })
  markingMode: string;

  @Column({
    type: DataType.ENUM,
    field: 'status',
    values: ['Open', 'Marked', 'Closed'],
    allowNull: false,
    defaultValue: 'Open',
  })
  status: string;

  @Column({
    type: DataType.UUID,
    field: 'entity_id',
  })
  entityId: string;

  @Column({
    type: DataType.STRING,
    field: 'entity_type',
  })
  entityType: string;

  @Column({
    type: DataType.INTEGER,
    field: 'total_expected',
  })
  totalExpected: number;

  @Column({
    type: DataType.INTEGER,
    field: 'total_marked',
  })
  totalMarked: number;

  @Column({
    type: DataType.INTEGER,
    field: 'quick_count_total',
  })
  quickCountTotal: number;

  @Column({
    type: DataType.INTEGER,
    field: 'male_count',
  })
  maleCount: number;

  @Column({
    type: DataType.INTEGER,
    field: 'female_count',
  })
  femaleCount: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id',
    },
  })
  createdBy: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @BelongsTo(() => User, 'createdBy')
  creator: User;

  @HasMany(() => AttendanceRecord, 'sessionId')
  records: AttendanceRecord[];
}
