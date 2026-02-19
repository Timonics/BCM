import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { ProjectMembership } from './project-membership.model';

/**
 * Project model - Committee projects / special events
 * Plain membership: ProjectMembership. Leadership roles: LeadershipAssignment (scopeEntity PROJECT, scopeId = project id).
 */
@Table({ tableName: 'projects' })
export class Project extends Model<Project> {
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
  name: string;

  @Column({
    type: DataType.ENUM(
      'Evangelism',
      'Worship',
      'Education',
      'Infrastructure',
      'Welfare',
      'Youth',
      'Program',
      'Event',
      'Construction',
      'Outreach',
      'General',
    ),
    allowNull: false,
    field: 'project_type',
  })
  projectType: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  year: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

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
    type: DataType.ENUM('active', 'planned', 'completed', 'archived'),
    allowNull: false,
  })
  status: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @HasMany(() => ProjectMembership, 'projectId')
  memberships: ProjectMembership[];
}
