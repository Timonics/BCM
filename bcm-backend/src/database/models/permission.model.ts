import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  BelongsToMany,
} from 'sequelize-typescript';
import { RolePermission } from './role-permission.model';
import { Role } from './role.model';

/**
 * Permission model - Defines granular permissions for role-based access control
 */
@Table({ tableName: 'permissions' })
export class Permission extends Model<Permission> {
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
  code: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  // Associations
  @BelongsToMany(() => Role, () => RolePermission, 'permissionId', 'roleId')
  roles: Role[];
}
