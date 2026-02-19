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
import { Member } from './member.model';

/**
 * MemberAcademic model - Tracks educational background of members
 * Members can have multiple academic records
 */
@Table({ tableName: 'member_academics' })
export class MemberAcademic extends Model<MemberAcademic> {
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
    field: 'member_id',
    references: {
      model: 'members',
      key: 'id',
    },
  })
  memberId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  institution: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'course_program',
  })
  courseProgram: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  qualification: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'start_date',
  })
  startDate: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'end_date',
  })
  endDate: Date;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  // Associations
  @BelongsTo(() => Member, 'memberId')
  member: Member;
}
