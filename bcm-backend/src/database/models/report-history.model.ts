import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  CreatedAt,
} from 'sequelize-typescript';

/**
 * Report History model - Tracks all reports generated from the system
 */
@Table({ tableName: 'report_history' })
export class ReportHistory extends Model<ReportHistory> {
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
  category: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.ENUM('PDF', 'Excel', 'CSV'),
    allowNull: false,
  })
  format: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'date_range',
  })
  dateRange: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  filters: any;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'generated_by',
    references: {
      model: 'users',
      key: 'id',
    },
  })
  generatedBy: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'file_url',
  })
  fileUrl: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;
}
