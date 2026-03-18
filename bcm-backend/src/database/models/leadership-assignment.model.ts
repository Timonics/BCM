import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { LeadershipRoleTemplate } from './leadership-role-template.model';
import { Member } from './member.model';

/**
 * LeadershipAssignment model - Tracks actual leadership assignments
 * Links members to leadership roles with tenure periods
 * Band executives: Patron, Matron, Captain, Vice-Captain, Secretary (2-year tenure)
 */
@Table({ tableName: 'leadership_assignments' })
export class LeadershipAssignment extends Model<LeadershipAssignment> {
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
    field: 'template_id',
    references: {
      model: 'leadership_role_templates',
      key: 'id',
    },
  })
  templateId: string;

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

  @Column({
    type: DataType.ENUM(
      'CHURCH',
      'BAND',
      'UNIT',
      'CLASS_BATCH',
      'PROJECT',
      'DEPARTMENT',
    ),
    allowNull: false,
    field: 'scope_entity',
  })
  scopeEntity: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'scope_id',
  })
  scopeId: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    field: 'start_date',
  })
  startDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'end_date',
  })
  endDate: Date;

  @Default('active')
  @Column({
    type: DataType.ENUM('active', 'acting', 'ended', 'inactive'),
    allowNull: false,
    field: 'leadership_status',
  })
  leadershipStatus: string;

  @Column({
    type: DataType.ENUM('expiry', 'replaced', 'resigned', 'suspended'),
    allowNull: true,
    field: 'end_reason',
  })
  endReason: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  // Associations for sequelize-typescript to detect foreign keys
  @BelongsTo(() => LeadershipRoleTemplate, 'templateId')
  template: LeadershipRoleTemplate;

  @BelongsTo(() => Member, 'memberId')
  member: Member;
}
