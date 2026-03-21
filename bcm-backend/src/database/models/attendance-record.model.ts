import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  BelongsTo,
} from 'sequelize-typescript';

import { AttendanceSession } from './attendance-session.model';
import { Member } from './member.model';
import { User } from './user.model';

@Table({
  tableName: 'attendance_records',
  indexes: [
    {
      unique: true,
      fields: ['session_id', 'member_id'],
    },
  ],
})
export class AttendanceRecord extends Model<AttendanceRecord> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    field: 'id',
  })
  id: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'session_id',
    references: {
      model: 'attendance_sessions',
      key: 'id',
    },
  })
  sessionId: string;

  @BelongsTo(() => AttendanceSession, { foreignKey: 'sessionId' })
  session: AttendanceSession;

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

  @BelongsTo(() => Member, { foreignKey: 'memberId' })
  member: Member;

  @Column({
    type: DataType.ENUM,
    field: 'attendance_status',
    values: ['Present', 'Absent', 'Late', 'Excused'],
    allowNull: false,
  })
  attendanceStatus: string;

  @Column({
    type: DataType.DATE,
    field: 'check_in_time',
  })
  checkInTime: Date;

  @Column({
    type: DataType.TEXT,
    field: 'notes',
    allowNull: true,
  })
  notes: string;

  @Column({
    type: DataType.UUID,
    field: 'marked_by',
  })
  markedBy: string;

  @BelongsTo(() => User, { foreignKey: 'markedBy' })
  markedByUser: User;

  @Column({
    type: DataType.DATE,
    field: 'created_at',
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at',
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;
}
