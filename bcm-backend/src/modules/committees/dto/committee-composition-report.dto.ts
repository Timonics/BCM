import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * One row in Committee Composition report
 */
export class CommitteeCompositionRowDto {
  @ApiProperty({ description: 'Assignment ID', example: 'uuid' })
  assignmentId: string;

  @ApiProperty({ description: 'Member ID', example: 'uuid' })
  memberId: string;

  @ApiProperty({ description: 'Member name', example: 'Pastor David Mensah' })
  memberName: string;

  @ApiPropertyOptional({ description: 'Member email' })
  memberEmail?: string;

  @ApiProperty({ description: 'Project ID', example: 'uuid' })
  projectId: string;

  @ApiProperty({ description: 'Project name', example: 'Easter Revival Campaign' })
  projectName: string;

  @ApiPropertyOptional({ description: 'Project type', example: 'Evangelism' })
  projectType?: string;

  @ApiProperty({ description: 'Role name', example: 'Chairperson' })
  role: string;

  @ApiPropertyOptional({ description: 'Band name', example: 'Band A' })
  bandName?: string;

  @ApiPropertyOptional({ description: 'Unit name', example: 'Accra Central' })
  unitName?: string;

  @ApiProperty({ description: 'Start date', example: '2025-01-10' })
  startDate: string;

  @ApiPropertyOptional({ description: 'End date', example: '2025-04-20' })
  endDate?: string;

  @ApiProperty({ description: 'Days served', example: 81 })
  daysServed: number;

  @ApiProperty({ description: 'Status', example: 'Active' })
  status: string;
}
