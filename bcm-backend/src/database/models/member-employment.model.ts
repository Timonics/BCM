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
 * MemberEmployment model - Tracks employment information of members
 * Members can have multiple employment records
 */
@Table({ tableName: 'member_employment' })
export class MemberEmployment extends Model<MemberEmployment> {
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
    field: 'place_of_work',
  })
  placeOfWork: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'office_address',
  })
  officeAddress: string;

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
