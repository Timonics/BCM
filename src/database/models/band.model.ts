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
import { BandMembership } from './band-membership.model';

/**
 * Band model - Represents church bands (Youth Band, Children's Band, etc.)
 * Bands have age brackets and gender types (male, female, mixed)
 */
@Table({ tableName: 'bands' })
export class Band extends Model<Band> {
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
    type: DataType.STRING,
    allowNull: true,
  })
  code: string;

  @Column({
    type: DataType.ENUM('male', 'female', 'mixed'),
    allowNull: false,
    field: 'band_type',
  })
  bandType: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'has_age_bracket',
  })
  hasAgeBracket: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'min_age',
  })
  minAge: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'max_age',
  })
  maxAge: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
    field: 'founded_date',
  })
  foundedDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'meeting_schedule_day',
  })
  meetingScheduleDay: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'meeting_schedule_time',
  })
  meetingScheduleTime: string;

  @Default('active')
  @Column({
    type: DataType.ENUM('active', 'archived'),
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
  @HasMany(() => BandMembership, 'bandId')
  memberships: BandMembership[];
}
