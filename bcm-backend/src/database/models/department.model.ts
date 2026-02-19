import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Unit } from './unit.model';
import { Member } from './member.model';

/**
 * Department model - Top-level organizational unit (e.g. Youth Department, Children's Department)
 * Departments contain units. Members belong to units; department-level leadership is tracked via LeadershipAssignment (scope DEPARTMENT).
 */
@Table({ tableName: 'departments' })
export class Department extends Model<Department> {
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
    type: DataType.ENUM('Ministry', 'Administrative', 'Support', 'Outreach'),
    allowNull: false,
    defaultValue: 'Ministry',
  })
  category: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'head_of_department_id',
    references: {
      model: 'members',
      key: 'id',
    },
  })
  @ForeignKey(() => Member)
  headOfDepartmentId: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'meeting_day',
  })
  meetingDay: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'meeting_time',
  })
  meetingTime: string;

  @Default('active')
  @Column({
    type: DataType.ENUM('active', 'archived'),
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'founded_date',
  })
  foundedDate: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'max_units',
  })
  maxUnits: number | null;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @HasMany(() => Unit, 'departmentId')
  units: Unit[];

  @BelongsTo(() => Member, 'headOfDepartmentId')
  headOfDepartment: Member;
}
