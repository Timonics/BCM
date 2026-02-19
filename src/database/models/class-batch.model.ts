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
} from 'sequelize-typescript';
import { ClassType } from './class-type.model';
import { ClassEnrollment } from './class-enrollment.model';

/**
 * ClassBatch model - Represents a specific batch of a class type
 * E.g., "ETS January 2025 Batch" or "Pre-Youth 2025 Batch"
 */
@Table({ tableName: 'class_batches' })
export class ClassBatch extends Model<ClassBatch> {
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
    field: 'class_type_id',
    references: {
      model: 'class_types',
      key: 'id',
    },
  })
  classTypeId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    field: 'batch_code',
  })
  batchCode: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  year: number;

  @Column({
    type: DataType.ENUM('JAN', 'AUG', 'ANNUAL'),
    allowNull: false,
  })
  intake: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'start_date',
  })
  startDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'end_date',
  })
  endDate: Date;

  @Default('not_started')
  @Column({
    type: DataType.ENUM(
      'open',
      'closed',
      'archived',
      'not_started',
      'started',
      'completed',
    ),
    allowNull: false,
  })
  status: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'system_generated',
  })
  systemGenerated: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'max_capacity',
  })
  maxCapacity: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  // Associations
  @BelongsTo(() => ClassType, 'classTypeId')
  classType: ClassType;

  @HasMany(() => ClassEnrollment, 'batchId')
  enrollments: ClassEnrollment[];
}
