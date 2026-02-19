import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { ClassBatch } from './class-batch.model';
import { Member } from './member.model';

/**
 * ClassEnrollment model - Tracks member enrollment in class batches
 * Handles multiple attempts (retakes) and approval workflow
 */
@Table({ tableName: 'class_enrollments' })
export class ClassEnrollment extends Model<ClassEnrollment> {
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
    field: 'batch_id',
    references: {
      model: 'class_batches',
      key: 'id',
    },
  })
  batchId: string;

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

  @Default(1)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'attempt_no',
  })
  attemptNo: number;

  @Default('enrolled')
  @Column({
    type: DataType.ENUM('enrolled', 'approved', 'failed', 'rolled_over'),
    allowNull: false,
    field: 'enrollment_status',
  })
  enrollmentStatus: string;

  @Default('manual')
  @Column({
    type: DataType.ENUM('import', 'manual', 'auto_migrate'),
    allowNull: false,
  })
  source: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'migrated_from_batch_id',
    references: {
      model: 'class_batches',
      key: 'id',
    },
  })
  migratedFromBatchId: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'enrolled_at',
  })
  enrolledAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'decided_at',
  })
  decidedAt: Date;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'sessions_attended',
  })
  sessionsAttended: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'total_sessions',
  })
  totalSessions: number;

  @Default('not_ready')
  @Column({
    type: DataType.ENUM('ready', 'not_ready'),
    allowNull: false,
    field: 'graduation_status',
  })
  graduationStatus: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'band_eligible',
  })
  bandEligible: boolean;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  // Associations for sequelize-typescript to detect foreign keys
  @BelongsTo(() => ClassBatch, 'batchId')
  batch: ClassBatch;

  @BelongsTo(() => Member, 'memberId')
  member: Member;
}
