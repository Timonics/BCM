import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  HasMany,
} from 'sequelize-typescript';
import { BandMembership } from './band-membership.model';
import { UnitMembership } from './unit-membership.model';
import { ClassEnrollment } from './class-enrollment.model';
import { LeadershipAssignment } from './leadership-assignment.model';
import { MemberAcademic } from './member-academic.model';
import { MemberEmployment } from './member-employment.model';

/**
 * Member model - Represents church members
 * Core entity for the BCM system
 * Uses soft delete - deleted members are marked with deleted_at instead of being removed
 */
@Table({
  tableName: 'members',
  paranoid: true, // Enable soft delete (uses deleted_at)
  deletedAt: 'deleted_at', // Column name for soft delete
})
export class Member extends Model<Member> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
    field: 'member_code',
  })
  memberCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'first_name',
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'middle_name',
  })
  middleName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  surname: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  phone: string;

  @Column({
    type: DataType.ENUM('male', 'female'),
    allowNull: false,
  })
  gender: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  dob: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'marital_status',
  })
  maritalStatus: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'state_of_origin',
  })
  stateOfOrigin: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  country: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'residential_state',
  })
  residentialState: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lga: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  occupation: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'address_line',
  })
  addressLine: string;

  @Column({
    type: DataType.ENUM('transfer', 'birth', 'new_convert', 'marriage'),
    allowNull: true,
    field: 'membership_path',
  })
  membershipPath: string;

  @Default('active')
  @Column({
    type: DataType.ENUM('active', 'suspended'),
    allowNull: false,
    field: 'suspension_status',
  })
  suspensionStatus: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'suspended_at',
  })
  suspendedAt: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    field: 'suspended_reason',
  })
  suspendedReason: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @DeletedAt
  @Column({ field: 'deleted_at' })
  deletedAt: Date;

  // Associations
  @HasMany(() => BandMembership, 'memberId')
  bandMemberships: BandMembership[];

  @HasMany(() => UnitMembership, 'memberId')
  unitMemberships: UnitMembership[];

  @HasMany(() => ClassEnrollment, 'memberId')
  classEnrollments: ClassEnrollment[];

  @HasMany(() => LeadershipAssignment, 'memberId')
  leadershipAssignments: LeadershipAssignment[];

  @HasMany(() => MemberAcademic, 'memberId')
  academics: MemberAcademic[];

  @HasMany(() => MemberEmployment, 'memberId')
  employment: MemberEmployment[];

  // Virtual field to calculate age
  get age(): number | null {
    if (!this.dob) return null;
    const today = new Date();
    const birthDate = new Date(this.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
}
