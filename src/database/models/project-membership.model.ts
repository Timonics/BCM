import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from 'sequelize-typescript';
import { Project } from './project.model';
import { Member } from './member.model';

/**
 * ProjectMembership model - Junction table for committee/project–member relationships.
 * Plain membership: who is on the committee. Leadership roles (Chair, Secretary, etc.)
 * are assigned separately via the Leadership module (scopeEntity PROJECT, scopeId = project id).
 */
@Table({ tableName: 'project_memberships' })
export class ProjectMembership extends Model<ProjectMembership> {
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
    field: 'project_id',
    references: {
      model: 'projects',
      key: 'id',
    },
  })
  projectId: string;

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

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_active',
  })
  isActive: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'exit_reason',
  })
  exitReason: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @BelongsTo(() => Project, 'projectId')
  project: Project;

  @BelongsTo(() => Member, 'memberId')
  member: Member;
}
