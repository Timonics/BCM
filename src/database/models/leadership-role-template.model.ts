import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
  HasMany,
} from 'sequelize-typescript';
import { LeadershipAssignment } from './leadership-assignment.model';

/**
 * LeadershipRoleTemplate model - Defines reusable leadership role templates
 * Examples: Band Leader, Unit Head, Class Coordinator, etc.
 * Can be global (single holder) or contextual (per band/unit/class)
 */
@Table({ tableName: 'leadership_role_templates' })
export class LeadershipRoleTemplate extends Model<LeadershipRoleTemplate> {
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
    type: DataType.ENUM('SIC', 'BAND', 'UNIT', 'CLASS', 'COMMITTEE', 'DEPARTMENT'),
    allowNull: false,
  })
  category: string;

  @Column({
    type: DataType.ENUM('global', 'contextual'),
    allowNull: false,
    field: 'scope_type',
  })
  scopeType: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'single_holder',
  })
  singleHolder: boolean;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'requires_tenure',
  })
  requiresTenure: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'default_tenure_months',
  })
  defaultTenureMonths: number;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'allow_multi_role_per_member',
  })
  allowMultiRolePerMember: boolean;

  @Default('active')
  @Column({
    type: DataType.ENUM('active', 'disabled'),
    allowNull: false,
  })
  status: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  // Associations
  @HasMany(() => LeadershipAssignment, 'templateId')
  assignments: LeadershipAssignment[];
}

