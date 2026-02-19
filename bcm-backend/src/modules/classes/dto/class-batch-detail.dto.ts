import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClassBatchLeadershipDto } from './class-batch-leadership.dto';
import { ClassBatchMemberDto } from './class-batch-member.dto';
import { GraduationReadinessDto } from './graduation-readiness.dto';

/**
 * DTO for detailed class batch information
 */
export class ClassBatchDetailDto {
  @ApiProperty({ description: 'Batch ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Batch code', example: 'BCJAN2025' })
  batchCode: string;

  @ApiProperty({ description: 'Class type', example: 'BAPTISMAL' })
  classType: string;

  @ApiProperty({ description: 'Class type name', example: 'Baptismal Class' })
  classTypeName: string;

  @ApiProperty({ description: 'Status', example: 'started' })
  status: string;

  @ApiProperty({ description: 'Year', example: 2025 })
  year: number;

  @ApiProperty({ description: 'Intake period', example: 'JAN' })
  intake: string;

  @ApiProperty({ description: 'Start date', example: '2025-01-05' })
  startDate: Date;

  @ApiProperty({ description: 'End date', example: '2025-05-31' })
  endDate: Date;

  @ApiPropertyOptional({ description: 'Description', example: 'Baptismal Class for January 2025' })
  description?: string;

  @ApiProperty({ description: 'Total members', example: 48 })
  totalMembers: number;

  @ApiProperty({ description: 'Active members', example: 45 })
  activeMembers: number;

  @ApiPropertyOptional({ description: 'Ready for graduation', example: 38 })
  readyForGraduation?: number;

  @ApiPropertyOptional({ description: 'Gender distribution', example: { male: 24, female: 24 } })
  genderDistribution?: { male: number; female: number };

  @ApiPropertyOptional({ description: 'Average attendance percentage', example: 88 })
  averageAttendance?: number;

  @ApiPropertyOptional({ description: 'Completion progress percentage', example: 85 })
  completionProgress?: number;

  @ApiPropertyOptional({ description: 'Batch leadership', type: [ClassBatchLeadershipDto] })
  leadership?: ClassBatchLeadershipDto[];

  @ApiPropertyOptional({ description: 'Graduation readiness', type: GraduationReadinessDto })
  graduationReadiness?: GraduationReadinessDto;

  @ApiPropertyOptional({ description: 'Members list', type: [ClassBatchMemberDto] })
  members?: ClassBatchMemberDto[];

  @ApiPropertyOptional({ description: 'Pending approvals count', example: 4 })
  pendingApprovals?: number;

  @ApiPropertyOptional({ description: 'Approved count', example: 3 })
  approved?: number;

  @ApiPropertyOptional({ description: 'Band eligible count (for ETS)', example: 32 })
  bandEligible?: number;

  @ApiPropertyOptional({ description: 'Total graduated', example: 0 })
  totalGraduated?: number;
}
