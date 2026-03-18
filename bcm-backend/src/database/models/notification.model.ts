import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
} from 'sequelize-typescript';

/**
 * Notification model - In-app notifications for alerts
 * Types: over_age_members, expired_leadership, pending_class_completions
 */
@Table({ tableName: 'notifications' })
export class Notification extends Model<Notification> {
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
  })
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

  @Default('info')
  @Column({
    type: DataType.ENUM('info', 'warning', 'critical'),
    allowNull: false,
  })
  severity: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'recipient_user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  })
  recipientUserId: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'recipient_member_id',
    references: {
      model: 'members',
      key: 'id',
    },
  })
  recipientMemberId: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_read',
  })
  isRead: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'entity_type',
  })
  entityType: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'entity_id',
  })
  entityId: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;
}
