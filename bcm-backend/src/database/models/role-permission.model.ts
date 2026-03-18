import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { Role } from './role.model';
import { Permission } from './permission.model';

/**
 * RolePermission junction table - Many-to-many relationship between roles and permissions
 */
@Table({ tableName: 'role_permissions' })
export class RolePermission extends Model<RolePermission> {
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

  @Column({
    type: DataType.UUID,
    field: 'permission_id',
    primaryKey: true,
    references: {
      model: 'permissions',
      key: 'id',
    },
  })
  permissionId: string;

  // Associations for sequelize-typescript to detect foreign keys
  @BelongsTo(() => Role, 'roleId')
  role: Role;

  @BelongsTo(() => Permission, 'permissionId')
  permission: Permission;
}
