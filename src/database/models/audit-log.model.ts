import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';

/**
 * AuditLog model - Tracks all system actions for audit trail
 * Records CREATE, UPDATE, DELETE, ASSIGN, APPROVE, IMPORT operations
 */
@Table({ tableName: 'audit_logs' })
export class AuditLog extends Model<AuditLog> {
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
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  })
  userId: string;

  // Association for sequelize-typescript to detect foreign key
  @BelongsTo(() => User, 'userId')
  user: User;

  @Column({
    type: DataType.ENUM('CREATE', 'UPDATE', 'DELETE', 'ASSIGN', 'APPROVE', 'IMPORT'),
    allowNull: false,
  })
  action: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'entity_type',
  })
  entityType: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'entity_id',
  })
  entityId: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'before_json',
  })
  beforeJson: any;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'after_json',
  })
  afterJson: any;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;
}

