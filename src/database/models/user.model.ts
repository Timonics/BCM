import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { UserRole } from './user-role.model';
import { Role } from './role.model';
import { AuditLog } from './audit-log.model';

/**
 * User model - Represents system users (admins, superadmins, coordinators)
 * Users authenticate to access the admin dashboard
 */
@Table({ tableName: 'users' })
export class User extends Model<User> {
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
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'password_hash',
  })
  passwordHash: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'full_name',
  })
  fullName: string;

  @Default('active')
  @Column({
    type: DataType.ENUM('active', 'disabled'),
    allowNull: false,
  })
  status: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  // Associations
  @BelongsToMany(() => Role, () => UserRole, 'userId', 'roleId')
  roles: Role[];

  @HasMany(() => AuditLog, 'userId')
  auditLogs: AuditLog[];
}
