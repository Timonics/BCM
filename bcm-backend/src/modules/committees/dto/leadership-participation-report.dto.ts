import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * One row in Leadership Participation report
 */
export class LeadershipParticipationRowDto {
  @ApiProperty({ description: 'Member ID', example: 'uuid' })
  memberId: string;

  @ApiProperty({ description: 'Member name', example: 'Pastor David Mensah' })
  memberName: string;

  @ApiPropertyOptional({ description: 'Member email' })
  memberEmail?: string;

  @ApiPropertyOptional({ description: 'Unit name', example: 'Accra Central' })
  unitName?: string;

  @ApiProperty({ description: 'Total projects', example: 2 })
  totalProjects: number;

  @ApiProperty({ description: 'Leadership roles count', example: 2 })
  leadershipRoles: number;

  @ApiProperty({ description: 'Member roles count', example: 0 })
  memberRoles: number;

  @ApiProperty({ description: 'Active projects count', example: 1 })
  activeCount: number;

  @ApiProperty({ description: 'Completed projects count', example: 1 })
  completedCount: number;

  @ApiProperty({ description: 'Total days served', example: 197 })
  totalDaysServed: number;

  @ApiProperty({
    description: 'Positions held (role names)',
    example: ['Chairperson', 'Secretary'],
  })
  positionsHeld: string[];
}
