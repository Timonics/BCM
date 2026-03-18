import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
  BelongsToMany,
} from 'sequelize-typescript';
import { UserRole } from './user-role.model';
import { User } from './user.model';
import { RolePermission } from './role-permission.model';
import { Permission } from './permission.model';

/**
 * Role model - Defines user roles (superadmin, admin, coordinator)
 */
@Table({ tableName: 'roles' })
export class Role extends Model<Role> {
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
    unique: true,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  // Associations
  @BelongsToMany(() => User, () => UserRole, 'roleId', 'userId')
  users: User[];

  @BelongsToMany(
    () => Permission,
    () => RolePermission,
    'roleId',
    'permissionId',
  )
  permissions: Permission[];
}
