import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Role } from './role.model';

/**
 * UserRole junction table - Many-to-many relationship between users and roles
 */
@Table({ tableName: 'user_roles' })
export class UserRole extends Model<UserRole> {
  @Column({
    type: DataType.UUID,
    field: 'user_id',
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id',
    },
  })
  userId: string;

  @Column({
    type: DataType.UUID,
    field: 'role_id',
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'id',
    },
  })
  roleId: string;

  @CreatedAt
  @Column({ field: 'assigned_at' })
  assignedAt: Date;

  // Associations for sequelize-typescript to detect foreign keys
  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Role, 'roleId')
  role: Role;
}
