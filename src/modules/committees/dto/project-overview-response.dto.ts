import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Committee/project list item (GET /committees)
 */
export class ProjectOverviewResponseDto {
  @ApiProperty({ description: 'Project ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Project name', example: 'Easter Revival Campaign' })
  name: string;

  @ApiProperty({
    description: 'Project type',
    enum: ['Evangelism', 'Worship', 'Education', 'Infrastructure', 'Welfare', 'Youth', 'Program', 'Event', 'Construction', 'Outreach', 'General'],
    example: 'Evangelism',
  })
  projectType: string;

  @ApiProperty({ description: 'Project year', example: 2025 })
  year: number;

  @ApiPropertyOptional({ description: 'Project description' })
  description?: string;

  @ApiProperty({ description: 'Start date', example: '2025-01-10' })
  startDate: string;

  @ApiPropertyOptional({ description: 'End date', example: '2025-04-20' })
  endDate?: string;

  @ApiProperty({
    description: 'Status',
    enum: ['active', 'planned', 'completed', 'archived'],
    example: 'active',
  })
  status: string;

  @ApiProperty({ description: 'Committee size (number of assigned members)', example: 12 })
  committeeSize: number;

  @ApiPropertyOptional({ description: 'Number of leadership roles (key positions)' })
  leadershipCount?: number;

  @ApiPropertyOptional({ description: 'Leadership alerts (expired or expiring soon)' })
  leadershipAlerts?: number;

  @ApiPropertyOptional({ description: 'Progress percentage (0-100)' })
  progressPercent?: number;

  @ApiProperty({ description: 'Last updated', example: '2025-02-09T12:00:00.000Z' })
  updatedAt: Date;
}
