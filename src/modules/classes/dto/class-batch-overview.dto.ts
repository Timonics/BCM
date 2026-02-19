import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for class batch overview (list view)
 */
export class ClassBatchOverviewDto {
  @ApiProperty({ description: 'Batch ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Batch code', example: 'BCJAN2025' })
  batchCode: string;

  @ApiProperty({ description: 'Class type', example: 'BAPTISMAL' })
  classType: string;

  @ApiProperty({ description: 'Batch status', example: 'started' })
  status: string;

  @ApiProperty({ description: 'Year', example: 2025 })
  year: number;

  @ApiProperty({ description: 'Intake period', example: 'JAN' })
  intake: string;

  @ApiProperty({ description: 'Start date', example: '2025-01-05' })
  startDate: Date;

  @ApiProperty({ description: 'End date', example: '2025-05-31' })
  endDate: Date;

  @ApiProperty({ description: 'Total members enrolled' })
  membersEnrolled: number;

  @ApiProperty({ description: 'Maximum capacity' })
  maxCapacity: number;

  @ApiPropertyOptional({
    description: 'Completion progress percentage',
  })
  completionProgress?: number;

  @ApiPropertyOptional({ description: 'Readiness status', example: 'high' })
  readinessStatus?: string;

  @ApiPropertyOptional({
    description: 'Coordinator name',
    example: 'Pastor David Mensah',
  })
  coordinatorName?: string;

  @ApiPropertyOptional({
    description: 'Average attendance percentage',
  })
  averageAttendance?: number;

  @ApiPropertyOptional({
    description: 'Number of leaders assigned',
  })
  leadershipCount?: number;

  @ApiPropertyOptional({
    description: 'Ready for graduation count',
  })
  readyForGraduation?: number;

  @ApiPropertyOptional({ description: 'Total graduated' })
  totalGraduated?: number;

  @ApiPropertyOptional({ description: 'Pending approvals count', example: 4 })
  pendingApprovals?: number;

  @ApiPropertyOptional({
    description: 'Band eligible count (for ETS)',
  })
  bandEligible?: number;
}
