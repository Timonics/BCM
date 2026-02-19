import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { ClassBatch } from './class-batch.model';

/**
 * ClassType model - Defines the three class types: Pre-Youth, Baptismal, ETS
 * Pre-Youth: Annual batches
 * Baptismal & ETS: Biannual batches (January and August)
 */
@Table({ tableName: 'class_types' })
export class ClassType extends Model<ClassType> {
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.ENUM('PREYOUTH', 'BAPTISMAL', 'ETS'),
    allowNull: false,
    unique: true,
  })
  code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.ENUM('annual', 'biannual'),
    allowNull: false,
  })
  cadence: string;

  // Associations
  @HasMany(() => ClassBatch, 'classTypeId')
  batches: ClassBatch[];
}
