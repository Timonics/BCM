import { ApiProperty } from '@nestjs/swagger';

/**
 * GET /committees/overview - dashboard stats
 */
export class CommitteeOverviewStatsDto {
  @ApiProperty({
    description: 'Number of currently active projects',
  })
  activeProjects: number;

  @ApiProperty({ description: 'Number of projects this year' })
  committeesThisYear: number;

  @ApiProperty({
    description: 'Total committee members (across all projects)',
  })
  totalCommitteeMembers: number;

  @ApiProperty({ description: 'Number of archived projects' })
  archivedProjects: number;
}
